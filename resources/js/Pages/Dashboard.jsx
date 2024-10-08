import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import ApexCharts from "apexcharts";
import dateFormat from "dateformat";
import { Tooltip } from "flowbite-react";
import CountUp from "react-countup";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Modal2 from "@/Components/Modal2"; // Pastikan path import sesuai

export default function Dashboard({
    status,
    equipments,
    approve,
    anomalis,
    anomalis_date,
    anomaliPerBulan,
    anomaliPerSubstation, // Tambahkan prop baru
}) {
    const { auth } = usePage().props;
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Gunakan useRef untuk menyimpan referensi chart
    const radialChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const substationChartRef = useRef(null);

    useEffect(() => {
        const formattedEvents = anomalis_date.map((anomali) => ({
            id: anomali.id,
            title: anomali.titlename,
            start: anomali.date_plan_start,
            end: anomali.date_plan_end,
            backgroundColor: getEventColor(anomali.status.name),
            borderColor: getEventColor(anomali.status.name),
            extendedProps: { ...anomali },
        }));
        setEvents(formattedEvents);

        // Inisialisasi chart
        if (typeof ApexCharts !== "undefined") {
            if (!radialChartRef.current) {
                radialChartRef.current = new ApexCharts(
                    document.querySelector("#radial-chart"),
                    getChartStatus()
                );
                radialChartRef.current.render();
            } else {
                radialChartRef.current.updateOptions(getChartStatus());
            }

            if (!pieChartRef.current) {
                pieChartRef.current = new ApexCharts(
                    document.getElementById("pie-chart"),
                    getChartEquipment()
                );
                pieChartRef.current.render();
            } else {
                pieChartRef.current.updateOptions(getChartEquipment());
            }

            if (anomaliPerBulan && anomaliPerBulan.length > 0) {
                if (!lineChartRef.current) {
                    lineChartRef.current = new ApexCharts(
                        document.getElementById("line-chart"),
                        getChartAnomaliPerBulan()
                    );
                    lineChartRef.current.render();
                } else {
                    lineChartRef.current.updateOptions(
                        getChartAnomaliPerBulan()
                    );
                }
            }
        }

        // Cleanup function
        return () => {
            if (radialChartRef.current) {
                radialChartRef.current.destroy();
                radialChartRef.current = null;
            }
            if (pieChartRef.current) {
                pieChartRef.current.destroy();
                pieChartRef.current = null;
            }
            if (lineChartRef.current) {
                lineChartRef.current.destroy();
                lineChartRef.current = null;
            }
            if (substationChartRef.current) {
                substationChartRef.current.destroy();
                substationChartRef.current = null;
            }
        };
    }, [anomaliPerBulan, anomaliPerSubstation, status, equipments, anomalis]);

    const getEventColor = (status) => {
        switch (status) {
            case "Open":
                return "#10B981";
            case "Close":
                return "#0EA5E9";
            default:
                return "#10B981";
        }
    };

    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event.extendedProps);
        setShowModal(true);
    };

    const getChartStatus = () => {
        let statusNew = (status[0].anomali.length / anomalis.length) * 100;
        let statusOpen = (status[1].anomali.length / anomalis.length) * 100;
        let statusClose = (status[2].anomali.length / anomalis.length) * 100;

        return {
            series: [
                statusNew.toFixed(1),
                statusOpen.toFixed(1),
                statusClose.toFixed(1),
            ],
            colors: ["#EF4444", "#10B981", "#0EA5E9"],
            chart: {
                height: 280,
                width: "100%",
                type: "radialBar",
                sparkline: {
                    enabled: true,
                },
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    },
                    export: {
                        svg: {
                            filename: "status_anomali_svg",
                        },
                        png: {
                            filename: "status_anomali_png",
                        },
                    },
                },
            },
            plotOptions: {
                radialBar: {
                    track: {
                        background: "#E5E7EB",
                    },
                    dataLabels: {
                        show: false,
                    },
                    hollow: {
                        margin: 0,
                        size: "32%",
                    },
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
            labels: status.map((status) => status.name),
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
                        return value + "%";
                    },
                },
            },
        };
    };

    const getChartEquipment = () => {
        return {
            series: equipments.map((equipment) => equipment.anomali.length),
            colors: [
                "#1f77b4",
                "#ff7f0e",
                "#2ca02c",
                "#d62728",
                "#9467bd",
                "#8c564b",
                "#e377c2",
                "#7f7f7f",
                "#295F98",
                "#bcbd22",
                "#17becf",
                "#ffcc00",
                "#a52a2a",
            ],
            chart: {
                height: 350,
                width: "100%",
                type: "pie",
                zoom: {
                    enabled: true,
                },
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    },
                    export: {
                        svg: {
                            filename: "distribusi_equipment_svg",
                        },
                        png: {
                            filename: "distribusi_equipment_png",
                        },
                    },
                },
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
                        offset: -25,
                    },
                },
            },
            labels: equipments.map((equipment) => equipment.name),
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
                        return value;
                    },
                },
            },
            xaxis: {
                labels: {
                    formatter: function (value) {
                        return value;
                    },
                },
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
            },
        };
    };

    const getChartAnomaliPerBulan = () => {
        if (!anomaliPerBulan || anomaliPerBulan.length === 0) {
            return {}; // atau berikan konfigurasi default
        }

        return {
            series: [
                {
                    name: "Jumlah Anomali",
                    data: anomaliPerBulan.map((item) => item.jumlah),
                },
            ],
            chart: {
                height: 280,
                type: "line",
                zoom: {
                    enabled: true,
                },
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                    },
                    export: {
                        svg: {
                            filename: "Anomali_Per_Month_svg",
                        },
                        png: {
                            filename: "Anomali_Per_Month_png",
                        },
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "straight",
            },
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5,
                },
            },
            xaxis: {
                categories: anomaliPerBulan.map((item) => item.bulan_tahun),
            },
        };
    };

    const { flash } = usePage().props;

    console.log(anomalis);
    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout user={auth.user}>
                <div className="p-4 space-y-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg text-white">
                        <div className="flex items-center">
                            <ApplicationLogo className="w-10 h-10 mr-3 text-white" />
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Selamat Datang, {auth.user.name}!
                                </h1>
                                <p className="text-sm opacity-90">
                                    Mari kita lihat perkembangan anomali kita
                                    hari ini.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Status Anomali
                            </h2>
                            <div id="radial-chart" className="h-44"></div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {status.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-lg text-center ${
                                            index === 0
                                                ? "bg-rose-100 dark:bg-rose-900 dark:text-white"
                                                : index === 1
                                                ? "bg-teal-100 dark:bg-teal-900 dark:text-white"
                                                : "bg-blue-100 dark:bg-blue-900 dark:text-white"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold">
                                            {item.anomali.length}
                                        </p>
                                        <p className="text-xs">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Distribusi Equipment
                            </h2>
                            <div id="pie-chart" className="h-44"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Anomali per Month
                            </h2>
                            <div id="line-chart" className="h-44"></div>
                        </div>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-12">
                        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Kalender Anomali
                            </h2>
                            <div className="h-[600px] md:h-[450px] lg:h-[600px]">
                                <FullCalendar
                                    plugins={[
                                        dayGridPlugin,
                                        timeGridPlugin,
                                        interactionPlugin,
                                    ]}
                                    initialView="dayGridMonth"
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                                    }}
                                    events={events}
                                    eventClick={handleEventClick}
                                    height="100%"
                                    eventMouseEnter={(info) => {
                                        info.el.style.cursor = "pointer";
                                    }}
                                    dayMaxEvents={3} // Menampilkan maksimal 3 event per hari
                                    eventDisplay="block" // Menampilkan event sebagai blok
                                    slotEventOverlap={false} // Mencegah event saling tumpang tindih
                                    eventContent={(arg) => {
                                        return (
                                            <div className="p-1 text-xs">
                                                <div className="font-bold">
                                                    {arg.timeText}
                                                </div>
                                                <div>{arg.event.title}</div>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Ringkasan Anomali Terbaru
                            </h2>
                            <div className="overflow-x-auto max-h-[400px] md:max-h-[450px] lg:max-h-[500px]">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Judul
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Tanggal Mulai
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Tanggal Selesai
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-2"
                                            >
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {anomalis_date
                                            .slice(0, 5)
                                            .map((anomali, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                >
                                                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                                                        {anomali.titlename}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {dateFormat(
                                                            anomali.date_plan_start,
                                                            "dd mmm yyyy"
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {dateFormat(
                                                            anomali.date_plan_end,
                                                            "dd mmm yyyy"
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {anomali.status.name}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal2 untuk menampilkan detail event */}
                <Modal2
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="Detail Anomali"
                >
                    {selectedEvent && (
                        <div className="space-y-4">
                            <p>
                                <strong>Judul:</strong>{" "}
                                {selectedEvent.titlename}
                            </p>
                            <p>
                                <strong>Tanggal Mulai:</strong>{" "}
                                {dateFormat(
                                    selectedEvent.date_plan_start,
                                    "dd mmmm yyyy"
                                )}
                            </p>
                            <p>
                                <strong>Tanggal Selesai:</strong>{" "}
                                {dateFormat(
                                    selectedEvent.date_plan_end,
                                    "dd mmmm yyyy"
                                )}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedEvent.status.name}
                            </p>
                            <p>
                                <strong>Deskripsi:</strong>{" "}
                                {selectedEvent.description ||
                                    "Tidak ada deskripsi"}
                            </p>
                            {/* Tambahkan field lain sesuai kebutuhan */}
                        </div>
                    )}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Tutup
                        </button>
                    </div>
                </Modal2>
            </DashboardLayout>
        </>
    );
}
