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
    anomaliPerType,
    anomaliPerTypeStatus,
    anomaliPerSection,
}) {
    const { auth } = usePage().props;
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const radialChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const typeChartRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 11;
    const totalPages = Math.ceil(anomalis.length / itemsPerPage);

    const getCurrentAnomalies = () => {
        if (!Array.isArray(anomalis)) return [];

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return anomalis.slice(indexOfFirstItem, indexOfLastItem);
    };

    useEffect(() => {
        setIsLoading(true);

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
    }, [status, equipments, anomalis, anomaliPerType, anomaliPerTypeStatus]);

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
        if (!anomaliPerSection || anomaliPerSection.length === 0) {
            return {
                series: [0],
                chart: {
                    height: 330,
                    type: "radialBar",
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: "70%",
                        },
                    },
                },
                labels: ["Tidak ada data"],
                noData: {
                    text: "Tidak ada data tersedia",
                    align: "center",
                    verticalAlign: "middle",
                    style: {
                        fontSize: "16px",
                    },
                },
            };
        }

        // Perbaikan pada perhitungan persentase
        const sections = [
            ...new Set(anomaliPerSection.map((item) => item.section_name)),
        ];
        const sectionTotals = sections.map((section) => {
            return anomaliPerSection
                .filter((item) => item.section_name === section)
                .reduce((sum, item) => sum + parseInt(item.total), 0); // Tambahkan parseInt
        });

        const totalAnomali = sectionTotals.reduce((a, b) => a + b, 0);
        const seriesData = sectionTotals.map(
            (total) => Math.round((total / totalAnomali) * 100) // Hitung persentase dari total keseluruhan
        );

        return {
            series: seriesData,
            chart: {
                type: "radialBar",
                height: 330,
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    },
                    export: {
                        svg: {
                            filename: "anomali_per_section_svg",
                        },
                        png: {
                            filename: "anomali_per_section_png",
                        },
                    },
                },
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: "30%",
                        background: "transparent",
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            fontSize: "16px",
                            offsetY: -10,
                        },
                        total: {
                            show: true,
                            label: "Total Anomali",
                            formatter: function () {
                                return sectionTotals.reduce((a, b) => a + b, 0);
                            },
                        },
                    },
                    track: {
                        show: true,
                        background: "#f2f2f2",
                        strokeWidth: "97%",
                        opacity: 1,
                        margin: 5,
                    },
                },
            },
            colors: ["#FF6347", "#20C997", "#4A90E2", "#FFD700", "#3B82F6"],
            labels: sections,
            legend: {
                show: true,
                position: "bottom",
                horizontalAlign: "center",
                floating: false,
                fontSize: "12px",
                fontFamily: "Inter, sans-serif",
                formatter: function (seriesName, opts) {
                    return [
                        seriesName,
                        " - ",
                        sectionTotals[opts.seriesIndex] + " anomali",
                    ];
                },
                labels: {
                    colors: undefined,
                    useSeriesColors: true,
                },
                markers: {
                    width: 12,
                    height: 12,
                    strokeWidth: 0,
                    strokeColor: "#fff",
                    radius: 12,
                },
            },
            stroke: {
                lineCap: "round",
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: function (val, opts) {
                        return sectionTotals[opts.dataPointIndex] + " anomali";
                    },
                },
            },
        };
    };

    const getChartEquipment = () => {
        if (!equipments || equipments.length === 0) {
            return {
                series: [
                    {
                        data: [0],
                    },
                ],
                chart: {
                    height: 390,
                    type: "bar",
                },
                xaxis: {
                    categories: ["Tidak ada data"],
                },
                noData: {
                    text: "Tidak ada data tersedia",
                    align: "center",
                    verticalAlign: "middle",
                    style: {
                        fontSize: "16px",
                    },
                },
            };
        }

        // Pastikan data anomali ada sebelum mapping
        const data = equipments.map((equipment) => ({
            x: equipment.name,
            y: Array.isArray(equipment.anomali) ? equipment.anomali.length : 0,
        }));

        return {
            series: [
                {
                    name: "Jumlah Anomali",
                    data: data,
                },
            ],
            chart: {
                height: 390,
                type: "bar",
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
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    columnWidth: "50%",
                    distributed: true,
                    dataLabels: {
                        position: "top",
                    },
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val;
                },
                style: {
                    fontSize: "12px",
                    colors: ["#304758"],
                },
            },
            legend: {
                show: false,
            },
            colors: [
                "#3498db",
                "#2ecc71",
                "#e74c3c",
                "#f1c40f",
                "#9b59b6",
                "#1abc9c",
                "#e67e22",
                "#34495e",
                "#27ae60",
                "#8e44ad",
                "#d35400",
                "#c0392b",
                "#16a085",
            ],
            xaxis: {
                categories: equipments.map((equipment) => equipment.name),
                labels: {
                    style: {
                        fontSize: "12px",
                        fontFamily: "Inter, sans-serif",
                    },
                    rotate: -45,
                    rotateAlways: false,
                    trim: true,
                    maxHeight: 120,
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + " anomali";
                    },
                },
            },
            grid: {
                padding: {
                    top: 40,
                },
            },
        };
    };

    const getChartAnomaliPerType = () => {
        if (!anomaliPerTypeStatus || anomaliPerTypeStatus.length === 0) {
            return {
                series: [
                    {
                        name: "Tidak ada data",
                        data: [0],
                    },
                ],
                chart: {
                    type: "bar",
                    height: 350,
                },
                xaxis: {
                    categories: ["Tidak ada data"],
                },
                noData: {
                    text: "Tidak ada data tersedia",
                    align: "center",
                    verticalAlign: "middle",
                    style: {
                        fontSize: "16px",
                    },
                },
            };
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
            colors: ["#10B981", "#EF4444", "#0EA5E9"], // Merah untuk New, Hijau untuk Open, Biru untuk Close
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

    // Tambahkan fungsi untuk mengubah halaman
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                                Chart Anomali section
                            </h2>
                            <div id="radial-chart" className="h-44 mb-4"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:col-span-2">
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Chart Anomali Status
                            </h2>
                            <div id="type-chart" className="h-44"></div>
                        </div>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-12">
                        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                                Calender Plan Anomali
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
                                    events={anomalis_date.map((anomali) => {
                                        const endDate = new Date(
                                            anomali.date_plan_end
                                        );
                                        endDate.setDate(endDate.getDate() + 1);

                                        return {
                                            id: anomali.id,
                                            title: anomali.titlename,
                                            start: anomali.date_plan_start,
                                            end: endDate,
                                            backgroundColor: getEventColor(
                                                anomali.status.name
                                            ),
                                            borderColor: getEventColor(
                                                anomali.status.name
                                            ),
                                            extendedProps: { ...anomali },
                                            allDay: true,
                                        };
                                    })}
                                    eventClick={handleEventClick}
                                    height="auto"
                                    eventDidMount={(info) => {
                                        // Gunakan vanilla tooltip jika Flowbite tooltip bermasalah
                                        info.el.title = `${info.event.title}\nStatus: ${info.event.extendedProps.status.name}`;
                                    }}
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
