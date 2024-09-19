import {React, useRef, useState} from "react";
import { Head, router, usePage, useForm, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import DashboardLayout from '@/Layouts/DashboardLayout';
import InputLabel from "@/Components/InputLabel";
import { TextInput } from "flowbite-react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Button, Drawer, Badge } from "flowbite-react";
import { Select } from "@headlessui/react";
import { HiOutlinePlus } from "react-icons/hi";


export default function Bay() {
    const {bays,auth, conditions, substations, success} = usePage().props
    console.log(success);



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
        bay: '',
        substation : '',
        condition : ''
    })

    const [isOpen, setIsOpen] = useState(false);
    const handleCloseInsert = () => setIsOpen(false);

    const handleCreate = (e) => {
        e.preventDefault();
        router.post('/bay', data, {
            onSuccess: () => {
                reset();
                getData();
                Swal.fire({
                    title: 'Success',
                    text: data.bay +' has been created.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1C64F2'
                });
            },
        });
        setIsOpen(false)
    };

    const { dataEdit, setEdit} = useForm({
        bayEdit: '',
        substation : '',
        condition : ''
    })

    const handleUpdate = (e) => {
        console.log(e);
        e.preventDefault();
        router.post(`/bay/edit/${id}`, data, {
            onSuccess: () => {
                reset();
                getData();
                Swal.fire({
                    title: 'Success',
                    text: dataEdit.bay +' has been created.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1C64F2'
                });
            },
        });
        setIsOpen(false)
    };

    console.log(dataEdit);

    const [selectedItem, setSelectedItem] = useState(null)
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const handleCloseEdit = () => setOpenModalEdit(false);

    const editItem = (data) => {
        setSelectedItem(data);
        setOpenModalEdit(true, data);
        console.log(data); // Log the data parameter instead of selectedItem
    }

    return (
        <>
        <Head title="Bay"/>
        <DashboardLayout user={auth.user}>

        {/* Drawer Insert */}
        <Drawer open={isOpen} onClose={handleCloseInsert} position="top">
            <Drawer.Header title="New Bay" />
            <Drawer.Items>
                <form onSubmit={handleCreate} className="w-full">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                        <InputLabel htmlFor="Bay" value="Bay Name" className="text-sm font-thin"/>
                            <TextInput
                            type="text"
                            sizing="md"
                            name="bay"
                            value={data.bay}
                            onChange={(e) => setData('bay', e.target.value)}
                            className="mt-1 text-gray-500"
                            required
                            autoFocus
                            />
                        </div>
                        <div className="col-span-1">
                        <InputLabel htmlFor="substation" value="Substation" className="text-sm font-thin"/>
                            <Select required
                                name="substation"
                                onChange={(e) => setData('substation', e.target.value)}
                                value={data.substation}
                                className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                    <option value="" className="text-sm font-thin text-gray-500">Select substation</option>
                                    {substations.map((substation, index) => (
                                        <option id='substation'
                                        key={index}
                                        value={substation.id}
                                        className="text-sm font-thin text-gray-500">{substation.name}</option>
                                    ))}
                            </Select>
                            <InputError className='mt-2' message={errors.substations}/>
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="condition" value="Condition" className="text-sm font-thin"/>
                            <Select required
                                name="condition"
                                onChange={(e) => setData('condition', e.target.value)}
                                value={data.condition}
                                className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                    <option value="" className="text-sm font-thin text-gray-500">Select condition</option>
                                    {conditions.map((condition, index) => (
                                        <option id='condition' key={index} value={condition.id} className="text-sm font-thin text-gray-500">{condition.name}</option>
                                    ))}
                            </Select>
                            <InputError className='mt-2' message={errors.conditions}/>
                        </div>
                        <div className="flex items-center justify-start col-span-1 mx-4">
                            <PrimaryButton className="h-10 mt-[26px]" disabled={processing}>
                                <HiOutlinePlus className="w-4 h-4 mr-2"/>
                                Add bay
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Drawer.Items>
        </Drawer>

        {/* Drawer Edit */}
        <Drawer open={openModalEdit} onClose={handleCloseEdit} position="top">
            <Drawer.Header title="Edit Bay" />
            <Drawer.Items>
                {selectedItem && (
                    <form onSubmit={()=> handleUpdate(selectedItem.id)} className="w-full">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                        <InputLabel htmlFor="Bay" value="Bay Name" className="text-sm font-thin"/>
                            <TextInput
                            type="text"
                            sizing="md"
                            name="bayEdit"
                            value={selectedItem.name}
                            onChange={(e) => setData('bayEdit', e.target.value)}
                            className="mt-1 text-gray-500"
                            required
                            autoFocus
                            />
                        </div>
                        <div className="col-span-1">
                        <InputLabel htmlFor="substation" value="Substation" className="text-sm font-thin"/>
                            <Select required
                                name="substation"
                                onChange={(e) => setData('substation', e.target.value)}
                                value={selectedItem.substation_id}
                                className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                    <option value="" className="text-sm font-thin text-gray-500">Select substation</option>
                                    {substations.map((substation, index) => (
                                        <option id='substation'
                                        key={index}
                                        value={substation.id}
                                        className="text-sm font-thin text-gray-500">{substation.name}</option>
                                    ))}
                            </Select>
                            <InputError className='mt-2' message={errors.substations}/>
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="condition" value="Condition" className="text-sm font-thin"/>
                            <Select required
                                name="condition"
                                onChange={(e) => setData('condition', e.target.value)}
                                value={selectedItem.condition_id}
                                className="w-full mt-2 text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                    <option value="" className="text-sm font-thin text-gray-500">Select condition</option>
                                    {conditions.map((condition, index) => (
                                        <option id='condition' key={index} value={condition.id} className="text-sm font-thin text-gray-500">{condition.name}</option>
                                    ))}
                            </Select>
                            <InputError className='mt-2' message={errors.conditions}/>
                        </div>
                        <div className="flex items-center justify-start col-span-1 mx-4">
                            <PrimaryButton className="h-10 mt-[26px]" disabled={processing}>
                                <HiOutlinePlus className="w-4 h-4 mr-2"/>
                                Add bay
                            </PrimaryButton>
                        </div>
                    </div>
                    </form>
                )}
            </Drawer.Items>
        </Drawer>

        <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-gray-100 rtl:text-right">
                <div className="inline-flex items-center gap-3">
                    <button onClick={() => setIsOpen(true)} className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border rounded-full bg-emerald-50 border-emerald-500 focus:shadow-outline hover:scale-105 hover:shadow-xl">
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
                            <input type="search" className="block w-full text-xs font-thin border-none rounded-lg ps-14 focus:ring-gray-100 focus:border-gray-100" placeholder="Search bay"/>
                        </div>
                    </form>
                </div>
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-slate-50">
                    <tr className="text-left">
                        <th scope="col" className="p-3">
                            No
                        </th>
                        <th scope="col" className="p-3">
                            Substation
                        </th>
                        <th scope="col" className="p-3">
                            Bay
                        </th>
                        <th scope="col" className="p-3">
                            Condition
                        </th>
                        <th>

                        </th>
                    </tr>
                </thead>
                <tbody>
                    { isLoading ? (
                        <tr>
                            <td>Loading....</td>
                        </tr>
                    ) : bays.data.map((bay, index) => (
                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {bays.from + index}
                                </td>
                                <td className="px-4 py-3">
                                    {bay.substation.name}
                                </td>
                                <td className="px-4 py-3">
                                    {bay.name}
                                </td>
                                <td className="px-4 py-3">
                                    {bay.condition.name === 'Operasi' ? (
                                        <Badge color="success" className="justify-center w-24">{bay.condition.name}</Badge>
                                    ): (
                                        <Badge color="failure" className="justify-center w-24">{bay.condition.name}</Badge>
                                    )}
                                </td>
                                <td className="flex items-center justify-end mx-4 mt-2">
                                    <Button onClick={() => editItem(bay)} size="xs" color="warning" className="rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                            ))
                        }

                </tbody>
            </table>
            <div className="flex items-center justify-between mx-2">
                <p className="text-sm font-medium text-gray-700">
                    Showing {bays.from} to {bays.to} total {bays.total}
                </p>
                <div className="inline-flex items-center justify-center my-2">
                    <InputLabel value='Filter'/>
                    <select name="perpage" id="perpage" className="p-2 mx-2 text-sm border-none rounded-lg"
                            value={perpage.current} onChange={handleChangePerPage}>
                        <option>10</option>
                        <option>20</option>
                        <option>30</option>
                    </select>
                </div>
            <Pagination className="rounded-sm" links={bays.links}/>
            </div>
        </div>
        </DashboardLayout>
        </>
    );
}
