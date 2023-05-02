import { Link, useOutletContext } from "@remix-run/react"
import { ArrowRightIcon, Frown, PlusIcon, SearchIcon, UsersIcon } from "lucide-react"
import BackgroundFiller from "~/components/app/BackgroundFiller"
import Header from "~/components/app/Header"
import ProfilePicture from "~/components/app/ProfilePicture"
import dbToAppUserMap from "~/utils/dbToAppUserMap"
import fromNow from "~/utils/fromNow"
import whoson from "~/utils/whoson"

export const meta = () => ({
    title: "Who's On - Chats",
})

export default function Chats() {
    const { user, location, friends, requests, chats, forceRefresh } = useOutletContext() || {}

    return (
        <>
            <Header
                title="Chats"
                actions={[
                    {
                        icon: PlusIcon,
                        to: "/app/chats/new",
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
            {!chats?.length ? (
                <BackgroundFiller text="Looks like you have no friends..." icon={Frown} />
            ) : (
                <div className="mt-4 flex w-full flex-col space-y-4">
                    {chats
                        ?.sort((_a, _b) => {
                            let a = _a.people.filter(p => p._id != user.id).map(dbToAppUserMap)
                            let b = _b.people.filter(p => p._id != user.id).map(dbToAppUserMap)

                            if (whoson.user.isOnline(a[0]) && !whoson.user.isOnline(b[0])) return -1
                            if (!whoson.user.isOnline(a[0]) && whoson.user.isOnline(b[0])) return 1

                            let ax = a[0].location.longitude
                            let ay = a[0].location.latitude
                            let bx = b[0].location.longitude
                            let by = b[0].location.latitude
                            let ux = location[0]
                            let uy = location[1]

                            let aDist = Math.sqrt(Math.pow(ux - ax, 2) + Math.pow(uy - ay, 2))
                            let bDist = Math.sqrt(Math.pow(ux - bx, 2) + Math.pow(uy - by, 2))

                            return aDist - bDist
                        })
                        .map(chat => {
                            let lastMessage = chat.messages[chat.messages.length - 1]
                            let firstUser = chat.people
                                .map(dbToAppUserMap)
                                .filter(p => p.id != user.id)[0]
                            const status = !whoson.user.isOnline(firstUser)
                                ? "Unavailable"
                                : firstUser?.status == whoson.constants.statuses.AVAILABLE
                                ? "Available"
                                : firstUser?.status == whoson.constants.statuses.BUSY
                                ? "Busy"
                                : "Unavailable"
                            return (
                                <Link
                                    key={chat.id}
                                    to={`/app/chats/${chat.id}`}
                                    className="flex w-full flex-row">
                                    <ProfilePicture
                                        user={firstUser}
                                        size="w-12 h-12"
                                        textSize="text-xl"
                                        showStatus={true}
                                    />
                                    <div className="ml-4 flex w-full flex-col">
                                        <div className="flex w-full flex-row">
                                            <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                                                {firstUser.firstName} {firstUser.lastName}
                                            </h2>
                                            <p className="my-auto ml-auto font-sans text-xs font-normal text-gray-900/50">
                                                {status}
                                            </p>
                                        </div>
                                        <p className="text-xs font-normal italic text-gray-900/70">
                                            {lastMessage.sender}: {lastMessage.contents} (
                                            {fromNow(lastMessage.timestamp)})
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                </div>
            )}
        </>
    )
}
