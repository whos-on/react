import { json, redirect } from "@remix-run/cloudflare"
import { useFetcher, useOutletContext } from "@remix-run/react"
import { SmileIcon } from "lucide-react"
import { useEffect } from "react"
import BackgroundFiller from "~/components/app/BackgroundFiller"
import Header from "~/components/app/Header"
import ProfilePicture from "~/components/app/ProfilePicture"
import whoson from "~/utils/whoson"

export const action = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let acceptDenyData = await request.formData()
    let username = acceptDenyData.get("username")
    let accept = acceptDenyData.get("accept")

    let { error } = await whoson.friend[accept ? "accept" : "deny"](request, username)
    if (error) return json({ data: null, error: error.message }, { status: error.status })

    // TODO: Create a new chat between the two users
    return json({ data: null, error: null })
}

export default function Requests() {
    const fetcher = useFetcher()
    const { data: incomingData, error: incomingError } = fetcher?.data || {}
    const { requests, forceRefresh } = useOutletContext() || {}

    useEffect(() => {
        forceRefresh()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incomingData, incomingError])

    return (
        <>
            <Header title="Requests" back />
            <div className="flex h-full w-full flex-col">
                <h2 className="font-sans text-xs font-semibold uppercase text-gray-900/80">
                    Incoming Requests - {requests.length}
                </h2>
                {!requests?.length ? (
                    <BackgroundFiller
                        text="You have no incoming friend requests!"
                        icon={SmileIcon}
                    />
                ) : (
                    <div className="mt-4 flex flex-col space-y-4">
                        {requests.map((user, i) => (
                            <div key={i} className="group flex flex-row">
                                <ProfilePicture user={user} size="w-12 h-12" textSize="text-xl">
                                    <div className="absolute left-0 bottom-0 box-content h-3 w-3 rounded-full border-t-2 border-r-2 border-gray-50 bg-green-500"></div>
                                </ProfilePicture>
                                <div className="ml-4 flex flex-col">
                                    <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p className="text-xs font-medium text-gray-900/50">
                                        @{user.username}
                                    </p>
                                </div>
                                <div className="ml-auto flex flex-row items-center space-x-2 opacity-0 group-hover:opacity-100">
                                    <button
                                        className="rounded-md bg-green-500 px-2 py-1 text-xs font-semibold text-white"
                                        onClick={() => {
                                            fetcher.submit(
                                                { username: user.username, accept: true },
                                                { method: "POST" }
                                            )
                                        }}>
                                        Accept
                                    </button>
                                    <button
                                        className="rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white"
                                        onClick={() => {
                                            fetcher.submit(
                                                { username: user.username, accept: false },
                                                { method: "POST" }
                                            )
                                        }}>
                                        Deny
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
