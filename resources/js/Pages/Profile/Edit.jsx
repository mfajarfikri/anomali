import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <DashboardLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-300">
                    Profile
                </h2>
            }
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
                {/* <div className="col-span-1 mx-5">
                    <div className="mt-7 p-2 bg-white shadow sm:p-8 sm:rounded-lg dark:bg-dark-400">
                        <div className="flex flex-col items-center">
                            <img
                                src={
                                    auth.user.profile_photo_url ||
                                    "https://via.placeholder.com/250"
                                }
                                alt="Foto Profil"
                                className="w-48 h-48 rounded-full mb-4 border-4 border-white dark:border-gray-700"
                            />
                            <form className="w-full">
                                <div className="mb-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        // onChange={handleFileChange}
                                        className="w-full bg-white text-sm font-thin text-gray-500 border border-gray-300 rounded-md shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:border-cyan-600 dark:focus:ring-cyan-600"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    Upload Foto
                                </button>
                            </form>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold dark:text-gray-200">
                                {auth.user.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {auth.user.email}
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>
        </DashboardLayout>
    );
}
