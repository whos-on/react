import { json, redirect } from "@remix-run/cloudflare"
import NavigationBar from "~/components/common/NavigationBar"
import whoson from "~/utils/whoson"
import Map, { useMap } from "react-map-gl"
import Footer from "~/components/app/Footer"
import { Outlet, useActionData, useFetcher, useLoaderData } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"

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

    return json({ ...(await whoson.user.refresh(request, status, { lat, long })) })
}

export default function WhosOnApp() {
    // Done for testing so we don't burn through our Mapbox API quota
    const disableMap = false
    const { user } = useLoaderData() || {}
    const fetcher = useFetcher()
    const { data: refreshData } = fetcher?.data || {}

    const mapResize = useRef(null)

    const [mapCursor, setMapCursor] = useState("auto")
    const [status, setStatus] = useState(1)
    const [location, setLocation] = useState({
        lat: null,
        long: null,
    })

    const map = useMap()

    if (!user) throw new Error(`User is not logged in. (${user})`)

    useEffect(() => {
        if (mapResize.current) {
            clearInterval(mapResize.current)
        }
        mapResize.current = setInterval(() => {
            map?.current?.resize()
        }, 1000)

        return () => clearInterval(mapResize.current)
    }, [map])

    useEffect(() => {
        let geo = navigator.geolocation.watchPosition(onUpdate, onError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 5000,
        })

        function onUpdate(pos) {
            let { latitude: lat, longitude: long } = pos?.coords || {}
            setLocation({ lat, long })
        }

        async function onError(err) {
            console.error(err)
        }

        return () => navigator.geolocation.clearWatch(geo)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetcher.submit({ status, ...location }, { method: "POST" })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, status])

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
                <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-40 flex h-screen max-h-screen w-screen max-w-full flex-col">
                    <NavigationBar user={user} status={status} setStatus={setStatus} />

                    <div className="pointer-events-auto mx-5 mb-3 flex h-full w-1/4 flex-col rounded-xl bg-gray-50 px-6 py-4 shadow-lg ring-1 ring-gray-700 ring-opacity-20">
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    )
}
