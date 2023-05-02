import { redirect } from "@remix-run/cloudflare"
import AuthScreen from "~/components/auth/AuthScreen"
import whoson from "~/utils/whoson"

export const loader = async ({ request }) => {
    // Check if user is already logged in and redirect to app
    if (await whoson.user.current(request)) return redirect("/app")

    return null
}

export default function ResetPasswordSuccess() {
    return (
        <AuthScreen
            title="Password Reset Complete"
            altText="You can now log in with your new password."
            disableFooter
        />
    )
}
