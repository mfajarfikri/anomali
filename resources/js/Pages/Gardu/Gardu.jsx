import {React, useRef, useState} from "react";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import DashboardLayout from '@/Layouts/DashboardLayout';
import Dropdown from "@/Components/Dropdown";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Button, Drawer } from "flowbite-react";
import { HiDocumentAdd } from "react-icons/hi";


export default function Gardu() {

    const { data, setData, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        router.post('/gardu', data, {
            onSuccess: () => {
                // Reset form data
                setData({
                    name: '',
                });
                // Show success SweetAlert
                Swal.fire({
                    title: 'Success!',
                    text: 'Gardu has been added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6' // This sets the confirm button color to blue
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Refresh the page
                        window.location.reload();
                    }
                });
            },
            onError: (errors) => {
                if (errors.name) {
                    // Show error SweetAlert for duplicate name
                    Swal.fire({
                        title: 'Error!',
                        text: 'A Gardu with this name already exists.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#d33'
                    });
                }
            }
        });
    };

    const perpage = useRef(10);
    const [isLoading, setisLoading] = useState(false);
    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    }

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

    const {gardus, auth} = usePage().props

    const [isOpen, setIsOpen] = useState(false)
    const handleClose = () => setIsOpen(false);

    return (
        <>
        <Head title="Gardu"/>
        <DashboardLayout user={auth.user}>
            <Drawer open={isOpen} onClose={handleClose} position="top">
                <Drawer.Header title="Gardu" />
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

                            <PrimaryButton className="ms-4">
                                Add Gardu
                            </PrimaryButton>
                        </div>
                    </form>
                </Drawer.Items>
            </Drawer>

        <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                Gardu Induk
                <div className="flex items-center justify-between">
                    <div className="inline-flex row-span-3">
                        <p className="mt-1 text-sm font-normal text-gray-500 ">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                    </div>
                    <div className="inline-flex items-center">
                        <Button className="bg-teal-500" onClick={() => setIsOpen(true)}>
                            <HiDocumentAdd className="w-5 h-5"/>
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
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                            <tr>
                                <td>Loading...</td>
                            </tr>
                        ) : gardus.data.map((gardu, index) => (
                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {gardus.from + index}
                                </td>
                                <td className="px-4 py-3">
                                    {gardu.name}
                                </td>
                            </tr>
                            ))
                        }

                </tbody>
            </table>
            <div className="flex items-center justify-between mx-2">
                <p className="text-sm font-medium text-gray-700">
                    Showing {gardus.from} to {gardus.to} total {gardus.total}
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
            <Pagination className="rounded-sm" links={gardus.links}/>
            </div>
        </div>
        </DashboardLayout>
        </>
    );
}
