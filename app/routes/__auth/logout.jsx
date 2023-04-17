import { redirect } from "@remix-run/cloudflare"
import whoson, { userCookie } from "~/utils/whoson"

const handler = async request => {
    // Check if user isn't logged in and redirect to index
    if (!(await whoson.user.current(request))) throw redirect("/login")

    throw redirect("/", {
        headers: {
            "Set-Cookie": await userCookie().serialize({}, { maxAge: -1 }),
        },
    })
}

export const loader = async ({ request }) => handler(request)
export const action = async ({ request }) => handler(request)
