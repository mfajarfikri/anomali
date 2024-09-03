import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button,Badge, HR, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState, useRef } from "react";
import { HiCheck, HiOutlinePencil, HiOutlineX } from "react-icons/hi";
import { Select } from "@headlessui/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";

export default function Aproval({auth, anomalis}){


    const perpage = useRef(10);
    const [openModal, setOpenModal] = useState(true);

    const handleChangePerPage = (e) => {
        perpage.current = e.target.value;
        getData();
    }

    const [isLoading, setisLoading] = useState(false);

    const getData = () => {
        setisLoading(true)
        router.get(route().current(), {
            perpage: perpage.current
        },{
            preserveScroll : true,
            preserveState : true,
            onFinish : () => setisLoading(false)
        });
    }
    const { data, setData, processing, post, errors, reset} = useForm({
        approve_by: auth.user.name,
    })

    const approve = (id) => {
        router.post(`/approval/approve/${id}`, data)
    }

    const [selectedItem, setSelectedItem] = useState(null)
    const [openModalDetail, setOpenModalDetail] = useState(false)

    const detailItem = (data) => {
        setSelectedItem(data);
        setOpenModalDetail(true, data);
        console.log(data); // Log the data parameter instead of selectedItem
    }

    const handleDelete = (id, titlename) =>{
        console.log(id);
        Swal.fire({
            title: "Do you want to reject " + titlename + " ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!"
          }).then((result) => {
            if (result.isConfirmed) {
                router.post(`/approval/${id}/delete`, {
                    _method: "delete"
                })
                Swal.fire({
                    title: 'Rejected',
                    text: titlename + ' has been rejected.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1C64F2'
                });
            }
          });

    }

    const [editItem, setEditItem] = useState(null)
    const [openModalEdit, setOpenModalEdit] = useState(false)

    const editedItem = (data) => {
        setSelectedItem(data);
        setOpenModalEdit(true, data);
        console.log(data); // Log the data parameter instead of selectedItem
    }

    return(
        <>
        <Head title="Anomali"/>
        <DashboardLayout user={auth.user}>

            <Modal size="3xl" show={openModalEdit} onClose={() => setOpenModalEdit(false)} position="center">
                <Modal.Header>

                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
            </Modal>

        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-gray-500 ">
            <caption className="p-5 text-lg font-semibold text-left bg-gray-100 rtl:text-right">
                <div className="inline-flex items-center gap-3">
                    <form>
                        <div className="relative bg-transparent">
                            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
                                <svg className="text-gray-700 size-5 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" className="block w-full text-xs font-thin border-none rounded-lg ps-14 focus:ring-gray-100 focus:border-gray-100" placeholder="Search Ticket"/>
                        </div>
                    </form>
                </div>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-slate-50">
                <tr className="text-left">
                    <th scope="col" className="p-3">
                        No
                    </th>
                    <th scope="col" className="py-3">
                        Title Name
                    </th>
                    <th scope="col" className="py-3">
                        Substation
                    </th>
                    <th scope="col" className="py-3">
                        section
                    </th>
                    <th scope="col" className="py-3 text-center">
                        Type
                    </th>
                    <th scope="col" className="py-3">
                        User
                    </th>
                    <th scope="col" className="py-3">
                        equipment
                    </th>
                    <th scope="col" className="py-3">
                        Bay
                    </th>
                    <th scope="col" className="py-3">
                        Date Found
                    </th>
                    <th scope="col" className="py-3 text-center">
                        Status
                    </th>
                    <th scope="col" className="py-3 text-center">
                        Approve
                    </th>
                    <th scope="col" className="py-3 text-center">
                        Action
                    </th>

                </tr>
            </thead>
            <tbody>
                {anomalis.data.map((anomali, index) => (
                    <tr key={anomali.id} onClick={() => setEditItem(anomali)} className="bg-white border-b cursor-pointer hover:bg-zinc-100">
                        <td className="px-4 py-2 font-medium text-gray-900">
                            {anomalis.from + index}
                        </td>
                        <td>
                            {anomali.titlename}
                        </td>
                        <td>
                            {anomali.substation.name}
                        </td>
                        <td>
                            {anomali.section.name}
                        </td>
                        <td className="px-4 ">
                            {anomali.type.name === "Major" ? (
                                <Badge color="failure" className="justify-center">{anomali.type.name}</Badge>
                            ): (
                                <Badge color="indigo" className="justify-center">{anomali.type.name}</Badge>
                            )
                            }
                        </td>
                        <td>
                            {anomali.user.name}
                        </td>
                        <td>
                            {anomali.equipment.name}
                        </td>
                        <td>
                            {anomali.bay.name === null ? (
                                null
                            ): (
                                <span>{anomali.bay.name}</span>
                            )}
                        </td>
                        <td>
                            {anomali.date_find}
                        </td>
                        <td className="px-4 ">
                        {anomali.status.name === "Open" ? (
                            <Badge color="success" className="justify-center">{anomali.status.name}</Badge>
                        ) : anomali.status.name === "Pending" ? (
                            <Badge color="warning" className="justify-center">{anomali.status.name}</Badge>
                        ) : anomali.status.name === "Close" ? (
                            <Badge color="failure" className="justify-center">{anomali.status.name}</Badge>
                        ) : (
                            <Badge color="info" className="justify-center">{anomali.status.name}</Badge>
                        )
                        }
                        </td>
                        <td>
                            {anomali.is_approve === 0 ? (
                                <span>False</span>
                            ): (
                                <span>True</span>
                            )}
                        </td>
                        <td className="flex items-center justify-center">
                            {anomali.is_approve === 0 ? (
                                <>
                                <Button className="flex items-center mx-1" size="xs" onClick={() => approve(anomali.id)}>
                                    <HiCheck className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>
                                <Button color="failure" size="xs" onClick={()=> handleDelete(anomali.id, anomali.titlename)}>
                                    <HiOutlineX className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                                </>
                            ):(
                            <Button onClick={() => setOpenModal(true)} color="warning" size="xs" className="mx-4">
                                <HiOutlinePencil className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            )
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="flex items-center justify-between mx-2">
            <p className="text-sm font-medium text-gray-700">
            Showing {anomalis.from} to {anomalis.to} total {anomalis.total}
            </p>
            <div className="inline-flex items-center justify-center my-2">
                <Label value='Filter'/>
                <select name="perpage" id="perpage" className="p-2 mx-2 text-sm border-none rounded-lg"
                        value={perpage.current} onChange={handleChangePerPage}>
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                </select>
            </div>
        <Pagination links={anomalis.links}/>
        </div>
    </div>

        </DashboardLayout>
        </>
    );
}
