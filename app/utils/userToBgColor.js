/**
 * Converts a first/last name and id into a unique, deterministic HSL color
 * based on the first and last initials. Their unique permutation is
 * calculated, scaled into the hue range (0-360), and then converted to
 * HSL.
 *
 * @param {object} user - User object (serialized from database)
 */
export default function userToBgColor(user) {
    const f = user?.firstName?.[0]?.toLowerCase().charCodeAt(0)
    const l = user?.lastName?.[0]?.toLowerCase().charCodeAt(0)
    const id = parseInt(user?.id || NaN, 16) || 0 // ids = 12 byte hex strings
    const a = "a".charCodeAt(0)
    const z = "z".charCodeAt(0)

    if (!f || !l || !id) return "hsl(0,100%,40%)"

    const hueRangeMax = 360
    const b = z - a + 1                 // base
    const oldMin = z - a + 2            // lower bound (26)
    const oldMax = (z - a + 1) * b + b  // upper bound (702)

    // Get unique permutation using a 2-term polynomial
    let ret = (f - a + 1) * b + l - a + 1 - oldMin
    ret = Math.floor(ret * (hueRangeMax / (oldMax - oldMin))) // Clamp range
    // Use id's to offset hue, so that users with the same initials have
    // different colors (but still deterministic)
    ret -= Math.max(Math.min(Math.floor(Math.sin(id) * 100), hueRangeMax), 0)
    ret = (ret + 360) % 360 // Clamp again (in case of negative)

    return `hsl(${ ret },100%,40%)` // Just do hsl for CSS (no hsl->rgb->hex)
}
