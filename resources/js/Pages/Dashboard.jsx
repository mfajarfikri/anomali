import React, { useEffect, useState } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Checkbox from "@/Components/Checkbox";


export default function Dashboard(props) {

    const {gardu, anomalis,anomalis_new, anomalis_open, anomalis_pending, anomalis_close, auth} = usePage().props

    console.log(anomalis_new);
    return (
        <>
        <Head title="Dashboard"/>
            <DashboardLayout user={auth.user}>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <div className="border rounded-lg">
                                    <div className="inline-flex items-center justify-center px-3 py-4">
                                        <button outline className="inline-flex items-center justify-center w-10 h-10 mr-2 transition-colors duration-150 border rounded-full bg-emerald-50 border-emerald-500 focus:shadow-outline hover:scale-105 hover:shadow-xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6 stroke-emerald-800">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                        </button>
                                        <div className="mx-4">
                                            <span className="flex justify-start">{anomalis_close} From {anomalis.length}</span>
                                            <span className="text-xs font-thin text-gray-500">Ticket Closed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="border rounded-lg">
                                    <div className="inline-flex items-center justify-center px-3 py-4">
                                        <button outline className="inline-flex items-center justify-center w-10 h-10 mr-2 transition-colors duration-150 border rounded-full bg-amber-50 border-amber-500 focus:shadow-outline hover:scale-105 hover:shadow-xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="stroke-amber-800 size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>

                                        </button>
                                        <div className="mx-4">
                                            <span className="flex justify-start">{anomalis_pending} From {anomalis.length}</span>
                                            <span className="text-xs font-thin text-gray-500">Ticket Pending</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="border rounded-lg">
                                    <div className="inline-flex items-center justify-center px-3 py-4">
                                        <button outline className="inline-flex items-center justify-center w-10 h-10 mr-2 transition-colors duration-150 border rounded-full bg-rose-50 border-rose-500 focus:shadow-outline hover:scale-105 hover:shadow-xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6 stroke-rose-800">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                        </button>
                                        <div className="mx-4">
                                            <span className="flex justify-start">{anomalis_open} From {anomalis.length}</span>
                                            <span className="text-xs font-thin text-gray-500">Ticket Open</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="border rounded-lg">
                                    <div className="inline-flex items-center justify-center px-3 py-4">
                                        <button outline className="inline-flex items-center justify-center w-10 h-10 mr-2 transition-colors duration-150 border rounded-full bg-sky-50 border-sky-500 focus:shadow-outline hover:scale-105 hover:shadow-xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="stroke-sky-300 size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>
                                        </button>
                                        <div className="mx-4">
                                            <span className="flex justify-start">{anomalis_new} From {anomalis.length}</span>
                                            <span className="text-xs font-thin text-gray-500">Ticket New</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row-span-1">
                        <div className="h-screen border rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
