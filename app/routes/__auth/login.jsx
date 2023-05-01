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
    if (await whoson.user.current(request)) return redirect("/app")

    return null
}

export const action = async ({ request }) => {
    // Check if user is already logged in and redirect to app
    if (await whoson.user.current(request)) return redirect("/app")

    // Grab form data and check that all fields are present
    const loginForm = await request?.formData()
    if (!loginForm) return json({ message: "Missing all required fields" }, { status: 400 })

    let loginPayload = {
        email: loginForm.get("email") || null,
        password: loginForm.get("password") || null,
    }

    // Dynamically generate error message
    let loginFormErrors = []
    if (!loginPayload.email) loginFormErrors.push("email")
    if (!loginPayload.password) loginFormErrors.push("password")
    if (loginFormErrors.length == 2) {
        return json({ message: `Missing ${loginFormErrors.join(" and ")}` }, { status: 400 })
    } else if (loginFormErrors.length == 1) {
        return json({ message: `Missing ${loginFormErrors[0]}` }, { status: 400 })
    }

    // Attempt to login
    let { data: loginRes, error: loginErr } = await whoson.user.login(loginPayload)
    if (loginErr) return json({ message: loginErr.message }, { status: loginErr.status })

    // Set cookie and redirect to app
    throw redirect("/app", {
        headers: {
            "Set-Cookie": await userCookie().serialize(loginRes),
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
