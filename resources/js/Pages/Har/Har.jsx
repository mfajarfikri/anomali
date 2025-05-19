import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Badge, HR, Label, Textarea, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { HiUser, HiOutlineTicket, HiOutlineFilter } from "react-icons/hi";
import { Select } from "@headlessui/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";
import Modal2 from "@/Components/Modal2";
import dateFormat, { masks } from "dateformat";
import Notiflix from "notiflix";
import { Link } from "@inertiajs/react";
import * as XLSX from "xlsx";

export default function Har({
    auth,
    hars,
    substations,
    sections,
    types,
    equipments,
    status,
}) {
    const perpage = useRef(10);
    const [openModal, setOpenModal] = useState(false);

    const [filters, setFilters] = useState({
        substation_id: "",
        bay_id: "",
        user_id: auth.user.id,
        equipment_id: "",
        start_date: "",
        end_date: "",
    });

    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    };

    const [isLoading, setIsLoading] = useState(false);

    const getData = () => {
        setIsLoading(true);
        // Clean filters by removing empty string values
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "")
        );
        router.get(
            route().current(),
            {
                perpage: perpage.current,
                ...cleanedFilters,
            },
            {
                preserveScroll: true,
                preserveState: true,
                only: ["hars"],
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const [bays, setBays] = useState([]);
    const isAdmin = auth.user.role_id === 1;

    const { data, setData, processing, post, errors, reset } = useForm({
        titlename: "",
        substation: "",
        bay: "",
        user: auth.user.id,
        equipment: "",
        date: "",
        description: "",
    });

    const handleSubstationChange = (e) => {
        const substationId = e.target.value;
        setData("substation", substationId);

        const selectedSubstation = substations.find(
            (substation) => substation.id === parseInt(substationId)
        );

        if (selectedSubstation) {
            setBays(selectedSubstation.bay);
            setData("bay", ""); // Reset bay selection
        } else {
            setBays([]);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            // Mengatur bay berdasarkan substation yang dipilih jika admin login
            const selectedSubstation = substations.find(
                (substation) => substation.id === parseInt(data.substation)
            );
            if (selectedSubstation) {
                setBays(selectedSubstation.bay);
            }
        } else {
            // Mengatur bay berdasarkan substation user jika user login
            const userSubstation = substations.find(
                (substation) => substation.id === auth.user.substation_id
            );
            if (userSubstation) {
                setBays(userSubstation.bay);
            }
        }
    }, [isAdmin, substations, data.substation, auth.user.substation_id]);

    const submit = (e) => {
        e.preventDefault();
        post(route("har.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpenModal(false);
                getData();
                Notiflix.Report.success("Success");
            },
            onError: (errors) => {
                Notiflix.Report.failure(
                    "Error",
                    `"Gagal menutup ${data.titlename}. ${Object.values(
                        errors
                    ).join(", ")} please call web administrator"`,
                    "OK"
                );
            },
        });
    };

    const [selectedItem, setSelectedItem] = useState(null);
    const [openModalDetail, setOpenModalDetail] = useState(false);

    const detailItem = (data) => {
        setSelectedItem(data);
        setOpenModalDetail(true);
        console.log(data);
    };

    const handleExport = () => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";

        // Format data untuk excel dengan pengecekan null
        const excelData = hars.data.map((item, index) => ({
            No: index + 1,
            Title: item.titlename || "-",
            Substation: item.substation?.name || "-",
            Section: item.section?.name || "-",
            Type: item.type?.name || "-",
            User: item.user?.name || "-",
            Equipment: item.equipment?.name || "-",
            Bay: item.bay?.name || "-",
            "Additional Information": item.description || "-",
            "Date Found": item.date
                ? dateFormat(item.date, "dd mmmm yyyy")
                : "-",
            "Date Plan Start": item.date_plan_start
                ? dateFormat(item.date_plan_start, "dd mmmm yyyy")
                : "-",
            "Date Plan End": item.date_plan_end
                ? dateFormat(item.date_plan_end, "dd mmmm yyyy")
                : "-",
            Status: item.status?.name || "-",
        }));

        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

            // Atur lebar kolom
            const colWidths = [
                { wch: 5 }, // No
                { wch: 30 }, // Title
                { wch: 20 }, // Substation
                { wch: 15 }, // Section
                { wch: 10 }, // Type
                { wch: 20 }, // User
                { wch: 15 }, // Equipment
                { wch: 15 }, // Bay
                { wch: 40 }, // Additional Information
                { wch: 15 }, // Date Found
                { wch: 15 }, // Date Plan Start
                { wch: 15 }, // Date Plan End
                { wch: 10 }, // Status
            ];
            ws["!cols"] = colWidths;

            const excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array",
            });
            const data = new Blob([excelBuffer], { type: fileType });

            const fileName =
                "har_" + dateFormat(new Date(), "dd-mm-yyyy") + fileExtension;
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(data);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export error:", error);
            Notiflix.Notify.failure("Failed to export data");
        }
    };

    console.log(hars);

    return (
        <>
            <Head title="Har" />
            <DashboardLayout user={auth.user}>
                <Modal2
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    title="SCHEDULE HAR"
                >
                    <form onSubmit={submit}>
                        <div className="">
                            <Label
                                htmlFor="titlename"
                                value="Title Name"
                                className="text-sm font-thin dark:text-gray-300"
                            />
                            <TextInput
                                type="text"
                                id="titlename"
                                name="titlename"
                                value={data.titlename}
                                onChange={(e) =>
                                    setData("titlename", e.target.value)
                                }
                                icon={HiOutlineTicket}
                                autoComplete="off"
                                placeholder="My Suggestion for this title"
                                className="dark:text-gray-300 dark:border-gray-600"
                            />
                            <InputError
                                className="mt-2"
                                message={errors.titlename}
                            />
                        </div>
                        <div className="mt-2">
                            <div className="w-full">
                                <Label
                                    htmlFor="substation"
                                    value="Substation"
                                    className="text-sm font-thin dark:text-gray-300"
                                />
                                <Select
                                    name="substation"
                                    value={data.substation}
                                    onChange={
                                        isAdmin
                                            ? (e) =>
                                                  setData(
                                                      "substation",
                                                      e.target.value
                                                  )
                                            : handleSubstationChange
                                    }
                                    className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    disabled={auth.user.role_id !== 1}
                                >
                                    {substations.map((substation, index) => (
                                        <option
                                            key={index}
                                            value={substation.id}
                                            className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                        >
                                            {substation.name}
                                        </option>
                                    ))}
                                </Select>
                                <InputError
                                    className="mt-2"
                                    message={errors.substation}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="w-full">
                                <Label
                                    htmlFor="bay"
                                    value="Bay"
                                    className="text-sm font-thin dark:text-gray-300"
                                />
                                <Select
                                    name="bay"
                                    value={data.bay}
                                    onChange={(e) =>
                                        setData("bay", e.target.value)
                                    }
                                    className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                >
                                    <option value="">Select Bay</option>
                                    {bays.map((bay) => (
                                        <option key={bay.id} value={bay.id}>
                                            {bay.name}
                                        </option>
                                    ))}
                                </Select>
                                <InputError
                                    className="mt-2"
                                    message={errors.bay}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <Label
                                        htmlFor="user"
                                        value="User"
                                        className="text-sm font-thin dark:text-gray-300"
                                    />
                                    <TextInput
                                        type="text"
                                        id="user"
                                        name="user"
                                        onChange={(e) =>
                                            setData("user", e.target.value)
                                        }
                                        className="w-full font-thin text-gray-500 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                        placeholder={auth.user.name}
                                        icon={HiUser}
                                        readOnly
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label
                                        htmlFor="equipment"
                                        value="Equipment"
                                        className="text-sm font-thin dark:text-gray-300"
                                    />
                                    <Select
                                        name="equipment"
                                        onChange={(e) =>
                                            setData("equipment", e.target.value)
                                        }
                                        value={data.equipment}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    >
                                        <option
                                            value=""
                                            className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                        >
                                            Select equipment
                                        </option>
                                        {equipments.map((equipment, index) => (
                                            <option
                                                id="equipment"
                                                key={index}
                                                value={equipment.id}
                                                className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                            >
                                                {equipment.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.equipment}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="w-full">
                                <Label
                                    htmlFor="date"
                                    value="Date"
                                    className="text-sm font-thin dark:text-gray-300"
                                />

                                <TextInput
                                    type="date"
                                    name="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData("date", e.target.value)
                                    }
                                    className="text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    min={new Date().toISOString().split("T")[0]}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.date}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <Label
                                htmlFor="description"
                                value="Description"
                                className="text-sm font-thin dark:text-gray-300"
                            />

                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Leave a comment..."
                                rows={2}
                                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.description}
                            />
                        </div>
                        <HR />

                        <div className="flex items-center justify-end">
                            <PrimaryButton
                                className="ms-4 bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                                disabled={processing}
                            >
                                Add ticket
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal2>

                {/* Modal Detail */}
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
                                        {selectedItem.description}
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
                                                    selectedItem.date,
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
                                    Attachment :
                                </span>
                                {selectedItem.attachment_path && (
                                    <>
                                        {selectedItem.attachment_path.endsWith(
                                            ".pdf"
                                        ) ? (
                                            <div className="relative">
                                                <embed
                                                    src={`/storage/${selectedItem.attachment_path.replace(
                                                        "public/",
                                                        ""
                                                    )}`}
                                                    type="application/pdf"
                                                    width="100%"
                                                    height="600px"
                                                    className="rounded-lg shadow-md"
                                                />
                                            </div>
                                        ) : selectedItem.attachment_path.match(
                                              /\.(jpeg|jpg|gif|png)$/
                                          ) ? (
                                            <div className="relative">
                                                <a
                                                    href={`/storage/${selectedItem.attachment_path.replace(
                                                        "public/",
                                                        ""
                                                    )}`}
                                                    download
                                                    className="absolute top-2 right-2 bg-gray-500 bg-opacity-50 hover:bg-gray-600 hover:bg-opacity-70 text-white font-bold py-2 px-3 rounded-md transition duration-300 ease-in-out flex items-center gap-2"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                                                        />
                                                    </svg>
                                                </a>
                                                <img
                                                    src={`/storage/${selectedItem.attachment_path.replace(
                                                        "public/",
                                                        ""
                                                    )}`}
                                                    alt="attachment"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        ) : null}
                                    </>
                                )}
                                {!selectedItem.attachment_path && (
                                    <p className="text-red-800 text-xs italic dark:text-gray-400">
                                        No file available
                                    </p>
                                )}

                                {selectedItem.report_path && (
                                    <div className="mt-4">
                                        <span className="font-thin dark:text-gray-300">
                                            Berita Acara :
                                        </span>
                                        <embed
                                            src={`/storage/${selectedItem.report_path.replace(
                                                "public/",
                                                ""
                                            )}`}
                                            type="application/pdf"
                                            width="100%"
                                            height="600px"
                                            className="rounded-lg shadow-md"
                                        />
                                    </div>
                                )}
                                {!selectedItem.report_path && (
                                    <p className="mt-4 text-red-800 text-xs italic dark:text-gray-400">
                                        Official report is not yet available
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </Modal2>

                <div className="relative overflow-auto shadow-lg sm:rounded-lg">
                    <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                        <caption className="p-5 text-lg font-semibold text-left bg-gray-100 dark:bg-gray-800 rtl:text-right dark:text-gray-300">
                            <div className="inline-flex items-center gap-3">
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
                                <button
                                    onClick={handleExport}
                                    className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border-none hover:scale-105 dark:text-gray-300"
                                    title="Export to Excel"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        className="stroke-gray-700 size-6 dark:stroke-gray-300"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                        />
                                    </svg>
                                </button>

                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="relative bg-transparent">
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
                                            className="block w-full text-xs font-thin border-none rounded-lg ps-14 focus:ring-gray-100 focus:border-gray-100 dark:bg-gray-700 dark:text-gray-300"
                                            placeholder="Cari har"
                                            onChange={(e) => {
                                                const searchTerm =
                                                    e.target.value;
                                                setIsLoading(true);
                                                router.get(
                                                    route(route().current()),
                                                    {
                                                        search: searchTerm,
                                                        perpage:
                                                            perpage.current,
                                                    },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        only: ["hars"],
                                                        replace: true,
                                                        onFinish: () =>
                                                            setIsLoading(false),
                                                    }
                                                );
                                            }}
                                        />
                                    </div>
                                </form>
                            </div>
                        </caption>
                        <thead className="text-xs text-gray-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-gray-400">
                            <tr className="text-left">
                                <th scope="col" className="text-center w-10">
                                    No
                                </th>
                                <th scope="col" className="py-2 w-64">
                                    Title Name
                                </th>
                                <th scope="col" className="py-2 w-28">
                                    Substation
                                </th>
                                <th scope="col" className="py-2 w-36">
                                    Create By
                                </th>
                                <th scope="col" className="py-2 w-28">
                                    equipment
                                </th>
                                <th scope="col" className="py-2 w-20">
                                    Bay
                                </th>
                                <th scope="col" className="py-2 w-28">
                                    Date
                                </th>
                                <th
                                    scope="col"
                                    className="py-2 text-center w-72"
                                >
                                    Note
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="max-w-sm animate-pulse">
                                    <td
                                        colSpan="10"
                                        className="text-center py-4 dark:text-gray-400"
                                    >
                                        Loading.....
                                    </td>
                                </tr>
                            ) : hars.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="10"
                                        className="text-center py-4 dark:text-gray-400"
                                    >
                                        There is no data found
                                    </td>
                                </tr>
                            ) : (
                                hars.data.map((har, index) => (
                                    <tr
                                        key={har.id}
                                        onClick={() => detailItem(har)}
                                        className="bg-white border-b cursor-pointer dark:border-gray-600 dark:bg-[#1A262D] hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <td className="text-center py-2 font-medium text-gray-900 dark:text-gray-300 w-10">
                                            {hars.from + index}
                                        </td>
                                        <td className="dark:text-gray-400 w-64">
                                            {har.titlename}
                                        </td>
                                        <td className="dark:text-gray-400 w-28">
                                            {har.substation.name}
                                        </td>
                                        <td className="w-36">
                                            {har.user.name}
                                        </td>
                                        <td className="w-28">
                                            {har.equipment.name}
                                        </td>
                                        <td className="w-20">{har.bay.name}</td>
                                        <td className="w-28">
                                            {dateFormat(
                                                har.date,
                                                "dd mmmm yyyy"
                                            )}
                                        </td>
                                        <td className="w-72">{har.note}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between mx-2 dark:text-gray-400">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                            Showing {hars.from} to {hars.to} total {hars.total}
                        </p>
                        <div className="inline-flex items-center justify-center my-2">
                            <Label
                                value="Filter"
                                className="dark:text-gray-400"
                            />
                            <select
                                name="perpage"
                                id="perpage"
                                className="bg-transparent p-2 mx-2 text-sm border-none rounded-lg dark:bg-gray-700 dark:text-gray-400"
                                value={perpage.current}
                                onChange={handleChangePerPage}
                            >
                                <option>10</option>
                                <option>20</option>
                                <option value={hars.total}>All</option>
                            </select>
                        </div>
                        <Pagination
                            links={hars.links}
                            only={["hars"]}
                            preserveScroll={true}
                        />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
