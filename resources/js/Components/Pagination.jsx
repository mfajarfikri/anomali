import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {

    function getClassName(active) {
        if(active) {
            return "flex items-center mx-1 justify-center px-3 h-8 leading-tight text-gray-500 bg-slate-300 rounded-md hover:bg-gray-100 hover:text-gray-700";
        } else{
            return "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white rounded-md hover:bg-gray-100 hover:text-gray-700";
        }
    }

    return (
        links.length > 3 && (
            <div className="mx-4 mb-2">
                <div className="flex flex-wrap mt-2">
                    {links.map((link, index) => (
                            link.url === null ?
                        (<Link key={index} className="flex items-center justify-center h-8 px-3 mx-1 leading-tight text-gray-500 bg-white rounded-md hover:bg-gray-100 hover:text-gray-700" dangerouslySetInnerHTML={{ __html:link.label }}/>)
                        :
                        (<Link key={index} className={getClassName(link.active)} href={ link.url } dangerouslySetInnerHTML={{ __html:link.label }}/>
                        )))}
                </div>
            </div>
        )
    );
}
