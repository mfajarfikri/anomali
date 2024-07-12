import Pagination from "@/Components/Pagination";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";

export default function User({auth, users}) {

    console.log(users);

    return (
        <>
        <Head title="User"/>
        <DashboardLayout user={auth.user}>
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr className="text-left">
                        <th scope="col" className="px-6 py-3">
                            No
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Role
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.data.map((users, index) => (
                    <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                        <td className="px-6 py-4 font-medium text-gray-900">
                            {users.id}
                        </td>
                        <td className="px-6 py-4">
                            {users.name}
                        </td>
                        <td className="px-6 py-4">
                            {users.email}
                        </td>
                        <td className="px-6 py-4">
                            <span className="p-2 text-sm bg-green-100 rounded-lg">

                            </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <div className="flex">
                                <Link href={route("user.edit",users.id)} className="mx-1">
                                    <button data-tooltip-target="tooltip-animation" className="flex p-2 text-white transition-all duration-300 bg-slate-500 rounded-xl hover:rounded-3xl hover:bg-slate-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </Link>
                                <Link href="" className="mx-1">
                                    <button className="flex p-2 text-white transition-all duration-300 bg-red-500 rounded-xl hover:rounded-3xl hover:bg-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </Link>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center mx-2">
                <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium">1</span>to
                    <span className="font-medium">10</span>
                    of
                    <span className="font-medium">97</span>
                    results
                </p>
            <Pagination links={users.links}/>
            </div>
        </div>
        </DashboardLayout>
        </>
    );
}
