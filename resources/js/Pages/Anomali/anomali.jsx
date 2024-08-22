import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button, Datepicker, HR, Label, Modal, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Textarea, TextInput } from "flowbite-react";
import { useState, useRef } from "react";
import { HiUser, HiOutlineTicket } from "react-icons/hi";
import { Select } from "@headlessui/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Anomali({auth, peralatans, bays, voltages, bidangs, jenis, gardus}){


    const perpage = useRef(10);
    const [openModal, setOpenModal] = useState(true);

    const [selectedDate, setSelectedDate] = useState(null);
    const handleDateChange = (date) => {
        setSelectedDate(date);
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
        gardu: '',
        bidang:'',
        jenis:'',
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
                            placeholder="My Suggestion for this ticket"
                            className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm"
                            required/>
                        </div>
                        <div className="mt-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <Label htmlFor="gardu" value="Gardu Induk" className="text-sm font-thin"/>
                                    <Select required
                                        name="gardu"
                                        onChange={(e) => setData('gardu', e.target.value)}
                                        value={data.gardu}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                            <option value="" className="text-sm font-thin text-gray-500">Select gardu</option>
                                            {gardus.map((gardu, index) => (
                                                <option id='gardu'
                                                key={index}
                                                value={gardu.id}
                                                className="text-sm font-thin text-gray-500">{gardu.name}</option>
                                            ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.bidangs}/>
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="bidang" value="Bidang" className="text-sm font-thin"/>
                                    <Select required
                                        name="bidang"
                                        onChange={(e) => setData('bidang', e.target.value)}
                                        value={data.bidang}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                            <option value="" className="text-sm font-thin text-gray-500">Select bidang</option>
                                            {bidangs.map((bidang, index) => (
                                                <option id='bidang' key={index} value={bidang.id} className="text-sm font-thin text-gray-500">{bidang.name}</option>
                                            ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.bidangs}/>
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="bidang" value="Jenis Anomali" className="text-sm font-thin"/>
                                    <Select required
                                        name="jenis"
                                        onChange={(e) => setData('jenis', e.target.value)}
                                        value={data.jenis}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                            <option value="" className="text-sm font-thin text-gray-500">Select jenis</option>
                                            {jenis.map((jenis, index) => (
                                                <option id='jenis' key={index} value={jenis.id} className="text-sm font-thin text-gray-500">{jenis.name}</option>
                                            ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.jenis}/>
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
            <Table hoverable>
            <caption className="p-5 text-lg font-thin text-left text-gray-900 bg-slate-300 rtl:text-right">
                List Anomali
                    <div className="flex items-center justify-between">
                        <div className="inline-flex row-span-3">
                            <p className="text-sm font-normal text-gray-500 ">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                        </div>
                        <Button size="xs" color="info" onClick={() => setOpenModal((openModal) => !openModal)}>
                            <div className="inline-flex items-center justify-center">
                                <HiOutlineTicket className="w-4 h-4 mr-2"/>
                                <span>Add Ticket</span>
                            </div>
                        </Button>
                    </div>
                </caption>
                <TableHead>
                    <TableHeadCell>No Ticket</TableHeadCell>
                    <TableHeadCell>Name Ticket</TableHeadCell>
                    <TableHeadCell>Priority</TableHeadCell>
                    <TableHeadCell>user</TableHeadCell>
                    <TableHeadCell>Gardu</TableHeadCell>
                    <TableHeadCell>Voltage</TableHeadCell>
                </TableHead>
                <TableBody>
                        <TableRow className="hover:cursor-pointer">
                            <TableCell className="font-thin">#INC198242S</TableCell>
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
