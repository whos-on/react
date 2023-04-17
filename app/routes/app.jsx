import { redirect } from "@remix-run/cloudflare"
import NavigationBar from "~/components/common/NavigationBar"
import whoson from "~/utils/whoson"
import Map, { useMap } from "react-map-gl"
import Footer from "~/components/app/Footer"
import { useLoaderData } from "@remix-run/react"
import { useState } from "react"

export const loader = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    return { user }
}

export default function WhosOnApp() {
    const { user } = useLoaderData() || {}

    const [mapCursor, setMapCursor] = useState("auto")

    const map = useMap()

    if (!user) throw new Error(`User is not logged in. (${user})`)

    const MAPBOX_PUBLIC_ACCESS_TOKEN = (global || window)?.env?.MAPBOX_PUBLIC_ACCESS_TOKEN

    return (
        <div className="flex h-screen max-h-full min-h-full w-screen min-w-full max-w-full flex-shrink flex-grow overflow-hidden">
            <NavigationBar user={user} />
            {/* <button
                onClick={() => {
                    window.location.href = "/logout"
                }}>
                Log out
            </button> */}
            <div className="flex h-screen min-h-full w-screen min-w-full flex-shrink flex-grow">
                <Map
                    initialViewState={{
                        latitude: 28.6024,
                        longitude: -81.2001,
                        zoom: 16,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    mapboxAccessToken={MAPBOX_PUBLIC_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/skyclo/clgk1iq1w00nn01lcmk8g6i1i"
                    className="h-full min-h-full w-full min-w-full"
                    attributionControl={false}
                    onDragStart={() => {
                        setMapCursor("grabbing")
                    }}
                    onDragEnd={() => {
                        setMapCursor("auto")
                    }}
                    cursor={mapCursor}
                />
            </div>
            <Footer />
        </div>
    )
}
