import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, Head} from '@inertiajs/react';
import { Select } from '@headlessui/react';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function UserEdit({ auth, user, role, gardu  }) {

    const {data, setData, errors, patch} = useForm({
        name: user.name,
        email: user.email,
        role: '',
        gardu: ''
    })



    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        patch(route('user.update',user.id),{
            preserveScroll: true,
            onSuccess: () => {
                alert("User Updated");
            },
            onError:(errors) => {
                console.log(errors);
            },
        });

    };

return (
<DashboardLayout user={auth.user} header={<h2
    className="text-xl font-semibold leading-tight text-gray-800">User</h2>}
    >

    <Head title="User" />
    <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative overflow-x-auto rounded-lg shadow">
                <div className="p-4 bg-white sm:p-8 sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                    <section className="max-w-xl">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">Edit The User</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Update your account's profile information and email address.
                            </p>

                        </header>
                        <form onSubmit={submit} className="mt-6 space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Name" />

                                <TextInput
                                    id="name"
                                    className="block w-full mt-1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    className="block w-full mt-1"
                                    value={data.email}
                                    disabled
                                />

                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div className="">
                                <InputLabel htmlFor="gardu" value="Gardu Induk"/>
                                <Select name='gardu' className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    <option></option>
                                    {gardu.map((gardu, index) => (
                                        <option id='gardu' key={index} value={data.gardu.name}
                                        onChange={(e) => setData('gardu', e.target.value)}>{gardu.name}</option>
                                    ))}
                                </Select>

                                <InputError className='mt-2' message={errors.gardu}/>
                            </div>

                            <div className="">
                                <InputLabel htmlFor="role" value="Role"/>
                                <Select name='role' className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    <option></option>
                                    {role.map((role, index) => (
                                        <option id={role.id} key={index} value={data.role.name}
                                        onChange={(e) => setData('role', e.target.value)}>{role.name}</option>
                                    ))}
                                </Select>

                                <InputError className='mt-2' message={errors.role}/>
                            </div>
                            <div className="flex items-center gap-4">
                                <PrimaryButton>{processing ? "Loading....": "Save"}</PrimaryButton>

                                {/* <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600">

                                    </p>
                                </Transition> */}
                            </div>
                        </form>
                    </section>

                    </div>
                </div>

            </div>

        </div>

    </div>


</DashboardLayout>
);
}
