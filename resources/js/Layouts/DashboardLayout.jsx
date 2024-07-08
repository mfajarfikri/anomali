import { React, useState } from 'react';
import { Link } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { FaRegUser } from "react-icons/fa";
import { HiOutlineLogout, HiOutlineUser  } from "react-icons/hi";
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function DashboardLayout({children, user }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    return (
        <>

        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
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
                                                                <HiOutlineUser className='mx-2'/>
                                                                <span className=''>Profile</span>
                                                            </div>
                                                        </Dropdown.Link>
                                                    </div>
                                                    <div className="">
                                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                                            <div className="inline-flex items-center">
                                                                    <HiOutlineLogout className='mx-2'/>
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

        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 shadow-2xl sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                <ul className="space-y-2 font-medium">
                    <li>
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                        </svg>
                        <span className="ms-3">Dashboard</span>
                        </ResponsiveNavLink>
                    </li>
                    <li>
                        <ResponsiveNavLink href={route('gardu')} active={route().current('gardu')} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M10.915 2.345a2 2 0 0 1 2.17 0l7 4.52A2 2 0 0 1 21 8.544V9.5a1.5 1.5 0 0 1-1.5 1.5H19v6h1a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h1v-6h-.5A1.5 1.5 0 0 1 3 9.5v-.955a2 2 0 0 1 .915-1.68l7-4.52ZM17 17v-6h-2v6h2Zm-6-6h2v6h-2v-6Zm-2 6v-6H7v6h2Z" clipRule="evenodd"/>
                        <path d="M2 21a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Z"/>
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">Gardu Induk</span>
                        <span className="inline-flex items-center justify-center px-2 text-sm font-medium text-gray-800 bg-gray-100 rounded-full ms-3">Pro</span>
                        </ResponsiveNavLink>
                    </li>

                </ul>
                <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200">
                    <li>
                        <ResponsiveNavLink href={route('user')} active={route().current('user')} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd"/>
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">User</span>
                        <span className="inline-flex items-center justify-center px-2 text-sm font-medium text-gray-800 bg-gray-100 rounded-full ms-3">Pro</span>
                        </ResponsiveNavLink>
                    </li>
                </ul>
            </div>
        </aside>

        <main className="px-4 pt-20 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
                {children}
            </div>
        </main>




        </>
    );
}
