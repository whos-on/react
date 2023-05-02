import { json, redirect } from "@remix-run/cloudflare"
import { Form, useLoaderData, useOutletContext, useActionData } from "@remix-run/react"
import Header from "~/components/app/Header"
import ProfilePicture from "~/components/app/ProfilePicture"
import whoson from "~/utils/whoson"

export const meta = () => ({
    title: "Who's On - Chat Settings",
})

export const loader = async ({ request, params }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    if (!whoson.user.isVerified(user)) throw redirect("/verification")

    let { id = null } = params
    if (!id) throw redirect("/app/chats")

    let { data: chatInfo, error: chatInfoError } = await whoson.chat.info(request, id)
    if (chatInfoError)
        return json(
            { data: null, error: chatInfoError.message, float: Math.random() },
            { status: chatInfoError.status }
        )

    return json({ user, chatInfo, error: null })
}

export const action = async ({ request, params }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let { id = null } = params
    if (!id) throw redirect("/app/chats")

    let { data, error } = await whoson.chat.leave(request, user.id, id)
    if (error)
        return json(
            { data: null, error: error.message, float: Math.random() },
            { status: error.status }
        )

    throw redirect("/app/chats")
}

export default function ChatSettings() {
    let { error: leaveChatError } = useActionData() || {}
    let { user, chatInfo, messages, error } = useLoaderData() || {}
    const { location, friends, requests, chats, forceRefresh } = useOutletContext() || {}

    return (
        <>
            <Header title="Chat Settings" back={`/app/chats/${chatInfo.id}`} />
            <div className="mt-4 flex h-full w-full flex-col space-y-4">
                <h2 className="font-sans text-xs font-semibold uppercase text-gray-900/80">
                    Members - {chatInfo.people.length}
                </h2>
                <div className="mt-4 flex flex-col space-y-4">
                    {chatInfo.people.map((person, i) => (
                        <div key={i} className="flex flex-row">
                            <ProfilePicture
                                user={person}
                                size="w-12 h-12"
                                textSize="text-xl"
                                showStatus
                            />
                            <div className="ml-4 flex flex-col">
                                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                                    {person.firstName} {person.lastName}
                                </h2>
                                <p className="text-xs font-medium text-gray-900/50">
                                    @{person.username}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <Form className="mt-auto flex w-full flex-row items-center pt-4">
                    <button
                        disabled={leaveChatError}
                        type="submit"
                        className={`ml-2 h-full w-full min-w-max rounded-lg bg-green-500 py-2 ${
                            !leaveChatError ? "opacity-100" : "opacity-50"
                        } px-3 font-sans text-xs font-semibold text-gray-50`}>
                        Leave Chat
                    </button>
                </Form> */}
            </div>
        </>
    )
}
