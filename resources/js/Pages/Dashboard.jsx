import React, { useEffect, useState } from "react";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";


export default function Dashboard(props) {

    const {gardu, anomali, auth} = usePage().props

    console.log(gardu);


    return (
        <>
        <Head title="Dashboard"/>
            <DashboardLayout user={auth.user}>

                {/* <ToastContainer/> */}

      <div className="grid grid-cols-3 gap-4 mb-4">

      </div>
      <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50">

      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">
               <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
               </svg>
            </p>
         </div>



      </div>
      <div className="grid grid-cols-2 gap-4">
         <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">
               <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
               </svg>
            </p>
         </div>
         <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">
               <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
               </svg>
            </p>
         </div>
         <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">
               <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
               </svg>
            </p>
         </div>
         <div className="flex items-center justify-center rounded bg-gray-50 h-28">
            <p className="text-2xl text-gray-400">
               <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
               </svg>
            </p>
         </div>
    </div>
            </DashboardLayout>
        </>
    );
}
