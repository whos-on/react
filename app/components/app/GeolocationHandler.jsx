import { useEffect, useRef } from "react"
import { useMap } from "react-map-gl"

export default function GeolocationHandler({ setLocation }) {
    const map = useMap()

    const loc = useRef([null, null])

    const options = {
        enableHighAccuracy: false,
        timeout: 5000,
    }

    useEffect(() => {
        setLocation(loc.current)
        let interval = setInterval(() => {
            setLocation(loc.current)
        }, 2000)

        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let firstGeoUpdate = true

        let geo = navigator.geolocation.watchPosition(handleUpdate, handleError, options)

        function handleUpdate(pos) {
            let { latitude: lat, longitude: long } = pos?.coords || {}
            if (firstGeoUpdate) {
                firstGeoUpdate = false
                map.current.flyTo({
                    center: [long, lat],
                    zoom: 16,
                    speed: 0.7,
                    curve: 1,
                })
            }
            loc.current = [long, lat]
        }

        async function handleError(err) {
            console.error(err)
        }

        return () => navigator.geolocation.clearWatch(geo)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null // Just acts as a service
}
