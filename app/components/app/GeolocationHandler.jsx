import { useEffect, useState } from "react"
import { useMap } from "react-map-gl"

const options = {
    enableHighAccuracy: false,
    timeout: 5000,
}

export default function GeolocationHandler({ setLocation }) {
    const map = useMap()

    const [l, setL] = useState([null, null])
    const [oldUpdateTime, setOldUpdateTime] = useState(0)

    useEffect(() => {
        if (Date.now() - oldUpdateTime < 1000 * 6) return
        setLocation(l)
        setOldUpdateTime(Date.now())
    }, [l, oldUpdateTime, setLocation])

    useEffect(() => {
        let firstGeoUpdate = true

        navigator.geolocation.getCurrentPosition(handleUpdate, handleError, options)

        let geo = navigator.geolocation.watchPosition(handleUpdate, handleError, options)

        function handleUpdate(pos) {
            let { latitude: lat, longitude: long } = pos?.coords || {}
            if (firstGeoUpdate) {
                firstGeoUpdate = false
                setLocation([long, lat])
                map.current.flyTo({
                    center: [long, lat],
                    zoom: 16,
                    speed: 0.7,
                    curve: 1,
                })
            }
            setL([long, lat])
        }

        async function handleError(err) {
            console.error(err)
        }

        return () => navigator.geolocation.clearWatch(geo)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null // Just acts as a service
}
