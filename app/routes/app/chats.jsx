import { useOutletContext } from "@remix-run/react"
import { Frown } from "lucide-react"
import BackgroundFiller from "~/components/app/BackgroundFiller"
import Header from "~/components/app/Header"

export default function Chats() {
    const { friends, requests, forceRefresh } = useOutletContext() || {}

    return (
        <>
            <Header title="Chats" />
            {!friends?.length ? (
                <BackgroundFiller text="Looks like you have no friends..." icon={Frown} />
            ) : (
                <div className="flex flex-col space-y-4">{friends.map(friend => null)}</div>
            )}
        </>
    )
}
