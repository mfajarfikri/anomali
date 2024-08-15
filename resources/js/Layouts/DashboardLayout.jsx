import { React, useState } from 'react';
import { Link } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Sidebar, Badge, HR } from 'flowbite-react';

import { twMerge } from "tailwind-merge";

import { HiArrowSmRight, HiChartPie, HiInbox, HiDatabase, HiTable, HiUser, HiChevronRight, HiChevronUp, HiGlobe } from "react-icons/hi";

export default function DashboardLayout({children, user}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
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
                                        <div className="relative ms-3">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-md">
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
                                                    </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <div className="flex">
                                                        <Dropdown.Link href={route('profile.edit')}>
                                                            <div className="inline-flex items-center">
                                                                <span className=''>Profile</span>
                                                            </div>
                                                        </Dropdown.Link>
                                                    </div>
                                                    <div className="">
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
                        <ResponsiveNavLink href={route('gardu')} active={route().current('gardu')}>
                            Gardu Induk
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('user')} active={route().current('user')}>
                            User
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



        <aside className="fixed top-0 left-0 z-30 w-64 h-screen pt-12 transition-transform -translate-x-full border-r border-gray-200 shadow-2xl sm:translate-x-0" aria-label="Sidebar">
            <Sidebar>
                <Sidebar.Items>
                    <Sidebar.ItemGroup >
                        <Sidebar.Item href={route('dashboard')} active={route().current('dashboard')} icon={HiChartPie} className='text-lg font-bold'>
                            Dashboard
                        </Sidebar.Item>
                        <Sidebar.Item href={route('anomali')} active={route().current('anomali')} icon={HiInbox}>
                            Anomali
                        </Sidebar.Item>
                        <HR/>
                        <Sidebar.Item href={route('user')} active={route().current('user')} icon={HiUser}>
                            Users
                        </Sidebar.Item>
                        <Sidebar.Collapse
                            icon={HiDatabase}
                            label="Data"
                            renderChevronIcon={(theme, open) => {
                            const IconComponent = open ? HiChevronUp : HiChevronRight;

                            return <IconComponent aria-hidden className={twMerge(theme.label.icon.open[open ? 'on' : 'off'])} />;
                            }}
                        >
                            <Sidebar.Item href={route('gardu')} active={route().current('gardu')}>Gardu</Sidebar.Item>
                        </Sidebar.Collapse>
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
