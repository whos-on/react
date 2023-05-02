import whoson from "~/utils/whoson"
import { FrownIcon, PlusIcon } from "lucide-react"
import { json, redirect } from "@remix-run/cloudflare"
import { useActionData, useFetcher, useOutletContext } from "@remix-run/react"
import Header from "~/components/app/Header"
import BackgroundFiller from "~/components/app/BackgroundFiller"
import { useEffect, useState } from "react"
import ProfilePicture from "~/components/app/ProfilePicture"

export const meta = () => ({
    title: "Who's On - Manage Friends",
})

export const action = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let friendData = await request.formData()
    let username = friendData.get("username")

    let { data, error } = await whoson.friend.remove(request, username)

    if (error)
        return json(
            { data: null, error: error.message, float: Math.random() },
            { status: error.status }
        )
    return json({ data, error: null })
}

export default function Friends() {
    const fetcher = useFetcher()
    let { data, error, float } = useActionData() || {}
    const { friends, forceRefresh } = useOutletContext() || {}
    const [removeError, setRemoveError] = useState(null)

    useEffect(() => {
        if (data) forceRefresh()
        else if (error) setRemoveError(error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error, float])

    return (
        <>
            <Header
                title={`Manage Friends (${friends.length})`}
                back={true}
                actions={[
                    {
                        icon: PlusIcon,
                        to: "/app/friends/add",
                    },
                ]}
            />
            {removeError && (
                <div className="mt-1 flex w-full flex-row text-center font-sans text-xs font-semibold text-red-500">
                    {removeError.toString()}
                </div>
            )}
            <div className="flex h-full w-full flex-col">
                {!friends?.length ? (
                    <BackgroundFiller text="Looks like you have no friends..." icon={FrownIcon} />
                ) : (
                    <div className="mt-4 flex flex-col space-y-4">
                        {friends.map((user, i) => (
                            <div key={i} className="group flex flex-row">
                                <ProfilePicture
                                    user={user}
                                    size="w-12 h-12"
                                    textSize="text-xl"
                                    showStatus
                                />
                                <div className="ml-4 flex flex-col">
                                    <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p className="text-xs font-medium text-gray-900/50">
                                        @{user.username}
                                    </p>
                                </div>
                                <div className="ml-auto flex flex-col opacity-0 group-hover:opacity-100">
                                    <button
                                        className="my-auto rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white"
                                        onClick={() => {
                                            fetcher.submit(
                                                { username: user.username },
                                                { method: "POST" }
                                            )
                                        }}>
                                        Remove
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
