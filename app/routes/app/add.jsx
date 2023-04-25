import whoson from "~/utils/whoson"
import { HandIcon } from "lucide-react"
import { json, redirect } from "@remix-run/cloudflare"
import { Form, useActionData, useOutletContext } from "@remix-run/react"
import Header from "~/components/app/Header"
import InlineInput from "~/components/app/InlineInput"
import BackgroundFiller from "~/components/app/BackgroundFiller"
import { useEffect, useState } from "react"
import ProfilePicture from "~/components/app/ProfilePicture"

export const action = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let friendData = await request.formData()
    let username = friendData.get("username")

    let { data, error } = await whoson.friend.add(request, username)
    if (error)
        return json(
            { data: null, error: error.message, float: Math.random() },
            { status: error.status }
        )
    return json({ data, error: null })
}

export default function Friends() {
    // float used because I'm too lazy to properly implement a refresh of props
    let { data, error, float } = useActionData() || {}
    const { pending, forceRefresh } = useOutletContext() || {}
    const [addError, setAddError] = useState(null)

    useEffect(() => {
        console.log(error, addError)
        if (data) forceRefresh()
        else if (error) setAddError(error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error, float])

    return (
        <>
            <Header title="Add Friend" back={true} />
            <Form className="mt-4 flex flex-row" method="post">
                <InlineInput
                    name="username"
                    placeholder="Username"
                    action="Send Friend Request"
                    error={!!addError}
                    onChange={() => {
                        setAddError(null)
                    }}
                />
            </Form>
            {addError && (
                <div className="mt-1 flex w-full flex-row text-center font-sans text-xs font-semibold text-red-500">
                    {addError.toString()}
                </div>
            )}
            <div className="mt-4 flex h-full w-full flex-col border-t border-t-gray-900/5 pt-4">
                <h2 className="font-sans text-xs font-semibold uppercase text-gray-900/80">
                    Pending Requests - {pending.length}
                </h2>
                {!pending?.length ? (
                    <BackgroundFiller
                        text="Try sending a friend request to someone!"
                        icon={HandIcon}
                    />
                ) : (
                    <div className="mt-4 flex flex-col space-y-4">
                        {pending.map((user, i) => (
                            <div key={i} className="flex flex-row">
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
