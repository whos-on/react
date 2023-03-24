import { createCookie } from "@remix-run/cloudflare"

const apiError = (req, msg) => {
    return {
        data: null,
        error: new Error(msg),
        status: req?.status || 500
    }
}

const apiSuccess = (req, data) => {
    return {
        data,
        error: null,
        status: req?.status || 200
    }
}

export const userCookie = () => createCookie("wo_uid", {
    maxAge: 604800,
    path: "/",
    sameSite: "lax",
    secure: global.env.WORKER_ENV == "production",
    httpOnly: true
})

export default {
    user: {
        register: async ({ email, password, username, firstName, lastName }) => {
            let req = await fetch(new URL("/api/user/register/", global.env.WHOSON_API_URL).href, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    firstName,
                    lastName,
                }),
            })

            if (req.status >= 500)
                return apiError(req, "Server error")
            else if (req.status == 400)
                return apiError(req, "User already exists")
            else if (req.status == 201)
                return apiSuccess(req, null)
            else
                return apiError(req, "Unknown error")
        },

        login: async ({ email, password }) => {
            let req = await fetch(new URL("/api/user/login/", global.env.WHOSON_API_URL).href, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (req.status >= 500)
                return apiError(req, "Server error")
            else if (req.status == 400)
                return apiError(req, "Missing email or password")
            else if (req.status >= 401)
                return apiError(req, "Invalid email or password")
            else if (req.status == 200)
                return apiSuccess(req, await req.json())
            else
                return apiError(req, "Unknown error")
        },

        current: async (req) => {
            const cookieHeader = req.headers.get("Cookie")
            if (!cookieHeader) return null
            let res = await userCookie().parse(cookieHeader)
            console.log(res)
            return (res) || null
        }
    }
}
