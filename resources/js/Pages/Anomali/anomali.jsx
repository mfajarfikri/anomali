import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function anomali({auth, anomali}){

    console.log(anomali);

    return(
        <>
        <Head title="Anomali"/>
        <DashboardLayout user={auth.user}>
        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">

                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                List Anomali
                <div className="flex items-center justify-between">
                    <div className="inline-flex row-span-3">
                        <p className="mt-1 text-sm font-normal text-gray-500 ">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                    </div>
                    <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button type="button" data-tooltip-target="data-tooltip" data-tooltip-placement="bottom" className="items-center justify-center hidden w-8 h-8 text-sm text-gray-500 rounded-lg sm:inline-flex hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 ">
                                        <svg width="20px" height="20px" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M603 192q0-43-30-73t-73-30-73 30.5-30 73 30 72.5 72.5 30 73-30.5T603 192zm0 616q0-43-30-73t-73-30-73 30-30 73 30 73 72.5 30 73-30.5T603 808zm0-308q0-43-30-73t-73-30-73 30-30 73 30 73 72.5 30 73-30.5T603 500z"/>
                                        </svg>
                                        <span className="sr-only">Download data</span>
                                    </button>
                                </span>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <div className="flex">
                                    <Dropdown.Link href={route('user.create')}>
                                        <div className="inline-flex items-center">
                                            <span className='text-sm'>Add User</span>
                                        </div>
                                    </Dropdown.Link>
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                </div>
                </caption>
                    <thead>
                        <th>No</th>
                        <th>Nama</th>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td>Kosambi</td>
                        </tr>
                    </tbody>
            </table>
        </div>


        </DashboardLayout>
        </>
    );
}
