import {React, useState} from "react";
import { Head, usePage } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import DashboardLayout from '@/Layouts/DashboardLayout';


export default function Gardu() {

    const {gardu, auth} = usePage().props

    return (
        <>

        <Head title="Gardu"/>
        <DashboardLayout user={auth.user}>

        <table className="w-full text-sm text-left text-gray-500 rtl:text-right">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white rtl:text-right">
                    Data Gardu
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            No
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama Gardu
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {gardu.data.map((gardu, index) =>
                        <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {gardu.id}
                            </th>
                            <td className="px-6 py-4">
                                {gardu.name}
                            </td>
                        </tr>

                    )}
                </tbody>
            </table>
            <Pagination className="mt-4" links={gardu.links}/>

        </DashboardLayout>
        </>
    );
}
