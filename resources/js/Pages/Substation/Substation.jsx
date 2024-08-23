import {React, useRef, useState} from "react";
import { Head, router, usePage, useForm, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import DashboardLayout from '@/Layouts/DashboardLayout';
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Button, Drawer } from "flowbite-react";
import { HiDocumentAdd, HiHome, HiTrash } from "react-icons/hi";


export default function Substation() {
    const {substations, auth} = usePage().props
    const perpage = useRef(10);
    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    }
    const [isLoading, setisLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(false)
    const handleClose = () => setIsOpen(false)

    const { data, setData, errors, reset, processing } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        router.post('/substation', data, {
            onSuccess: () => {
                reset();
                getData();
                Swal.fire({
                    title: 'Success',
                    text: data.name +' has been created.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1C64F2'
                });
            },
        });
        setIsOpen(false)
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

    const handleDelete = (id, name) =>{
        console.log(id);
        Swal.fire({
            title: "Do you want to delete " + name + " ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/substation/${id}/delete`, {
                    _method: "delete"
                })
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            }
          });

    }

    return (
        <>
        <Head title="Substation"/>
        <DashboardLayout user={auth.user}>
            <Drawer open={isOpen} onClose={handleClose} position="top">
                <Drawer.Header title="Substation" />
                <Drawer.Items>
                <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />

                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="block w-full mt-1"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-4">

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Add substation
                            </PrimaryButton>
                        </div>
                    </form>
                </Drawer.Items>
            </Drawer>

        <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                Substation
                <div className="flex items-center justify-between">
                    <div className="inline-flex row-span-3">
                        <p className="mt-1 text-sm font-normal text-gray-500 ">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                    </div>
                    <div className="inline-flex items-center">
                        <Button size="xs" color="info" onClick={() => setIsOpen(true)}>
                            <div className="inline-flex items-center justify-center">
                                <HiHome className="w-4 h-4 mr-2"/>
                                <span>Add substation</span>
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
                            Nama
                        </th>
                        <th></th>
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
                                <td className="px-4 py-3">
                                    {substation.name}
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
                                    <Button size="xs" color="failure" className="rounded-lg" onClick={()=> handleDelete(substation.id, substation.name)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Button>
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
