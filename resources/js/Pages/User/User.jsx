import DashboardLayout from "@/Layouts/DashboardLayout";
import Pagination from "@/Components/Pagination";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useRef, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Select } from "@headlessui/react";
import { Badge, Button, Label, Modal, TextInput  } from "flowbite-react";
import { HiUser, HiOutlineMail, HiOfficeBuilding, HiUserCircle, HiLockClosed, HiX, HiUserAdd } from "react-icons/hi";

export default function User({auth, users, substations, roles}) {

    console.log(roles);

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
        substation_id: '',
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
        {/* outline onClick={() => setOpenModal(true)} */}
        <Head title="User"/>
        <DashboardLayout user={auth.user}>

        <Modal size="3xl" show={openModal} onClose={() => setOpenModal(false)} position="center">
            <Modal.Header>
                <div className="rounded-lg">
                    <div className="inline-flex items-center justify-center">
                        <div className="p-2 border rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                        </div>
                        <div className="flex items-center justify-center mx-2">
                            <p className="font-bold">New User</p>
                        </div>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="">
                            <Label htmlFor="name" value="Name User"/>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                autoComplete="off"
                                className="block w-full mt-1"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                icon={HiUser}
                                placeholder="Use the name you want to appear"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="">
                            <Label htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full mt-1"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                icon={HiOutlineMail}
                                placeholder="example@domain.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="">
                            <Label htmlFor="substation" value="Substation"/>
                            <Select
                                id="substation"
                                name="substation_id"
                                className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500"
                                value={data.substation_id}
                                onChange={(e) => setData('substation_id', e.target.value)}
                                required
                                icon={HiOfficeBuilding}
                            >
                                <option value="">Select a Substation</option>
                                {substations.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </Select>
                            <InputError className='mt-2' message={errors.substation_id}/>
                        </div>

                        <div className="">
                            <Label htmlFor="role" value="Role"/>
                            <Select
                                id="role"
                                name="role_id"
                                className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500"
                                value={data.role_id}
                                onChange={(e) => setData('role_id', e.target.value)}
                                required
                                icon={HiUserCircle}
                            >
                                <option value="">Select a role</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </Select>
                            <InputError className='mt-2' message={errors.role_id}/>
                        </div>

                        <div className="">
                            <Label htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full mt-1"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                icon={HiLockClosed}
                                placeholder="Keep your password confidential"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="">
                            <Label htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full mt-1"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                icon={HiLockClosed}
                                placeholder="Re-enter your password"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                        <PrimaryButton type="submit" disabled={processing}>
                            <HiUserAdd className="w-4 h-4 mr-2" />
                            Add User
                        </PrimaryButton>
                    </div>
                </form>
            </Modal.Body>
        </Modal>

        <div className="relative overflow-x-auto shadow-2xl sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">
                <caption className="p-4 text-lg font-semibold text-left bg-gray-100 rtl:text-right">
                    <div className="inline-flex gap-3">
                        <button onClick={() => setOpenModal(true)} className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border rounded-full bg-emerald-50 border-emerald-500 focus:shadow-outline hover:scale-105 hover:shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="transition ease-in-out stroke-1 stroke-emerald-700 size-5 hover:rotate-45 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                        <form>
                            <button className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border-none hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="stroke-gray-700 size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </form>
                        <button className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border-none hover:scale-105">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="stroke-gray-700 size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                            </svg>
                        </button>
                    </div>
                </caption>

                <thead className="text-xs text-gray-700 uppercase bg-slate-50">
                    <tr className="text-left">
                        <th scope="col" className="p-3">
                            No
                        </th>
                        <th scope="col">
                            Nama
                        </th>
                        <th scope="col">
                            Email
                        </th>
                        <th scope="col">
                            Penempatan
                        </th>
                        <th scope="col" className="text-center">
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
                            <td className="px-4 py-2 font-medium text-gray-900 ">
                               {users.from + index}
                            </td>
                            <td className="py-2 ">
                                {user.name}
                            </td>
                            <td className="py-2 text-blue-700 ">
                                {user.email}
                            </td>
                            <td className="py-2 ">
                                {user.substation.name}
                            </td>
                            <td className="flex items-center justify-center py-2">
                                {user.role.name === 'Admin' ? (
                                <Badge color="success" className="justify-center w-24">
                                    {user.role.name}
                                </Badge>
                            ):( <Badge color="gray" className="justify-center w-24">
                                    {user.role.name}
                                </Badge>
                                )}

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
                    <Label value='Filter'/>
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
