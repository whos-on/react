import { json, redirect } from "@remix-run/cloudflare"
import { useActionData } from "@remix-run/react"
import { Key, Mail, Smile, User } from "lucide-react"
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
    const signupForm = await request?.formData()
    if (!signupForm) return json({ message: "Missing all required fields" }, { status: 400 })

    let signupPayload = {
        firstName: signupForm.get("first_name") || null,
        lastName: signupForm.get("last_name") || null,
        username: signupForm.get("username") || null,
        email: signupForm.get("email") || null,
        password: signupForm.get("password") || null,
    }

    // Dynamically generate error message
    let signupFormErrors = []
    if (!signupPayload.firstName) signupFormErrors.push("first name")
    if (!signupPayload.lastName) signupFormErrors.push("last name")
    if (!signupPayload.username) signupFormErrors.push("username")
    if (!signupPayload.email) signupFormErrors.push("email")
    if (!signupPayload.password) signupFormErrors.push("password")
    if (signupFormErrors.length >= 3) {
        let last = signupFormErrors.pop()
        return json(
            { message: `Missing ${signupFormErrors.join(", ")} and ${last}` },
            { status: 400 }
        )
    } else if (signupFormErrors.length == 2) {
        return json({ message: `Missing ${signupFormErrors.join(" and ")}` }, { status: 400 })
    } else if (signupFormErrors.length == 1) {
        return json({ message: `Missing ${signupFormErrors[0]}` }, { status: 400 })
    }

    // Attempt to register
    let { error: signupErr } = await whoson.user.register(signupPayload)
    if (signupErr) return json({ message: signupErr.message }, { status: signupErr.status })

    // Login now
    let { data: loginRes, error: loginErr } = await whoson.user.login(signupPayload)
    if (loginErr) return json({ message: loginErr.message }, { status: loginErr.status })

    // Set cookie and redirect to app
    throw redirect("/app", {
        headers: {
            "Set-Cookie": await userCookie().serialize(loginRes),
        },
    })
}

export default function Signup() {
    let formError = useActionData()
    const [submitDisabled, setSubmitDisabled] = useState(false)

    useEffect(() => {
        if (formError) setSubmitDisabled(true)
    }, [formError])

    return (
        <AuthScreen title="Create a new account" altLink="/login" altText="log into your account">
            <div className="flex w-full flex-row space-x-4">
                <AuthInput
                    name="first_name"
                    type="text"
                    label="First Name*"
                    icon={User}
                    setSubmitDisabled={setSubmitDisabled}
                />
                <AuthInput
                    name="last_name"
                    type="text"
                    label="Last Name*"
                    icon={User}
                    setSubmitDisabled={setSubmitDisabled}
                />
            </div>
            <AuthInput
                name="username"
                type="text"
                label="Username*"
                icon={Smile}
                setSubmitDisabled={setSubmitDisabled}
            />
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
                {submitDisabled ? formError.message : "Sign up"}
            </AuthSubmitButton>
        </AuthScreen>
    )
}
