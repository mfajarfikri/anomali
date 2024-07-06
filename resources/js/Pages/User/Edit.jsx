import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Selectbox from '@/Components/SelectBox';

export default function UserEdit({ auth, user  }) {
    // console.log(id)
    // const user = usePage().props.auth.user;
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        password:"",
        password_confirmation:""

    });

    const submit = (e) => {
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
    className="font-semibold text-xl text-gray-800 leading-tight">User</h2>}
    >

    <Head title="User" />
    <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="relative overflow-x-auto shadow rounded-lg">
              
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
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    disabled
                                />

                                <InputError className="mt-2" message={errors.name} />
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    disabled
                                />

                                <InputError className="mt-2" message={errors.email} />
                            </div>
                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Save</PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600">Saved.</p>
                                </Transition>
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
