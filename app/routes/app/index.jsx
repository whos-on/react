import { redirect } from "@remix-run/cloudflare"

export const loader = async ({ request }) => {
    throw redirect("/app/chats") // Default screen
}

export default function AppIndex({ friends }) {
    return null
}
