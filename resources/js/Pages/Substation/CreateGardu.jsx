import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

export default function CreateGardu({auth, flash}) {

    const { data, setData, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        router.post('/gardu', data);
    };

    return (
        <>
        <Head title="Add Gardu"/>
        <ToastContainer/>
        <DashboardLayout user={auth.user}>
            <div className="p-5 text-sm rounded-tl-lg rounded-tr-lg bg-slate-200">
                <h2 className="text-lg font-semibold text-left text-gray-900">Add Gardu</h2>
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

                        <div className="flex items-center justify-end mt-4">

                            <PrimaryButton className="ms-4">
                                Add Gardu
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
        </>
    )
}
