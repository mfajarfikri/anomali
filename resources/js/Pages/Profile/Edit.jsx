import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <DashboardLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-300">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="grid lg:grid-cols-3">
                <div className="col-span-2">
                    <div className="space-y-6 py-7 sm:px-6 lg:px-8">
                        <div className="p-4 bg-white shadow sm:p-8 sm:rounded-lg dark:bg-dark-400">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="p-2 bg-white shadow sm:p-8 sm:rounded-lg dark:bg-dark-400">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        <div className="p-2 bg-white shadow sm:p-8 sm:rounded-lg dark:bg-dark-400">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
                <div className="col-span-1 mx-5">
                    <div className="w-full mt-8 bg-gray-300 rounded-lg">
                        <div className="flex justify-start py-8 pl-8">
                            <img src="https://images.unsplash.com/photo-1652026921593-e92f05d46cce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='w-48 h-48 border-4 border-white rounded-full'/>
                            <div class="flex flex-col justify-between py-16 mx-4 leading-normal">
                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{auth.user.name}</h5>
                                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{auth.user.email}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
