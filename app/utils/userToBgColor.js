/**
 * Converts a first and last name into a unique, deterministic HSL color
 * based on the first and last initials. Their unique permutation is
 * calculated, scaled into the hue range (0-360), and then converted to
 * HSL.
 *
 * @param {object} user - User object (serialized from database)
 */
export default function userToBgColor(user) {
    const f = user?.firstName?.[0]?.toLowerCase().charCodeAt(0)
    const l = user?.lastName?.[0]?.toLowerCase().charCodeAt(0)
    const a = "a".charCodeAt(0)
    const z = "z".charCodeAt(0)

    if (!f || !l) return "hsl(0,100%,50%)"

    const error = 16 // error correction
    const hueRangeMax = 360 + error
    const oldMin = a * (z - a + 1) + 1,
        oldMax = z * (z - a + 1) + z - a + 1

    let ret = null

    ret = f * (z - a + 1) + l - a + 1 - oldMin
    ret = Math.floor(ret * (hueRangeMax / (oldMax - oldMin)))
    ret %= hueRangeMax // Just in case
    return `hsl(${ ret },100%,50%)`
}
