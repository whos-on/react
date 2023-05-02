import { Link } from "@remix-run/react"
import { ArrowLeftIcon } from "lucide-react"

export default function Header({ title = "No title provided :(", back = false, actions }) {
    return (
        <div className="mb-4 flex flex-row">
            {back && (
                <Link className="my-auto mr-2 p-1" to={typeof back == "string" ? back : "/app"}>
                    <ArrowLeftIcon className="h-4 w-4 stroke-2 text-gray-900/80" />
                </Link>
            )}
            <h1 className="text-left font-sans text-2xl font-extrabold tracking-tight">{title}</h1>
            <div className="ml-auto flex flex-row space-x-3">
                {actions?.map(({ icon: Icon, to }, i) => (
                    <Link key={i} className="group my-auto p-1" to={to}>
                        <Icon className="h-4 w-4 stroke-2 text-gray-900/70 group-hover:text-gray-900/100" />
                    </Link>
                ))}
            </div>
        </div>
    )
}
