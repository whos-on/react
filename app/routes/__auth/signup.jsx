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
    if ((await whoson.user.current(request)) != null) return redirect("/app")

    return null
}

export const action = async ({ request }) => {
    // Check if user is already logged in and redirect to app
    if ((await whoson.user.current(request)) != null) return redirect("/app")

    // Grab form data and check that all fields are present
    const signupForm = await request?.formData()
    if (!signupForm) return json({ message: "Missing all required fields" }, { status: 400 })

    let signupJSON = {
        firstName: signupForm.get("first_name") || null,
        lastName: signupForm.get("last_name") || null,
        username: signupForm.get("username") || null,
        email: signupForm.get("email") || null,
        password: signupForm.get("password") || null,
    }

    // Dynamically generate error message
    let signupErrors = []
    if (!signupJSON.firstName) signupErrors.push("first name")
    if (!signupJSON.lastName) signupErrors.push("last name")
    if (!signupJSON.username) signupErrors.push("username")
    if (!signupJSON.email) signupErrors.push("email")
    if (!signupJSON.password) signupErrors.push("password")
    if (signupErrors.length >= 3) {
        let last = signupErrors.pop()
        return json({ message: `Missing ${signupErrors.join(", ")} and ${last}` }, { status: 400 })
    } else if (signupErrors.length == 2) {
        return json({ message: `Missing ${signupErrors.join(" and ")}` }, { status: 400 })
    } else if (signupErrors.length == 1) {
        return json({ message: `Missing ${signupErrors[0]}` }, { status: 400 })
    }

    // Attempt to register
    let { error: signupReqErr } = await whoson.user.register(signupJSON)
    if (signupReqErr)
        return json({ message: signupReqErr.message }, { status: signupReqErr.status })

    // Login now
    let { data: loginReq, error: loginReqErr } = await whoson.user.login(signupJSON)
    if (loginReqErr) return json({ message: loginReqErr.message }, { status: loginReqErr.status })

    let { id: userID } = loginReq

    // Set cookie and redirect to app
    throw redirect("/app", {
        headers: {
            "Set-Cookie": await userCookie().serialize(userID),
        },
    })
}

export default function Signup() {
    let formError = useActionData()
    const [submitDisabled, setSubmitDisabled] = useState(false)

    useEffect(() => {
        if (formError) {
            console.log(formError)
            setSubmitDisabled(true)
        }
    }, [formError])

    return (
        <AuthScreen title="Create a new account" altLink="/login" altText="log into your account">
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
