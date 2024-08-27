import DashboardLayout from "@/Layouts/DashboardLayout";
import Pagination from "@/Components/Pagination";
import { Head, useForm, router } from "@inertiajs/react";
import { Button,Badge, Datepicker, HR, Label, Modal, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Textarea, TextInput } from "flowbite-react";
import { useState, useRef } from "react";
import { HiUser, HiOutlineTicket, HiOutlineSearch } from "react-icons/hi";
import { Input, Select } from "@headlessui/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Anomali({auth,anomalis, peralatans, bays, voltages, sections, types, substations}){


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
    console.log(data);

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
        selectedItem(data)
        setOpenModalDetail(true)
        console.log(selectedItem);
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
                            Please fill it in when choosing other
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
                                />
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

        <Modal size="2xl" show={openModalDetail} onClose={() => setOpenModalDetail(false)} position="top-right">
            <Modal.Header>
                {/* {sele.name} */}
            </Modal.Header>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>

        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-gray-500 ">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                Our User
                <div className="grid items-center grid-cols-2 gap-4">
                    <div className="inline-flex items-center justify-start col-span-1">
                        <form onSubmit="" className="flex w-1/2 mt-1">
                            <div className="w-full">
                                <TextInput
                                sizing="sm"
                                type="text"
                                id="search"
                                name="search"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                rightIcon={HiOutlineSearch}
                                autoComplete="off"
                                placeholder="Search for this ticket"
                                className="w-full text-sm font-thin text-gray-500 border-gray-300 shadow-sm"/>
                                </div>
                        </form>
                    </div>
                    <div className="flex justify-end col-span-1">
                        <Button size="xs" color="info" onClick={() => setOpenModal((openModal) => !openModal)}>
                            <div className="inline-flex items-center justify-center">
                                <HiOutlineTicket className="w-4 h-4 mr-2"/>
                                <span>Add Ticket</span>
                            </div>
                        </Button>
                    </div>
                </div>
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-slate-50">
                    <tr className="text-left">
                        <th scope="col" className="p-3">
                            No
                        </th>
                        <th scope="col" className="p-3">
                            Ticketname
                        </th>
                        <th scope="col" className="p-3">
                            Substation
                        </th>
                        <th scope="col" className="p-3">
                            section
                        </th>
                        <th scope="col" className="p-3">
                            Type
                        </th>
                        <th scope="col" className="p-3">
                            User
                        </th>
                        <th scope="col" className="p-3">
                            Peralatan
                        </th>
                        <th scope="col" className="p-3">
                            Other
                        </th>
                        <th scope="col" className="p-3">
                            Voltage
                        </th>
                        <th scope="col" className="p-3">
                            Bay
                        </th>
                        <th scope="col" className="p-3">
                            Date Temuan
                        </th>
                        <th scope="col" className="p-3">
                            Date Plan
                        </th>
                        <th scope="col" className="p-3">
                            Date Execution
                        </th>
                        <th scope="col" className="p-3">
                            Status
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {anomalis.data.map((anomali, index) => (
                        <tr id="body" key={anomali.id} onClick={() => detailItem(anomali)} className="bg-white border-b cursor-pointer hover:bg-gray-100">
                            <td className="px-4 py-2 font-medium text-gray-900">
                                {anomalis.from + index}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.ticketname}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.substation.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.section.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.section.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.user.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.peralatan.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.other}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.voltage.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.bay.name}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.date_find}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.date_plan}
                            </td>
                            <td className="px-4 py-2">
                                {anomali.date_execution}
                            </td>
                            <td className="px-4 pt-2">
                            {anomali.status.name === "Open" ? (
                                <Badge className="justify-start" color="success">{anomali.status.name}</Badge>
                            ) : anomali.status.name === "Pending" ? (
                                <Badge className="justify-start" color="warning">{anomali.status.name}</Badge>
                            ) : (
                                <Badge className="justify-start" color="failure">{anomali.status.name}</Badge>
                            )
                            }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-between mx-2">
                <p className="text-sm font-medium text-gray-700">
                    Showing  to  total
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
            <Pagination links=""/>
            </div>
        </div>

        </DashboardLayout>
        </>
    );
}
