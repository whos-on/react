import { redirect } from "@remix-run/cloudflare"
import NavigationBar from "~/components/common/NavigationBar"
import whoson from "~/utils/whoson"
import Map, { useMap } from "react-map-gl"
import Footer from "~/components/app/Footer"
import { Outlet, useLoaderData } from "@remix-run/react"
import { useState } from "react"

export const loader = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    return { user }
}

export default function WhosOnApp() {
    const disableMap = false // Done for testing so we don't burn through our Mapbox API quota
    const { user } = useLoaderData() || {}

    const [mapCursor, setMapCursor] = useState("auto")
    const [status, setStatus] = useState(1)
    const [location, setLocation] = useState({
        lat: 28.6024,
        long: -81.2001,
    })

    const map = useMap()

    if (!user) throw new Error(`User is not logged in. (${user})`)

    const MAPBOX_PUBLIC_ACCESS_TOKEN = (global || window)?.env?.MAPBOX_PUBLIC_ACCESS_TOKEN

    return (
        <div className="flex h-screen max-h-full min-h-full w-screen min-w-full max-w-full flex-shrink flex-grow overflow-hidden">
            <div className="flex h-screen min-h-full w-screen min-w-full flex-shrink flex-grow">
                {!disableMap && (
                    <Map
                        initialViewState={{
                            latitude: location.lat || 28.6024,
                            longitude: location.long || -81.2001,
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
                )}
                <div className="absolute top-0 left-0 right-0 bottom-0 z-40 flex h-screen max-h-screen w-screen max-w-full flex-col">
                    <NavigationBar user={user} status={status} setStatus={setStatus} />

                    <div className="mx-5 mb-3 flex h-full w-1/4 flex-col rounded-xl bg-gray-50 px-6 py-4 shadow-lg ring-1 ring-gray-700 ring-opacity-20 ">
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    )
}
