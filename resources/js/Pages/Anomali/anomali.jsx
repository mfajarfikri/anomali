import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Button,Badge, HR, Label, Modal, Textarea, TextInput, FileInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { HiUser, HiOutlineTicket, HiOutlineSearch, HiOutlineCheck, HiDocumentReport } from "react-icons/hi";
import { Input, Select } from "@headlessui/react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";
import Modal2 from "@/Components/Modal2";

export default function Anomali({auth, anomalis, equipments,substations, sections, types, progress}){



const perpage = useRef(15);
const [openModal, setOpenModal] = useState(false);

const handleChangePerPage = (e) => {
    perpage.current = e.target.value;
    getData();
}

const [isLoading, setisLoading] = useState(false);

const getData = () => {
    setisLoading(true);
    router.get(route().current(), {
        perpage: perpage.current
    }, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => setisLoading(false)
    });
}

const [selectedSubstations, setSelectedSubstations] = useState('');
const { data, setData, processing, post, errors, reset } = useForm({
    titlename: '',
    // substation: auth.user.substation_id,
    substation: '',
    section: '',
    type: '',
    user: auth.user.id,
    equipment: '',
    bay: '',
    date_find: '',
    additional_information: '',
    file: null
});

const [bays, setBays] = useState([]);
const [selectedBays, setSelectedBays] = useState('');

const handleCategoryChange = (e) => {
    setData('substation', e.target.value)
    const getSubstationID = e.target.value;
    setSelectedSubstations(getSubstationID);
    const selected = substations.find(category => category.id === parseInt(getSubstationID));
    setBays(selected ? selected.bay : []);
    setSelectedBays(''); // Reset selected subcategory
    setData('substation', e.target.value)
};

const submit = (e) => {
    e.preventDefault();
    post(route('anomali.create'), {
        preserveScroll: true,
        onSuccess: () => {
            reset();
            setOpenModal(false);
            getData();
            Swal.fire({
                title: 'Success',
                text: data.titlename + ' has been created.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#1C64F2'
            });
        },
        onError: (errors) => {
            Swal.fire({
                title: errors,
                text: 'Error Create ' + data.titlename,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#1C64F2'
            });
        },
    });
};

const [selectedItem, setSelectedItem] = useState(null);
const [openModalDetail, setOpenModalDetail] = useState(false);

const detailItem = (data) => {
    setSelectedItem(data);
    setOpenModalDetail(true); // Removed the second argument
    console.log(data); // Log the data parameter instead of selectedItem
};

console.log(errors);



    return(
        <>
        <Head title="Anomali"/>
        <DashboardLayout user={auth.user}>

            <Modal2 isOpen={openModal} onClose={() => setOpenModal(false)} title="New Anomalies">
                <form onSubmit={submit}>
                        <div className="">
                            <Label htmlFor="titlename" value="Title Name" className="text-sm font-thin"/>
                            <TextInput
                            type="text"
                            id="titlename"
                            name="titlename"
                            value={data.titlename}
                            onChange={(e) => setData('titlename', e.target.value)}
                            icon={HiOutlineTicket}
                            autoComplete="off"
                            placeholder="My Suggestion for this title"
                            />
                            <InputError className='mt-2' message={errors.titlename}/>
                        </div>
                        <div className="mt-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <Label htmlFor="substation" value="Substation" className="text-sm font-thin"/>
                                        {/* <Selector data={substations} selected={substationData} mul setSelected={setSubstationData}/> */}

                                        <Select
                                        name="substation"
                                        value={selectedSubstations}
                                        onChange={handleCategoryChange}
                                        // onChange={(e) => setData('substation', e.target.value)}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                        <option value="" className="text-sm font-thin text-gray-500">Select substation</option>
                                        {substations.map((substation, index) => {
                                            return <option id='substation' key={index} value={substation.id} className="text-sm font-thin text-gray-500"
                                            >{substation.name}</option>
                                        })}
                                        </Select>



                                    <InputError className='mt-2' message={errors.substation}/>
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="section" value="Section" className="text-sm font-thin"/>
                                    <Select
                                        name="section"
                                        onChange={(e) => setData('section', e.target.value)}
                                        value={data.section}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                            <option value="" className="text-sm font-thin text-gray-500">Select section</option>
                                            {sections.map((section, index) => (
                                                <option id='section' key={index} value={section.id} className="text-sm font-thin text-gray-500">{section.name}</option>
                                            ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.section}/>
                                </div>
                                <div className="col-span-1">
                                    <Label htmlFor="section" value="Type" className="text-sm font-thin"/>
                                    <Select
                                        name="type"
                                        onChange={(e) => setData('type', e.target.value)}
                                        value={data.type}
                                        className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                            <option value="" className="text-sm font-thin text-gray-500">Select types</option>
                                            {types.map((types, index) => (
                                                <option id='types' key={index} value={types.id} className="text-sm font-thin text-gray-500">{types.name}</option>
                                            ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.type}/>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="w-full">
                                {/* <Label htmlFor="date" value="Bay" className="text-sm font-thin"/>
                                    <Selector data={bays} selected={bayData} setSelected={setBayData}/>
                                <InputError className='mt-2' message={errors.bays}/> */}
                            </div>
                            <div className="w-full">
                                <Label htmlFor="date" value="Bay" className="text-sm font-thin"/>

                                <Select
                                name="bay"
                                disabled={!selectedSubstations}
                                value={data.bay}
                                onChange={(e) => setData('bay', e.target.value)}
                                className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                <option value="" className="text-sm font-thin text-gray-500">Select Substation first</option>
                                {bays.map(bay => (
                                    <option key={bay.id} value={bay.id}>{bay.name}</option>
                                ))}
                                </Select>


                                <InputError className='mt-2' message={errors.bay}/>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                <Label htmlFor="user" value="User" className="text-sm font-thin"/>
                                    <TextInput
                                    type="text"
                                    id="user"
                                    name="user"
                                    onChange={(e) => setData('user', e.target.value)}
                                    className="w-full font-thin text-gray-500 border-gray-300 rounded-md shadow-sm"
                                    placeholder={auth.user.name}
                                    icon={HiUser} readOnly/>
                                </div>
                                <div className="col-span-1">
                                <Label htmlFor="equipment" value="Equipment" className="text-sm font-thin"/>
                                    <Select
                                    name="equipment"
                                    onChange={(e) => setData('equipment', e.target.value)}
                                    value={data.equipment}
                                    className="w-full text-sm font-thin text-gray-500 border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500">
                                        <option value="" className="text-sm font-thin text-gray-500">Select equipment</option>
                                        {equipments.map((equipment, index) => (
                                            <option id='equipment' key={index} value={equipment.id} className="text-sm font-thin text-gray-500">{equipment.name}</option>
                                        ))}
                                    </Select>
                                    <InputError className='mt-2' message={errors.equipment}/>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="w-full">

                                <Label htmlFor="date" value="Date" className="text-sm font-thin"/>

                                <TextInput
                                type="date"
                                name="date_find"
                                value={data.date_find}
                                onChange={(e) => setData('date_find', e.target.value)}
                                className="text-gray-500"/>

                                <InputError className='mt-2' message={errors.date_find}/>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="additional_information" value="Description" className="text-sm font-thin"/>

                            <Textarea id="additional_information"
                            name="additional_information"
                            value={data.additional_information}
                            onChange={(e) => setData('additional_information', e.target.value)}
                            placeholder="Leave a comment..." rows={2}/>

                            <InputError className='mt-2' message={errors.additional_information}/>

                        </div>
                        <div className="mt-2">


                            <Label htmlFor="attachment" value="Attachment" className="text-sm font-thin"/>

                            <input
                            type="file"
                            name="file"
                            value={data.other}
                            onChange={(e) => setData('file', e.target.files[0])}
                            className="w-full text-sm font-thin text-gray-500 border border-gray-300 rounded-md shadow-sm bg-slate-50 focus:border-cyan-500 focus:ring-cyan-500"/>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-300" id="file_input_help">* PNG, JPG or PDF (Max. 3048kb).</p>

                            <InputError className='mt-2' message={errors.file}/>

                        </div>

                        <HR/>

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="ms-4 bg-cyan-600" disabled={processing}>
                                Add ticket
                            </PrimaryButton>
                        </div>

                    </form>
            </Modal2>

        <Modal size="3xl" show={openModalDetail} onClose={() => setOpenModalDetail(false)} position="top-right">
            <Modal.Header>
                <div className="inline-flex items-center">
                    <div className="p-2 border rounded-lg">
                        <HiOutlineTicket style={{ color: "green", fontSize: "1.5em" }}/>
                    </div>
                    <span className="mx-2">
                        {selectedItem && selectedItem.titlename}
                    </span>
                </div>

            </Modal.Header>
            <Modal.Body>
                {selectedItem && (
                    <>
                    <span>Detail Ticket</span>
                        <div className="grid grid-flow-col grid-cols-2 gap-4 text-xs divide-x">
                            <div className="col-span-1 mt-4">
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Request By</span>
                                    <span>{selectedItem.user.name}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Email</span>
                                    <span>{selectedItem.user.email}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Substation</span>
                                    {selectedItem.substation.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Section</span>
                                    {selectedItem.section.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Status</span>

                                        {selectedItem.status.name === "Open" ? (
                                        <span className="bg-blue-400">{selectedItem.status.name}</span>
                                    ) : selectedItem.status.name === "Close" ? (
                                        <Badge color="failure">{selectedItem.status.name}</Badge>
                                    ) : (
                                        <Badge color="info">{selectedItem.status.name}</Badge>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-1 px-4 mt-4">
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Type</span>
                                    {selectedItem.type.name === "Major" ? (
                                        <Badge color="failure">{selectedItem.type.name}</Badge>
                                    ): (
                                        <Badge color="indigo">{selectedItem.type.name}</Badge>
                                    )
                                    }
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Equipment</span>
                                    {selectedItem.equipment.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Bay</span>
                                    {selectedItem.bay.name}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Created At</span>
                                    {selectedItem.created_at}
                                </div>
                                <hr />
                                <div className="flex justify-between my-2">
                                    <span className="italic">Approve By</span>
                                    {selectedItem.approve_by === null ? (
                                        <span>-</span>
                                    ): (
                                        <span>{selectedItem.approve_by}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <hr className="mt-4" />

                        <div className="mt-2">
                            <span>Note</span>
                            <div className="p-4 border rounded-md">
                                {selectedItem.other === null ? (
                                    <span>-</span>
                                ) : (
                                <p className="text-xs">{selectedItem.other}</p>
                                )}
                                <p className="mt-4 text-xs">{selectedItem.additional_information}</p>
                            </div>
                        </div>

                        <div className="mt-2 font-thin">
                            <span>Dates</span>
                            <div className="p-2 text-xs border rounded-lg">
                                <div className="grid justify-center grid-cols-3 gap-4 divide-x">
                                    <div className="flex justify-center col-span-1">
                                        <div className="inline-block">
                                            <span className="text-sm">Date Found</span>
                                            <p className="flex justify-center">{selectedItem.date_find}</p>
                                            <p className="flex justify-center">{selectedItem.date_find.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center col-span-1">
                                        <div className="inline-block">
                                            <span>Date Plan</span>
                                            {selectedItem.date_plan_start === null ? (
                                            <p className="flex justify-center">-</p>
                                        ):(
                                            <p>{selectedItem.date_plan_start} to {selectedItem.date_plan_end}</p>
                                        )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center col-span-1">
                                        <div className="inline-block">
                                            <span>Date Execution</span>
                                            {selectedItem.date_execution === null ? (
                                            <p className="flex justify-center">-</p>
                                        ):(
                                            <p>{selectedItem.date_execution}</p>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>

        <div className="relative overflow-auto shadow-lg sm:rounded-lg">
        <table className="w-full text-sm text-gray-500 ">
            <caption className="p-5 text-lg font-semibold text-left bg-gray-100 rtl:text-right">
                <div className="inline-flex items-center gap-3">
                    <button onClick={() => setOpenModal(true)} className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border rounded-full bg-emerald-50 border-emerald-500 focus:shadow-outline hover:scale-105 hover:shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="transition ease-in-out stroke-1 stroke-emerald-700 size-5 hover:rotate-45 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    <button className="inline-flex items-center justify-center w-8 h-8 mr-2 transition-colors duration-150 border-none hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="stroke-gray-700 size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                        </svg>
                    </button>
                    <form className="">
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

                </tr>
            </thead>
            <tbody>
                {isLoading ? (
                    <tr>
                        <td>
                            <div class="mx-2 my-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                        <td>
                            <div class="m-2 w-auto h-4 bg-slate-200 animate-pulse"></div>
                        </td>
                    </tr>
                    ) : anomalis.data.map((anomali, index) => (
                    <tr key={anomali.id} onClick={() => detailItem(anomali)} className="bg-white border-b cursor-pointer dark:border-gray-600 dark:bg-[#1A262D] hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-300">
                            {anomalis.from + index}
                        </td>
                        <td className="py-2 dark:text-gray-400">
                            {anomali.titlename}
                        </td>
                        <td className="py-2 dark:text-gray-400">
                            {anomali.substation.name}
                        </td>
                        <td className="py-2 dark:text-gray-400">
                            {anomali.section.name}
                        </td>
                        <td className="px-4 py-2">
                            {anomali.type.name === "Major" ? (
                                <p className="flex justify-center py-0.5 font-semibold text-xs text-rose-800 bg-rose-100 rounded-[4px] dark:bg-transparent dark:border dark:border-rose-300 dark:text-rose-500">{anomali.type.name}</p>
                            ): (
                                <p className="flex justify-center py-0.5 font-semibold text-xs text-sky-800 bg-sky-100 rounded-[4px] dark:bg-transparent dark:border dark:border-sky-300 dark:text-sky-500">{anomali.type.name}</p>
                            )
                            }
                        </td>
                        <td className="py-2">
                            {anomali.user.name}
                        </td>
                        <td className="py-2">
                            {anomali.equipment.name}
                        </td>
                        <td className="py-2">
                            {anomali.bay.name}
                        </td>
                        <td className="py-2">
                            {anomali.date_find}
                        </td>
                        <td className="px-4 py-2">
                        {anomali.status.name === "Open" ? (
                            <p className="flex justify-center py-0.5 font-semibold text-xs text-emerald-700 bg-emerald-100 rounded-[4px] dark:bg-transparent dark:border dark:border-emerald-300 dark:text-emerald-500">{anomali.status.name}</p>
                        ) : anomali.status.name === "Close" ? (
                            <p className="flex justify-center py-0.5 font-semibold text-xs text-sky-800 bg-sky-100 rounded-[4px] dark:bg-transparent dark:border dark:border-sky-300 dark:text-sky-500">{anomali.status.name}</p>
                        ) : (
                            <p className="flex justify-center py-0.5 font-semibold text-xs text-rose-800 bg-rose-100 rounded-[4px] dark:bg-transparent dark:border dark:border-rose-300 dark:text-rose-500">{anomali.status.name}</p>
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
                    <option value={anomalis.total}>All</option>
                </select>
            </div>
        <Pagination links={anomalis.links}/>
        </div>
        <div className=""></div>
    </div>

        </DashboardLayout>
        </>
    );
}


