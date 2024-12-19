import DashboardLayout from "@/Layouts/DashboardLayout";
import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import {
    Button,
    Badge,
    Label,
    Modal,
    Textarea,
    TextInput,
    FileInput,
} from "flowbite-react";
import { useState, useRef, useCallback } from "react";
import {
    HiCheck,
    HiOutlinePencil,
    HiOutlineX,
    HiEye,
    HiOutlineExclamation,
    HiOutlineCheck,
    HiLockClosed,
} from "react-icons/hi";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import Modal2 from "@/Components/Modal2";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import dateFormat, { masks } from "dateformat";
import debounce from "lodash/debounce";
import Notiflix from "notiflix";

export default function Approval({ auth, anomalis }) {
    const perpage = useRef(15);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getData = useCallback(
        debounce((query) => {
            setIsLoading(true);
            router.get(
                route().current(),
                { perpage: perpage.current, search: query },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsLoading(false),
                }
            );
        }, 300),
        []
    );

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearch(query);
        getData(query);
    };

    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData(search);
    };

    const { data, setData, processing, post, errors, reset } = useForm({
        approve_by: auth.user.name,
        date_plan_start: "",
        date_plan_end: "",
        date_execution: "",
        action: "",
        officialReport: null,
    });

    const [selectedApprove, setSelectedApprove] = useState(null);
    const [openApprove, setOpenApprove] = useState(false);
    const approve = (data) => {
        setSelectedApprove(data);
        setOpenApprove(true, data);
    };
    const handleApprove = (e) => {
        e.preventDefault();
        post(route("approval.approve", selectedApprove.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpenApprove(false);
                getData();
                Notiflix.Report.success(
                    "Success",
                    `"${selectedApprove.titlename} success approved"`,
                    "OK"
                );
            },
            onError: (errors) => {
                setOpenApprove(true);
                Notiflix.Report.failure(
                    "Error",
                    `"${selectedApprove.titlename} failed to be approved" - Web Admin`,
                    "OK"
                );
            },
        });
        setOpenApprove(false);
    };

    const [selectedReject, setSelectedReject] = useState(null);
    const [openReject, setOpenReject] = useState(false);
    const reject = (data) => {
        setSelectedReject(data);
        setOpenReject(true, data);
        // router.post(`/approval/approve/${id}`, data)
    };
    const handleReject = (id) => {
        router.post(`/approval/${id}/delete`, {
            _method: "delete",
        });
        setOpenReject(false);
        Notiflix.Report.success(
            "Success",
            `"${selectedApprove.titlename} rejected successfully"`
        );
    };

    const [editItem, setEditItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [openModalEdit, setOpenModalEdit] = useState(false)

    const toggleModal = (data) => {
        setEditItem(data);
        setIsModalOpen(true, data);
    };

    const [selectedItem, setSelectedItem] = useState(null);
    const [openModalDetail, setOpenModalDetail] = useState(false);

    const handlePreview = (data) => {
        setSelectedItem(data);
        setOpenModalDetail(true);
    };

    const handleClose = (e) => {
        e.preventDefault();

        // const formData = new FormData();
        // formData.append("date_execution", data.date_execution);
        // formData.append("action", data.action);
        // formData.append("officialReport", data.officialReport);

        post(route("approval.close", editItem.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                getData();
                // Menampilkan Swal ketika berhasil
                Notiflix.Report.success(
                    "Success",
                    `"${editItem.titlename} close successfully"`,
                    "OK"
                );
            },
            onError: (errors) => {
                // Menampilkan Swal ketika terjadi kesalahan
                Notiflix.Report.failure(
                    "Error",
                    `"Gagal menutup ${editItem.titlename}. ${Object.values(
                        errors
                    ).join(", ")}"`,
                    "OK"
                );
            },
        });
    };

    return (
        <>
            <Head title="Anomali" />
            <DashboardLayout user={auth.user}>
                <Modal2
                    isOpen={openModalDetail}
                    onClose={() => setOpenModalDetail(false)}
                    title={selectedItem && selectedItem.titlename}
                >
                    {selectedItem && (
                        <>
                            <div className="grid grid-flow-col grid-cols-2 gap-4 text-xs divide-x dark:divide-gray-700">
                                <div className="col-span-1 mt-4">
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Request By
                                        </span>
                                        <span className="font-semibold dark:text-gray-300">
                                            {selectedItem.user.name}
                                        </span>
                                    </div>
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Email
                                        </span>
                                        <span className="font-semibold dark:text-gray-300">
                                            {selectedItem.user.email}
                                        </span>
                                    </div>
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Substation
                                        </span>
                                        <span className="font-semibold dark:text-gray-300">
                                            {selectedItem.substation.name}
                                        </span>
                                    </div>
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Section
                                        </span>
                                        <span className="font-semibold dark:text-gray-300">
                                            {selectedItem.section.name}
                                        </span>
                                    </div>
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Status
                                        </span>
                                        {selectedItem.status.name === "Open" ? (
                                            <Badge color="success">
                                                {selectedItem.status.name}
                                            </Badge>
                                        ) : selectedItem.status.name ===
                                          "Close" ? (
                                            <Badge color="failure">
                                                {selectedItem.status.name}
                                            </Badge>
                                        ) : (
                                            <Badge color="info">
                                                {selectedItem.status.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-1 px-4 mt-4">
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Type
                                        </span>
                                        {selectedItem.type.name === "Major" ? (
                                            <Badge color="failure">
                                                {selectedItem.type.name}
                                            </Badge>
                                        ) : (
                                            <Badge color="indigo">
                                                {selectedItem.type.name}
                                            </Badge>
                                        )}
                                    </div>
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Equipment
                                        </span>
                                        <span className="font-semibold dark:text-gray-300">
                                            {selectedItem.equipment.name}
                                        </span>
                                    </div>
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Bay
                                        </span>
                                        <span className="font-semibold dark:text-gray-300">
                                            {selectedItem.bay.name}
                                        </span>
                                    </div>
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Created At
                                        </span>
                                        <span className="font-semibold dark:text-gray-300">
                                            {dateFormat(
                                                selectedItem.created_at,
                                                "dd mmmm yyyy, hh:MM"
                                            )}
                                        </span>
                                    </div>
                                    <hr className="dark:border-gray-700" />
                                    <div className="flex justify-between my-2">
                                        <span className="dark:text-gray-300">
                                            Approve By
                                        </span>
                                        {selectedItem.approve_by === null ? (
                                            <span className="dark:text-gray-300">
                                                -
                                            </span>
                                        ) : (
                                            <span className="font-semibold dark:text-gray-300">
                                                {selectedItem.approve_by}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <hr className="mt-4 dark:border-gray-700" />

                            <div className="mt-2">
                                <span className="font-thin dark:text-gray-300">
                                    Description
                                </span>
                                <div className="p-4 border rounded-md dark:border-gray-700 dark:bg-gray-800">
                                    <p className="text-xs dark:text-gray-300">
                                        {selectedItem.additional_information}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 font-thin">
                                <span className="font-thin dark:text-gray-300">
                                    Dates
                                </span>
                                <div className="p-2 text-xs border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                                    <div className="grid grid-cols-3 gap-4 divide-x dark:divide-gray-700">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm dark:text-gray-300">
                                                Date Found
                                            </span>
                                            <p className="dark:text-gray-300">
                                                {dateFormat(
                                                    selectedItem.date_find,
                                                    "dd mmmm yyyy"
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm dark:text-gray-300">
                                                Date Plan
                                            </span>
                                            {selectedItem.date_plan_start ===
                                            null ? (
                                                <p className="dark:text-gray-300">
                                                    -
                                                </p>
                                            ) : (
                                                <p className="dark:text-gray-300">
                                                    {dateFormat(
                                                        selectedItem.date_plan_start,
                                                        "dd mmmm yyyy"
                                                    )}{" "}
                                                    to{" "}
                                                    {dateFormat(
                                                        selectedItem.date_plan_end,
                                                        "dd mmmm yyyy"
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm dark:text-gray-300">
                                                Date Execution
                                            </span>
                                            {selectedItem.date_execution ===
                                            null ? (
                                                <p className="dark:text-gray-300">
                                                    -
                                                </p>
                                            ) : (
                                                <p className="dark:text-gray-300">
                                                    {dateFormat(
                                                        selectedItem.date_execution,
                                                        "dd mmmm yyyy"
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="font-thin dark:text-gray-300">
                                    Attachment
                                </span>
                                {selectedItem.attachment_path && (
                                    <>
                                        {selectedItem.attachment_path
                                            .toLowerCase()
                                            .endsWith(".pdf") ? (
                                            <embed
                                                src={`/storage/${selectedItem.attachment_path}`}
                                                type="application/pdf"
                                                width="100%"
                                                height="600px"
                                                className="rounded-lg shadow-md"
                                            />
                                        ) : (
                                            <div className="relative">
                                                <img
                                                    src={`/storage/${selectedItem.attachment_path}`}
                                                    alt="attachment"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                                <a
                                                    href={`/storage/${selectedItem.attachment_path}`}
                                                    download
                                                    className="absolute top-1 left-1 bg-gray-500 bg-opacity-50 hover:bg-gray-600 hover:bg-opacity-70 text-white font-bold py-1 px-2 rounded-md"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                    </>
                                )}
                                {!selectedItem.attachment_path && (
                                    <p className="text-red-800 text-xs italic dark:text-gray-400">
                                        No file available
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </Modal2>

                <Modal2
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        reset();
                    }}
                    title={editItem && editItem.titlename}
                >
                    {editItem && (
                        <form onSubmit={handleClose}>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="col-span-1">
                                    <Label
                                        htmlFor="dateExecution"
                                        value="Date Execution"
                                    />
                                    <TextInput
                                        type="date"
                                        name="date_execution"
                                        value={data.date_execution}
                                        onChange={(e) =>
                                            setData(
                                                "date_execution",
                                                e.target.value
                                            )
                                        }
                                        min={editItem.date_plan_start}
                                        max={editItem.date_plan_end}
                                    />
                                    <InputError
                                        message={errors.date_execution}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <Label htmlFor="action" value="Action" />
                                <Textarea
                                    name="action"
                                    value={data.action}
                                    onChange={(e) =>
                                        setData("action", e.target.value)
                                    }
                                    placeholder="Leave an action ..."
                                    required
                                    rows={2}
                                />
                                <InputError
                                    message={errors.action}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-2">
                                <Label
                                    htmlFor="officialReport"
                                    value="Official Report"
                                />
                                <div className="flex items-center justify-center w-full mt-1">
                                    <Label
                                        htmlFor="officialReport"
                                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="p-4">
                                                <svg
                                                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                {data.officialReport
                                                    ? data.officialReport.name
                                                    : "No file chosen"}
                                            </span>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                    Clik to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PDF Only (MAKS. 2000kb)
                                            </p>
                                        </div>
                                        <FileInput
                                            name="officialReport"
                                            id="officialReport"
                                            className="hidden"
                                            onChange={(e) =>
                                                setData(
                                                    "officialReport",
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </Label>
                                </div>
                                <InputError
                                    message={errors.officialReport}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex items-center justify-end">
                                <div className="mt-6">
                                    <PrimaryButton disabled={processing}>
                                        Simpan
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    )}
                </Modal2>

                <Dialog
                    open={openReject}
                    onClose={setOpenReject}
                    className="relative z-51"
                >
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500 bg-opacity-70 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-opacity-80"
                    />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 dark:bg-gray-800"
                            >
                                <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4 dark:bg-gray-800">
                                    <div className="sm:flex sm:items-start">
                                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-200">
                                            <HiOutlineExclamation
                                                aria-hidden="true"
                                                className="w-6 h-6 text-red-600"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <DialogTitle
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-200"
                                            >
                                                Reject{" "}
                                                {selectedReject &&
                                                    selectedReject.titlename}{" "}
                                                ?
                                            </DialogTitle>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Are you sure you want to
                                                    reject{" "}
                                                    {selectedReject &&
                                                        selectedReject.titlename}
                                                    ? This action will be
                                                    permanently removed and
                                                    cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleReject(selectedReject.id)
                                        }
                                        className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        data-autofocus
                                        onClick={() => setOpenReject(false)}
                                        className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    open={openApprove}
                    onClose={setOpenApprove}
                    className="relative z-10"
                >
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500 backdrop-blur-sm bg-opacity-70 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-opacity-80"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                            <form onSubmit={handleApprove}>
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 dark:bg-gray-800"
                                >
                                    <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4 dark:bg-gray-800">
                                        <div className="sm:flex sm:items-start">
                                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10 dark:bg-blue-200">
                                                <HiOutlineCheck
                                                    aria-hidden="true"
                                                    className="w-6 h-6 text-blue-600"
                                                />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <DialogTitle
                                                    as="h3"
                                                    className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-200"
                                                >
                                                    Approve{" "}
                                                    {selectedApprove &&
                                                        selectedApprove.titlename}{" "}
                                                    ?
                                                </DialogTitle>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Are you sure you want to{" "}
                                                        <strong className="font-bold underline">
                                                            approve
                                                        </strong>{" "}
                                                        this anomalies? This
                                                        action will be
                                                        permanently accept and
                                                        cannot be reject or
                                                        delete.
                                                    </p>
                                                </div>
                                                <p className="mt-4 text-sm text-rose-400">
                                                    Please set the date bellow
                                                </p>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <div className="col-span-1">
                                                        <InputLabel
                                                            className="text-gray-500 dark:text-gray-400"
                                                            value="Date Plan Start"
                                                        />
                                                        <TextInput
                                                            type="date"
                                                            name="date_plan_start"
                                                            value={
                                                                data.date_plan_start
                                                            }
                                                            min={
                                                                new Date()
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "date_plan_start",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="text-gray-500"
                                                        />

                                                        <InputError
                                                            className="mt-2"
                                                            message={
                                                                errors.date_plan_start
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <InputLabel
                                                            className="text-gray-500 dark:text-gray-400"
                                                            value="Date Plan End"
                                                        />

                                                        <TextInput
                                                            type="date"
                                                            name="date_plan_end"
                                                            value={
                                                                data.date_plan_end
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "date_plan_end",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            min={
                                                                new Date()
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            }
                                                            className="text-gray-500"
                                                        />
                                                        <InputError
                                                            className="mt-2"
                                                            message={
                                                                errors.date_plan_end
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row-reverse sm:px-6 dark:bg-gray-800">
                                        <PrimaryButton
                                            className="w-full sm:w-auto mb-2 sm:mb-0 sm:ms-4 bg-cyan-600"
                                            disabled={processing}
                                        >
                                            Approve
                                        </PrimaryButton>
                                        <button
                                            type="button"
                                            data-autofocus
                                            onClick={() =>
                                                setOpenApprove(false)
                                            }
                                            className="w-full sm:w-auto px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </DialogPanel>
                            </form>
                        </div>
                    </div>
                </Dialog>

                <div className="relative overflow-auto shadow-lg sm:rounded-lg">
                    <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <caption className="p-5 text-lg font-semibold text-left bg-gray-100 dark:bg-gray-800 rtl:text-right">
                            <div className="inline-flex items-center gap-3">
                                <form>
                                    <div className="relative bg-transparent">
                                        <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                                            <svg
                                                className="text-gray-700 size-5 dark:text-gray-300"
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
                                            className="block w-full text-sm font-thin border-none rounded-lg ps-14 focus:ring-gray-100 focus:border-gray-100 dark:focus:ring-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                            placeholder="Search Ticket"
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                </form>
                            </div>
                        </caption>
                        <thead className="text-xs text-gray-700 uppercase dark:text-gray-300 bg-slate-50 dark:bg-dark-400">
                            <tr className="text-left">
                                <th
                                    scope="col"
                                    className="p-3 dark:bg-dark-500"
                                >
                                    No
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 dark:bg-dark-500"
                                >
                                    Title Name
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 dark:bg-dark-500"
                                >
                                    Substation
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 dark:bg-dark-500"
                                >
                                    section
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center dark:bg-dark-500"
                                >
                                    Type
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 dark:bg-dark-500"
                                >
                                    User
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 dark:bg-dark-500"
                                >
                                    equipment
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 dark:bg-dark-500"
                                >
                                    Bay
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 dark:bg-dark-500"
                                >
                                    Date Found
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center dark:bg-dark-500"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center dark:bg-dark-500"
                                >
                                    Description
                                </th>
                                <th
                                    scope="col"
                                    className="py-3 text-center dark:bg-dark-500"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="dark:bg-gray-800 dark:text-gray-300">
                            {isLoading ? (
                                <tr className="max-w-sm animate-pulse">
                                    <td
                                        colSpan="12"
                                        className="text-center py-4 dark:text-gray-400"
                                    >
                                        Loading.....
                                    </td>
                                </tr>
                            ) : anomalis.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="12"
                                        className="text-center py-4 dark:text-gray-400"
                                    >
                                        There is no data found
                                    </td>
                                </tr>
                            ) : (
                                anomalis.data.map((anomali, index) => (
                                    <tr
                                        key={anomali.id}
                                        className="bg-white border-b cursor-pointer dark:bg-[#1A262D] hover:bg-zinc-100 dark:hover:bg-gray-700 dark:border-gray-700"
                                    >
                                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-300">
                                            {anomalis.from + index}
                                        </td>
                                        <td className="dark:text-gray-300">
                                            {anomali.titlename}
                                        </td>
                                        <td className="dark:text-gray-300">
                                            {anomali.substation.name}
                                        </td>
                                        <td className="dark:text-gray-300">
                                            {anomali.section.name}
                                        </td>
                                        <td className="px-4 ">
                                            {anomali.type.name === "Major" ? (
                                                <Badge
                                                    color="failure"
                                                    className="justify-center"
                                                >
                                                    {anomali.type.name}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    color="indigo"
                                                    className="justify-center"
                                                >
                                                    {anomali.type.name}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="dark:text-gray-300">
                                            {anomali.user.name}
                                        </td>
                                        <td className="dark:text-gray-300">
                                            {anomali.equipment.name}
                                        </td>
                                        <td className="dark:text-gray-300">
                                            {anomali.bay.name ===
                                            null ? null : (
                                                <span>{anomali.bay.name}</span>
                                            )}
                                        </td>
                                        <td className="dark:text-gray-300">
                                            {dateFormat(
                                                anomali.date_find,
                                                "dd mmmm yyyy"
                                            )}
                                        </td>
                                        <td className="px-4 ">
                                            {anomali.status.name === "Open" ? (
                                                <Badge
                                                    color="success"
                                                    className="justify-center"
                                                >
                                                    {anomali.status.name}
                                                </Badge>
                                            ) : anomali.status.name ===
                                              "Pending" ? (
                                                <Badge
                                                    color="warning"
                                                    className="justify-center"
                                                >
                                                    {anomali.status.name}
                                                </Badge>
                                            ) : anomali.status.name ===
                                              "Close" ? (
                                                <Badge
                                                    color="failure"
                                                    className="justify-center"
                                                >
                                                    {anomali.status.name}
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    color="info"
                                                    className="justify-center"
                                                >
                                                    {anomali.status.name}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="dark:text-gray-300">
                                            {anomali.additional_information}
                                        </td>
                                        <td className="flex items-center justify-center">
                                            <div className="flex items-center mt-1 space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handlePreview(anomali)
                                                    }
                                                    className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                                >
                                                    <HiEye className="w-4 h-4" />
                                                </button>
                                                {anomali.is_approve === 0 ? (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                approve(anomali)
                                                            }
                                                            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                                                        >
                                                            <HiCheck className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                reject(anomali)
                                                            }
                                                            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                                                        >
                                                            <HiOutlineX className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            toggleModal(anomali)
                                                        }
                                                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-200"
                                                    >
                                                        <HiLockClosed className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between mx-2 dark:text-gray-300">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Showing {anomalis.from} to {anomalis.to} total{" "}
                            {anomalis.total}
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
                        <Pagination links={anomalis.links} />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
