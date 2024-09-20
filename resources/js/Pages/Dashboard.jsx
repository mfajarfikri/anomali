import React from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from "@inertiajs/react";
import ApexCharts from 'apexcharts'
import { Tooltip } from "flowbite-react";
import CountUp from 'react-countup';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  createViewDay
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { createEventModalPlugin } from "@schedule-x/event-modal";

export default function Dashboard({status, equipments, type, anomalis }) {


    const jsonString = JSON.stringify(anomalis);
    // console.log(jsonString.date_find)

    const { auth } = usePage().props;

    const getChartStatus = () => {
        let statusNew = status[0].anomali.length / anomalis.length * 100
        let statusOpen = status[1].anomali.length / anomalis.length * 100
        let statusClose = status[2].anomali.length / anomalis.length * 100

        return {
            series: [ statusClose.toFixed(1), statusOpen.toFixed(1), statusNew.toFixed(1)],
            colors: ["#0EA5E9", "#10B981", "#EF4444"],
            chart: {
              height: "380px",
              width: "100%",
              type: "radialBar",
              sparkline: {
                enabled: true,
              },
            },
            plotOptions: {
              radialBar: {
                track: {
                  background: '#E5E7EB',
                },
                dataLabels: {
                  show: true,
                },
                hollow: {
                  margin: 0,
                  size: "32%",
                }
              },
            },
            grid: {
              show: false,
              strokeDashArray: 4,
              padding: {
                left: 2,
                right: 2,
                top: -23,
                bottom: -20,
              },
            },
            labels: [
                status[2].name,
                status[1].name,
                status[0].name,
            ],
            legend: {
              show: true,
              position: "bottom",
              fontFamily: "Inter, sans-serif",
            },
            tooltip: {
              enabled: true,
              x: {
                show: false,
              },
            },
            yaxis: {
              show: false,
              labels: {
                formatter: function (value) {
                  return value + '%';
                }
              }
            }
          }
        }

      if (document.getElementById("radial-chart") && typeof ApexCharts !== 'undefined') {
        const chart = new ApexCharts(document.querySelector("#radial-chart"), getChartStatus());
        chart.render();
      }

    const getChartEquipment = () => {

    return {
        series: equipments.map(equipment => equipment.anomali.length),
        colors: [
            '#1f77b4',
            '#ff7f0e',
            '#2ca02c',
            '#d62728',
            '#9467bd',
            '#8c564b',
            '#e377c2',
            '#7f7f7f',
            '#295F98',
            '#bcbd22',
            '#17becf',
            '#ffcc00',
            '#a52a2a',
        ],
        chart: {
        height: 420,
        width: "100%",
        type: "pie",
        },
        stroke: {
        colors: ["white"],
        lineCap: "",
        },
        plotOptions: {
        pie: {
            labels: {
            show: true,
            },
            size: "100%",
            dataLabels: {
            offset: -25
            }
        },
        },
        labels: equipments.map(equipment => equipment.name),
        dataLabels: {
        enabled: true,
        style: {
            fontFamily: "Inter, sans-serif",
        },
        },
        legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        },
        yaxis: {
        labels: {
            formatter: function (value) {
            return value
            },
        },
        },
        xaxis: {
        labels: {
            formatter: function (value) {
            return value
            },
        },
        axisTicks: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
        },
    }
    }

    const calendar = useCalendarApp({
        views: [createViewMonthGrid(), createViewWeek(), createViewDay(), createViewMonthAgenda()],
        events: [
          {
            id: '1',
            title: 'Event 1',
            start: '2024-09-18',
            end: '2024-09-28',
            description: 'Example'
          },
          {
            id: '2',
            title: 'Event 2',
            start: '2024-09-20',
            end: '2024-09-30',
            description: 'Example'
          },
        ],
        plugins: [
            createEventModalPlugin()
        ]
      })

    if (document.getElementById("pie-chart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("pie-chart"), getChartEquipment());
    chart.render();
    }



    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout user={auth.user}>
                <div className="grid gap-6 m-4 lg:grid-cols-3">
                    <div className="flex col-span-1">
                        <ScheduleXCalendar calendarApp={calendar}/>
                    </div>
                    <div className="col-span-1">
                        <div className="p-4 bg-white rounded-lg shadow-lg dark:bg-dark-400 md:p-6">
                            <div className="flex justify-start mb-3">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center">
                                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-gray-100 pe-1">Anomali progress</h5>
                                        <Tooltip trigger="click" content="Progress dari setiap anomali">
                                          <svg className="w-3.5 h-3.5 text-gray-500  hover:text-gray-900 cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
                                          </svg>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border rounded-lg dark:border-gray-500 bg-gray-50 dark:bg-dark-400">
                                <div className="grid grid-cols-3 gap-3 mb-2">
                                <dl className="bg-rose-50 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                    <dt className="flex items-center justify-center w-8 h-8 mb-1 text-sm font-medium border rounded-full text-rose-600 bg-rose-100 border-rose-300 ">
                                        <CountUp end={status[0].anomali.length}/>
                                    </dt>
                                    <dd className="inline-flex items-center text-sm font-medium text-rose-600 ">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="mx-1 stroke-2 size-3 stroke-rose-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                      </svg>

                                      {status[0].name}
                                      </dd>
                                </dl>
                                <dl className="bg-teal-50 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                    <dt className="flex items-center justify-center w-8 h-8 mb-1 text-sm font-medium text-teal-600 bg-teal-100 border border-teal-300 rounded-full">
                                        <CountUp end={status[1].anomali.length}/>
                                    </dt>
                                    <dd className="inline-flex items-center text-sm font-medium text-teal-600">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="mx-1 stroke-2 stroke-teal-600 size-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                      </svg>

                                      {status[1].name}
                                      </dd>
                                </dl>
                                <dl className="bg-blue-50 rounded-lg flex flex-col items-center justify-center h-[78px]">
                                    <dt className="flex items-center justify-center w-8 h-8 mb-1 text-sm font-medium text-blue-600 bg-blue-100 border border-blue-300 rounded-full">
                                        <CountUp end={status[2].anomali.length}/>
                                    </dt>
                                    <dd className="inline-flex items-center text-sm font-medium text-blue-600">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="mx-1 stroke-2 stroke-blue-600 size-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                      </svg>

                                      {status[2].name}
                                    </dd>
                                </dl>
                                </div>

                            </div>

                            <div className="py-7" id="radial-chart"></div>

                            <div className="grid items-center grid-cols-1 border-t border-gray-200">
                                <div className="flex items-center justify-end pt-5">
                                  <a href={route('anomali')} className="inline-flex items-center px-3 py-2 text-sm font-semibold text-blue-600 uppercase rounded-lg hover:text-blue-700 hover:bg-gray-100 ">
                                      Progress report
                                      <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                      </svg>
                                  </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">

                        <div className="w-full p-4 bg-white rounded-lg shadow-lg dark:bg-dark-400 md:p-6">

                            <div className="flex items-start justify-between w-full">
                                <div className="flex-col items-center">
                                    <div className="flex items-center mb-1">
                                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-gray-100 me-1">Equipment</h5>
                                            <svg className="w-3.5 h-3.5 text-gray-500  hover:text-gray-900 cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
                                            </svg>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <button id="widgetDropdownButton" data-dropdown-toggle="widgetDropdown" data-dropdown-placement="bottom" type="button"  className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 "><svg className="w-3.5 h-3.5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                    </svg><span className="sr-only">Open dropdown</span>
                                    </button>
                                    <div id="widgetDropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 ">
                                        <ul className="py-2 text-sm text-gray-700" aria-labelledby="widgetDropdownButton">
                                        <li>
                                            <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100"><svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279"/>
                                            </svg>Edit widget
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100"><svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
                                                <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                                            </svg>Download data
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100"><svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5.953 7.467 6.094-2.612m.096 8.114L5.857 9.676m.305-1.192a2.581 2.581 0 1 1-5.162 0 2.581 2.581 0 0 1 5.162 0ZM17 3.84a2.581 2.581 0 1 1-5.162 0 2.581 2.581 0 0 1 5.162 0Zm0 10.322a2.581 2.581 0 1 1-5.162 0 2.581 2.581 0 0 1 5.162 0Z"/>
                                            </svg>Add to repository
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100"><svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
                                            </svg>Delete widget
                                            </a>
                                        </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            <div className="py-[61px]" id="pie-chart"></div>

                            <div className="grid items-center justify-between grid-cols-1 border-t border-gray-200 ">
                                <div className="flex items-center justify-end pt-5">
                                    <a href="#"
                                    className="inline-flex items-center px-3 py-2 text-sm font-semibold text-blue-600 uppercase rounded-lg hover:text-blue-700hover:bg-gray-100 ">
                                    Traffic analysis
                                    <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
