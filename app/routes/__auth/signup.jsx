import { json, redirect } from "@remix-run/cloudflare"
import { Key, Mail, User } from "lucide-react"
import AuthScreen from "~/components/AuthScreen"
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
        email: signupForm.get("email") || null,
        password: signupForm.get("password") || null,
        firstName: signupForm.get("first_name") || null,
        lastName: signupForm.get("last_name") || null,
    }

    // Dynamically generate error message
    let signupErrors = []
    if (!signupJSON.email) signupErrors.push("email")
    if (!signupJSON.password) signupErrors.push("password")
    if (!signupJSON.firstName) signupErrors.push("first name")
    if (!signupJSON.lastName) signupErrors.push("last name")
    if (signupErrors.length >= 3) {
        let last = signupErrors.pop()
        return json({ message: `Missing ${signupErrors.join(", ")} and ${last}` }, { status: 400 })
    } else if (signupErrors.length == 2) {
        return json({ message: `Missing ${signupErrors.join(" and ")}` }, { status: 400 })
    } else if (signupErrors.length == 1) {
        return json({ message: `Missing ${signupErrors[0]}` }, { status: 400 })
    }

    // Generate username
    // TODO: Backend should generate this
    signupJSON.username =
        signupJSON.firstName.toLowerCase() +
        signupJSON.lastName.toLowerCase() +
        Math.floor(Math.random() * 1000)

    // Attempt to register
    let { error: signupReqErr } = await whoson.user.register(signupJSON)
    if (signupReqErr) return json({ message: signupReqErr.message }, { status: 400 })

    // Login now
    let { data: loginReq, error: loginReqErr } = await whoson.user.login(signupJSON)
    if (loginReqErr) return json({ message: loginReqErr.message }, { status: 400 })

    let { id: userID } = loginReq

    // Set cookie and redirect to app
    throw redirect("/app", {
        headers: {
            "Set-Cookie": await userCookie().serialize(userID),
        },
    })
}

export default function Signup() {
    return (
        <AuthScreen
            title="Create a new account"
            alt={{
                link: "/auth/login",
                text: "log into your account",
            }}
            formFields={[
                {
                    name: "first_name",
                    type: "text",
                    label: "First Name*",
                    icon: User,
                    validator: () => true,
                },
                {
                    name: "last_name",
                    type: "text",
                    label: "Last Name*",
                    icon: User,
                    validator: () => true,
                },
                {
                    name: "email",
                    type: "email",
                    label: "Email*",
                    icon: Mail,
                    validator: () => true,
                },
                {
                    name: "password",
                    type: "password",
                    label: "Password*",
                    icon: Key,
                    validator: () => true,
                },
            ]}
            submitText="Sign up"
        />
    )
}
