import { React, useRef, useState, useEffect } from "react";
import { Head, router, usePage, useForm, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import DashboardLayout from "@/Layouts/DashboardLayout";
import InputLabel from "@/Components/InputLabel";
import { TextInput } from "flowbite-react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Button, Drawer, Badge, Select } from "flowbite-react";
import { HiOutlinePlus } from "react-icons/hi";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";

export default function Bay() {
    const { bays, auth, conditions, substations, filters } = usePage().props;

    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [filterSubstation, setFilterSubstation] = useState(
        filters.substation || ""
    );
    const [filterCondition, setFilterCondition] = useState(
        filters.condition || ""
    );
    const [isLoading, setIsLoading] = useState(false);

    const perpage = useRef(filters.perpage || 15);

    useEffect(() => {
        setSearchTerm(filters.search || "");
        setFilterSubstation(filters.substation || "");
        setFilterCondition(filters.condition || "");
        perpage.current = filters.perpage || 15;
    }, [filters]);

    const debouncedSearch = useRef(
        debounce((search, substation, condition, perpage) => {
            setIsLoading(true);
            router.get(
                route(route().current()),
                { search, substation, condition, perpage },
                {
                    preserveState: true,
                    replace: true,
                    onFinish: () => setIsLoading(false),
                }
            );
        }, 300)
    ).current;

    useEffect(() => {
        debouncedSearch(
            searchTerm,
            filterSubstation,
            filterCondition,
            perpage.current
        );
    }, [searchTerm, filterSubstation, filterCondition]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubstationChange = (e) => {
        setFilterSubstation(e.target.value);
    };

    const handleConditionChange = (e) => {
        setFilterCondition(e.target.value);
    };

    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        debouncedSearch(
            searchTerm,
            filterSubstation,
            filterCondition,
            perpage.current
        );
    };

    const { data, setData, processing, post, errors, reset } = useForm({
        bay: "",
        substation: "",
        condition: "",
    });

    const { dataEdit, setEdit } = useForm({
        bayEdit: "",
        substationEdit: "",
        conditionEdit: "",
    });

    const [isOpen, setIsOpen] = useState(false);
    const handleCloseInsert = () => setIsOpen(false);

    const handleCreate = (e) => {
        e.preventDefault();
        router.post("/bay", data, {
            onSuccess: () => {
                reset();
                debouncedSearch(
                    searchTerm,
                    filterSubstation,
                    filterCondition,
                    perpage.current
                );
                setIsOpen(false);
                Swal.fire({
                    title: "Berhasil",
                    text: data.bay + " telah dibuat.",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1C64F2",
                    background: document.documentElement.classList.contains(
                        "dark"
                    )
                        ? "#374151"
                        : "#ffffff",
                    color: document.documentElement.classList.contains("dark")
                        ? "#ffffff"
                        : "#000000",
                });
            },
            onError: (errors) => {
                Swal.fire({
                    title: "Gagal",
                    text: "Terjadi kesalahan saat membuat bay.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1C64F2",
                });
            },
        });
    };

    const handleUpdate = (id) => {
        router.put(
            `/bay/${id}`,
            {
                bay: data.bay,
                substation: data.substation,
                condition: data.condition,
            },
            {
                onSuccess: () => {
                    reset();
                    debouncedSearch(
                        searchTerm,
                        filterSubstation,
                        filterCondition,
                        perpage.current
                    );
                    setOpenModalEdit(false);
                    Swal.fire({
                        title: "Berhasil",
                        text: `${data.bay} telah diperbarui.`,
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#1C64F2",
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        title: "Gagal",
                        text: "Terjadi kesalahan saat memperbarui bay.",
                        icon: "error",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#1C64F2",
                    });
                },
            }
        );
    };

    const [selectedItem, setSelectedItem] = useState(null);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const handleCloseEdit = () => setOpenModalEdit(false);

    const editItem = (data) => {
        setSelectedItem(data);
        setOpenModalEdit(true);
        setData({
            bay: data.name,
            substation: data.substation_id,
            condition: data.condition_id,
        });
    };

    useEffect(() => {
        if (selectedItem) {
            setData({
                bay: selectedItem.name,
                substation: selectedItem.substation_id,
                condition: selectedItem.condition_id,
            });
        }
    }, [selectedItem]);

    console.log(data);

    return (
        <>
            <Head title="Bay" />
            <DashboardLayout user={auth.user}>
                {/* Drawer Insert */}
                <Drawer
                    open={isOpen}
                    onClose={handleCloseInsert}
                    position="top"
                    className="dark:bg-gray-800"
                >
                    <Drawer.Header
                        title="New Bay"
                        className="dark:text-gray-200"
                    />
                    <Drawer.Items className="dark:bg-gray-800">
                        <form onSubmit={handleCreate} className="w-full">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <InputLabel
                                        htmlFor="Bay"
                                        value="Bay Name"
                                        className="text-sm font-thin dark:text-gray-300"
                                    />
                                    <TextInput
                                        type="text"
                                        sizing="md"
                                        name="bay"
                                        value={data.bay}
                                        onChange={(e) =>
                                            setData("bay", e.target.value)
                                        }
                                        className="mt-1 text-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-500"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="col-span-1">
                                    <InputLabel
                                        htmlFor="substation"
                                        value="Substation"
                                        className="text-sm font-thin dark:text-gray-300"
                                    />
                                    <Select
                                        required
                                        name="substation"
                                        onChange={(e) =>
                                            setData(
                                                "substation",
                                                e.target.value
                                            )
                                        }
                                        value={data.substation}
                                        className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
                                    >
                                        <option
                                            value=""
                                            className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                        >
                                            Select substation
                                        </option>
                                        {substations.map(
                                            (substation, index) => (
                                                <option
                                                    id="substation"
                                                    key={index}
                                                    value={substation.id}
                                                    className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                                >
                                                    {substation.name}
                                                </option>
                                            )
                                        )}
                                    </Select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.substations}
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
                                        className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
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
                                <div className="flex items-center justify-start col-span-1 mx-4">
                                    <PrimaryButton
                                        className="h-10 mt-[26px]"
                                        disabled={processing}
                                    >
                                        <HiOutlinePlus className="w-4 h-4 mr-2" />
                                        Add bay
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </Drawer.Items>
                </Drawer>

                {/* Drawer Edit */}
                <Drawer
                    open={openModalEdit}
                    onClose={handleCloseEdit}
                    position="top"
                    className="dark:bg-gray-800"
                >
                    <Drawer.Header
                        title="Edit Bay"
                        className="dark:text-gray-200"
                    />
                    <Drawer.Items className="dark:bg-gray-800">
                        {selectedItem && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdate(selectedItem.id);
                                }}
                                className="w-full"
                            >
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1">
                                        <InputLabel
                                            htmlFor="bay"
                                            value="Bay Name"
                                            className="text-sm font-thin dark:text-gray-300"
                                        />
                                        <TextInput
                                            id="bay"
                                            type="text"
                                            sizing="md"
                                            name="bay"
                                            value={
                                                data.bay || selectedItem.name
                                            }
                                            onChange={(e) =>
                                                setData("bay", e.target.value)
                                            }
                                            className="mt-1 text-gray-500 dark:text-gray-200 dark:border-gray-500"
                                            required
                                            autoFocus
                                        />
                                        <InputError
                                            message={errors.bay}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <InputLabel
                                            htmlFor="substation"
                                            value="Substation"
                                            className="text-sm font-thin dark:text-gray-300"
                                        />
                                        <Select
                                            id="substation"
                                            required
                                            name="substation"
                                            onChange={(e) =>
                                                setData(
                                                    "substation",
                                                    e.target.value
                                                )
                                            }
                                            value={
                                                data.substation ||
                                                selectedItem.substation_id
                                            }
                                            className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
                                        >
                                            <option value="">
                                                Select substation
                                            </option>
                                            {substations.map((substation) => (
                                                <option
                                                    key={substation.id}
                                                    value={substation.id}
                                                >
                                                    {substation.name}
                                                </option>
                                            ))}
                                        </Select>
                                        <InputError
                                            message={errors.substation}
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
                                            id="condition"
                                            required
                                            name="condition"
                                            onChange={(e) =>
                                                setData(
                                                    "condition",
                                                    e.target.value
                                                )
                                            }
                                            value={
                                                data.condition ||
                                                selectedItem.condition_id
                                            }
                                            className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500"
                                        >
                                            <option value="">
                                                Select condition
                                            </option>
                                            {conditions.map((condition) => (
                                                <option
                                                    key={condition.id}
                                                    value={condition.id}
                                                >
                                                    {condition.name}
                                                </option>
                                            ))}
                                        </Select>
                                        <InputError
                                            message={errors.condition}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex items-center justify-start col-span-1 mx-4">
                                        <PrimaryButton
                                            className="h-10 mt-[26px] dark:bg-blue-600 dark:hover:bg-blue-700"
                                            disabled={processing}
                                        >
                                            Update Bay
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Drawer.Items>
                </Drawer>

                <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
                    <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-gray-100 rtl:text-right dark:bg-gray-800 dark:text-gray-100">
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border rounded-full bg-emerald-50 border-emerald-500 focus:shadow-outline hover:scale-105 hover:shadow-xl dark:bg-emerald-900 dark:border-emerald-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="transition ease-in-out stroke-1 stroke-emerald-700 size-5 hover:rotate-45 dark:stroke-emerald-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                </button>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative bg-transparent flex-1">
                                        <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                                            <svg
                                                className="text-gray-700 size-5 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="search"
                                            className="block w-full text-md font-thin border border-gray-300 rounded-lg ps-14 py-2 focus:ring-gray-100 focus:border-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-cyan-600 dark:focus:border-cyan-600"
                                            placeholder="Cari bay"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <Select
                                        id="filterSubstation"
                                        value={filterSubstation}
                                        onChange={handleSubstationChange}
                                        className="text-xs flex-1 py-2"
                                    >
                                        <option value="">All Substation</option>
                                        {substations.map((substation) => (
                                            <option
                                                key={substation.id}
                                                value={substation.id}
                                            >
                                                {substation.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <Select
                                        id="filterCondition"
                                        value={filterCondition}
                                        onChange={handleConditionChange}
                                        className="text-xs flex-1 py-2"
                                    >
                                        <option value="">All Condition</option>
                                        {conditions.map((condition) => (
                                            <option
                                                key={condition.id}
                                                value={condition.id}
                                            >
                                                {condition.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </caption>
                        <thead className="text-xs text-gray-700 uppercase bg-slate-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr className="text-left">
                                <th scope="col" className="p-3">
                                    No
                                </th>
                                <th scope="col" className="p-3">
                                    Substation
                                </th>
                                <th scope="col" className="p-3">
                                    Bay
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
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : bays.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-4"
                                    >
                                        Tidak ada data yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                bays.data.map((bay, index) => (
                                    <tr
                                        className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                        key={index}
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                            {bays.from + index}
                                        </td>
                                        <td className="px-4 py-3 dark:text-gray-300">
                                            {bay.substation.name}
                                        </td>
                                        <td className="px-4 py-3 dark:text-gray-300">
                                            {bay.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {bay.condition.name ===
                                            "Operasi" ? (
                                                <Badge
                                                    color="success"
                                                    className="justify-center w-24"
                                                >
                                                    {bay.condition.name}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    color="failure"
                                                    className="justify-center w-24"
                                                >
                                                    {bay.condition.name}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="flex items-center justify-end mx-4 mt-2">
                                            <Button
                                                onClick={() => editItem(bay)}
                                                size="xs"
                                                color="warning"
                                                className="rounded-lg dark:bg-yellow-600 dark:hover:bg-yellow-700"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4 mx-2"
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
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between mx-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Showing {bays.from} to {bays.to} total {bays.total}
                        </p>
                        <div className="inline-flex items-center justify-center my-2">
                            <InputLabel
                                value="Filter"
                                className="dark:text-gray-300"
                            />
                            <select
                                name="perpage"
                                id="perpage"
                                className="p-2 mx-2 text-sm border-none rounded-lg dark:bg-gray-700 dark:text-gray-300"
                                value={perpage.current}
                                onChange={handleChangePerPage}
                            >
                                <option>10</option>
                                <option>20</option>
                                <option>30</option>
                            </select>
                        </div>
                        <Pagination className="rounded-sm" links={bays.links} />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
