import { useEffect } from "react"
import { useMap } from "react-map-gl"

export default function GeolocationHandler({ setLocation }) {
    const map = useMap()

    const options = {
        enableHighAccuracy: false,
        timeout: 5000,
    }

    useEffect(() => {
        let firstGeoUpdate = true

        navigator.geolocation.getCurrentPosition(handleUpdate, handleError, options)

        let geo = navigator.geolocation.watchPosition(handleUpdate, handleError, options)

        function handleUpdate(pos) {
            let { latitude: lat, longitude: long } = pos?.coords || {}
            console.log(lat, long)
            if (firstGeoUpdate) {
                firstGeoUpdate = false
                map.current.flyTo({
                    center: [long, lat],
                    zoom: 16,
                    speed: 0.7,
                    curve: 1,
                })
            }
            setLocation([long, lat])
        }

        async function handleError(err) {
            console.error(err)
        }

        return () => navigator.geolocation.clearWatch(geo)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null // Just acts as a service
}
