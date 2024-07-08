import {React} from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from '@/Layouts/DashboardLayout';


export default function Gardu({auth}) {
    return (
        <>

        <Head title="Gardu"/>
        <DashboardLayout user={auth.user}>


        </DashboardLayout>
        </>
    );
}
