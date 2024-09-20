import DashboardLayout from "@/Layouts/DashboardLayout";
import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Button,Badge, Label, Modal, Textarea, TextInput, FileInput } from "flowbite-react";
import { useState, useRef } from "react";
import { HiCheck, HiOutlinePencil, HiOutlineX, HiOutlineTicket, HiOutlineExclamation, HiOutlineCheck  } from "react-icons/hi";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Modal2 from "@/Components/Modal2";

export default function Approval({auth, anomalis}){


    const perpage = useRef(10);

    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    }

    const [isLoading, setisLoading] = useState(false);

    const getData = () => {
        setisLoading(true)
        router.get(route().current(), {
            perpage: perpage.current
        },{
            preserveScroll : true,
            preserveState : true,
            onFinish : () => setisLoading(false)
        });
    }
    const { data, setData, processing, post, errors, reset} = useForm({
        approve_by : auth.user.name,
        date_plan : '',
        date_execution : '',
        action : '',
    })

    const [selectedApprove, setSelectedApprove] = useState(null)
    const [openApprove, setOpenApprove] = useState(false)
    const approve = (data) => {
        setSelectedApprove(data)
        setOpenApprove(true, data)
    }
    const handleApprove = (id) => {
        router.post(`/approval/approve/${id}`, data)
        setOpenApprove(false)
    }

    const [selectedReject, setSelectedReject] = useState(null)
    const [openReject, setOpenReject] = useState(false)
    const reject = (data) => {
        setSelectedReject(data)
        setOpenReject(true, data)
        console.log(data);
        // router.post(`/approval/approve/${id}`, data)
    }
    const handleReject = (id) =>{
        router.post(`/approval/${id}/delete`, {
            _method: "delete"
        })
        setOpenReject(false)
        Swal.fire({
            title: 'Success',
            text: 'A anomali has been rejected.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#1C64F2'
        });
    }

    const [editItem, setEditItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [openModalEdit, setOpenModalEdit] = useState(false)

    const toggleModal = (data) => {
        setEditItem(data);
        setIsModalOpen(true, data);
        console.log(data);
    };

    const [file, setFile] = useState(false)
    const FileInputField = useRef(null)

    const handleFileChange = (e) => {
        setFile(event.target.files[0].name)
    }

    const save = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('attachment', file);

        // router.post(`/approval/update/${id}`, [formData, data], {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     },
        // });
    }

    const submit = (e) => {
        e.preventDefault();
    }

    return(
        <>
        <Head title="Anomali"/>
        <DashboardLayout user={auth.user}>

            <Modal2 isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem && editItem.titlename}>
                    {editItem && (
                        <>
                        <div className="grid grid-flow-col grid-cols-2 gap-4 text-xs divide-x">
                            <div className="col-span-1 mt-4">
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Request By</span>
                                    <span className="font-semibold">{editItem.user.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Email</span>
                                    <span className="font-semibold">{editItem.user.email}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Substation</span>
                                    <span className="font-semibold">{editItem.substation.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Section</span>
                                    <span className="font-semibold">{editItem.section.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Status</span>

                                    {editItem.status.name === "Open" ? (
                                        <Badge color="success">{editItem.status.name}</Badge>
                                    ) : editItem.status.name === "Close" ? (
                                        <Badge color="failure">{editItem.status.name}</Badge>
                                    ) : (
                                        <Badge color="info">{editItem.status.name}</Badge>
                                    )}
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Date Found</span>
                                    <span className="font-semibold">{editItem.date_find}</span>
                                </div>
                            </div>
                            <div className="col-span-1 px-4 mt-4">
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Type</span>
                                    {editItem.type.name === "Major" ? (
                                        <Badge color="failure">{editItem.type.name}</Badge>
                                    ) : (
                                        <Badge color="indigo">{editItem.type.name}</Badge>
                                    )
                                    }
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Equipment</span>
                                    <span className="font-semibold">{editItem.equipment.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Bay</span>
                                    <span className="font-semibold">{editItem.bay.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Created At</span>
                                    <span className="font-semibold">{editItem.created_at}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Approve By</span>
                                    {editItem.approve_by === null ? (
                                        <span>-</span>
                                    ) : (
                                        <span className="font-semibold">{editItem.approve_by}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <hr className="mt-2"/>
                        <div className="mt-2 font-thin">
                            <span>Note</span>
                        </div>
                        <div className="mt-1 border rounded-md">
                            <div className="m-4">
                                {editItem.other === null ? (
                                    <span>-</span>
                                ) : (
                                    <span className="text-xs">{editItem.other}</span>
                                )}

                                <p className="text-xs">{editItem.additional_information}</p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <form onSubmit={() => save(anomali.id)}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <Label htmlFor="datePlan" value="Date Plan"/>
                                        <TextInput
                                            type="date"
                                            name="date_plan"
                                            value={data.date_plan}
                                            onChange={(e) => setData('date_plan', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Label htmlFor="dateExecution" value="Date Execution"/>
                                        <TextInput
                                            type="date"
                                            name="date_execution"
                                            value={data.date_execution}
                                            onChange={(e) => setData('date_execution', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Label htmlFor="action" value="Action"/>
                                    <Textarea
                                        name="action"
                                        value={data.action}
                                        onChange={(e) => setData('action', e.target.value)}
                                        placeholder="Leave an action ..." required rows={2}
                                    />
                                </div>
                                <div className="mt-2">
                                    <Label htmlFor="attachment" value="Attachment"/>
                                    <div className="flex items-center justify-center w-full mt-1">
                                        <Label
                                            htmlFor="dropzone-file"
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="p-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24"
                                                        className="stroke-2 stroke-gray-400 size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
                                                    </svg>
                                                </div>
                                                <span>{file}</span>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span
                                                        className="font-semibold text-blue-600">Click to upload</span> or
                                                    drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF Only (MAX.
                                                    200kb)</p>
                                            </div>
                                            <FileInput
                                                name="attachment"
                                                id="dropzone-file" className="hidden"
                                                onChange={handleFileChange}
                                                ref={FileInputField}
                                            />
                                        </Label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <div className="mt-6">
                                        <PrimaryButton>Save</PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                        </>
                    )}
            </Modal2>

            {/* <Modal size="3xl" show={openModalEdit} onClose={() => setOpenModalEdit(false)} position="center">
                <Modal.Header>
                <div className="inline-flex items-center">
                    <div className="p-2 border rounded-lg">
                        <HiOutlineTicket style={{ color: "green", fontSize: "1.5em" }}/>
                    </div>
                    <span className="mx-2">
                        {editItem && editItem.titlename}
                    </span>
                </div>
                </Modal.Header>
                <Modal.Body>
                {editItem && (
                    <>
                        <span>Detail Ticket</span>
                        <div className="grid grid-flow-col grid-cols-2 gap-4 text-xs divide-x">
                            <div className="col-span-1 mt-4">
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Request By</span>
                                    <span className="font-semibold">{editItem.user.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Email</span>
                                    <span className="font-semibold">{editItem.user.email}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Substation</span>
                                    <span className="font-semibold">{editItem.substation.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Section</span>
                                    <span className="font-semibold">{editItem.section.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Status</span>

                                    {editItem.status.name === "Open" ? (
                                        <Badge color="success">{editItem.status.name}</Badge>
                                    ) : editItem.status.name === "Close" ? (
                                        <Badge color="failure">{editItem.status.name}</Badge>
                                    ) : (
                                        <Badge color="info">{editItem.status.name}</Badge>
                                    )}
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Date Found</span>
                                    <span className="font-semibold">{editItem.date_find}</span>
                                </div>
                            </div>
                            <div className="col-span-1 px-4 mt-4">
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Type</span>
                                    {editItem.type.name === "Major" ? (
                                        <Badge color="failure">{editItem.type.name}</Badge>
                                    ) : (
                                        <Badge color="indigo">{editItem.type.name}</Badge>
                                    )
                                    }
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Equipment</span>
                                    <span className="font-semibold">{editItem.equipment.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Bay</span>
                                    <span className="font-semibold">{editItem.bay.name}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Created At</span>
                                    <span className="font-semibold">{editItem.created_at}</span>
                                </div>
                                <hr/>
                                <div className="flex justify-between my-2">
                                    <span>Approve By</span>
                                    {editItem.approve_by === null ? (
                                        <span>-</span>
                                    ) : (
                                        <span className="font-semibold">{editItem.approve_by}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <hr className="mt-2"/>
                        <div className="mt-2 font-thin">
                            <span>Note</span>
                        </div>
                        <div className="mt-1 border rounded-md">
                            <div className="m-4">
                                {editItem.other === null ? (
                                    <span>-</span>
                                ) : (
                                    <span className="text-xs">{editItem.other}</span>
                                )}

                                <p className="text-xs">{editItem.additional_information}</p>
                            </div>
                        </div>

                        <div className="mt-2">
                            <form onSubmit={() => save(anomali.id)}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <Label htmlFor="datePlan" value="Date Plan"/>
                                        <TextInput
                                            type="date"
                                            name="date_plan"
                                            value={data.date_plan}
                                            onChange={(e) => setData('date_plan', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Label htmlFor="dateExecution" value="Date Execution"/>
                                        <TextInput
                                            type="date"
                                            name="date_execution"
                                            value={data.date_execution}
                                            onChange={(e) => setData('date_execution', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Label htmlFor="action" value="Action"/>
                                    <Textarea
                                        name="action"
                                        value={data.action}
                                        onChange={(e) => setData('action', e.target.value)}
                                        placeholder="Leave an action ..." required rows={2}
                                    />
                                </div>
                                <div className="mt-2">
                                    <Label htmlFor="attachment" value="Attachment"/>
                                    <div className="flex items-center justify-center w-full mt-1">
                                        <Label
                                            htmlFor="dropzone-file"
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="p-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24"
                                                         className="stroke-2 stroke-gray-400 size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
                                                    </svg>
                                                </div>
                                                <span>{file}</span>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span
                                                        className="font-semibold text-blue-600">Click to upload</span> or
                                                    drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF Only (MAX.
                                                    200kb)</p>
                                            </div>
                                            <FileInput
                                                name="attachment"
                                                id="dropzone-file" className="hidden"
                                                onChange={handleFileChange}
                                                ref={FileInputField}
                                            />
                                        </Label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <div className="mt-6">
                                        <PrimaryButton>Save</PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )}
                </Modal.Body>
            </Modal> */}

            <Dialog open={openReject} onClose={setOpenReject} className="relative z-10">
                <DialogBackdrop transition
                className="fixed inset-0 bg-gray-500 bg-opacity-70 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"/>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                        <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                <HiOutlineExclamation aria-hidden="true" className="w-6 h-6 text-red-600"/>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    Reject {selectedReject && selectedReject.titlename}
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                    Are you sure you want to reject {selectedReject && selectedReject.titlename}? This action will be permanently removed and
                                    cannot be undone.
                                    </p>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={()=> handleReject(selectedReject.id)}
                                className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                                Reject
                            </button>
                            <button
                                type="button"
                                data-autofocus
                                onClick={() => setOpenReject(false)}
                                className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openApprove} onClose={setOpenApprove} className="relative z-10">
                <DialogBackdrop transition
                className="fixed inset-0 bg-gray-500 backdrop-blur-sm bg-opacity-70 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"/>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                        <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                                <HiOutlineCheck aria-hidden="true" className="w-6 h-6 text-blue-600"/>
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    Approve {selectedApprove && selectedApprove.titlename} ?
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                    Are you sure you want to <strong className="font-bold underline">approve</strong> this anomalies? This action will be permanently accept and
                                    cannot be reject or delete.
                                    </p>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            onClick={() => handleApprove(selectedApprove.id)}
                            className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        >
                            Approve
                        </button>
                        <button
                            type="button"
                            data-autofocus
                            onClick={() => setOpenApprove(false)}
                            className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                            Cancel
                        </button>
                        </div>
                    </DialogPanel>
                    </div>
                </div>
            </Dialog>

        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-gray-500 ">
            <caption className="p-5 text-lg font-semibold text-left bg-gray-100 dark:bg-dark-300 rtl:text-right">
                <div className="inline-flex items-center gap-3">
                    <form>
                        <div className="relative bg-transparent">
                            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                                <svg className="text-gray-700 size-5 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" className="block w-full text-xs font-thin border-none rounded-lg ps-14 focus:ring-gray-100 focus:border-gray-100 dark:focus:ring-gray-900 dark:bg-gray-600 dark:text-gray-200" placeholder="Search Ticket"/>
                        </div>
                    </form>
                </div>
            </caption>
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-300 bg-slate-50 dark:bg-dark-400">
                <tr className="text-left">
                    <th scope="col" className="p-3">
                        No
                    </th>
                    <th scope="col" className="py-3">
                        Title Name
                    </th>
                    <th scope="col" className="py-3">
                        Substation
                    </th>
                    <th scope="col" className="py-3">
                        section
                    </th>
                    <th scope="col" className="py-3 text-center">
                        Type
                    </th>
                    <th scope="col" className="py-3">
                        User
                    </th>
                    <th scope="col" className="py-3">
                        equipment
                    </th>
                    <th scope="col" className="py-3">
                        Bay
                    </th>
                    <th scope="col" className="py-3">
                        Date Found
                    </th>
                    <th scope="col" className="py-3 text-center">
                        Status
                    </th>
                    <th scope="col" className="py-3 text-center">
                        Approve
                    </th>
                    <th scope="col" className="py-3 text-center">
                        Action
                    </th>

                </tr>
            </thead>
            <tbody>
                {anomalis.data.map((anomali, index) => (
                    <tr key={anomali.id} className="bg-white border-b cursor-pointer dark:bg-dark-300 hover:bg-zinc-100">
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-300">
                            {anomalis.from + index}
                        </td>
                        <td>
                            {anomali.titlename}
                        </td>
                        <td>
                            {anomali.substation.name}
                        </td>
                        <td>
                            {anomali.section.name}
                        </td>
                        <td className="px-4 ">
                            {anomali.type.name === "Major" ? (
                                <Badge color="failure" className="justify-center">{anomali.type.name}</Badge>
                            ): (
                                <Badge color="indigo" className="justify-center">{anomali.type.name}</Badge>
                            )
                            }
                        </td>
                        <td>
                            {anomali.user.name}
                        </td>
                        <td>
                            {anomali.equipment.name}
                        </td>
                        <td>
                            {anomali.bay.name === null ? (
                                null
                            ): (
                                <span>{anomali.bay.name}</span>
                            )}
                        </td>
                        <td>
                            {anomali.date_find}
                        </td>
                        <td className="px-4 ">
                        {anomali.status.name === "Open" ? (
                            <Badge color="success" className="justify-center">{anomali.status.name}</Badge>
                        ) : anomali.status.name === "Pending" ? (
                            <Badge color="warning" className="justify-center">{anomali.status.name}</Badge>
                        ) : anomali.status.name === "Close" ? (
                            <Badge color="failure" className="justify-center">{anomali.status.name}</Badge>
                        ) : (
                            <Badge color="info" className="justify-center">{anomali.status.name}</Badge>
                        )
                        }
                        </td>
                        <td>
                            {anomali.is_approve === 0 ? (
                                <span className="flex items-center justify-center">No</span>
                            ): (
                                <span className="flex items-center justify-center">Yes</span>
                            )}
                        </td>
                        <td className="flex items-center justify-center">
                            {anomali.is_approve === 0 ? (
                                <>
                                <Button className="flex items-center mx-1" size="xs" onClick={() => approve(anomali) }>
                                    <HiCheck className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>
                                {/* <Button color="failure" size="xs" onClick={()=> handleDelete(anomali.id, anomali.titlename)}> */}
                                <Button color="failure" size="xs" onClick={() => reject(anomali)}>
                                    <HiOutlineX className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                                </>
                            ):(
                            // <Button onClick={() => editedItem(anomali)} color="warning" size="xs" className="mx-4">
                            <Button onClick={() => toggleModal(anomali)} color="warning" size="xs" className="mx-4">
                                <HiOutlinePencil className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            )
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="flex items-center justify-between mx-2">
            <p className="text-sm font-medium text-gray-700">
            Showing {anomalis.from} to {anomalis.to} total {anomalis.total}
            </p>
            <div className="inline-flex items-center justify-center my-2">
                <Label value='Filter'/>
                <select name="perpage" id="perpage" className="p-2 mx-2 text-sm border-none rounded-lg"
                        value={perpage.current} onChange={handleChangePerPage}>
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                </select>
            </div>
        <Pagination links={anomalis.links}/>
        </div>
    </div>

        </DashboardLayout>
        </>
    );
}
