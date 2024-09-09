import React from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from "@inertiajs/react";
import CountUp from 'react-countup';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

// Setup the localizer for the Calendar
const localizer = momentLocalizer(moment);

export default function Dashboard({status, equipments, type, anomalis, date_plan, }) {
    const { auth } = usePage().props;

    // Sample events for the calendar
    const events = [
        {
            start: new Date(),
            end: new Date(),
            title: "Test",
        },
        // Add more events as needed
    ];

    console.log(equipments);

    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout user={auth.user}>
                <div className="p-6">
                    <h1 className="mb-6 text-3xl font-semibold text-gray-800">Welcome Back, {auth.user.name}</h1>
                    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="col-span-1">
                            <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
                                <div className="p-3 mr-4 border rounded-full border-emerald-600 bg-emerald-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-2 stroke-emerald-700 size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </div>
                                <div>
                                    <strong className="text-gray-600"><CountUp end={status[2].anomali.length}/> From <CountUp duration={2} end={anomalis.length}/></strong>
                                    <p className="text-xs font-semibold text-gray-800">Ticket Closed</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
                                <div className="p-3 mr-4 border rounded-full border-rose-600 bg-rose-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-2 stroke-rose-700 size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </div>
                                <div>
                                    <strong className="text-gray-600"><CountUp end={status[1].anomali.length}/> From <CountUp duration={2} end={anomalis.length}/></strong>
                                    <p className="text-xs font-semibold text-gray-800">Ticket Open</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
                                <div className="p-3 mr-4 border rounded-full border-sky-600 bg-sky-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-2 stroke-sky-500 size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                                <div>
                                    <strong className="text-gray-600"><CountUp end={status[0].anomali.length}/> From <CountUp duration={2} end={anomalis.length}/></strong>
                                    <p className="text-xs font-semibold text-gray-800">Ticket New</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
                                <div className="p-3 mr-4 border rounded-full border-fuchsia-600 bg-fuchsia-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-2 stroke-fuchsia-700 size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                                    </svg>
                                </div>
                                <div>
                                    <strong className="text-gray-600">{type[0].anomali.length} From {anomalis.length}</strong>
                                    <p className="text-xs font-semibold text-gray-800">Ticket Major</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
                                <div className="p-3 mr-4 border border-purple-600 rounded-full bg-purple-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-2 stroke-purple-700 size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                    </div>
                                <div>
                                    <strong className="text-gray-600">{type[1].anomali.length} From {anomalis.length}</strong>
                                    <p className="text-xs font-semibold text-gray-800">Ticket Minor</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
                            {/* Add a chart or list of recent activities here */}
                            <p className="text-gray-600">Chart or list placeholder</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="mb-4 text-xl font-semibold">Performance Overview</h2>
                            {/* Add a performance chart here */}
                            <p className="text-gray-600">Performance chart placeholder</p>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <h2 className="mb-4 text-xl font-semibold">Calendar</h2>
                        <div style={{ height: '500px' }}>
                            <Calendar
                                localizer={localizer}
                                events={date_plan.date_plan}
                                style={{ height: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
