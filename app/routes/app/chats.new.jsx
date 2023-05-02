import whoson from "~/utils/whoson"
import { SendIcon } from "lucide-react"
import { json, redirect } from "@remix-run/cloudflare"
import { Form, useActionData, useOutletContext } from "@remix-run/react"
import Header from "~/components/app/Header"
import { useEffect, useState } from "react"

export const meta = () => ({
    title: "Who's On - New Chat",
})

export const action = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let chatData = await request.formData()
    let usernames = chatData.get("usernames")
    let message = chatData.get("message")

    let { data, error } = await whoson.chat.create(
        request,
        usernames.split(",").map(u => u.trim()),
        message
    )
    if (error)
        return json(
            { data: null, error: error.message, float: Math.random() },
            { status: error.status }
        )
    throw redirect("/app/chats/" + data.id)
}

export default function NewChat() {
    // float used because I'm too lazy to properly implement a refresh of props
    let { data, error, float } = useActionData() || {}
    const { pending, forceRefresh } = useOutletContext() || {}
    const [newChatError, setNewChatError] = useState(null)
    const [usernames, setUsernames] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (data) forceRefresh()
        else if (error) setNewChatError(error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error, float])

    return (
        <div className="flex h-full w-full flex-col">
            <Header title="New Chat" back={true} />
            <Form className="flex h-full w-full flex-col" method="post">
                <input
                    className={`w-full rounded-lg border bg-gray-50 py-2 px-3 font-sans text-sm font-medium text-gray-900/90  focus:outline-none focus:ring-1 ${
                        newChatError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-primary focus:ring-primary"
                    }}`}
                    placeholder="Usernames*"
                    name="usernames"
                    onChange={e => {
                        setUsernames(e.target.value)
                        setNewChatError(null)
                    }}
                />
                {newChatError && (
                    <div className="mt-1 flex w-full flex-row text-center font-sans text-xs font-semibold text-red-500">
                        {newChatError.toString()}
                    </div>
                )}
                <div className="flex h-full flex-col overflow-y-scroll"></div>
                <div className="mt-auto flex flex-row items-center pt-4">
                    <input
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 font-sans text-sm font-medium  text-gray-900/90 focus:border-primary
                                focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Start typing..."
                        name="message"
                        onChange={e => {
                            setMessage(e.target.value)
                            setNewChatError(null)
                        }}
                    />
                    <button
                        disabled={!usernames || !message || error}
                        type="submit"
                        className={`ml-2 h-full min-w-max rounded-lg bg-green-500 ${
                            usernames && message && !error ? "opacity-100" : "opacity-50"
                        } px-3 font-sans text-xs font-semibold text-gray-50`}>
                        <SendIcon className="my-auto h-4 w-4 stroke-2 text-gray-50" />
                    </button>
                </div>
            </Form>
        </div>
    )
}
