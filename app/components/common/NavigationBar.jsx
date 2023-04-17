import userToBgColor from "~/utils/userToBgColor"

export default function NavigationBar({ user }) {
    return (
        <nav className="z-40 mx-5 my-3 flex flex-row items-center justify-between rounded-full bg-gray-50 py-2 px-6 shadow-lg ring-1 ring-gray-700 ring-opacity-20">
            <a href="/">
                <img
                    className="mx-auto my-2 h-4 w-auto"
                    src="/images/wo_logo_green_nobg_653x100.svg"
                    alt="logo"
                />
            </a>
            <div
                className="flex h-7 w-7 select-none rounded-full"
                style={{ backgroundColor: userToBgColor(user) }}>
                <div className="m-auto flex items-center text-center font-sans text-xs font-semibold text-gray-50">
                    {user?.firstName?.[0] + user?.lastName?.[0]}
                </div>
            </div>
        </nav>
    )
}
