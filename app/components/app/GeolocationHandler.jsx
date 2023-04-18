import { useEffect } from "react"
import { useMap } from "react-map-gl"

export default function GeolocationHandler({ setLocation }) {
    const map = useMap()

    useEffect(() => {
        let firstGeoUpdate = true
        let geo = navigator.geolocation.watchPosition(onUpdate, onError, {
            enableHighAccuracy: false,
            timeout: 5000,
        })

        function onUpdate(pos) {
            let { latitude: lat, longitude: long } = pos?.coords || {}
            if (firstGeoUpdate) {
                firstGeoUpdate = false
                map.current.jumpTo({
                    center: [long, lat],
                    zoom: 16,
                    speed: 0.5,
                    curve: 1,
                })
            }
            setLocation([long, lat])
        }

        async function onError(err) {
            console.error(err)
        }

        return () => navigator.geolocation.clearWatch(geo)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null // Just acts as a service
}
