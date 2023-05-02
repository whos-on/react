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
import { ChevronDownIcon, LogOutIcon, SettingsIcon } from "lucide-react"

const possbileStatuses = [
    { id: 1, name: "Available", color: "bg-green-500" },
    { id: 2, name: "Busy", color: "bg-yellow-500" },
    { id: 0, name: "Offline", color: "bg-gray-500" },
]

export const links = () => [{ rel: "stylesheet", href: mapboxStylesheet }]

export const loader = async ({ request }) => {
    // Check if user isn't logged in
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    if (!whoson.user.isVerified(user)) throw redirect("/verification")

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

    let { data: friends } = await whoson.friend.list(request)

    let pending = [],
        requests = []
    for await (let username of data.pending) {
        let { data } = (await whoson.user.info(request, { username })) || {}
        if (data) {
            // If the user hasn't updated their status in 2 minutes, consider them offline
            pending.push({ ...data, status: whoson.user.isOnline(data) ? data.status : 0 })
        }
    }
    for await (let username of data.requests) {
        let { data } = (await whoson.user.info(request, { username })) || {}
        if (data) {
            // If the user hasn't updated their status in 2 minutes, consider them offline
            requests.push({ ...data, status: whoson.user.isOnline(data) ? data.status : 0 })
        }
    }

    return json({ data: { ...data, friends, pending, requests } })
}

export default function WhosOnApp() {
    // Done for testing so we don't burn through our Mapbox API quota
    const disableMap = false
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
    const [statusSubMenuOpen, setStatusSubMenuOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    if (!user) throw new Error(`User is not logged in. (${user})`)

    useEffect(() => {
        // automatic update interval
        let updateInterval = null
        let handler = () => {
            updateInterval = setTimeout(handler, 1000 * 10) // 10 seconds
            if (!location[0] || !location[1]) return
            console.log(location)
            fetcher.submit({ status, long: location[0], lat: location[1] }, { method: "POST" })
        }

        handler()

        return () => clearTimeout(updateInterval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, location])

    useEffect(() => {
        // props update interval
        if (fetcher.state != "idle" || fetcher.data != null) return
        if (!location[0] || !location[1]) return
        console.log(location)
        fetcher.submit({ status, long: location[0], lat: location[1] }, { method: "POST" })
    }, [fetcher, status, location])

    useEffect(() => {
        if (refreshData && !refreshError) {
            setFriends(refreshData.friends)
            setPending(refreshData.pending)
            setRequests(refreshData.requests)
        }
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
                    {friends.map((friend, i) => {
                        friend = {
                            ...friend,
                            id: friend._id,
                            status: friend.stat.userStatus,
                            lastUpdated: friend.stat.lastUpdated,
                        }
                        if (!friend.location.latitude || !friend.location.longitude) return null
                        if (!whoson.user.isOnline(friend)) return null

                        return (
                            <Marker
                                key={i}
                                longitude={friend.location.longitude || -81.2001}
                                latitude={friend.location.latitude || 28.6024}>
                                <ProfilePicture
                                    user={friend}
                                    size="w-12"
                                    textSize="text-sm"
                                    className={`rounded-full border-4 border-opacity-50 shadow-sm ${
                                        friend.status == whoson.constants.statuses.AVAILABLE
                                            ? "border-green-500 shadow-green-500"
                                            : "border-amber-500 shadow-amber-500"
                                    }`}
                                />
                            </Marker>
                        )
                    })}
                    <Marker
                        longitude={location[0] || -81.2001}
                        latitude={location[1] || 28.6024}
                        style={{ zIndex: 20 }}>
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
                <NavigationBar user={user} status={status} setStatus={setStatus}>
                    <ProfilePicture
                        user={user}
                        size="w-7 h-7"
                        textSize="text-xs"
                        onClick={() => {
                            setMenuOpen(!menuOpen)
                        }}>
                        <div
                            className={`absolute top-full right-0 z-40 mt-3 ${
                                menuOpen ? "flex" : "hidden"
                            } w-screen max-w-sm translate-y-1 flex-col rounded-xl bg-gray-50 px-4 py-4 shadow-lg ring-1 ring-gray-700 ring-opacity-20`}>
                            <div className="flex flex-row px-2 py-2">
                                <ProfilePicture user={user} size="w-12 h-12" textSize="text-xl" />
                                <div className="ml-4 flex flex-col">
                                    <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p className="text-xs font-medium text-gray-900/50">
                                        @{user.username}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col">
                                <button
                                    className="flex w-full flex-row items-center rounded-full px-3 py-1.5 hover:bg-gray-100"
                                    onClick={() => {
                                        setStatusSubMenuOpen(!statusSubMenuOpen)
                                    }}>
                                    <div
                                        className={`${
                                            possbileStatuses.find(s => s.id == status).color
                                        } ml-0.5 aspect-square w-3 flex-shrink-0 flex-grow-0 rounded-full`}></div>
                                    <p className="ml-3.5 text-sm font-medium text-gray-900/80">
                                        Status: {possbileStatuses.find(s => s.id == status).name}
                                    </p>
                                    <ChevronDownIcon className="ml-auto w-4 text-gray-900/80" />
                                </button>
                                <div
                                    className={`mt-2 ${
                                        statusSubMenuOpen ? "flex" : "hidden"
                                    } flex-col space-y-2 border-y border-gray-900/5 py-2`}>
                                    {possbileStatuses.map(status => (
                                        <button
                                            key={status.id}
                                            className="flex w-full flex-row items-center rounded-full px-3 py-1.5 hover:bg-gray-100"
                                            onClick={() => {
                                                setStatus(status.id)
                                                setStatusSubMenuOpen(false)
                                            }}>
                                            <div
                                                className={`ml-0.5 aspect-square w-3 flex-shrink-0 flex-grow-0 rounded-full ${status.color}`}></div>
                                            <p className="ml-3.5 text-sm font-medium text-gray-900/80">
                                                {status.name}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button className="mt-2 flex w-full flex-row items-center rounded-full px-3 py-1.5 text-gray-900/80 hover:bg-gray-100">
                                <SettingsIcon className="w-4" />
                                <p className="ml-3 text-sm font-medium">Settings</p>
                            </button>
                            <button
                                className="mt-2 flex w-full flex-row items-center rounded-full px-3 py-1.5 text-gray-900/80 hover:bg-gray-100"
                                onClick={() => {
                                    window.location.href = "/logout"
                                }}>
                                <LogOutIcon className="w-4" />
                                <p className="ml-3 text-sm font-medium">Log Out</p>
                            </button>
                        </div>
                    </ProfilePicture>
                </NavigationBar>

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
