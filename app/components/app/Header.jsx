import { Link } from "@remix-run/react"
import { ArrowLeftIcon, PlusIcon, SearchIcon, UserPlusIcon } from "lucide-react"

export default function Header({ title = "No title provided :(", back = false }) {
    return (
        <div className="flex flex-row">
            {back && (
                <Link className="my-auto mr-2 p-1" to="/app">
                    <ArrowLeftIcon className="h-4 w-4 stroke-2 text-gray-900/80" />
                </Link>
            )}
            <h1 className="text-left font-sans text-2xl font-extrabold tracking-tight">{title}</h1>
            {!back && (
                <>
                    <Link className="my-auto ml-auto p-1" to="/app/new">
                        <PlusIcon className="h-4 w-4 stroke-2 text-gray-900/80" />
                    </Link>
                    <Link className="my-auto ml-2 p-1" to="/app/add">
                        <UserPlusIcon className="h-4 w-4 stroke-2 text-gray-900/80" />
                    </Link>
                    <Link className="my-auto ml-2 p-1" to="/app/search">
                        <SearchIcon className="h-4 w-4 stroke-2 text-gray-900/80" />
                    </Link>
                </>
            )}
        </div>
    )
}
