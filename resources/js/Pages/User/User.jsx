import Pagination from "@/Components/Pagination";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import TextInput from "@/Components/TextInput";
import { useRef, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import { Badge, Button } from "flowbite-react";

export default function User({auth, users}) {

    const perpage = useRef(10);
    const [isLoading, setisLoading] = useState(false);
    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    }

    const getData = () => {
        setisLoading(true)
        router.get(route().current(), {
            perpage: perpage.current
        },{
            preserveScroll : true,
            preserveState : true,
            onFinish : () => setisLoading(false)
        });
    }

    console.log(users);

    return (
        <>
        <Head title="User"/>
        <DashboardLayout user={auth.user}>
        <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                Our User
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

                <thead className="text-xs text-gray-700 uppercase bg-slate-50">
                    <tr className="text-left">
                        <th scope="col" className="p-3">
                            No
                        </th>
                        <th scope="col" className="p-3">
                            Nama
                        </th>
                        <th scope="col" className="p-3">
                            Email
                        </th>
                        <th scope="col" className="p-3">
                            Penempatan
                        </th>
                        <th scope="col" className="p-3 text-center">
                            Role
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td>Loading....</td>
                        </tr>
                    ) : users.data.map((user, index) => (
                        <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                            <td className="px-4 py-2 font-medium text-gray-900">
                               {users.from + index}
                            </td>
                            <td className="px-4 py-2">
                                {user.name}
                            </td>
                            <td className="px-4 py-2">
                                {user.email}
                            </td>
                            <td className="px-4 py-2">
                                {user.gardu.name}
                            </td>
                            <td className="px-4 py-2">
                                {user.role.name === 'Admin' ?
                                (<Badge color="success" className="justify-center">
                                    {user.role.name}
                                </Badge>):(<Badge color="gray" className="justify-center">
                                    {user.role.name}
                                </Badge>
                                )}

                        </td>
                        <td className="px-4 py-2">
                        <div className="flex">
                                <Link href={route("user.edit",user.id)} className="mx-1">
                                    <Button color="warning" className="rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Button>
                                </Link>
                                <Link href='' className="mx-1">
                                    <Button color="failure" className="rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Button>
                                </Link>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-between mx-2">
                <p className="text-sm font-medium text-gray-700">
                    Showing {users.from} to {users.to} total {users.total}
                </p>
                <div className="inline-flex items-center justify-center my-2">
                    <InputLabel value='Filter'/>
                    <select name="perpage" id="perpage" className="p-2 mx-2 text-sm border-none rounded-lg"
                            value={perpage.current} onChange={handleChangePerPage}>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                    </select>
                </div>
            <Pagination links={users.links}/>
            </div>
        </div>
        </DashboardLayout>
        </>
    );
}
