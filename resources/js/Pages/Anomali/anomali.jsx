import Pagination from "@/Components/Pagination";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";

export default function anomali({auth, anomali}){
    return(
        <>
        <Head title="Anomali"/>
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
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {anomali.data.map((anomali, index) => (
                    <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {anomali.id}
                        </th>
                        <td className="px-6 py-4">
                            {anomali.name}
                        </td>
                        <td className="px-6 py-4">
                            <a href="#" className="font-medium text-blue-600">Edit</a>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <Pagination className="" links={anomali.links}/>
        </div>

        </DashboardLayout>
        </>
    );
}
