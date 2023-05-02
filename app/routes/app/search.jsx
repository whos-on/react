import { json, redirect } from "@remix-run/cloudflare"
import { Form, Link, useFetcher, useOutletContext } from "@remix-run/react"
import { SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import BackgroundFiller from "~/components/app/BackgroundFiller"
import Header from "~/components/app/Header"
import ProfilePicture from "~/components/app/ProfilePicture"
import dbToAppUserMap from "~/utils/dbToAppUserMap"
import fromNow from "~/utils/fromNow"
import whoson from "~/utils/whoson"

export const meta = () => ({
    title: "Who's On - Search Chats",
})

export const action = async ({ request, params }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let searchData = await request.formData()
    let query = searchData.get("query")

    let { data, error } = await whoson.chat.search(request, query)
    if (error)
        return json(
            { data: null, error: error.message, float: Math.random() },
            { status: error.status }
        )

    let chats = []
    for await (let chat of data) {
        let { data: chatInfo, error: chatInfoError } = await whoson.chat.info(request, chat)
        if (chatInfoError)
            return json(
                { data: null, error: chatInfoError.message, float: Math.random() },
                { status: chatInfoError.status }
            )
        chats.push(chatInfo)
    }

    return json({ data: chats, error: null })
}

export default function Chats() {
    const fetcher = useFetcher()
    const { data, error: searchError } = fetcher?.data || {}
    const { user, location, friends, requests, chats, forceRefresh } = useOutletContext() || {}

    const [value, setValue] = useState("")
    const timeout = useRef(null)

    useEffect(() => {
        if (fetcher.state != "idle" || fetcher.data != null) return
        if (timeout.current) clearTimeout(timeout.current)
        if (!value) return
        timeout.current = setTimeout(() => {
            fetcher.submit({ query: value }, { method: "POST" })
        }, 1000)
    }, [value, fetcher])

    return (
        <>
            <Header title="Search Chats" back={true} />
            <Form className="flex flex-row" method="post">
                <input
                    className={`w-full rounded-lg border bg-gray-50 py-2 px-3 font-sans text-sm font-medium text-gray-900/90  focus:outline-none focus:ring-1 ${
                        false
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-primary focus:ring-primary"
                    }`}
                    placeholder="Search for chats..."
                    name="query"
                    onChange={e => {
                        setValue(e.target.value)
                    }}
                />
            </Form>
            {false && (
                <div className="mt-1 flex w-full flex-row text-center font-sans text-xs font-semibold text-red-500">
                    {searchError.toString()}
                </div>
            )}
            {!data?.length ? (
                <BackgroundFiller
                    text="We've searched far and wide and couldn't find what you were looking for. Try a different search query."
                    icon={SearchIcon}
                />
            ) : (
                <div className="mt-4 flex w-full flex-col space-y-4">
                    {data
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
