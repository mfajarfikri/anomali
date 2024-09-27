export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex justify-center items-center px-3 py-2 text-sm font-semibold text-white bg-cyan-700 rounded-md shadow-sm hover:bg-cyan-500 tracking-widest focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
