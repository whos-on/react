import whoson from "~/utils/whoson"
import { ArrowRightIcon, Frown, PlusIcon, SearchIcon, UserPlusIcon } from "lucide-react"
import { json, redirect } from "@remix-run/cloudflare"
import { Form, useFetcher } from "@remix-run/react"

export const action = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let friendData = await request.formData()
    let username = friendData.get("username")

    return json({ ...(await whoson.friend.add(request, username)) })
}

export default function Friends({ friends }) {
    const fetcher = useFetcher()
    const { data: friendData, error: friendError } = fetcher?.data || {}

    return (
        <>
            <div className="flex flex-row">
                <h1 className="text-left font-sans text-2xl font-extrabold tracking-tight">
                    Friends
                </h1>
                <button className="my-auto ml-auto p-1" onClick={() => {}}>
                    <PlusIcon className="h-4 w-4 stroke-2 text-gray-900/80" />
                </button>
                <button className="my-auto ml-2 p-1" onClick={() => {}}>
                    <UserPlusIcon className="h-4 w-4 stroke-2 text-gray-900/80" />
                </button>
                <button
                    className="my-auto ml-2 p-1"
                    onClick={() => {
                        // Search for friends
                        fetcher.submit({ username: "test" }, { method: "POST" })
                    }}>
                    <SearchIcon className="h-4 w-4 stroke-2 text-gray-900/80" />
                </button>
            </div>
            <Form className="mt-2 flex flex-row" method="post">
                <input
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 font-sans text-sm font-medium text-gray-900/90 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Username"
                    name="username"
                />
                <button
                    type="submit"
                    className="ml-2 min-w-max rounded-lg bg-green-500 px-3 font-sans text-xs font-semibold text-gray-50">
                    Send Friend Request
                </button>
            </Form>
            {!friends ? (
                <div className="flex h-full w-full flex-col">
                    <div className="m-auto flex flex-col text-gray-900/20">
                        <Frown className="mx-auto mb-2 h-14 w-14" />
                        <p className="text-center font-sans text-sm font-medium">
                            Looks like you have no friends...
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col space-y-4">{friends.map(friend => null)}</div>
            )}
        </>
    )
}
