import { React, useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import {
    Sidebar,
    Badge,
    HR,
    Button,
    theme,
    Tooltip,
    ToggleSwitch,
} from "flowbite-react";

import { twMerge } from "tailwind-merge";

import {
    HiSwitchHorizontal,
    HiChartPie,
    HiInbox,
    HiHome,
    HiOutlineMoon,
    HiUser,
    HiDocumentReport,
    HiOutlineSun,
} from "react-icons/hi";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";

export default function DashboardLayout({ children, user }) {
    const [jumlahStatusNew, setJumlahStatusNew] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const hitungJumlahStatusNew = async () => {
        try {
            const response = await axios.get("/api/jumlah-status-new");
            setJumlahStatusNew(response.data.jumlah);
        } catch (error) {
            console.error("Gagal mengambil jumlah status baru:", error);
        }
    };

    useEffect(() => {
        hitungJumlahStatusNew();
        // Panggil fungsi setiap 5 menit
        const interval = setInterval(hitungJumlahStatusNew, 30000);

        return () => clearInterval(interval);
    }, []);

    const signOut = () => {
        router.post("logout");
    };

    const switchMode = () => {
        const html = document.querySelector("html");
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);

        if (newDarkMode) {
            html.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            html.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    };

    useEffect(() => {
        const savedDarkMode = localStorage.getItem("darkMode");
        if (savedDarkMode !== null) {
            const isDark = savedDarkMode === "true";
            setIsDarkMode(isDark);
            document.querySelector("html").classList.toggle("dark", isDark);
        }
    }, []);

    // Efek hamburger
    const getHamburger = () => {
        document
            .getElementById("hamburger")
            .classList.toggle("hamburger-active");
        document.getElementById("nav-menu").classList.toggle("hidden");
    };

    // Efek Nav
    window.onscroll = function () {
        const header = document.querySelector("header");
        const fixedNav = header.offsetTop;

        if (window.pageYOffset > fixedNav) {
            header.classList.add("navbar-fixed");
        } else {
            header.classList.remove("navbar-fixed");
        }
    };
    return (
        <>
            <header className="absolute top-0 left-0 z-10 items-center w-full bg-transparent">
                <div className="flex justify-between">
                    <div className="relative flex items-center">
                        <div className="inline-flex items-center px-4 py-2">
                            <ApplicationLogo className="w-14 h-14" />
                            <span className="text-2xl font-bold dark:text-gray-300">
                                ULTG KARAWANG
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center px-4">
                        <button
                            id="hamburger"
                            onClick={getHamburger}
                            type="button"
                            className="absolute block right-4 lg:hidden"
                        >
                            <span className="transition duration-300 ease-in-out origin-top-left hamburger-line"></span>
                            <span className="transition duration-300 ease-in-out hamburger-line"></span>
                            <span className="transition duration-300 ease-in-out origin-bottom-left hamburger-line"></span>
                        </button>

                        <nav
                            id="nav-menu"
                            className="hidden text-base font-medium absolute bg-white rounded-lg shadow-lg max-w-[250px] w-full right-4 top-full lg:block lg:static lg:bg-transparent lg:max-w-full lg:shadow-none lg:rounded-none dark:bg-dark-300 dark:lg:bg-transparent"
                        >
                            <ul className="block lg:flex">
                                {user.role_id === 1 ? (
                                    <>
                                        <li className="items-center dark:hover:bg-slate-700 lg:dark:hover:bg-transparent lg:flex">
                                            <a
                                                href={route("dashboard")}
                                                className="flex py-2 mx-4 text-base text-black dark:text-gray-300 dark:hover:text-cyan-500 lg:inline-flex hover:text-cyan-500"
                                            >
                                                Dashboard
                                            </a>
                                        </li>
                                        <li className="items-center dark:hover:bg-slate-700 lg:dark:hover:bg-transparent lg:flex">
                                            <a
                                                href={route("anomali")}
                                                className="flex py-2 mx-4 text-base text-black dark:text-gray-300 dark:hover:text-cyan-500 lg:inline-flex hover:text-cyan-500"
                                            >
                                                Anomali
                                            </a>
                                        </li>
                                        <li className="items-center dark:hover:bg-slate-700 lg:dark:hover:bg-transparent lg:flex">
                                            <a
                                                href={route("substation")}
                                                className="flex py-2 mx-4 text-base text-black dark:text-gray-300 dark:hover:text-cyan-500 lg:inline-flex hover:text-cyan-500"
                                            >
                                                Substation
                                            </a>
                                        </li>
                                        <li className="items-center dark:hover:bg-slate-700 lg:dark:hover:bg-transparent lg:flex">
                                            <a
                                                href={route("bay")}
                                                className="flex py-2 mx-4 text-base text-black dark:text-gray-300 dark:hover:text-cyan-500 lg:inline-flex hover:text-cyan-500"
                                            >
                                                Bay
                                            </a>
                                        </li>
                                        <li className="items-center dark:hover:bg-slate-700 lg:dark:hover:bg-transparent lg:flex">
                                            <a
                                                href={route("user")}
                                                className="flex py-2 mx-4 text-base text-black dark:text-gray-300 dark:hover:text-cyan-500 lg:inline-flex hover:text-cyan-500"
                                            >
                                                User
                                            </a>
                                        </li>
                                        <li className="dark:hover:bg-slate-700 lg:dark:hover:bg-transparent lg:flex">
                                            <div className="inline-flex mx-4">
                                                <a
                                                    href={route("approval")}
                                                    className="flex mr-[2px] items-center text-base text-black dark:text-gray-300 dark:hover:text-cyan-500 lg:inline-flex hover:text-cyan-500"
                                                >
                                                    Approval
                                                </a>
                                                <div className="flex -mt-4">
                                                    <div className="flex items-center justify-center px-1 my-6 bg-red-500 border border-red-500 rounded-full">
                                                        <span className="text-xs font-semibold text-slate-100">
                                                            {jumlahStatusNew}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <Menu
                                            as="div"
                                            className="relative inline-block text-left"
                                        >
                                            <div className="">
                                                <MenuButton className="inline-flex items-center justify-center w-full px-3 py-2 text-base font-semibold text-black dark:text-gray-300">
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                                                        {user.name
                                                            .split(" ")
                                                            .map((n) =>
                                                                n[0].toUpperCase()
                                                            )
                                                            .join("")}
                                                    </div>
                                                    <p className="lg:hidden">
                                                        {user.name}
                                                    </p>
                                                </MenuButton>
                                            </div>
                                            <MenuItems
                                                transition
                                                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-dark-400"
                                            >
                                                <div className="py-1">
                                                    <MenuItem>
                                                        <a
                                                            href={route(
                                                                "profile.edit"
                                                            )}
                                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 dark:text-gray-200 dark:data-[focus]:bg-gray-600"
                                                        >
                                                            Profile
                                                        </a>
                                                    </MenuItem>
                                                    <form onSubmit={signOut}>
                                                        <MenuItem>
                                                            <button
                                                                type="submit"
                                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 dark:text-gray-200 dark:data-[focus]:bg-gray-600"
                                                            >
                                                                Sign out
                                                            </button>
                                                        </MenuItem>
                                                    </form>
                                                </div>
                                            </MenuItems>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <li className="items-center dark:hover:bg-slate-700 lg:dark:hover:bg-transparent lg:flex">
                                            <a
                                                href={route("anomali")}
                                                className="flex py-2 mx-4 text-base text-black dark:text-gray-300 dark:hover:text-cyan-500 lg:inline-flex hover:text-cyan-500"
                                            >
                                                Anomali
                                            </a>
                                        </li>
                                        <li className="items-center dark:hover:bg-slate-700 lg:dark:hover:bg-transparent lg:flex">
                                            <a
                                                href={route("dashboard")}
                                                className="flex py-2 mx-4 text-base text-black dark:text-gray-300 dark:hover:text-cyan-500 lg:inline-flex hover:text-cyan-500"
                                            >
                                                Dashboard
                                            </a>
                                        </li>
                                        <Menu
                                            as="div"
                                            className="relative inline-block text-left"
                                        >
                                            <div className="">
                                                <MenuButton className="inline-flex items-center justify-center w-full px-3 py-2 text-base font-semibold text-black dark:text-gray-300">
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">
                                                        {user.name[0].toUpperCase()}
                                                    </div>
                                                    <p className="lg:hidden">
                                                        {user.name}
                                                    </p>
                                                </MenuButton>
                                            </div>
                                            <MenuItems
                                                transition
                                                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-dark-400"
                                            >
                                                <div className="py-1">
                                                    <MenuItem>
                                                        <a
                                                            href={route(
                                                                "profile.edit"
                                                            )}
                                                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 dark:text-gray-200 dark:data-[focus]:bg-gray-600"
                                                        >
                                                            Profile
                                                        </a>
                                                    </MenuItem>
                                                    <form onSubmit={signOut}>
                                                        <MenuItem>
                                                            <button
                                                                type="submit"
                                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 dark:text-gray-200 dark:data-[focus]:bg-gray-600"
                                                            >
                                                                Sign out
                                                            </button>
                                                        </MenuItem>
                                                    </form>
                                                </div>
                                            </MenuItems>
                                        </Menu>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="p-4">
                <div className="mt-16 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    {children}
                </div>
            </div>

            <div className="fixed z-50 flex items-center justify-center bg-gray-300 rounded-full dark:bg-gray-600 bottom-12 right-2 transition-transform duration-300 ease-in-out transform hover:scale-105">
                <button
                    onClick={switchMode}
                    className="p-2 transition-transform duration-300 ease-in-out transform"
                >
                    {isDarkMode ? (
                        <HiOutlineSun className="w-6 h-6 text-yellow-500" />
                    ) : (
                        <HiOutlineMoon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                    )}
                </button>
            </div>
        </>
    );
}
