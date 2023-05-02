import { redirect } from "@remix-run/cloudflare"

export const loader = async ({ request }) => {
    throw redirect("/resetpassword/request") // Default screen
}

export default function ResetPassword({ friends }) {
    return null
}
