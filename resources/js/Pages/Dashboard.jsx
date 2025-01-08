import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import ApexCharts from "apexcharts";
import dateFormat from "dateformat";
import { Tooltip } from "flowbite-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Modal2 from "@/Components/Modal2";

export default function Dashboard({
    status,
    equipments,
    anomalis,
    anomalis_date,
    anomaliPerEquipmentStatus,
    anomaliPerSectionType,
    anomaliPerStatus,
    maintenance_schedule,
}) {
    const { auth } = usePage().props;
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 11;
    const totalPages = Math.ceil(anomalis.length / itemsPerPage);

    const getCurrentAnomalies = () => {
        if (!Array.isArray(anomalis)) return [];

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return anomalis.slice(indexOfFirstItem, indexOfLastItem);
    };

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
        // Handle klik event berdasarkan tipenya
        const eventType = clickInfo.event.extendedProps.type;
        if (eventType === "anomali") {
            // Handle klik event anomali
            setSelectedEvent(clickInfo.event.extendedProps);
            setShowModal(true);
        } else if (eventType === "maintenance") {
            // Handle klik event maintenance
            // Misalnya menampilkan modal yang berbeda
            setSelectedMaintenance(clickInfo.event.extendedProps);
            setShowMaintenanceModal(true);
        }
    };

    // Tambahkan fungsi untuk mengubah halaman
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!anomaliPerSectionType || anomaliPerSectionType.length === 0) {
            console.log("Data tidak tersedia");
            return;
        }

        // Pastikan element dengan id "section-type-chart" ada
        const chartElement = document.querySelector("#section-type-chart");
        if (!chartElement) {
            console.log("Element chart tidak ditemukan");
            return;
        }

        // Mengorganisir data untuk chart
        const sections = [
            ...new Set(anomaliPerSectionType.map((item) => item.section_name)),
        ];
        const types = [
            ...new Set(anomaliPerSectionType.map((item) => item.type_name)),
        ];

        // Menyiapkan series data
        const series = types.map((type) => ({
            name: type,
            data: sections.map((section) => {
                const match = anomaliPerSectionType.find(
                    (item) =>
                        item.section_name === section && item.type_name === type
                );
                return match ? match.total : 0;
            }),
        }));

        const options = {
            series: series,
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    columnWidth: "50%",
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: {
                                fontSize: "13px",
                                fontWeight: 900,
                            },
                        },
                    },
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            xaxis: {
                categories: sections,
                labels: {
                    formatter: function (val) {
                        return Math.abs(Math.round(val));
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return Math.abs(val) + " anomali";
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
            },
            colors: ["#DA680F", "#008080"],
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return Math.abs(val);
                },
                style: {
                    fontSize: "12px",
                    colors: ["#fff"],
                },
            },
        };

        try {
            const chart = new ApexCharts(chartElement, options);
            chart.render();

            return () => {
                chart.destroy();
            };
        } catch (error) {
            console.error("Error rendering chart:", error);
        }
    }, [anomaliPerSectionType]);

    useEffect(() => {
        // Tambahkan pengecekan untuk memastikan data tersedia
        if (
            !anomaliPerEquipmentStatus ||
            anomaliPerEquipmentStatus.length === 0
        ) {
            return;
        }

        // Mengorganisir data untuk chart - Diubah untuk mengelompokkan berdasarkan status
        const statusData = {
            New: [],
            Open: [],
            Close: [],
        };

        // Mengumpulkan semua equipment yang unik
        const uniqueEquipments = [
            ...new Set(
                anomaliPerEquipmentStatus.map((item) => item.equipment_name)
            ),
        ];

        // Mengorganisir data berdasarkan status
        anomaliPerEquipmentStatus.forEach((item) => {
            if (statusData[item.status_name]) {
                statusData[item.status_name].push({
                    equipment: item.equipment_name,
                    total: item.total,
                });
            }
        });

        // Pastikan element dengan id "pie-chart" ada
        const chartElement = document.querySelector("#pie-chart");
        if (!chartElement) {
            return;
        }

        // Membuat series berdasarkan status
        const series = Object.entries(statusData).map(([status, data]) => ({
            name: status,
            data: uniqueEquipments.map((equipment) => {
                const equipmentData = data.find(
                    (d) => d.equipment === equipment
                );
                return equipmentData ? equipmentData.total : 0;
            }),
        }));

        const options = {
            series: series,
            chart: {
                type: "bar",
                height: 400,
                stacked: true,
                toolbar: {
                    show: true,
                },
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: false, // Ubah ke false untuk membuat vertikal
                    columnWidth: "50%",
                    endingShape: "rounded",
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetY: -10,
                            style: {
                                fontSize: "13px",
                                fontWeight: 900,
                            },
                        },
                    },
                },
            },
            stroke: {
                width: 1,
                colors: ["#fff"],
            },
            xaxis: {
                categories: uniqueEquipments,
                labels: {
                    rotate: -30,
                    rotateAlways: true,
                    style: {
                        fontSize: "12px",
                    },
                },
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return Math.abs(Math.round(val));
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return Math.abs(val);
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "top",
                horizontalAlign: "center",
                offsetX: 0,
                offsetY: 0,
            },
            colors: ["#B81414", "#10B981", "#0EA5E9"],
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val;
                },
                style: {
                    fontSize: "12px",
                },
            },
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [anomaliPerEquipmentStatus]);

    useEffect(() => {
        if (!anomaliPerStatus || anomaliPerStatus.length === 0) return;

        const chartElement = document.querySelector("#radar-chart");
        if (!chartElement) return;

        const options = {
            series: anomaliPerStatus.map((item) => item.total),
            chart: {
                type: "pie",
                height: 350,
            },
            labels: anomaliPerStatus.map((item) => item.status_name),
            colors: ["#B81414", "#F59E0B", "#0EA5E9", "#10B981"],
            legend: {
                position: "bottom",
                labels: {
                    colors: "#9ca3af",
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "50%",
                    },
                    expandOnClick: true,
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    return opts.w.config.series[opts.seriesIndex];
                },
                style: {
                    fontSize: "12px",
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + " anomali";
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
            theme: {
                mode: "light",
            },
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [anomaliPerStatus]);

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
                                            Initial Plan :
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
                                            Final Plan:
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
                                            Reporter:
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
                                                d="M17.657 16.657L13.414 20.9a1 1 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            ></path>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            ></path>
                                        </svg>
                                        <span className="font-semibold mr-2">
                                            Location:
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
                                            Equipment:
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
                                                Attachment
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
                                                News Report
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

                {/* Modal untuk maintenance */}
                <Modal2
                    isOpen={showMaintenanceModal}
                    onClose={() => setShowMaintenanceModal(false)}
                    title="Detail Maintenance"
                >
                    {selectedMaintenance && (
                        <div className="space-y-4">
                            {/* Render detail maintenance */}
                            <p>Maintenance ID: {selectedMaintenance.id}</p>
                            <p>Title: {selectedMaintenance.title}</p>
                            <p>Start Date: {selectedMaintenance.start_date}</p>
                            <p>End Date: {selectedMaintenance.end_date}</p>
                        </div>
                    )}
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                Chart Anomali section
                            </h2>
                            <div
                                id="section-type-chart"
                                className="h-[350px]"
                            ></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:col-span-3">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                                    />
                                </svg>
                                Chart Anomali Equipment
                            </h2>
                            <div id="pie-chart" className="h-44 mb-4"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                Status Distribution
                            </h2>
                            <div id="radar-chart" className="h-[350px]"></div>
                            <p className="text-center text-gray-800 font-semibold text-lg pt-4">
                                Total Anomali : {anomalis.length}
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-12">
                        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Calender Plan
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
                                    events={[
                                        // Events dari tabel pertama (anomalis_date)
                                        ...anomalis_date.map((anomali) => ({
                                            id: `anomali-${anomali.id}`,
                                            title: anomali.titlename,
                                            start: anomali.date_plan_start,
                                            end: (() => {
                                                const endDate = new Date(
                                                    anomali.date_plan_end
                                                );
                                                endDate.setDate(
                                                    endDate.getDate() + 1
                                                );
                                                return endDate;
                                            })(),
                                            backgroundColor: getEventColor(
                                                anomali.status.name
                                            ),
                                            borderColor: getEventColor(
                                                anomali.status.name
                                            ),
                                            extendedProps: {
                                                type: "anomali",
                                                ...anomali,
                                            },
                                            allDay: true,
                                        })),

                                        // Events dari tabel kedua (misalnya: maintenance_schedule)
                                        ...[
                                            {
                                                id: 2,
                                                title: "Pemeliharaan Rutin",
                                                start: "2025-01-15",
                                                end: (() => {
                                                    const endDate = new Date(
                                                        "2025-01-17"
                                                    );
                                                    endDate.setDate(
                                                        endDate.getDate() + 1
                                                    );
                                                    return endDate;
                                                })(),
                                                backgroundColor: "#FF9800",
                                                borderColor: "#F57C00",
                                                extendedProps: {
                                                    type: "maintenance",
                                                    description:
                                                        "Pemeliharaan rutin peralatan",
                                                },
                                                allDay: true,
                                            },
                                        ],
                                    ]}
                                    eventClick={handleEventClick}
                                    eventDidMount={(info) => {
                                        // Custom tooltip berdasarkan tipe event
                                        const eventType =
                                            info.event.extendedProps.type;
                                        if (eventType === "anomali") {
                                            info.el.title = `${info.event.title}\nStatus: ${info.event.extendedProps.status.name}`;
                                        } else if (
                                            eventType === "maintenance"
                                        ) {
                                            info.el.title = `Maintenance: ${info.event.title}\nSchedule: ${info.event.start} - ${info.event.end}`;
                                        }
                                    }}
                                    height="auto"
                                    locale="id"
                                    firstDay={1}
                                    dayMaxEvents={true}
                                    moreLinkText="lihat {n} lainnya"
                                    noEventsText="Tidak ada anomali"
                                    businessHours={{
                                        daysOfWeek: [1, 2, 3, 4, 5],
                                        startTime: "07:00",
                                        endTime: "17:00",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                Anomali Anda
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                No
                                            </th>
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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {anomalis && anomalis.length > 0 ? (
                                            getCurrentAnomalies().map(
                                                (anomali, index) => (
                                                    <tr
                                                        key={anomali.id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {
                                                                    anomali.titlename
                                                                }
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
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                                >
                                                    Tidak ada data anomali untuk
                                                    ditampilkan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination Controls */}
                                {anomalis.length > itemsPerPage && (
                                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage + 1
                                                    )
                                                }
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Showing{" "}
                                                    <span className="font-medium">
                                                        {(currentPage - 1) *
                                                            itemsPerPage +
                                                            1}
                                                    </span>{" "}
                                                    to{" "}
                                                    <span className="font-medium">
                                                        {Math.min(
                                                            currentPage *
                                                                itemsPerPage,
                                                            anomalis.length
                                                        )}
                                                    </span>{" "}
                                                    of{" "}
                                                    <span className="font-medium">
                                                        {anomalis.length}
                                                    </span>{" "}
                                                    results
                                                </p>
                                            </div>
                                            <div>
                                                <nav
                                                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                                    aria-label="Pagination"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            handlePageChange(
                                                                currentPage - 1
                                                            )
                                                        }
                                                        disabled={
                                                            currentPage === 1
                                                        }
                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="sr-only">
                                                            Previous
                                                        </span>
                                                        <svg
                                                            className="h-5 w-5"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>

                                                    {/* Page Numbers */}
                                                    {[...Array(totalPages)].map(
                                                        (_, index) => (
                                                            <button
                                                                key={index + 1}
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        index +
                                                                            1
                                                                    )
                                                                }
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                                    ${
                                                                        currentPage ===
                                                                        index +
                                                                            1
                                                                            ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200"
                                                                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                                    }`}
                                                            >
                                                                {index + 1}
                                                            </button>
                                                        )
                                                    )}

                                                    <button
                                                        onClick={() =>
                                                            handlePageChange(
                                                                currentPage + 1
                                                            )
                                                        }
                                                        disabled={
                                                            currentPage ===
                                                            totalPages
                                                        }
                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="sr-only">
                                                            Next
                                                        </span>
                                                        <svg
                                                            className="h-5 w-5"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
