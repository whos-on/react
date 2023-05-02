import { Link, useOutletContext } from "@remix-run/react"
import { ArrowRightIcon, Frown, PlusIcon, SearchIcon, UsersIcon } from "lucide-react"
import BackgroundFiller from "~/components/app/BackgroundFiller"
import Header from "~/components/app/Header"

export const meta = () => ({
    title: "Who's On - Chats",
})

export default function Chats() {
    const { friends, requests, forceRefresh } = useOutletContext() || {}

    return (
        <>
            <Header
                title="Chats"
                actions={[
                    {
                        icon: PlusIcon,
                        to: "/app/new",
                    },
                    {
                        icon: UsersIcon,
                        to: "/app/friends",
                    },
                    {
                        icon: SearchIcon,
                        to: "/app/search",
                    },
                ]}
            />
            {!!requests?.length && (
                <Link
                    to="/app/requests"
                    className="flex w-full flex-row items-center rounded-full bg-primary/80 py-2 px-3 font-sans text-xs font-semibold text-gray-50">
                    <UsersIcon className="mr-2 h-4 w-4" />
                    <p>
                        You have {requests.length} new friend request{requests.length > 1 && "s"}!
                    </p>
                    <ArrowRightIcon className="ml-auto h-4 w-4" />
                </Link>
            )}
            {!friends?.length ? (
                <BackgroundFiller text="Looks like you have no friends..." icon={Frown} />
            ) : (
                <div className="flex flex-col space-y-4">{friends.map(friend => null)}</div>
            )}
        </>
    )
}
