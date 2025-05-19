import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    function getClassName(active) {
        if (active) {
            return "flex items-center mx-1 justify-center px-2 sm:px-3 h-6 sm:h-8 text-xs sm:text-sm leading-tight text-gray-500 bg-slate-300 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600";
        } else {
            return "flex items-center justify-center px-2 sm:px-3 h-6 sm:h-8 text-xs sm:text-sm leading-tight text-gray-500 bg-transparent rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-slate-600";
        }
    }

    return (
        links?.length > 3 && (
            <div className="mx-2 sm:mx-4 mb-2">
                <div className="flex flex-wrap justify-center sm:justify-start mt-2">
                    {links.map((link, index) =>
                        link.url === null ? (
                            <Link
                                key={index}
                                className="flex items-center justify-center h-6 sm:h-8 px-2 sm:px-3 mx-1 text-xs sm:text-sm leading-tight text-gray-500 bg-transparent rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-slate-600"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <Link
                                key={index}
                                className={getClassName(link.active)}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    )}
                </div>
            </div>
        )
    );
}
