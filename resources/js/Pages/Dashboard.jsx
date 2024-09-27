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

export default function Dashboard({status, equipments, approve, anomalis, anomalis_date }) {

    // window.location.reload()

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
            labels: status.map(status => status.name),
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

    const eventDataFromDB = anomalis_date.map(anomali => ({
        id: anomali.id,
        title: anomali.titlename,
        start: anomali.date_plan_start,
        end: anomali.date_plan_end
    }))

    const calendar = useCalendarApp({
        views: [createViewMonthGrid(), createViewMonthAgenda()],
        events:
        eventDataFromDB.map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.description
          })),
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
                <div className="">
                    <p>Welcome {auth.user.name}</p>
                </div>
                <div className="grid gap-6 m-4 lg:grid-cols-5 md:grid-cols-1">
                    <div className="flex col-span-3">
                        <ScheduleXCalendar calendarApp={calendar}/>
                    </div>
                    <div className="flex col-span-1">
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

                    <div className="flex col-span-1">

                        <div className="w-full p-4 bg-white rounded-lg shadow-lg dark:bg-dark-400 md:p-6">

                            <div className="flex items-start justify-between w-full">
                                <div className="flex-col items-center">
                                    <div className="flex items-center mb-1">
                                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-gray-100 me-1">Equipment</h5>
                                            <Tooltip trigger="click" content="Perhitungan tiap peralatan dari total anomali">
                                                <svg className="w-3.5 h-3.5 text-gray-500  hover:text-gray-900 cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
                                                </svg>
                                            </Tooltip>
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

                <div className=""></div>
            </DashboardLayout>
        </>
    );
}
