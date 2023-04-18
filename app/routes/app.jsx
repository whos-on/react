import { json, redirect } from "@remix-run/cloudflare"
import NavigationBar from "~/components/common/NavigationBar"
import whoson from "~/utils/whoson"
import Map, { Marker, useMap } from "react-map-gl"
import Footer from "~/components/app/Footer"
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import ProfilePicture from "~/components/app/ProfilePicture"

import mapboxStylesheet from "mapbox-gl/dist/mapbox-gl.css"
import GeolocationHandler from "~/components/app/GeolocationHandler"

export const links = () => [{ rel: "stylesheet", href: mapboxStylesheet }]

export const loader = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    return json({ user })
}

export const action = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    let refreshData = await request.formData()
    let status = refreshData.get("status")
    let lat = refreshData.get("lat")
    let long = refreshData.get("long")

    return json({ ...(await whoson.user.refresh(request, status, [long, lat])) })
}

export default function WhosOnApp() {
    // Done for testing so we don't burn through our Mapbox API quota
    const disableMap = false
    const { user } = useLoaderData() || {}
    const fetcher = useFetcher()
    const { data: refreshData } = fetcher?.data || {}

    const [mapCursor, setMapCursor] = useState("auto")
    const [status, setStatus] = useState(1)
    const [location, setLocation] = useState([null, null])
    const [mapReady, setMapReady] = useState(false)

    if (!user) throw new Error(`User is not logged in. (${user})`)

    useEffect(() => {
        fetcher.submit({ status, long: location[0], lat: location[1] }, { method: "POST" })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, status])

    const MAPBOX_PUBLIC_ACCESS_TOKEN = (global || window)?.env?.MAPBOX_PUBLIC_ACCESS_TOKEN

    return (
        <div className="flex h-screen max-h-screen min-h-screen w-screen min-w-full max-w-full flex-shrink flex-grow overflow-hidden">
            {!disableMap && (
                <Map
                    initialViewState={{
                        longitude: location[0] || -81.2001,
                        latitude: location[1] || 28.6024,
                        zoom: 16,
                    }}
                    style={{ width: "100%", height: "inherit" }}
                    mapboxAccessToken={MAPBOX_PUBLIC_ACCESS_TOKEN}
                    mapStyle="mapbox://styles/skyclo/clgk1iq1w00nn01lcmk8g6i1i"
                    className="h-full min-h-full w-full min-w-full"
                    attributionControl={false}
                    onLoad={() => {
                        setMapReady(true)
                    }}
                    onDragStart={() => {
                        setMapCursor("grabbing")
                    }}
                    onDragEnd={() => {
                        setMapCursor("auto")
                    }}
                    cursor={mapCursor}>
                    <GeolocationHandler setLocation={setLocation} />
                    <Marker longitude={location[0] || -81.2001} latitude={location[1] || 28.6024}>
                        <div>
                            <ProfilePicture
                                user={user}
                                size="w-12"
                                textSize="text-sm"
                                className={`rounded-full shadow-2xl ${
                                    status ? "opacity-100" : "opacity-50"
                                }`}
                            />
                        </div>
                    </Marker>
                </Map>
            )}
            <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-40 flex max-h-screen max-w-full flex-col">
                <NavigationBar user={user} status={status} setStatus={setStatus} />

                <div className="pointer-events-auto mx-5 mb-3 flex h-full w-1/4 flex-col rounded-xl bg-gray-50 px-6 py-4 shadow-lg ring-1 ring-gray-700 ring-opacity-20">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    )
}
