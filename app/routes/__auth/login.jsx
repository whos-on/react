import { json, redirect } from "@remix-run/cloudflare"
import { useActionData } from "@remix-run/react"
import { Key, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import AuthScreen from "~/components/auth/AuthScreen"
import AuthInput from "~/components/auth/AuthInput"
import AuthSubmitButton from "~/components/auth/AuthSubmitButton"
import whoson, { userCookie } from "~/utils/whoson"

export const loader = async ({ request }) => {
    // Check if user is already logged in and redirect to app
    if ((await whoson.user.current(request)) != null) return redirect("/app")

    return null
}

export const action = async ({ request }) => {
    // Check if user is already logged in and redirect to app
    if ((await whoson.user.current(request)) != null) return redirect("/app")

    // Grab form data and check that all fields are present
    const loginForm = await request?.formData()
    if (!loginForm) return json({ message: "Missing all required fields" }, { status: 400 })

    let loginJSON = {
        email: loginForm.get("email") || null,
        password: loginForm.get("password") || null,
    }

    // Dynamically generate error message
    let loginErrors = []
    if (!loginJSON.email) loginErrors.push("email")
    if (!loginJSON.password) loginErrors.push("password")
    if (loginErrors.length == 2) {
        return json({ message: `Missing ${loginErrors.join(" and ")}` }, { status: 400 })
    } else if (loginErrors.length == 1) {
        return json({ message: `Missing ${loginErrors[0]}` }, { status: 400 })
    }

    // Attempt to login
    let { data: loginReq, error: loginReqErr } = await whoson.user.login(loginJSON)
    if (loginReqErr) return json({ message: loginReqErr.message }, { status: loginReqErr.status })

    let { id: userID } = loginReq

    // Set cookie and redirect to app
    throw redirect("/app", {
        headers: {
            "Set-Cookie": await userCookie().serialize(userID),
        },
    })
}

export default function Login() {
    let formError = useActionData()
    const [submitDisabled, setSubmitDisabled] = useState(false)

    useEffect(() => {
        if (formError) {
            setSubmitDisabled(true)
        }
    }, [formError])

    return (
        <AuthScreen title="Log in to your account" altLink="/signup" altText="create a new account">
            <AuthInput
                name="email"
                type="email"
                label="Email*"
                icon={Mail}
                setSubmitDisabled={setSubmitDisabled}
            />
            <AuthInput
                name="password"
                type="password"
                label="Password*"
                icon={Key}
                setSubmitDisabled={setSubmitDisabled}
            />
            <AuthSubmitButton disabled={submitDisabled}>
                {submitDisabled ? formError.message : "Log in"}
            </AuthSubmitButton>
        </AuthScreen>
    )
}
