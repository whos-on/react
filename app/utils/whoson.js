import { createCookie } from "@remix-run/cloudflare"

const apiError = (req, msg) => {
    return {
        data: null,
        error: new Error(typeof msg === "string" ? msg : msg.error),
        status: req?.status || 500,
    }
}

const apiSuccess = (req, data) => {
    return {
        data,
        error: null,
        status: req?.status || 200,
    }
}

const url = (path, query) => {
    let url = new URL(path, global.env.WHOSON_API_URL)
    if (query) {
        for (let [key, value] of Object.entries(query)) {
            url?.searchParams?.append(key, value)
        }
    }
    return url?.href || null
}

//!: Bad practice... should use session cookies instead but too lazy tbh
export const userCookie = () =>
    createCookie("wo_uid", {
        maxAge: 604800,
        path: "/",
        sameSite: "lax",
        secure: global.env.WORKER_ENV == "production",
        httpOnly: true,
    })

const api = {
    constants: {
        HEADERS: {
            "Content-Type": "application/json",
        },
        statuses: {
            OFFLINE: 0,
            AVAILABLE: 1,
            BUSY: 2,
        }
    },
    user: {
        register: async ({ email, password, username, firstName, lastName }) => {
            let res = await fetch(url("/api/user/register/"), {
                method: "POST",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    firstName,
                    lastName,
                }),
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 201) return apiSuccess(res, null)
            else return apiError(res, "Unknown error")
        },

        login: async ({ email, password }) => {
            let res = await fetch(url("/api/user/login/"), {
                method: "POST",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 400) return apiError(res, "Missing email or password")
            else if (res.status >= 401) return apiError(res, "Invalid email or password")
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        current: async req => {
            const cookieHeader = req.headers.get("Cookie")
            if (!cookieHeader) return null
            let res = await userCookie().parse(cookieHeader)
            return res || null
        },

        refresh: async (req, status, [long, lat]) => {
            if (!status) return apiError(req, "Missing status")
            if (!lat || !long) return apiError(req, "Malformed location was passed")

            let user = await api.user.current(req)
            if (!user) return null

            let res = await fetch(url("/api/user/refresh/"), {
                method: "PUT",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    id: user.id,
                    userStatus: status,
                    location: { latitude: lat, longitude: long },
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 400) return apiError(res, "Missing user id")
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        info: async (req, { username = null, id = null }) => {
            if (!username && !id) return apiError(req, "Missing username or id")

            let body = {}
            if (username) body.username = username
            if (id) body.id = id

            let res = await fetch(url("/api/user/info/"), {
                method: "POST",
                headers: api.constants.HEADERS,
                body: JSON.stringify(body)
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        search: async (req, query) => {
            if (!query) return apiError(req, "Missing query")

            let res = await fetch(url("/api/user/search/"), {
                method: "POST",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    query,
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        isOnline: user => {
            if (!user) return apiError(null, "Missing user")
            return user.status != api.constants.statuses.OFFLINE && Date.now() - new Date(user.lastUpdated) <= 1000 * 60 * 2
        },

        isVerified: user => {
            if (!user) return apiError(null, "Missing user")
            return !user.verificationCode
        },

        verifyEmail: async (req, code) => {
            if (!code) return apiError(req, "Missing verification code")

            let user = await api.user.current(req)
            if (!user) return null

            let res = await fetch(url("/api/user/verify/"), {
                method: "POST",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    id: user.id,
                    code,
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 401) return apiError(res, await res.json())
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        sendResetPassword: async (req, email) => {
            if (!email) return apiError(req, "Missing email")

            let res = await fetch(url("/api/user/resetpassword/"), {
                method: "POST",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    email,
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        updatePassword: async (req, id, password) => {
            if (!password) return apiError(req, "Missing new password")

            let res = await fetch(url("/api/user/updatepassword/"), {
                method: "POST",
                headers: api.constants.HEADERS,
                body: JSON.stringify({ id, password })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        }
    },

    friend: {
        add: async (req, username) => {
            if (!username) return apiError(req, "Missing username")

            let user = await api.user.current(req)
            if (!user) return null

            let res = await fetch(url("/api/friend/addFriend/"), {
                method: "PUT",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    id: user.id,
                    search: username,
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 404) return apiError(res, "User not found")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        accept: async (req, username) => {
            if (!username) return apiError(req, "Missing username")

            let user = await api.user.current(req)
            if (!user) return null

            let res = await fetch(url("/api/friend/processRequest/"), {
                method: "PUT",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    id: user.id,
                    requester: username,
                    accept: 1,
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 404) return apiError(res, "User not found")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        deny: async (req, username) => {
            if (!username) return apiError(req, "Missing username")

            let user = await api.user.current(req)
            if (!user) return null

            let res = await fetch(url("/api/friend/processRequest/"), {
                method: "PUT",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    id: user.id,
                    requester: username,
                    accept: 0,
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 404) return apiError(res, "User not found")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        },

        list: async req => {
            let user = await api.user.current(req)
            if (!user) return null

            let res = await fetch(url("/api/friend/get/"), {
                method: "POST",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    id: user.id,
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, (await res.json())?.friends)
            else return apiError(res, "Unknown error")
        },

        remove: async (req, username) => {
            if (!username) return apiError(req, "Missing username")

            let user = await api.user.current(req)
            if (!user) return null

            let { data: removed, error: removedError } = await api.user.info(req, { username })

            if (removedError) return apiError(req, removedError)

            let res = await fetch(url("/api/friend/removeFriend/"), {
                method: "PUT",
                headers: api.constants.HEADERS,
                body: JSON.stringify({
                    id: user.id,
                    removed: removed.id,
                })
            })

            if (res.status >= 500) return apiError(res, "Server error")
            else if (res.status == 404) return apiError(res, "User not found")
            else if (res.status == 400) return apiError(res, await res.json())
            else if (res.status == 200) return apiSuccess(res, await res.json())
            else return apiError(res, "Unknown error")
        }
    },
}

export default api
