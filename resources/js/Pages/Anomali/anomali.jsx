import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, router } from "@inertiajs/react";
import {
    Button,
    Badge,
    HR,
    Label,
    Modal,
    Textarea,
    TextInput,
    FileInput,
} from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { HiUser, HiOutlineTicket, HiOutlineFilter } from "react-icons/hi";
import { Input, Select } from "@headlessui/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";
import Modal2 from "@/Components/Modal2";
import dateFormat, { masks } from "dateformat";
// import Swal from "sweetalert2";

export default function Anomali({
    auth,
    anomalis,
    equipments,
    substations,
    sections,
    types,
    status,
    progress,
}) {
    const perpage = useRef(15);
    const [openModal, setOpenModal] = useState(false);

    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    };

    const [isLoading, setIsLoading] = useState(false);

    const getData = () => {
        setIsLoading(true);
        router.get(
            route().current(),
            {
                perpage: perpage.current,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const [bays, setBays] = useState([]);
    const isAdmin = auth.user.role_id === 1;

    const { data, setData, processing, post, errors, reset } = useForm({
        titlename: "",
        substation: isAdmin ? "" : auth.user.substation_id, // Mengisi substation dengan nilai default
        section: "",
        type: "",
        user: auth.user.id,
        equipment: "",
        bay: "",
        date_find: "",
        additional_information: "",
        file: null,
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
        post(route("anomali.create"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpenModal(false);
                getData();
                Swal.fire({
                    title: "Success",
                    text: data.titlename + " has been created.",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1C64F2",
                });
            },
            onError: (errors) => {
                Swal.fire({
                    title: "Error",
                    text: "Error Create " + data.titlename,
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1C64F2",
                });
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
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const startDate = formData.get("startDate");
        const endDate = formData.get("endDate");
        console.log("Filter diterapkan:", { startDate, endDate });
        setOpenFilterModal(false);
    };

    const [filters, setFilters] = useState({
        substation: "",
        section: "",
        type: "",
        equipment: "",
        status: "",
        start_date: "",
        end_date: "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        setIsLoading(true);
        router.get(
            route().current(),
            {
                ...filters,
                perpage: perpage.current,
            },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsLoading(false),
            }
        );
        setOpenFilterModal(false);
    };

    const resetFilters = () => {
        setFilters({
            substation: "",
            section: "",
            type: "",
            equipment: "",
            status: "",
            start_date: "",
            end_date: "",
        });
        router.get(route().current(), { perpage: perpage.current });
        setOpenFilterModal(false);
    };

    console.log(data);
    // console.log(auth.user.role_id);

    return (
        <>
            <Head title="Anomali" />
            <DashboardLayout user={auth.user}>
                <Modal2
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    title="New Anomalies"
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
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
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
                                        {substations.map(
                                            (substation, index) => (
                                                <option
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
                                        message={errors.substation}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label
                                        htmlFor="section"
                                        value="Section"
                                        className="text-sm font-thin dark:text-gray-300"
                                    />
                                    <Select
                                        name="section"
                                        onChange={(e) =>
                                            setData("section", e.target.value)
                                        }
                                        value={data.section}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    >
                                        <option
                                            value=""
                                            className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                        >
                                            Select section
                                        </option>
                                        {sections.map((section, index) => (
                                            <option
                                                id="section"
                                                key={index}
                                                value={section.id}
                                                className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                            >
                                                {section.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.section}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Label
                                        htmlFor="type"
                                        value="Type"
                                        className="text-sm font-thin dark:text-gray-300"
                                    />
                                    <Select
                                        name="type"
                                        onChange={(e) =>
                                            setData("type", e.target.value)
                                        }
                                        value={data.type}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    >
                                        <option
                                            value=""
                                            className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                        >
                                            Select types
                                        </option>
                                        {types.map((type, index) => (
                                            <option
                                                id="type"
                                                key={index}
                                                value={type.id}
                                                className="text-sm font-thin text-gray-500 dark:text-gray-300"
                                            >
                                                {type.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.type}
                                    />
                                </div>
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
                                    name="date_find"
                                    value={data.date_find}
                                    onChange={(e) =>
                                        setData("date_find", e.target.value)
                                    }
                                    className="text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.date_find}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <Label
                                htmlFor="additional_information"
                                value="Description"
                                className="text-sm font-thin dark:text-gray-300"
                            />

                            <Textarea
                                id="additional_information"
                                name="additional_information"
                                value={data.additional_information}
                                onChange={(e) =>
                                    setData(
                                        "additional_information",
                                        e.target.value
                                    )
                                }
                                placeholder="Leave a comment..."
                                rows={2}
                                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            />

                            <InputError
                                className="mt-2"
                                message={errors.additional_information}
                            />
                        </div>
                        <div className="mt-2">
                            <Label
                                htmlFor="attachment"
                                value="Attachment"
                                className="text-sm font-thin dark:text-gray-300"
                            />

                            <input
                                type="file"
                                name="file"
                                onChange={(e) =>
                                    setData("file", e.target.files[0])
                                }
                                className="w-full text-sm font-thin text-gray-500 border border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            />
                            <p
                                className="mt-1 text-xs text-gray-500 dark:text-gray-300"
                                id="file_input_help"
                            >
                                * PNG, JPG or PDF (Max. 3048kb).
                            </p>

                            <InputError
                                className="mt-2"
                                message={errors.file}
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
                    title={`Preview`.selectedItem && selectedItem.titlename}
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
                                    Attachment :
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

                                {selectedItem.report_path && (
                                    <div className="mt-4">
                                        <span className="font-thin dark:text-gray-300">
                                            Berita Acara :
                                        </span>
                                        <embed
                                            src={`/storage/${selectedItem.report_path}`}
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

                {/* Modal Filter */}
                <Modal2
                    isOpen={openFilterModal}
                    onClose={() => setOpenFilterModal(false)}
                    title="Filter Tabel"
                >
                    <div className="mt-4">
                        <form onSubmit={applyFilters}>
                            <div className="mb-4">
                                <Label
                                    htmlFor="substation"
                                    value="Substation"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                                <Select
                                    id="substation"
                                    name="substation"
                                    value={filters.substation}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
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
                            </div>
                            <div className="mb-4">
                                <Label
                                    htmlFor="section"
                                    value="Section"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                                <Select
                                    id="section"
                                    name="section"
                                    value={filters.section}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                >
                                    <option value="">All Section</option>
                                    {sections.map((section) => (
                                        <option
                                            key={section.id}
                                            value={section.id}
                                        >
                                            {section.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="mb-4">
                                <Label
                                    htmlFor="type"
                                    value="Type"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                                <Select
                                    id="type"
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                >
                                    <option value="">All Type</option>
                                    {types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="mb-4">
                                <Label
                                    htmlFor="equipment"
                                    value="Equipment"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                                <Select
                                    id="equipment"
                                    name="equipment"
                                    value={filters.equipment}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                >
                                    <option value="">All Equipment</option>
                                    {equipments.map((equipment) => (
                                        <option
                                            key={equipment.id}
                                            value={equipment.id}
                                        >
                                            {equipment.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="mb-4">
                                <Label
                                    htmlFor="status"
                                    value="Status"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                />
                                <Select
                                    id="status"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                >
                                    <option value="">All Status</option>
                                    {status.map((s) => (
                                        <option key={s.id} value={s.name}>
                                            {s.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            <div className="mb-4 flex space-x-4">
                                <div className="flex-1">
                                    <Label
                                        htmlFor="start_date"
                                        value="Tanggal Mulai"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    />
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        value={filters.start_date}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label
                                        htmlFor="end_date"
                                        value="Tanggal Akhir"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    />
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="end_date"
                                        value={filters.end_date}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="pt-6 flex justify-between">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center w-full px-3 py-2 items-center text-sm font-semibold text-white bg-cyan-600 rounded-md shadow-sm hover:bg-cyan-500 sm:w-auto"
                                >
                                    <HiOutlineFilter className="mr-2" />
                                    Apply Filter
                                </button>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex justify-center w-full px-3 py-2 items-center text-sm font-semibold text-white bg-slate-600 rounded-md shadow-sm hover:bg-slate-500 sm:w-auto"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </form>
                    </div>
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
                                    onClick={() => setOpenFilterModal(true)}
                                    className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border-none hover:scale-105 dark:text-gray-300"
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
                                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
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
                                            placeholder="Cari Anomali"
                                            onChange={(e) => {
                                                const searchTerm =
                                                    e.target.value;
                                                router.get(
                                                    route(route().current()),
                                                    { search: searchTerm },
                                                    {
                                                        preserveState: true,
                                                        replace: true,
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
                                <th scope="col" className="text-center">
                                    No
                                </th>
                                <th scope="col" className=" py-2">
                                    Title Name
                                </th>
                                <th scope="col" className=" py-2">
                                    Substation
                                </th>
                                <th scope="col" className=" py-2">
                                    section
                                </th>
                                <th scope="col" className=" py-2 text-center">
                                    Type
                                </th>
                                <th scope="col" className=" py-2">
                                    User
                                </th>
                                <th scope="col" className=" py-2">
                                    equipment
                                </th>
                                <th scope="col" className=" py-2">
                                    Bay
                                </th>
                                <th scope="col" className=" py-2">
                                    Date Found
                                </th>
                                <th scope="col" className=" py-2 text-center">
                                    Status
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
                            ) : anomalis.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="10"
                                        className="text-center py-4 dark:text-gray-400"
                                    >
                                        No data matches the filter
                                    </td>
                                </tr>
                            ) : (
                                anomalis.data.map((anomali, index) => (
                                    <tr
                                        key={anomali.id}
                                        onClick={() => detailItem(anomali)}
                                        className="bg-white border-b cursor-pointer dark:border-gray-600 dark:bg-[#1A262D] hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <td className="text-center font-medium text-gray-900 dark:text-gray-300">
                                            {anomalis.from + index}
                                        </td>
                                        <td className="dark:text-gray-400">
                                            {anomali.titlename}
                                        </td>
                                        <td className="dark:text-gray-400">
                                            {anomali.substation.name}
                                        </td>
                                        <td className="dark:text-gray-400">
                                            {anomali.section.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {anomali.type.name === "Major" ? (
                                                <p className="flex justify-center py-0.5 font-semibold text-xs text-rose-800 bg-rose-100 rounded-[4px] dark:bg-transparent dark:border dark:border-rose-300 dark:text-rose-500">
                                                    {anomali.type.name}
                                                </p>
                                            ) : (
                                                <p className="flex justify-center py-0.5 font-semibold text-xs text-sky-800 bg-sky-100 rounded-[4px] dark:bg-transparent dark:border dark:border-sky-300 dark:text-sky-500">
                                                    {anomali.type.name}
                                                </p>
                                            )}
                                        </td>
                                        <td className="">
                                            {anomali.user.name}
                                        </td>
                                        <td className="">
                                            {anomali.equipment.name}
                                        </td>
                                        <td className="">{anomali.bay.name}</td>
                                        <td className="">
                                            {dateFormat(
                                                anomali.date_find,
                                                "dd mmmm yyyy"
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {anomali.status.name === "Open" ? (
                                                <p className="flex justify-center py-0.5 font-semibold text-xs text-emerald-700 bg-emerald-100 rounded-[4px] dark:bg-transparent dark:border dark:border-emerald-300 dark:text-emerald-500">
                                                    {anomali.status.name}
                                                </p>
                                            ) : anomali.status.name ===
                                              "Close" ? (
                                                <p className="flex justify-center py-0.5 font-semibold text-xs text-sky-800 bg-sky-100 rounded-[4px] dark:bg-transparent dark:border dark:border-sky-300 dark:text-sky-500">
                                                    {anomali.status.name}
                                                </p>
                                            ) : (
                                                <p className="flex justify-center py-0.5 font-semibold text-xs text-rose-800 bg-rose-100 rounded-[4px] dark:bg-transparent dark:border dark:border-rose-300 dark:text-rose-500">
                                                    {anomali.status.name}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between mx-2 dark:text-gray-400">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                            Showing {anomalis.from} to {anomalis.to} total{" "}
                            {anomalis.total}
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
                                <option value={anomalis.total}>All</option>
                            </select>
                        </div>
                        <Pagination links={anomalis.links} />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
