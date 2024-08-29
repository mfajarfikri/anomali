import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button,Badge, HR, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, useRef } from "react";
import { HiUser, HiOutlineTicket, HiOutlineSearch, HiOutlineCheck, HiDocumentReport } from "react-icons/hi";
import { Input, Select } from "@headlessui/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";

export default function Anomali({auth, anomalis, peralatans, bays, voltages, sections, types, substations}){


    const perpage = useRef(10);
    const [openModal, setOpenModal] = useState(false);

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
        ticketname: '',
        substation: '',
        section:'',
        type:'',
        user: auth.user.id,
        peralatan: '',
        other: '',
        voltage: '',
        bay: '',
        date_find: '',
        additional_information: ''
    })

    const submit = (e) => {
        e.preventDefault();
        post(route('anomali.create'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpenModal(false);
                getData();
                Swal.fire({
                    title: 'Success',
                    text: 'A anomali has been created.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1C64F2'
                });
            },
            onError: (errors) => {
                console.error('Error creating user:', errors);
            },
        });
    }

    const [selectedItem, setSelectedItem] = useState(null)
    const [openModalDetail, setOpenModalDetail] = useState(false)

    const detailItem = (data) => {
        setSelectedItem(data);
        setOpenModalDetail(true, data);
        console.log(data); // Log the data parameter instead of selectedItem
    }

    console.log(anomalis);


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
                    <form onSubmit={submit}>
                        <div className="">
                            <Label htmlFor="ticketName" value="Ticket Name" className="text-sm font-thin"/>
                            <TextInput
                            type="text"
                            id="ticketname"
                            name="ticketname"
                            value={data.ticketname}
                            onChange={(e) => setData('ticketname', e.target.value)}
                            icon={HiOutlineTicket}
                            autoComplete="off"
                            placeholder="My Suggestion for this ticket"
                            required/>
                        </div>
                        <div className="mt-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <Label htmlFor="substation" value="Substation" className="text-sm font-thin"/>
                                    <Select required
                                        name="substation"
                                        onChange={(e) => setData('substation', e.target.value)}
                                        value={data.substation}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                            <option value="" className="text-sm font-thin text-gray-500">Select substation</option>
                                            {substations.map((substation, index) => (
                                                <option id='substation'
                                                key={index}
                                                value={substation.id}
                                                className="text-sm font-thin text-gray-500">{substation.name}</option>
                                            ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.sections}/>
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="section" value="Section" className="text-sm font-thin"/>
                                    <Select required
                                        name="section"
                                        onChange={(e) => setData('section', e.target.value)}
                                        value={data.section}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                            <option value="" className="text-sm font-thin text-gray-500">Select section</option>
                                            {sections.map((section, index) => (
                                                <option id='section' key={index} value={section.id} className="text-sm font-thin text-gray-500">{section.name}</option>
                                            ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.sections}/>
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="section" value="Types Anomalies" className="text-sm font-thin"/>
                                    <Select required
                                        name="type"
                                        onChange={(e) => setData('type', e.target.value)}
                                        value={data.type}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                            <option value="" className="text-sm font-thin text-gray-500">Select types</option>
                                            {types.map((types, index) => (
                                                <option id='types' key={index} value={types.id} className="text-sm font-thin text-gray-500">{types.name}</option>
                                            ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.types}/>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                <Label htmlFor="user" value="User" className="text-sm font-thin"/>
                                    <TextInput
                                    type="text"
                                    id="user"
                                    name="user"
                                    onChange={(e) => setData('user', e.target.value)}
                                    className="w-full font-thin text-gray-500 border-gray-300 rounded-md shadow-sm"
                                    placeholder={auth.user.name}
                                    icon={HiUser} readOnly/>
                                </div>
                                <div className="col-span-1">
                                <Label htmlFor="peralatan" value="Peralatan" className="text-sm font-thin"/>
                                    <Select required
                                    name="peralatan"
                                    onChange={(e) => setData('peralatan', e.target.value)}
                                    value={data.peralatan}
                                    className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                        <option value="" className="text-sm font-thin text-gray-500">Select peralatan</option>
                                        {peralatans.map((peralatan, index) => (
                                            <option id='peralatan' key={index} value={peralatan.id} className="text-sm font-thin text-gray-500">{peralatan.name}</option>
                                        ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.peralatans}/>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="other" value="Other" className="text-sm font-thin"/>
                            <TextInput
                            type="text"
                            helperText={<>
                            <cite>Please fill it in when choosing other</cite>
                            </>}
                            className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500"/>
                        </div>
                        <div className="mt-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="inline-flex col-span-1">
                                    <div className="w-full">
                                        <Label htmlFor="voltage" value="Voltage" className="text-sm font-thin"/>
                                        <Select required
                                        name="voltage"
                                        onChange={(e) => setData('voltage', e.target.value)}
                                        value={data.voltage}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                        <option value="" className="text-sm font-thin text-gray-500">Select Voltage</option>
                                        {voltages.map((voltage, index) => (
                                            <option id='voltage' key={index} value={voltage.id} className="text-sm font-thin text-gray-500">{voltage.name}</option>
                                        ))}
                                        </Select>
                                        <InputError className='mt-2' message={errors.voltages}/>
                                    </div>
                                </div>
                                <div className="inline-flex col-span-2">
                                    <div className="w-full">
                                        <Label htmlFor="date" value="Bay" className="text-sm font-thin"/>
                                        <Select required
                                        name="bay"
                                        value={data.bay}
                                        onChange={(e) => setData('bay', e.target.value)}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                        <option value="" className="text-sm font-thin text-gray-500">Select Bay</option>
                                        {bays.map((bay, index) => (
                                            <option id='bay' key={index} value={bay.id} className="text-sm font-thin text-gray-500"
                                            >{bay.name}</option>
                                        ))}
                                        </Select>
                                        <InputError className='mt-2' message={errors.bays}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="w-full">
                                <Label htmlFor="date" value="Date" className="text-sm font-thin"/>
                                <TextInput
                                type="date"
                                name="date_find"
                                value={data.date_find}
                                onChange={(e) => setData('date_find', e.target.value)}
                                className="text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="additional_information" value="Additional Information" className="text-sm font-thin"/>
                            <Textarea id="additional_information"
                            name="additional_information"
                            value={data.additional_information}
                            onChange={(e) => setData('additional_information', e.target.value)}
                            placeholder="Leave a comment..." required rows={2}/>
                        </div>

                        <HR/>

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Add ticket
                            </PrimaryButton>
                        </div>

                    </form>
                </Modal.Body>
        </Modal>

        <Modal size="3xl" show={openModalDetail} onClose={() => setOpenModalDetail(false)} position="top-right">
            <Modal.Header>
                <div className="inline-flex items-center">
                    <div className="p-2 border rounded-lg">
                        <HiOutlineTicket style={{ color: "green", fontSize: "1.5em" }}/>
                    </div>
                    <span className="mx-2">
                        {selectedItem && selectedItem.ticketname}
                    </span>
                </div>

            </Modal.Header>
            <Modal.Body>
                {selectedItem && (
                    <>
                    <span>Detail Ticket</span>
                        <div class="grid grid-cols-2 grid-flow-col gap-4 text-xs divide-x">
                            <div class="col-span-1 mt-4">
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Request By</span>
                                    <span>{selectedItem.user.name}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Email</span>
                                    <span>{selectedItem.user.email}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Substation</span>
                                    {selectedItem.substation.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Section</span>
                                    {selectedItem.section.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Status</span>

                                        {selectedItem.status.name == "Open" ? (
                                        <Badge color="success">{selectedItem.status.name}</Badge>
                                    ) : selectedItem.status.name === "Pending" ? (
                                        <Badge color="warning">{selectedItem.status.name}</Badge>
                                    ) : selectedItem.status.name === "Close" ? (
                                        <Badge color="failure">{selectedItem.status.name}</Badge>
                                    ) : (
                                        <Badge color="info">{selectedItem.status.name}</Badge>
                                    )}
                                </div>
                            </div>
                            <div class="col-span-1 mt-4 px-4">
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Type</span>
                                    {selectedItem.type.name === "Major" ? (
                                        <Badge color="failure">{selectedItem.type.name}</Badge>
                                    ): (
                                        <Badge color="indigo">{selectedItem.type.name}</Badge>
                                    )
                                    }
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Equipment</span>
                                    {selectedItem.peralatan.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Voltage</span>
                                    {selectedItem.voltage.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Bay</span>
                                    {selectedItem.bay.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Created At</span>
                                    {selectedItem.created_at}
                                </div>
                            </div>
                        </div>
                        <hr className="mt-4" />

                        <div className="mt-4">
                        {selectedItem.other === null ? (
                            <span>-</span>
                        ) : (
                            <span className="text-xs">{selectedItem.other}</span>
                        )}

                            <p className="text-xs">{selectedItem.additional_information}</p>
                        </div>

                        <div className="mt-2 font-thin">
                            <span>Dates</span>
                            <div className="p-2 mt-2 text-xs border rounded-lg">
                                <div className="grid justify-center grid-cols-3 gap-4 divide-x">
                                    <div className="flex justify-center col-span-1">
                                        <div className="inline-block">
                                            <span className="text-sm">Date Found</span>
                                            <p className="flex justify-center">{selectedItem.date_find}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center col-span-1">
                                        <div className="inline-block">
                                            <span>Date Plan</span>
                                            {selectedItem.date_plan === null ? (
                                            <p className="flex justify-center">-</p>
                                        ):(
                                            <p>{selectedItem.date_plan}</p>
                                        )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center col-span-1">
                                        <div className="inline-block">
                                            <span>Date Execution</span>
                                            {selectedItem.date_execution === null ? (
                                            <p className="flex justify-center">-</p>
                                        ):(
                                            <p>{selectedItem.date_execution}</p>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button size="sm" onClick={() => setOpenModalDetail(false)}>Close</Button>
            </Modal.Footer>
        </Modal>

        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-gray-500 ">
            <caption className="p-5 text-lg font-semibold text-left bg-gray-100 rtl:text-right">
                <div className="inline-flex items-center gap-3">
                    <button onClick={() => setOpenModal(true)} className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border rounded-full bg-emerald-50 border-emerald-500 focus:shadow-outline hover:scale-105 hover:shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="transition ease-in-out stroke-1 stroke-emerald-700 size-5 hover:rotate-45 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    <button className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border-none hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="stroke-gray-700 size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                        </svg>
                    </button>
                    <form className="">
                        <div className="relative bg-transparent">
                            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                                <svg className="text-gray-700 size-5 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" className="block w-full text-xs font-thin border-none rounded-lg ps-14 focus:ring-gray-100 focus:border-gray-100" placeholder="Search Ticket"/>
                        </div>
                    </form>
                </div>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-slate-50">
                <tr className="text-left">
                    <th scope="col" className="p-3">
                        No
                    </th>
                    <th scope="col" className="py-3">
                        Ticket Name
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
                        Peralatan
                    </th>
                    <th scope="col" className="py-3">
                        Voltage
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

                </tr>
            </thead>
            <tbody>
                {anomalis.data.map((anomali, index) => (
                    <tr key={anomali.id} onClick={() => detailItem(anomali)} className="bg-white border-b cursor-pointer hover:bg-zinc-100">
                        <td className="px-4 py-2 font-medium text-gray-900">
                            {anomalis.from + index}
                        </td>
                        <td className="py-2 ">
                            {anomali.ticketname}
                        </td>
                        <td className="py-2">
                            {anomali.substation.name}
                        </td>
                        <td className="py-2">
                            {anomali.section.name}
                        </td>
                        <td className="px-4 py-2">
                            {anomali.type.name === "Major" ? (
                                <Badge color="failure" className="justify-center">{anomali.type.name}</Badge>
                            ): (
                                <Badge color="indigo" className="justify-center">{anomali.type.name}</Badge>
                            )
                            }
                        </td>
                        <td className="py-2">
                            {anomali.user.name}
                        </td>
                        <td className="py-2">
                            {anomali.peralatan.name}
                        </td>
                        <td className="py-2">
                            {anomali.voltage.name}
                        </td>
                        <td className="py-2">
                            {anomali.bay.name}
                        </td>
                        <td className="py-2">
                            {anomali.date_find}
                        </td>
                        <td className="px-4 py-2">
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
