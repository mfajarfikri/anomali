import { React, useRef, useState } from "react";
import { Head, router, usePage, useForm, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import DashboardLayout from "@/Layouts/DashboardLayout";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Button, Drawer, Badge, TextInput } from "flowbite-react";
import { HiOutlinePlus } from "react-icons/hi";
import { Select } from "@headlessui/react";
import Notiflix from "notiflix";

export default function Substation() {
    const { substations, conditions, auth } = usePage().props;

    const perpage = useRef(10);
    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    };
    const [isLoading, setisLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    const { data, setData, processing, post, errors, reset } = useForm({
        name: "",
        condition: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("substation.create"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsOpen(false);
                getData();
                Notiflix.Report.success("Success");
            },
            onError: (errors) => {
                Notiflix.Report.failure(
                    "Error",
                    `"Error create ${data.titlename}. ${Object.values(
                        errors
                    ).join(", ")} please call web administrator"`,
                    "OK"
                );
            },
        });
    };

    const getData = () => {
        setisLoading(true);
        router.get(
            route().current(),
            {
                perpage: perpage.current,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setisLoading(false),
            }
        );
    };

    const [substationsProps, setSubstationsProps] = useState({
        id: "",
        name: "",
    });

    return (
        <>
            <Head title="Substation" />
            <DashboardLayout user={auth.user}>
                <Drawer open={isOpen} onClose={handleClose} position="top">
                    <Drawer.Header title="Substation" />
                    <Drawer.Items>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Name"
                                        className="dark:text-gray-300"
                                    />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="block w-full mt-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                        autoComplete="name"
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />

                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <InputLabel
                                        htmlFor="condition"
                                        value="Condition"
                                        className="text-sm font-thin dark:text-gray-300"
                                    />
                                    <Select
                                        required
                                        name="condition"
                                        onChange={(e) =>
                                            setData("condition", e.target.value)
                                        }
                                        value={data.condition}
                                        className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    >
                                        <option
                                            value=""
                                            className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                        >
                                            Select condition
                                        </option>
                                        {conditions.map((condition, index) => (
                                            <option
                                                id="condition"
                                                key={index}
                                                value={condition.id}
                                                className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                            >
                                                {condition.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.conditions}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <PrimaryButton
                                        className="ms-4 mt-[26px] dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        disabled={processing}
                                    >
                                        <HiOutlinePlus className="w-4 h-4 mr-2" />
                                        Add substation
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </Drawer.Items>
                </Drawer>

                <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
                    <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-gray-100 rtl:text-right dark:bg-gray-800 dark:text-gray-100">
                            <div className="inline-flex items-center gap-3">
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border rounded-full bg-emerald-50 border-emerald-500 focus:shadow-outline hover:scale-105 hover:shadow-xl dark:bg-emerald-900 dark:border-emerald-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="transition ease-in-out stroke-1 stroke-emerald-700 size-5 hover:rotate-45 dark:stroke-emerald-300"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </caption>
                        <thead className="text-xs text-gray-700 uppercase bg-slate-50 dark:bg-gray-700 dark:text-gray-100">
                            <tr className="text-left">
                                <th scope="col" className="p-3">
                                    No
                                </th>
                                <th scope="col" className="p-3">
                                    Name
                                </th>
                                <th scope="col" className="p-3">
                                    Bay Total
                                </th>
                                <th scope="col" className="p-3">
                                    Condition
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-4"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                substations.data.map((substation, index) => (
                                    <tr
                                        className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
                                        key={index}
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                            {substations.from + index}
                                        </td>
                                        <td className="dark:text-gray-100">
                                            {substation.name}
                                        </td>
                                        <td className="px-10 py-3 font-bold dark:text-gray-100">
                                            {substation.bay.length}
                                        </td>
                                        <td>
                                            {substation.condition.name ===
                                            "Operasi" ? (
                                                <Badge
                                                    color="success"
                                                    className="justify-center w-24 dark:bg-green-900 dark:text-green-300"
                                                >
                                                    {substation.condition.name}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    color="failure"
                                                    className="justify-center dark:bg-red-900 dark:text-red-300"
                                                >
                                                    {substation.condition.name}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="flex items-center justify-end mx-4 mt-2">
                                            <div className="flex">
                                                <Link
                                                    href={route(
                                                        "substation.edit",
                                                        substation.id
                                                    )}
                                                    className="mx-1"
                                                >
                                                    <Button
                                                        size="xs"
                                                        color="warning"
                                                        className="rounded-lg dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between mx-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-100">
                            Showing {substations.from} to {substations.to} total{" "}
                            {substations.total}
                        </p>
                        <div className="inline-flex items-center justify-center my-2">
                            <InputLabel
                                value="Filter"
                                className="dark:text-gray-300"
                            />
                            <select
                                name="perpage"
                                id="perpage"
                                className="p-2 mx-2 text-sm border-none rounded-lg dark:bg-gray-700 dark:text-gray-100"
                                value={perpage.current}
                                onChange={handleChangePerPage}
                            >
                                <option>10</option>
                                <option>20</option>
                                <option>30</option>
                            </select>
                        </div>
                        <Pagination
                            className="rounded-sm dark:bg-gray-800 dark:text-gray-100"
                            links={substations.links}
                        />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
