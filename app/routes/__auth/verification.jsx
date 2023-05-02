import { json, redirect } from "@remix-run/cloudflare"
import { useActionData, useLoaderData } from "@remix-run/react"
import { LockIcon } from "lucide-react"
import { useEffect, useState } from "react"
import AuthScreen from "~/components/auth/AuthScreen"
import AuthInput from "~/components/auth/AuthInput"
import AuthSubmitButton from "~/components/auth/AuthSubmitButton"
import whoson, { userCookie } from "~/utils/whoson"

export const loader = async ({ request }) => {
    // If user is not logged in, redirect to login
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    if (whoson.user.isVerified(user)) throw redirect("/app")

    return json({ user })
}

export const action = async ({ request }) => {
    // If user is not logged in, redirect to login
    let user = await whoson.user.current(request)
    if (!user) throw redirect("/login")

    // Grab form data and check that all fields are present
    const verificationForm = await request?.formData()
    const verificationCode = verificationForm.get("code") || null

    if (!verificationCode) return json({ message: "Invalid code provided" }, { status: 400 })

    // Attempt to verify
    let { error: verificationErr } = await whoson.user.verifyEmail(request, verificationCode)
    if (verificationErr)
        return json({ message: verificationErr.message }, { status: verificationErr.status })

    let { data: userRes, error: userErr } = await whoson.user.info(request, { id: user.id })
    if (userErr) return json({ message: userErr.message }, { status: userErr.status })

    // Redirect to app
    throw redirect("/app", {
        headers: {
            "Set-Cookie": await userCookie().serialize(userRes),
        },
    })
}

export default function Verification() {
    let { user } = useLoaderData() || {}
    let formError = useActionData()
    const [submitDisabled, setSubmitDisabled] = useState(false)

    useEffect(() => {
        if (formError) {
            setSubmitDisabled(true)
        }
    }, [formError])

    return (
        <AuthScreen
            title="Verify your email"
            altText={`We sent an email to ${user?.email}`}
            disableFooter>
            <AuthInput
                name="code"
                type="text"
                label="Verification Code*"
                icon={LockIcon}
                setSubmitDisabled={setSubmitDisabled}
            />
            <AuthSubmitButton disabled={submitDisabled}>
                {submitDisabled ? formError.message : "Continue"}
            </AuthSubmitButton>
        </AuthScreen>
    )
}
