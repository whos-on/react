import { ChevronDown, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import ProfilePicture from "~/components/app/ProfilePicture"

const possbileStatuses = [
    { id: 1, name: "Available", color: "bg-green-500" },
    { id: 2, name: "Busy", color: "bg-yellow-500" },
    { id: 0, name: "Offline", color: "bg-gray-500" },
]

export default function NavigationBar({ user, status, setStatus }) {
    const [statusSubMenuOpen, setStatusSubMenuOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <nav className="z-40 mx-5 my-3 flex flex-row items-center justify-between rounded-full bg-gray-50 py-2 px-6 shadow-lg ring-1 ring-gray-700 ring-opacity-20">
            <a href="/">
                <img
                    className="mx-auto my-2 h-4 w-auto"
                    src="/images/wo_logo_green_nobg_653x100.svg"
                    alt="logo"
                />
            </a>
            <ProfilePicture
                user={user}
                size="w-7 h-7"
                textSize="text-xs"
                onClick={() => {
                    setMenuOpen(!menuOpen)
                }}>
                <div
                    className={`absolute top-full right-0 z-40 mt-3 ${
                        menuOpen ? "flex" : "hidden"
                    } w-screen max-w-sm translate-y-1 flex-col rounded-xl bg-gray-50 px-4 py-4 shadow-lg ring-1 ring-gray-700 ring-opacity-20`}>
                    <div className="flex flex-row px-2 py-2">
                        <ProfilePicture user={user} size="w-12 h-12" textSize="text-xl" />
                        <div className="ml-4 flex flex-col">
                            <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-xs font-medium text-gray-900/50">@{user.username}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col">
                        <button
                            className="flex w-full flex-row items-center rounded-full px-3 py-1.5 hover:bg-gray-100"
                            onClick={() => {
                                setStatusSubMenuOpen(!statusSubMenuOpen)
                            }}>
                            <div
                                className={`${
                                    possbileStatuses.find(s => s.id == status).color
                                } ml-0.5 aspect-square w-3 flex-shrink-0 flex-grow-0 rounded-full`}></div>
                            <p className="ml-3.5 text-sm font-medium text-gray-900/80">
                                Status: {possbileStatuses.find(s => s.id == status).name}
                            </p>
                            <ChevronDown className="ml-auto w-4 text-gray-900/80" />
                        </button>
                        <div
                            className={`mt-2 ${
                                statusSubMenuOpen ? "flex" : "hidden"
                            } flex-col space-y-2 border-y border-gray-900/5 py-2`}>
                            {possbileStatuses.map(status => (
                                <button
                                    key={status.id}
                                    className="flex w-full flex-row items-center rounded-full px-3 py-1.5 hover:bg-gray-100"
                                    onClick={() => {
                                        setStatus(status.id)
                                        setStatusSubMenuOpen(false)
                                    }}>
                                    <div
                                        className={`ml-0.5 aspect-square w-3 flex-shrink-0 flex-grow-0 rounded-full ${status.color}`}></div>
                                    <p className="ml-3.5 text-sm font-medium text-gray-900/80">
                                        {status.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="mt-2 flex w-full flex-row items-center rounded-full px-3 py-1.5 text-gray-900/80 hover:bg-gray-100">
                        <Settings className="w-4" />
                        <p className="ml-3 text-sm font-medium">Settings</p>
                    </button>
                    <button
                        className="mt-2 flex w-full flex-row items-center rounded-full px-3 py-1.5 text-gray-900/80 hover:bg-gray-100"
                        onClick={() => {
                            window.location.href = "/logout"
                        }}>
                        <LogOut className="w-4" />
                        <p className="ml-3 text-sm font-medium">Log Out</p>
                    </button>
                </div>
            </ProfilePicture>
        </nav>
    )
}
