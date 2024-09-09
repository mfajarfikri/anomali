import {React, useRef, useState} from "react";
import { Head, router, usePage, useForm, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import DashboardLayout from '@/Layouts/DashboardLayout';
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Button, Drawer, Badge, TextInput } from "flowbite-react";
import { HiOutlinePlus } from "react-icons/hi";
import { Select } from "@headlessui/react";


export default function Substation() {
    const {substations, conditions, auth} = usePage().props
    const perpage = useRef(10);
    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    }
    const [isLoading, setisLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false)
    const handleClose = () => setIsOpen(false)

    const {  data, setData, processing, post, errors, reset } = useForm({
        name: '',
        condition: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('substation.create'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsOpen(false);
                getData();
                Swal.fire({
                    title: 'Success',
                    text: data.name +' has been created.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1C64F2'
                });
            },
            onError: (errors) => {
                console.error('Error creating user:', errors);
            }
        });
    };

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

    const [substationsProps, setSubstationsProps] = useState({
        id : "",
        name : ""
    })

    console.log(substations);

    return (
        <>
        <Head title="Substation"/>
        <DashboardLayout user={auth.user}>
            <Drawer open={isOpen} onClose={handleClose} position="top">
                <Drawer.Header title="Substation" />
                <Drawer.Items>
                <form onSubmit={submit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="block w-full mt-1"
                                    autoComplete="name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />

                                <InputError message={errors.name} className="mt-2" />
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
                            <div className="col-span-1">

                            <PrimaryButton className="ms-4 mt-[26px]" disabled={processing}>
                                <HiOutlinePlus className="w-4 h-4 mr-2"/>
                                Add substation
                            </PrimaryButton>
                        </div>
                        </div>
                    </form>
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
                            <input type="search" className="block w-full text-xs font-thin border-none rounded-lg ps-14 focus:ring-gray-100 focus:border-gray-100" placeholder="Search Substation"/>
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
                            Name
                        </th>
                        <th scope="col" className="p-3">
                            Bay Total
                        </th>
                        <th scope="col" className="p-3">
                            Condition
                        </th>
                        <th>

                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                            <tr>
                                <td>Loading...</td>
                            </tr>
                        ) : substations.data.map((substation, index) => (
                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {substations.from + index}
                                </td>
                                <td>
                                    {substation.name}
                                </td>
                                <td className="px-10 py-3 font-bold">
                                    {substation.bay.length}
                                </td>
                                <td>
                                    {substation.condition.name === 'Operasi' ? (
                                        <Badge color="success" className="justify-center w-24">{substation.condition.name}</Badge>
                                    ): (
                                        <Badge color="failure" className="justify-center">{substation.condition.name}</Badge>
                                    )}
                                </td>
                                <td className="flex items-center justify-end mx-4 mt-2">
                                <div className="flex">
                                    <Link href="" className="mx-1">
                                        <Button size="xs" color="warning" className="rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Button>
                                    </Link>
                                </div>
                                </td>
                            </tr>
                            ))
                        }

                </tbody>
            </table>
            <div className="flex items-center justify-between mx-2">
                <p className="text-sm font-medium text-gray-700">
                    Showing {substations.from} to {substations.to} total {substations.total}
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
            <Pagination className="rounded-sm" links={substations.links}/>
            </div>
        </div>
        </DashboardLayout>
        </>
    );
}

{/* <Button size="xs" color="failure" className="rounded-lg" onClick={()=> handleDelete(substation.id, substation.name)}>
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
</Button> */}
