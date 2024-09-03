import { React, useState } from 'react';
import { Link } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Sidebar, Badge, HR } from 'flowbite-react';

import { twMerge } from "tailwind-merge";

import { HiSwitchHorizontal, HiChartPie, HiInbox, HiHome, HiTable, HiUser, HiDocumentReport } from "react-icons/hi";

export default function DashboardLayout({children, user}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);


    const menu = () => {
        if (user.role_id == "1") {
            return [
                {
                    name: "Dashboard",
                    href: route("dashboard"),
                    current: route().current("dashboard"),
                    icon: HiChartPie
                },
                {
                    name: "Anomali",
                    href: route("anomali"),
                    current: route().current("anomali"),
                    icon: HiInbox
                },
                {
                    name: "User",
                    href: route("user"),
                    current: route().current("user"),
                    icon: HiUser
                },
                {
                    name: "Approval",
                    href: route("approval"),
                    current: route().current("approval"),
                    icon: HiDocumentReport
                },
                {
                    name: "Substation",
                    href: route("substation"),
                    current: route().current("subtation"),
                    icon: HiHome
                },
                {
                    name: "Bay",
                    href: route("bay"),
                    current: route().current("bay"),
                    icon: HiSwitchHorizontal
                }
            ];
        } else {
            return [
                {
                    name: "Dashboard",
                    href: route("dashboard"),
                    current: route().current("dashboard"),
                    icon: HiChartPie
                },
                {
                    name: "Anomali",
                    href: route("anomali"),
                    current: route().current("anomali"),
                    icon: HiInbox
                },

            ];
        }
    };

    return (
        <>

        <nav className="fixed top-0 z-40 w-full bg-white border-b border-gray-200">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <Link href="/" className="flex ms-2 md:me-24">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_PLN.png" className="h-8 me-3" alt="PLN Logo" />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">UPT Karawang</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3">
                            <div className='flex items-center'>
                                <div className="mx-4">
                                    <div className="hidden sm:flex sm:items-center sm:ms-6">
                                        <div className="inline-flex items-center ms-3">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                                    </svg>
                                                </button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    <span></span>
                                                </Dropdown.Content>
                                            </Dropdown>

                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none">
                                                        {user.name}
                                                        <svg className="ms-2 -me-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor" >
                                                            <path fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"/>
                                                        </svg>
                                                    </button>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <div className="flex">
                                                        <Dropdown.Link href={route('profile.edit')}>
                                                            <div className="inline-flex items-center">
                                                                <span className=''>Profile</span>
                                                            </div>
                                                        </Dropdown.Link>
                                                    </div>
                                                    <div className="flex">
                                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                                            <div className="inline-flex items-center">
                                                                <span className=''>Logout</span>
                                                            </div>
                                                        </Dropdown.Link>
                                                    </div>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="flex items-center -me-2 sm:hidden">
                                        <button
                                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                            className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
                                        >
                                            <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                                <path
                                                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                                <path
                                                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('substation')} active={route().current('substation')}>
                            Substation
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('user')} active={route().current('user')}>
                            User
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('user')} active={route().current('user')}>
                            peralatan
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
        </nav>



        <aside className="fixed top-0 left-0 z-30 w-64 h-screen pt-16 transition-transform -translate-x-full border-r border-gray-200 shadow-2xl sm:translate-x-0" aria-label="Sidebar">
            <Sidebar>
                <Sidebar.Items>
                    <Sidebar.ItemGroup >

                        {menu(user.role).map((item,index) => {
                            return (
                            <Sidebar.Item
                                    key={index}
                                    href={item.href}
                                    active={item.current}
                                    icon={item.icon}
                                    className='text-lg'
                                >
                                    {item.name}
                                </Sidebar.Item>
                            );
                        })}
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>

        </aside>



        <main className="px-4 pt-20 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
                {children}
            </div>
        </main>




        </>
    );
}
