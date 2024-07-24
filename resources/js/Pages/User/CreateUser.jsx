import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, useForm} from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useEffect } from "react";
import { Select } from "@headlessui/react";

export default function CreateUser({auth, gardu, role}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        gardu: '',
        role: '',
        password: '',
        password_confirmation: '',
    });


    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return(
        <>
        <Head title="Create"/>
        <DashboardLayout user={auth.user}>
            <div className="p-5 text-sm rounded-tl-lg rounded-tr-lg bg-slate-200">
                <h2 className="text-lg font-semibold text-left text-gray-900">Add New User</h2>
                <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, quas!</span>
            </div>
            <div className="p-5 rounded-lg shadow-md">
                <div className="bg-white">
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

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full mt-1"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="gardu" value="Gardu Induk"/>
                            <Select name="gardu" className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                {gardu.map((gardu, index) => (
                                    <option id='gardu' key={index} value={gardu.name}
                                    onChange={(e) => setData('gardu', e.target.value)}>{gardu.name}</option>
                                ))}
                            </Select>

                            <InputError className='mt-2' message={errors.gardu}/>
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="role" value="Role"/>
                            <Select name="role" className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                {role.map((role, index) => (
                                    <option id='role' key={index} value={role.name}
                                    onChange={(e) => setData('gardu', e.target.value)}>{role.name}</option>
                                ))}
                            </Select>

                            <InputError className='mt-2' message={errors.role}/>
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full mt-1"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-4">

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Add User
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
        </>
    )
}
