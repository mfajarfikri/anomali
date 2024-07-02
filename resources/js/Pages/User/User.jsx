import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";

export default function User({auth, users}) {
    console.log(users);
    return (
        <>
        <Head title="User"/>
        <DashboardLayout user={auth.user}>
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 rtl:text-right">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            No
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Role
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.data.map((users) => (
                    <tr className="bg-white border-b hover:bg-gray-50">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {users.id}
                        </th>
                        <td className="px-6 py-4">
                            {users.name}
                        </td>
                        <td className="px-6 py-4">
                            {users.email}
                        </td>
                        <td className="px-6 py-4">
                            <span class="text-sm bg-green-100 rounded-lg p-2">admin</span>
                        </td>
                        <td className="px-6 py-4">
                            <a href="#" className="font-medium text-blue-600">Edit</a>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </DashboardLayout>
        </>
    );
}
