import React from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from "@inertiajs/react";
import { FiUsers, FiActivity, FiDollarSign, FiBarChart2 } from "react-icons/fi";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

// Setup the localizer for the Calendar
const localizer = momentLocalizer(moment);

export default function Dashboard(props) {
    const { auth } = usePage().props;

    const stats = [
        { title: "Total Users", value: "1,234", icon: FiUsers, color: "bg-blue-500" },
        { title: "Active Projects", value: "42", icon: FiActivity, color: "bg-green-500" },
        { title: "Revenue", value: "$54,321", icon: FiDollarSign, color: "bg-yellow-500" },
        { title: "Growth", value: "12%", icon: FiBarChart2, color: "bg-purple-500" },
    ];

    // Sample events for the calendar
    const events = [
        {
            start: new Date(),
            end: new Date(),
            title: "Sample Event",
        },
        // Add more events as needed
    ];

    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout user={auth.user}>
                <div className="p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Welcome back, {auth.user.name}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
                                <div className={`${stat.color} rounded-full p-3 mr-4`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                            {/* Add a chart or list of recent activities here */}
                            <p className="text-gray-600">Chart or list placeholder</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
                            {/* Add a performance chart here */}
                            <p className="text-gray-600">Performance chart placeholder</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Calendar</h2>
                        <div style={{ height: '500px' }}>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
