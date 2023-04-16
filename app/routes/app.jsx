import whoson, { userCookie } from "~/utils/whoson"

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
