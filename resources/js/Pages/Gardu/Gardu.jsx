import {React, useRef, useState} from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import DashboardLayout from '@/Layouts/DashboardLayout';
import Dropdown from "@/Components/Dropdown";
import InputLabel from "@/Components/InputLabel";


export default function Gardu() {

    const perPage = useRef(10);
    const [isLoading, setisLoading] = useState(false);
    const handleChangePerPage = (e) => {
        perPage.current = e.target.value;
        getData();
    }

    const getData = () => {
        setisLoading(true)
        router.get(route().current(), {
            perPage: perPage.current
        },{
            preserveScroll : true,
            preserveState : true,
            onFinish : () => setisLoading(false)
        });
    }

    const {gardus, auth} = usePage().props

    console.log(gardus);

    return (
        <>
        <Head title="Gardu"/>
        <DashboardLayout user={auth.user}>
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                Gardu Induk
                <div className="flex items-center justify-between">
                    <div className="inline-flex row-span-3">
                        <p className="mt-1 text-sm font-normal text-gray-500 ">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                    </div>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button type="button" data-tooltip-target="data-tooltip" data-tooltip-placement="bottom" className="items-center justify-center w-8 h-8 text-sm text-gray-500 rounded-lg sm:inline-flex hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 ">
                                    <svg width="20px" height="20px" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M603 192q0-43-30-73t-73-30-73 30.5-30 73 30 72.5 72.5 30 73-30.5T603 192zm0 616q0-43-30-73t-73-30-73 30-30 73 30 73 72.5 30 73-30.5T603 808zm0-308q0-43-30-73t-73-30-73 30-30 73 30 73 72.5 30 73-30.5T603 500z"/>
                                    </svg>
                                    <span className="sr-only">Download data</span>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <div className="flex">
                                <Dropdown.Link href={route('gardu.create')}>
                                    <div className="inline-flex items-center">
                                        <span className='text-sm'>Add Gardu</span>
                                    </div>
                                </Dropdown.Link>
                            </div>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
                <div className="flex items-center justify-between">

                </div>
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-slate-50">
                    <tr className="text-left">
                        <th scope="col" className="p-3">
                            No
                        </th>
                        <th scope="col" className="p-3">
                            Nama
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                            <tr>
                                <td>Loading...</td>
                            </tr>
                        ) : gardus.data.map((gardu, index) => (
                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {gardus.from + index}
                                </td>
                                <td className="px-4 py-3">
                                    {gardu.name}
                                </td>
                            </tr>
                            ))
                        }

                </tbody>
            </table>
            <div className="flex items-center justify-between mx-2">
                <p className="text-sm font-medium text-gray-700">
                    Showing {gardus.from} to {gardus.to} total {" "}{gardus.total}
                </p>
                <div className="inline-flex items-center justify-center my-2">
                    <InputLabel value='Filter'/>
                    <select name="perpage" id="perpage" className="p-2 mx-2 text-sm border-none rounded-lg"
                            value={perPage.current} onChange={handleChangePerPage}>
                        <option>10</option>
                        <option>20</option>
                        <option>30</option>
                    </select>
                </div>
            <Pagination className="rounded-sm" links={gardus.links}/>
            </div>
        </div>
        </DashboardLayout>
        </>
    );
}
