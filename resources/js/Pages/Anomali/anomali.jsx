import DashboardLayout from "@/Layouts/DashboardLayout";
import Pagination from "@/Components/Pagination";
import { Head, useForm, router } from "@inertiajs/react";
import { Button, Datepicker, HR, Label, Modal, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Textarea, TextInput } from "flowbite-react";
import { useState, useRef } from "react";
import { HiUser, HiOutlineTicket } from "react-icons/hi";
import { Input, Select } from "@headlessui/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Anomali({auth,anomalis, peralatans, bays, voltages, sections, types, substations}){


    const perpage = useRef(10);
    const [openModal, setOpenModal] = useState(true);

    const [selectedDate, setSelectedDate] = useState(null);
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

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
        voltage: '',
        bay: '',
        date_temuan: '',
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
                            className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm"
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
                                        name="types"
                                        onChange={(e) => setData('types', e.target.value)}
                                        value={data.types}
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
                            <Label htmlFor="peralatan" value="Other" className="text-sm font-thin"/>
                            <Input type="text" className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500"/>
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
                                <Datepicker
                                name="date_input"
                                onSelectedDateChanged={handleDateChange}
                                className="text-sm cursor-pointer"/>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="additional_information" value="Additional Information" className="text-sm font-thin"/>
                            <Textarea id="additional_information"
                            name="additional_information"
                            value={data.additional_information}
                            onChange={(e) => setData('additional_information', e.target.value)}
                            placeholder="Leave a comment..." required rows={4}/>
                        </div>

                        <HR/>

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="ms-4">
                                Add ticket
                            </PrimaryButton>
                        </div>

                    </form>
                </Modal.Body>
        </Modal>

        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-gray-500 ">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                Our User
                <div className="flex items-center justify-between">
                    <div className="inline-flex row-span-3">
                        <p className="mt-1 text-sm font-normal text-gray-500 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, veniam!</p>
                    </div>
                    <Button size="xs" color="info" onClick={() => setOpenModal((openModal) => !openModal)}>
                        <div className="inline-flex items-center justify-center">
                            <HiOutlineTicket className="w-4 h-4 mr-2"/>
                            <span>Add Ticket</span>
                        </div>
                    </Button>
                </div>
                </caption>

                <thead className="text-xs text-gray-700 uppercase bg-slate-50">
                    <tr className="text-left">
                        <th scope="col" className="p-3">
                            No
                        </th>
                        <th scope="col" className="p-3">
                            Nama
                        </th>
                        <th scope="col" className="p-3">
                            Email
                        </th>
                        <th scope="col" className="p-3">
                            Penempatan
                        </th>
                        <th scope="col" className="p-3 text-center">
                            Role
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td>Loading....</td>
                        </tr>
                    ) : anomalis.data.map((anomali, index) => (
                        <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                            <td className="px-4 py-2 font-medium text-gray-900">
                               {anomalis.from + index}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.email}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.substation.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.role.name === 'Admin' ?
                                (<Badge color="success" className="justify-center">
                                    {anomali.role.name}
                                </Badge>):(<Badge color="gray" className="justify-center">
                                    {anomali.role.name}
                                </Badge>
                                )}

                        </td>
                        <td className="px-4 py-2">
                        <div className="flex">
                            <Link href={route("anomali.edit",anomali.id)} className="mx-1">
                                <Button size="xs" color="warning" className="rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </Button>
                            </Link>
                            <Link href='' className="mx-1">
                                <Button size="xs" color="failure" className="rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Button>
                            </Link>
                        </div>
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
