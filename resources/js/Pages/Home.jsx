import { Link, Head } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Home ({auth}) {
    return (
        <>
        <Head title="Home" />
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[url('https://pagedone.io/asset/uploads/1691055810.png')] bg-center bg-cover">
            <div className="relative px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
            <ApplicationLogo className="h-16 max-w-sm mx-auto mb-4"></ApplicationLogo>
                <h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-900 mb-5 md:text-5xl leading-[50px]">
                Control anomalies with reporting <span className="text-indigo-600">Smart Tool</span>
                </h1>
                <p className="max-w-sm mx-auto text-base font-normal leading-7 text-center text-gray-500 mb-9">
                    Invest intelligently and discover a better way to manage your entire
                    wealth easily.
                </p>
                {auth.user ?
                (
                        <Link href={route('dashboard')} className="inline-flex items-center justify-center w-full py-3 text-base font-semibold text-center text-white transition-all duration-500 bg-indigo-600 rounded-full shadow-xs md:w-auto mb-14 px-7 hover:bg-indigo-700">
                        {auth.user.name}
                        </Link>
                ):(
                        <Link href={route('login')} className="inline-flex items-center justify-center w-full py-3 text-base font-semibold text-center text-white transition-all duration-500 bg-indigo-600 rounded-full shadow-xs md:w-auto mb-14 px-7 hover:bg-indigo-700">
                        Login account
                        <svg className="ml-2"width="20"height="20"viewBox="0 0 20 20"fill="none"xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </Link>
                )}
            </div>
        </div>
        </>
    );
}


