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
    anomaliPerMinggu, // Tambahkan prop baru
    anomaliPerType, // Tambahkan prop baru
    anomaliPerTypeStatus, // Tambahkan prop baru
}) {
    const { auth } = usePage().props;
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Gunakan useRef untuk menyimpan referensi chart
    const radialChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const typeChartRef = useRef(null);

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

            if (anomaliPerMinggu && anomaliPerMinggu.length > 0) {
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

            if (anomaliPerTypeStatus && anomaliPerTypeStatus.length > 0) {
                if (!typeChartRef.current) {
                    typeChartRef.current = new ApexCharts(
                        document.getElementById("type-chart"),
                        getChartAnomaliPerType()
                    );
                    typeChartRef.current.render();
                } else {
                    typeChartRef.current.updateOptions(
                        getChartAnomaliPerType()
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
            if (typeChartRef.current) {
                typeChartRef.current.destroy();
                typeChartRef.current = null;
            }
        };
    }, [
        anomaliPerMinggu,
        status,
        equipments,
        anomalis,
        anomaliPerType,
        anomaliPerTypeStatus,
    ]);

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
                height: 330,
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
                "#bcbd22",
                "#17becf",
                "#ffcc00",
                "#a52a2a",
                "#555555",
            ],
            chart: {
                height: 390,
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
        if (!anomaliPerMinggu || anomaliPerMinggu.length === 0) {
            return {}; // atau berikan konfigurasi default
        }

        return {
            series: [
                {
                    name: "Jumlah Anomali",
                    data: anomaliPerMinggu.map((item) => item.jumlah),
                    color: "#4CAF50",
                },
            ],
            chart: {
                height: 350,
                type: "area",
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
                            filename: "Anomali_Per_Minggu_svg",
                        },
                        png: {
                            filename: "Anomali_Per_Minggu_png",
                        },
                    },
                },
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350,
                    },
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ["#333"],
                },
                background: {
                    enabled: true,
                    foreColor: "#fff",
                    padding: 4,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: "#fff",
                    opacity: 0.9,
                },
            },
            stroke: {
                curve: "smooth",
                width: 3,
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100],
                },
            },
            grid: {
                borderColor: "#e7e7e7",
                row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5,
                },
            },
            xaxis: {
                categories: anomaliPerMinggu.map((item) => item.minggu_tahun),
                labels: {
                    style: {
                        colors: "#333",
                        fontSize: "12px",
                    },
                    rotate: -45,
                },
                title: {
                    text: "Minggu",
                    style: {
                        fontSize: "14px",
                        fontWeight: 600,
                    },
                },
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return val.toFixed(0);
                    },
                },
            },
            tooltip: {
                theme: "light",
                y: {
                    formatter: function (val) {
                        return val + " anomali";
                    },
                },
            },
            markers: {
                size: 5,
                colors: ["#4CAF50"],
                strokeColors: "#fff",
                strokeWidth: 2,
                hover: {
                    size: 7,
                },
            },
        };
    };

    const getChartAnomaliPerType = () => {
        if (!anomaliPerTypeStatus || anomaliPerTypeStatus.length === 0) {
            return {};
        }

        // Mengorganisir data
        const types = [
            ...new Set(anomaliPerTypeStatus.map((item) => item.type_name)),
        ];
        const statuses = [
            ...new Set(anomaliPerTypeStatus.map((item) => item.status_name)),
        ];

        // Menyiapkan series data
        const series = statuses.map((status) => ({
            name: status,
            data: types.map((type) => {
                const match = anomaliPerTypeStatus.find(
                    (item) =>
                        item.type_name === type && item.status_name === status
                );
                return match ? match.total : 0;
            }),
        }));

        return {
            series: series,
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    },
                    export: {
                        svg: {
                            filename: "anomali_per_type_status_svg",
                        },
                        png: {
                            filename: "anomali_per_type_status_png",
                        },
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true, // Ubah ke horizontal
                    borderRadius: 4,
                    dataLabels: {
                        total: {
                            enabled: true,
                            style: {
                                fontSize: "13px",
                                fontWeight: 900,
                            },
                            offsetX: 10, // Tambahkan offset untuk label total
                        },
                    },
                },
            },
            xaxis: {
                categories: types,
                labels: {
                    style: {
                        fontSize: "12px",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: "12px",
                    },
                },
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
            },
            fill: {
                opacity: 1,
            },
            colors: ["#EF4444", "#10B981", "#0EA5E9"], // Merah untuk New, Hijau untuk Open, Biru untuk Close
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val;
                },
                style: {
                    fontSize: "12px",
                    colors: ["#304758"],
                },
                offsetX: 5, // Tambahkan offset untuk label data
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + " anomali";
                    },
                },
            },
            grid: {
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
        };
    };

    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout user={auth.user}>
                {/* Modal2 untuk menampilkan detail event */}
                <Modal2
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title="Detail Anomali"
                >
                    {selectedEvent && (
                        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">
                                {selectedEvent.titlename}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                                        <svg
                                            className="w-5 h-5 mr-2 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            ></path>
                                        </svg>
                                        <span className="font-semibold mr-2">
                                            Tanggal Mulai:
                                        </span>
                                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                            {dateFormat(
                                                selectedEvent.date_plan_start,
                                                "dd mmmm yyyy"
                                            )}
                                        </span>
                                    </p>
                                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                                        <svg
                                            className="w-5 h-5 mr-2 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            ></path>
                                        </svg>
                                        <span className="font-semibold mr-2">
                                            Tanggal Selesai:
                                        </span>
                                        <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                                            {dateFormat(
                                                selectedEvent.date_plan_end,
                                                "dd mmmm yyyy"
                                            )}
                                        </span>
                                    </p>
                                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                                        <svg
                                            className="w-5 h-5 mr-2 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                        </svg>
                                        <span className="font-semibold mr-2">
                                            Status:
                                        </span>
                                        <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">
                                            {selectedEvent.status.name}
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                                        <svg
                                            className="w-5 h-5 mr-2 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            ></path>
                                        </svg>
                                        <span className="font-semibold mr-2">
                                            Pelapor:
                                        </span>
                                        <span>
                                            {selectedEvent.user.name ||
                                                "Tidak tersedia"}
                                        </span>
                                    </p>
                                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                                        <svg
                                            className="w-5 h-5 mr-2 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            ></path>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            ></path>
                                        </svg>
                                        <span className="font-semibold mr-2">
                                            Lokasi:
                                        </span>
                                        <span>
                                            {selectedEvent.substation.name ||
                                                "Tidak tersedia"}
                                        </span>
                                    </p>
                                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                                        <svg
                                            className="w-5 h-5 mr-2 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                            ></path>
                                        </svg>
                                        <span className="font-semibold mr-2">
                                            Peralatan:
                                        </span>
                                        <span>
                                            {selectedEvent.equipment.name ||
                                                "Tidak tersedia"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                        ></path>
                                    </svg>
                                    Action:
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                    {selectedEvent.action ||
                                        "Tidak ada deskripsi"}
                                </p>
                            </div>
                            {(selectedEvent.attachment_filename ||
                                selectedEvent.official_report) && (
                                <div className="mt-6 space-y-4">
                                    {selectedEvent.attachment_filename && (
                                        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                                                <svg
                                                    className="w-5 h-5 mr-2 text-blue-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                    ></path>
                                                </svg>
                                                File Terlampir
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                {
                                                    selectedEvent.attachment_filename
                                                }
                                            </p>
                                            <a
                                                href={`/storage/${selectedEvent.attachment_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                    ></path>
                                                </svg>
                                                Unduh File
                                            </a>
                                        </div>
                                    )}
                                    {selectedEvent.official_report && (
                                        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                                                <svg
                                                    className="w-5 h-5 mr-2 text-green-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    ></path>
                                                </svg>
                                                Laporan Resmi
                                            </h4>
                                            <a
                                                href={`/storage/${selectedEvent.report_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition duration-150 ease-in-out"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    ></path>
                                                </svg>
                                                Lihat Laporan
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                            Tutup
                        </button>
                    </div>
                </Modal2>
                <div className="p-4 space-y-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg text-white">
                        <div className="flex items-center">
                            <ApplicationLogo className="w-10 h-10 mr-3 text-white" />
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Welcome, {auth.user.name}!
                                </h1>
                                <p className="text-sm opacity-90">
                                    Let's take a look at the development of our
                                    anomaly today.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Status Anomaly
                            </h2>
                            <div id="radial-chart" className="h-44"></div>
                            <div className="grid grid-cols-4 gap-2 mt-2">
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
                                <div className="p-2 rounded-lg text-center bg-gray-100 dark:bg-gray-900 dark:text-white">
                                    <p className="text-sm font-semibold">
                                        {anomalis.length}
                                    </p>
                                    <p className="text-xs">Total</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Distribution Equipment
                            </h2>
                            <div id="pie-chart" className="h-44"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Monthly Anomaliy
                            </h2>
                            <div id="line-chart" className="h-44"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Anomali per Type & Status
                            </h2>
                            <div id="type-chart" className="h-44"></div>
                        </div>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-12">
                        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Calender Plan Anomaly
                            </h2>
                            <div className="h-[650px] md:h-[460px] lg:h-[700px]">
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
                                Anomali Anda Terbaru
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Tipe Anomali
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Tanggal
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {anomalis
                                            .filter(
                                                (anomali) =>
                                                    anomali.user_id ===
                                                    auth.user.id
                                            )
                                            .slice(0, 5)
                                            .map((anomali) => (
                                                <tr key={anomali.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {anomali.titlename}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                                            {dateFormat(
                                                                anomali.date_plan_start,
                                                                "dd mmmm yyyy"
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                anomali.status
                                                                    .name ===
                                                                "Open"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                                                    : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                                            }`}
                                                        >
                                                            {
                                                                anomali.status
                                                                    .name
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
