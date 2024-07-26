import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Textarea } from "flowbite-react";

export default function anomali({auth}){

    console.log(auth);

    const [openModal, setOpenModal] = useState(true);

    return(
        <>
        <Head title="Anomali"/>
        <DashboardLayout user={auth.user}>

        <Modal size="7xl" show={openModal} onClose={() => setOpenModal(true)}>
            <Modal.Header>
                <div className="border rounded-lg shadow-2xl">
                    <div className="m-2">
                        <svg className="w-6 h-6 transition duration-75 text-cyan-800 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="m21,0H3C1.346,0,0,1.346,0,3v21h24V3c0-1.654-1.346-3-3-3Zm1,19.767l-5.354-4.53-1.292,1.526,6.189,5.237H2l10.104-5.179-.894-1.789-3.219,1.608.009-3.638-2-.005-.012,4.643-3.988,2.124V3c0-.551.449-1,1-1h4.023l3.099,6h3.29l2.214,3.986,1.748-.972-1.675-3.014h3.301v-2h-7.66l-2.066-4h11.726c.551,0,1,.449,1,1v16.767Z"/>
                        </svg>
                    </div>
                </div>
            </Modal.Header>
                    <div className="mx-6 my-2">
                        <p className="font-medium">Add New Anomali</p>
                    </div>
                <Modal.Body>
                    <form action="">
                        <div className="grid grid-cols-2">
                            <div className="">
                                <div className="mt-2">
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={auth.user.name}
                                    className="block w-full mt-1"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required/>
                                </div>
                                <div className="mt-2">
                                    <InputLabel htmlFor="name" value="Name" />
                                    <Textarea height="20"/>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            <Modal.Footer>
            <Button onClick={() => setOpenModal(false)}>I accept</Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
                Decline
            </Button>
            </Modal.Footer>
        </Modal>

        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
            <table className="w-full text-sm text-gray-500 ">

                <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-slate-300 rtl:text-right">
                List Anomali
                <div className="flex items-center justify-between">
                    <div className="inline-flex row-span-3">
                        <p className="mt-1 text-sm font-normal text-gray-500 ">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                    </div>
                    <Button color="info" onClick={setOpenModal}>
                        +
                    </Button>
                </div>
                </caption>
                    <thead>
                        <th>No</th>
                        <th>Nama</th>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td>Kosambi</td>
                        </tr>
                    </tbody>
            </table>
        </div>


        </DashboardLayout>
        </>
    );
}
