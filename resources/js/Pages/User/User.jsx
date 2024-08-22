import DashboardLayout from "@/Layouts/DashboardLayout";
import Pagination from "@/Components/Pagination";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { Select } from "@headlessui/react";
import { Badge, Button, Modal,  } from "flowbite-react";
import { HiOutlineUserAdd } from "react-icons/hi";

export default function User({auth, users, gardu, role}) {

    const [openModal, setOpenModal] = useState(false);

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
    const { data, setData, processing, post, errors, reset } = useForm({
        name: '',
        email: '',
        gardu_id: '',
        role_id: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('user.create'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpenModal(false);
                getData();
                Swal.fire({
                    title: 'Success',
                    text: 'A User has been created.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1C64F2'
                });
            },
            onError: (errors) => {
                console.error('Error creating user:', errors);
            },
        });
    };

    return (
        <>
        <Head title="User"/>
        <DashboardLayout user={auth.user}>

        <Modal size="3xl" show={openModal} onClose={() => setOpenModal(false)} position="center">
            <Modal.Header>
                <div className="rounded-lg">
                    <div className="inline-flex items-center justify-center">
                        <div className="p-2 border rounded-lg">
                            <HiOutlineUserAdd className="w-5 h-5" style={{ color: "gray", fontSize: "1.5em" }}/>
                        </div>
                        <div className="flex items-center justify-center mx-2">
                            <p className="font-bold">New User</p>
                        </div>
                    </div>

                </div>
            </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="block w-full mt-1 text-sm"
                                autoComplete="name"
                                placeholder="asdasda"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full mt-1 text-sm"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="gardu" value="Gardu Induk"/>
                            <Select
                                id="gardu"
                                name="gardu_id"
                                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.gardu_id}
                                onChange={(e) => setData('gardu_id', e.target.value)}
                                required
                            >
                                <option value="">Select a Gardu Induk</option>
                                {gardu.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </Select>
                            <InputError className='mt-2' message={errors.gardu_id}/>
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="role" value="Role"/>
                            <Select
                                id="role"
                                name="role_id"
                                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.role_id}
                                onChange={(e) => setData('role_id', e.target.value)}
                                required
                            >
                                <option value="">Select a role</option>
                                {role.map((r) => (
                                    <option className="text-sm" key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </Select>
                            <InputError className='mt-2' message={errors.role_id}/>
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full mt-1 text-sm"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full mt-1 text-sm"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-6">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Add User
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal.Body>
        </Modal>

        <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">
                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                Our User
                <div className="flex items-center justify-between">
                    <div className="inline-flex row-span-3">
                        <p className="mt-1 text-sm font-normal text-gray-500 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, veniam!</p>
                    </div>
                    <Button size="xs" color="info" onClick={() => setOpenModal(true)}>
                        <div className="inline-flex items-center justify-center">
                            <HiOutlineUserAdd className="mr-2"/>
                            <span>Add User</span>
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
                    ) : users.data.map((user, index) => (
                        <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                            <td className="px-4 py-2 font-medium text-gray-900">
                               {users.from + index}
                            </td>
                            <td className="px-4 py-2">
                                {user.name}
                            </td>
                            <td className="px-4 py-2">
                                {user.email}
                            </td>
                            <td className="px-4 py-2">
                                {user.gardu.name}
                            </td>
                            <td className="px-4 py-2">
                                {user.role.name === 'Admin' ?
                                (<Badge color="success" className="justify-center">
                                    {user.role.name}
                                </Badge>):(<Badge color="gray" className="justify-center">
                                    {user.role.name}
                                </Badge>
                                )}

                        </td>
                        <td className="px-4 py-2">
                        <div className="flex">
                            <Link href={route("user.edit",user.id)} className="mx-1">
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
                    Showing {users.from} to {users.to} total {users.total}
                </p>
                <div className="inline-flex items-center justify-center my-2">
                    <InputLabel value='Filter'/>
                    <select name="perpage" id="perpage" className="p-2 mx-2 text-sm border-none rounded-lg"
                            value={perpage.current} onChange={handleChangePerPage}>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                    </select>
                </div>
            <Pagination links={users.links}/>
            </div>
        </div>
        </DashboardLayout>
        </>
    );
}
