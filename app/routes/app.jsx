import { redirect } from "@remix-run/cloudflare"
import NavigationBar from "~/components/common/NavigationBar"
import whoson from "~/utils/whoson"
import Map from "react-map-gl"
import Footer from "~/components/app/Footer"

export const loader = async ({ request }) => {
    // Check if user isn't logged in
    if (!(await whoson.user.current(request))) throw redirect("/login")

    return null
}

export default function WhosOnApp() {
    const MAPBOX_PUBLIC_ACCESS_TOKEN = (global || window)?.env?.MAPBOX_PUBLIC_ACCESS_TOKEN

    return (
        <div className="h-screen max-h-full min-h-full w-screen min-w-full max-w-full overflow-hidden">
            <NavigationBar />
            {/* <button
                onClick={() => {
                    window.location.href = "/logout"
                }}>
                Log out
            </button> */}
            <div className="h-full min-h-full w-full min-w-full">
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
                />
            </div>
            <Footer />
        </div>
    )
}
