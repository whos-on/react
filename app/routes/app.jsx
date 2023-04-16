import { redirect } from "@remix-run/cloudflare"
import whoson, { userCookie } from "~/utils/whoson"

export const loader = async ({ request }) => {
    // Check if user isn't logged in
    if (!(await whoson.user.current(request))) throw redirect("/login")

    return null
}

export default function WhosOnApp() {
    return (
        <button
            onClick={() => {
                window.location.href = "/logout"
            }}>
            Log out
        </button>
    )
}
