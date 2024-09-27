import React from 'react';
import { Transition } from '@headlessui/react';
import { HiX } from 'react-icons/hi';

const Modal2 = ({ isOpen, onClose, title, children }) => {
    return (
        <Transition
            show={isOpen}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center bg-gray-500 bg-opacity-70 backdrop-blur-sm">
                <Transition
                    show={isOpen}
                    enter="transform transition-transform duration-300"
                    enterFrom="scale-95"
                    enterTo="scale-100"
                    leave="transform transition-transform duration-300"
                    leaveFrom="scale-100"
                    leaveTo="scale-95"
                >
                    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
                        <div className="flex items-center justify-between mb-6 ">
                            <h2 className="text-xl font-semibold">{title}</h2>
                                <button className="p-2 rounded-lg hover:bg-gray-100" onClick={onClose}>
                                    <HiX/>
                                </button>
                        </div>
                        <div>{children}</div>
                    </div>
                </Transition>
            </div>
        </Transition>
    );
};

export default Modal2;
