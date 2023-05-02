import whoson from "~/utils/whoson"
import { SendIcon } from "lucide-react"
import { json, redirect } from "@remix-run/cloudflare"
import { Form, useActionData, useLoaderData, useOutletContext } from "@remix-run/react"
import Header from "~/components/app/Header"
import { useEffect, useState } from "react"
import ProfilePicture from "~/components/app/ProfilePicture"
import fromNow from "~/utils/fromNow"
import dbToAppUserMap from "~/utils/dbToAppUserMap"

export const meta = () => ({
    title: "Who's On - Chat",
})

export const loader = async ({ request, params }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    if (!whoson.user.isVerified(user)) throw redirect("/verification")

    let { id = null } = params
    if (!id) throw redirect("/app/chats")

    let { data: messages, error: messageError } = await whoson.chat.getMessages(request, id)
    if (messageError)
        return json(
            { data: null, error: messageError.message, float: Math.random() },
            { status: messageError.status }
        )

    let { data: chatInfo, error: chatInfoError } = await whoson.chat.info(request, id)
    if (chatInfoError)
        return json(
            { data: null, error: chatInfoError.message, float: Math.random() },
            { status: chatInfoError.status }
        )

    return json({ user, chatInfo, messages, error: null })
}

export const action = async ({ request, params }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let { id = null } = params
    if (!id) throw redirect("/app/chats")

    let chatData = await request.formData()
    let message = chatData.get("message")

    let { data, error } = await whoson.chat.send(request, id, message)
    if (error)
        return json(
            { data: null, error: error.message, float: Math.random() },
            { status: error.status }
        )

    return json({ data, error: null })
}

export default function NewChat() {
    // float used because I'm too lazy to properly implement a refresh of props
    let { user, chatInfo, messages, error } = useLoaderData() || {}
    let { s } = useActionData() || {}
    const { pending, forceRefresh } = useOutletContext() || {}
    const [newChatError, setNewChatError] = useState(null)
    const [message, setMessage] = useState("")
    const [chatTitle, setChatTitle] = useState("")

    useEffect(() => {
        if (error) setNewChatError(error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    useEffect(() => {
        setChatTitle(
            (() => {
                if (!chatInfo) return "Loading..."
                let list = chatInfo.people.filter(p => p._id != user.id)

                console.log(list)

                if (list.length == 0) return "You"
                else if (list.length == 1) return `${list[0].firstName} ${list[0].lastName}`

                let last = list.pop()
                return `${list.map(p => `${p.firstName} ${p.lastName}`).join(", ")} and ${
                    last.firstName
                } ${last.lastName}`
            })()
        )
    }, [chatInfo, user.id])

    return (
        <div className="flex h-full w-full flex-col">
            <Header title={chatTitle} back={true} />
            <Form className="flex h-full w-full flex-col" method="post">
                {newChatError && (
                    <div className="mt-1 flex w-full flex-row text-center font-sans text-xs font-semibold text-red-500">
                        {newChatError.toString()}
                    </div>
                )}
                <div className="flex h-full flex-col space-y-1 overflow-y-scroll">
                    {messages.map((message, i) => {
                        let dt = new Date(message.timestamp)
                        let time = `${dt.getHours() % 12}:${dt
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")} ${dt.getHours() > 12 ? "PM" : "AM"}`

                        return (
                            <div
                                key={i}
                                className={`group flex w-full flex-col ${
                                    message.sender == user.username
                                        ? "items-end pl-4"
                                        : "items-start pr-4"
                                }`}>
                                <div
                                    className={`flex flex-row items-center space-x-2 ${
                                        message.sender == user.username ? "flex-row-reverse" : ""
                                    }`}>
                                    <ProfilePicture
                                        className={`${
                                            message.sender == user.username ? "ml-2" : "mr-2"
                                        }`}
                                        user={
                                            chatInfo.people
                                                .map(dbToAppUserMap)
                                                .filter(p => p.username == message.sender)[0]
                                        }
                                    />
                                    <div
                                        className={`flex flex-col rounded-xl py-2 px-3 font-sans text-sm font-medium ${
                                            message.sender == user.username
                                                ? "bg-green-500 text-gray-50"
                                                : "bg-gray-200 text-gray-900/80"
                                        }`}>
                                        {message.contents}
                                    </div>
                                    <div className="flex flex-col font-sans text-xs text-gray-500/50 opacity-0 group-hover:opacity-100">
                                        {time}
                                    </div>
                                </div>
                                {i == messages.length - 1 && (
                                    <div
                                        className={`mx-auto mt-1 flex flex-row text-center font-sans text-xs font-normal text-gray-500/50`}>
                                        {fromNow(message.timestamp)}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="mt-auto flex flex-row items-center pt-4">
                    <input
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 font-sans text-sm font-medium  text-gray-900/90 focus:border-primary
                                focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Start typing..."
                        name="message"
                        value={message}
                        onChange={e => {
                            setMessage(e.target.value)
                            setNewChatError(null)
                        }}
                    />
                    <button
                        disabled={!message || error}
                        type="submit"
                        className={`ml-2 h-full min-w-max rounded-lg bg-green-500 ${
                            message && !error ? "opacity-100" : "opacity-50"
                        } px-3 font-sans text-xs font-semibold text-gray-50`}>
                        <SendIcon className="my-auto h-4 w-4 stroke-2 text-gray-50" />
                    </button>
                </div>
            </Form>
        </div>
    )
}
