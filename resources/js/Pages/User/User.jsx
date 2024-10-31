import DashboardLayout from "@/Layouts/DashboardLayout";
import Pagination from "@/Components/Pagination";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useRef, useState, useCallback } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Select } from "@headlessui/react";
import { Badge, Button, Label, Modal, TextInput } from "flowbite-react";
import {
    HiUser,
    HiOutlineMail,
    HiPencilAlt,
    HiOfficeBuilding,
    HiUserCircle,
    HiLockClosed,
    HiX,
    HiUserAdd,
} from "react-icons/hi";
import Modal2 from "@/Components/Modal2";
import debounce from "lodash/debounce";
import Notiflix from "notiflix";

export default function User({ auth, users, substations, roles }) {
    const [openModal, setOpenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const perpage = useRef(10);
    const [isLoading, setisLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { data, setData, patch, processing, errors, reset } = useForm({
        substation_id: "",
        role_id: "",
    });

    const getData = useCallback(
        debounce((search) => {
            setisLoading(true);
            router.get(
                route().current(),
                {
                    perpage: perpage.current,
                    search: search,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onFinish: () => setisLoading(false),
                }
            );
        }, 300),
        []
    );

    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData(searchTerm);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        getData(value);
    };

    const {
        data: createData,
        setData: setCreateData,
        post,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        name: "",
        email: "",
        substation_id: "",
        role_id: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("user.create"), {
            preserveScroll: true,
            onSuccess: () => {
                resetCreate();
                setOpenModal(false);
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

    const openEditModal = (user) => {
        setEditingUser(user);
        setData({
            substation_id: user.substation_id,
            role_id: user.role_id,
        });
    };

    const closeEditModal = () => {
        setEditingUser(null);
        reset();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        patch(route("user.update", editingUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                Swal.fire({
                    title: "Success",
                    text: "User has been updated.",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1C64F2",
                    customClass: {
                        popup: "dark:bg-gray-800 dark:text-white",
                        confirmButton:
                            "dark:bg-blue-600 dark:hover:bg-blue-700",
                    },
                });
            },
            onError: (errors) => {
                console.error("Error updating user:", errors);
                Swal.fire({
                    title: "Error",
                    text: "Failed to update user.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1C64F2",
                    customClass: {
                        popup: "dark:bg-gray-800 dark:text-white",
                        confirmButton:
                            "dark:bg-blue-600 dark:hover:bg-blue-700",
                    },
                });
            },
        });
    };

    return (
        <>
            <Head title="User" />
            <DashboardLayout user={auth.user}>
                {/* add user */}
                <Modal2
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    title="New User"
                >
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="">
                                <Label htmlFor="name" value="Name User" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={createData.name}
                                    autoComplete="off"
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        setCreateData("name", e.target.value)
                                    }
                                    required
                                    icon={HiUser}
                                    placeholder="Use the name you want to appear"
                                />
                                <InputError
                                    message={createErrors.name}
                                    className="mt-2"
                                />
                            </div>
                            <div className="">
                                <Label htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={createData.email}
                                    className="block w-full mt-1"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setCreateData("email", e.target.value)
                                    }
                                    required
                                    icon={HiOutlineMail}
                                    placeholder="example@domain.com"
                                />
                                <InputError
                                    message={createErrors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="">
                                <Label
                                    htmlFor="substation"
                                    value="Substation"
                                />
                                <Select
                                    id="substation"
                                    name="substation_id"
                                    className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                    value={createData.substation_id}
                                    onChange={(e) =>
                                        setCreateData(
                                            "substation_id",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        Select a Substation
                                    </option>
                                    {substations.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </Select>
                                <InputError
                                    className="mt-2"
                                    message={createErrors.substation_id}
                                />
                            </div>

                            <div className="">
                                <Label htmlFor="role" value="Role" />
                                <Select
                                    id="role"
                                    name="role_id"
                                    className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                    value={createData.role_id}
                                    onChange={(e) =>
                                        setCreateData("role_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </Select>
                                <InputError
                                    className="mt-2"
                                    message={createErrors.role_id}
                                />
                            </div>

                            <div className="">
                                <Label htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    value={createData.password}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        setCreateData(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    required
                                    icon={HiLockClosed}
                                    placeholder="Keep your password confidential"
                                />
                                <InputError
                                    message={createErrors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="">
                                <Label
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={createData.password_confirmation}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        setCreateData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                    autoComplete="new-password"
                                    icon={HiLockClosed}
                                    placeholder="Re-enter your password"
                                />
                                <InputError
                                    message={createErrors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
                            <button
                                type="submit"
                                disabled={processing}
                                className="p-2 text-sm text-white rounded-md focus:ring-4 focus:ring-sky-300 bg-sky-600 dark:bg-sky-700 dark:focus:ring-sky-800"
                            >
                                Add User
                            </button>
                        </div>
                    </form>
                </Modal2>

                {/* edit user */}
                <Modal2
                    isOpen={editingUser !== null}
                    onClose={closeEditModal}
                    title="Edit User"
                >
                    <form onSubmit={submitEdit} className="space-y-6">
                        <div className="mb-4">
                            <Label htmlFor="name" value="Nama Pengguna" />
                            <input
                                id="name"
                                value={editingUser?.name}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="substation" value="Substation" />
                            <Select
                                id="substation"
                                name="substation_id"
                                value={data.substation_id}
                                onChange={(e) =>
                                    setData("substation_id", e.target.value)
                                }
                                required
                                className="block w-full mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                            >
                                <option value="">Pilih Substation</option>
                                {substations.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </Select>
                            <InputError
                                message={errors.substation_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="role" value="Role" />
                            <Select
                                id="role"
                                name="role_id"
                                value={data.role_id}
                                onChange={(e) =>
                                    setData("role_id", e.target.value)
                                }
                                required
                                className="block w-full mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                            >
                                <option value="">Pilih Role</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </Select>
                            <InputError
                                message={errors.role_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end py-2 mt-4">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="p-2 text-sm text-white rounded-md focus:ring-4 focus:ring-sky-300 bg-sky-600 dark:bg-sky-700 dark:focus:ring-sky-800"
                            >
                                Save
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal2>

                <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
                    <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <caption className="p-4 text-lg font-semibold text-left bg-gray-100 rtl:text-right dark:bg-gray-800 dark:text-gray-100">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setOpenModal(true)}
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
                                        className="block w-1/6 text-md font-thin border border-gray-300 rounded-lg ps-14 py-2 focus:ring-gray-100 focus:border-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-gray-600 dark:focus:border-gray-600"
                                        placeholder="Search Anything"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                        </caption>

                        <thead className="text-xs text-gray-700 uppercase bg-slate-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr className="text-left">
                                <th scope="col" className="p-3">
                                    No
                                </th>
                                <th scope="col">Nama</th>
                                <th scope="col">Email</th>
                                <th scope="col">Penempatan</th>
                                <th scope="col" className="text-center">
                                    Role
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-4"
                                    >
                                        Loading....
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user, index) => (
                                    <tr
                                        className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                        key={index}
                                    >
                                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                                            {users.from + index}
                                        </td>
                                        <td className="py-2 dark:text-gray-300">
                                            {user.name}
                                        </td>
                                        <td className="py-2 text-blue-700 dark:text-blue-400">
                                            {user.email}
                                        </td>
                                        <td className="py-2 dark:text-gray-300">
                                            {user.substation.name}
                                        </td>
                                        <td className="flex items-center justify-center py-2">
                                            {user.role.name === "Admin" ? (
                                                <Badge
                                                    color="success"
                                                    className="justify-center w-24"
                                                >
                                                    {user.role.name}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    color="gray"
                                                    className="justify-center w-24"
                                                >
                                                    {user.role.name}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="py-2">
                                            <Button
                                                onClick={() =>
                                                    openEditModal(user)
                                                }
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
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between mx-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Showing {users.from} to {users.to} total{" "}
                            {users.total}
                        </p>
                        <div className="inline-flex items-center justify-center my-2">
                            <Label
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
                                <option>50</option>
                            </select>
                        </div>
                        <Pagination links={users.links} />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
