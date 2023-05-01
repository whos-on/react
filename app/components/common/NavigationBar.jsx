export default function NavigationBar({ user, status, setStatus, children, className, ...props }) {
    return (
        <nav
            className={`pointer-events-auto z-40 mx-5 my-3 flex flex-row items-center justify-between rounded-full bg-gray-50 py-2 px-6 shadow-lg ring-1 ring-gray-700 ring-opacity-20 ${className}`}
            {...props}>
            <a href="/">
                <img
                    className="mx-auto my-2 h-4 w-auto"
                    src="/images/wo_logo_green_nobg_653x100.svg"
                    alt="logo"
                />
            </a>
            {children}
        </nav>
    )
}
