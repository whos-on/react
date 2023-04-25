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

    let { data, error } = await whoson.user.refresh(request, status, [long, lat])
    if (error) return json({ error })

    let pending = [],
        requests = []
    for await (let user of data.pending) {
        pending.push((await whoson.user.info(request, user))?.data)
    }
    for await (let user of data.requests) {
        requests.push((await whoson.user.info(request, user))?.data)
    }

    return json({ data: { ...data, pending, requests } })
}

export default function WhosOnApp() {
    // Done for testing so we don't burn through our Mapbox API quota
    const disableMap = true
    const { user } = useLoaderData() || {}
    const fetcher = useFetcher()
    const { data: refreshData, error: refreshError } = fetcher?.data || {}

    const [mapCursor, setMapCursor] = useState("auto")
    const [status, setStatus] = useState(1)
    const [location, setLocation] = useState([null, null])
    const [mapReady, setMapReady] = useState(false)
    const [friends, setFriends] = useState([])
    const [pending, setPending] = useState([])
    const [requests, setRequests] = useState([])

    if (!user) throw new Error(`User is not logged in. (${user})`)

    useEffect(() => {
        fetcher.submit({ status, long: location[0], lat: location[1] }, { method: "POST" })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, status])

    useEffect(() => {
        if (refreshData && !refreshError) {
            setFriends(refreshData.friends)
            setPending(refreshData.pending)
            setRequests(refreshData.requests)
        } else console.log(refreshError)
    }, [refreshData, refreshError])

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
                        <div className="flex flex-col space-y-1">
                            <ProfilePicture
                                user={user}
                                size="w-12"
                                textSize="text-sm"
                                className={`mx-auto rounded-full shadow-2xl ${
                                    status ? "opacity-100" : "opacity-50"
                                }`}
                            />
                            <div className="flex flex-row rounded-full bg-primary px-2 py-0.5 font-sans text-3xs font-extrabold uppercase tracking-wide text-gray-50">
                                You Are Here
                            </div>
                        </div>
                    </Marker>
                </Map>
            )}
            <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-40 flex max-h-screen max-w-full flex-col">
                <NavigationBar user={user} status={status} setStatus={setStatus} />

                <div className="pointer-events-auto mx-5 mb-3 flex h-full w-1/4 flex-col rounded-xl bg-gray-50 px-6 py-4 shadow-lg ring-1 ring-gray-700 ring-opacity-20">
                    <Outlet
                        context={{
                            friends,
                            pending,
                            requests,
                            forceRefresh: () => {
                                fetcher.submit(
                                    { status, long: location[0], lat: location[1] },
                                    { method: "POST" }
                                )
                            },
                        }}
                    />
                </div>
                <Footer />
            </div>
        </div>
    )
}
