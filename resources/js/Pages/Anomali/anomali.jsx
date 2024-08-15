import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import { Button, Datepicker, Label, Modal, Radio, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Textarea, TextInput } from "flowbite-react";
import { createContext, useContext, useState } from "react";
import { HiUser, HiHome, HiOutlineTicket } from "react-icons/hi";
import { Select, Transition } from "@headlessui/react";

export default function anomali({auth, types, gardus}){

    console.log(auth);

    const [openModal, setOpenModal] = useState(false);

    return(
        <>
        <Head title="Anomali"/>
        <DashboardLayout user={auth.user}>


        <Modal size="3xl" show={openModal} onClose={() => setOpenModal(false)} position="center">
            <Modal.Header>
                <div className="rounded-lg">
                    <div className="inline-flex">
                        <div className="p-2 border rounded-lg">
                            <HiOutlineTicket style={{ color: "green", fontSize: "1.5em" }}/>
                        </div>
                        <div className="flex items-center justify-center mx-2">
                            <p className="font-bold">New Ticket</p>
                        </div>
                    </div>

                </div>
            </Modal.Header>
                <Modal.Body>
                    <form action="">
                        <div className="">
                            <Label htmlFor="ticketName" value="Ticket Name" className="font-semibold text-md"/>
                            <TextInput type="text" icon={HiOutlineTicket} className="w-full mt-1 text-sm font-semibold text-gray-500 border-gray-300 rounded-md shadow-sm" placeholder="My Suggestion for this ticket"/>
                        </div>
                        <div className="mt-4">
                            <Label htmlFor="priority" value="Priority" className="font-semibold text-md"/>
                            <div className="mt-1">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="border rounded-lg">
                                <label className="rounded-lg cursor-pointer">
                                    <input type="radio" className="sr-only peer" name="priority" />
                                    <div className="p-3 text-gray-600 transition-all rounded-md bg-slate-50 ring-2 ring-transparent hover:shadow peer-checked:text-sky-600 peer-checked:ring-cyan-500 peer-checked:ring-offset-2">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-500">Low</p>
                                                <svg width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                </div>
                                <div className="border rounded-lg">
                                <label className="rounded-lg cursor-pointer">
                                    <input type="radio" className="sr-only peer" name="priority" />
                                    <div className="p-3 text-gray-600 transition-all rounded-md bg-slate-50 ring-2 ring-transparent hover:shadow peer-checked:text-amber-600 peer-checked:ring-amber-500 peer-checked:ring-offset-2">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-500">Medium</p>
                                                <svg width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                </div>
                                <div className="border rounded-lg">
                                <label className="rounded-lg cursor-pointer">
                                    <input type="radio" className="sr-only peer" name="priority" />
                                    <div className="p-3 text-gray-600 transition-all rounded-md bg-slate-50 ring-2 ring-transparent hover:shadow peer-checked:text-red-600 peer-checked:ring-red-500 peer-checked:ring-offset-2">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-500">High</p>
                                                <svg width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="">
                                <Label htmlFor="ticketName" value="Requester" className="font-semibold text-md"/>
                                    <TextInput type="text" className="w-full mt-1 text-sm font-semibold text-gray-500 border-gray-300 rounded-md shadow-sm" value={auth.user.name} icon={HiUser} disabled/>
                                </div>
                                <div className="">
                                <Label htmlFor="ticketName" value="Type" className="font-semibold text-md"/>
                                    <Select size="lg" name="type" className="w-full mt-1 text-sm font-semibold text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                        {types.map((type, index) => (
                                            <option id='type' key={index} value={type.name} className="text-sm font-semibold text-gray-500"
                                            onChange={(e) => setData('type', e.target.value)}>{type.name}</option>
                                        ))}
                                    </Select>
                                    {/* <InputError className='mt-2' message={errors.gardu}/> */}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="inline-flex">
                                <div className="">
                                    <Label htmlFor="date" value="Date" className="font-semibold text-md"/>
                                    <Datepicker className="cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">

                        </div>

                    </form>
                </Modal.Body>
            <Modal.Footer>
                <Button color="success" onClick={() => setOpenModal(false)}>Submit as New</Button>
            </Modal.Footer>
        </Modal>

        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
            <Table hoverable>
            <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                List Anomali
                    <div className="flex items-center justify-between">
                        <div className="inline-flex row-span-3">
                            <p className="mt-1 text-sm font-normal text-gray-500 ">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                        </div>
                        <Button color="info" onClick={() => setOpenModal((openModal) => !openModal)}>
                            +
                        </Button>
                    </div>
                </caption>
                <TableHead>
                    <TableHeadCell>No Ticket</TableHeadCell>
                    <TableHeadCell>Name Ticket</TableHeadCell>
                    <TableHeadCell>Priority</TableHeadCell>
                    <TableHeadCell>Requester</TableHeadCell>
                    <TableHeadCell>Gardu</TableHeadCell>
                    <TableHeadCell>Voltage</TableHeadCell>
                </TableHead>
                <TableBody>
                        <TableRow className="hover:cursor-pointer">
                            <TableCell className="font-semibold">#INC198242S</TableCell>
                            <TableCell>Anomali Kosambi Baru Pentanahan</TableCell>
                            <TableCell>Low</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Kosambi Baru</TableCell>
                            <TableCell>150 Kv</TableCell>
                        </TableRow>
                </TableBody>
            </Table>
        </div>

        </DashboardLayout>
        </>
    );
}
