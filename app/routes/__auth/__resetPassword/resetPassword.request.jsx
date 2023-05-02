import { json, redirect } from "@remix-run/cloudflare"
import { useActionData } from "@remix-run/react"
import { Mail } from "lucide-react"
import { useEffect, useState } from "react"
import AuthScreen from "~/components/auth/AuthScreen"
import AuthInput from "~/components/auth/AuthInput"
import AuthSubmitButton from "~/components/auth/AuthSubmitButton"
import whoson from "~/utils/whoson"

export const loader = async ({ request }) => {
    // Check if user is already logged in and redirect to app
    if (await whoson.user.current(request)) return redirect("/app")

    return null
}

export const action = async ({ request }) => {
    // Check if user is already logged in and redirect to app
    if (await whoson.user.current(request)) return redirect("/app")

    // Grab form data and check that all fields are present
    const resetForm = await request?.formData()
    const email = resetForm.get("email")

    if (!email) return json({ message: "Invalid email" }, { status: 400 })

    // Attempt to send reset email
    let { error: resetErr } = await whoson.user.sendResetPassword(request, email)

    if (resetErr) return json({ message: resetErr.message }, { status: resetErr.status })

    // Redirect to reset password page
    throw redirect("/resetpassword/waiting")
}

export default function ResetPasswordRequest() {
    let formError = useActionData()
    const [submitDisabled, setSubmitDisabled] = useState(false)

    useEffect(() => {
        if (formError) {
            setSubmitDisabled(true)
        }
    }, [formError])

    return (
        <AuthScreen
            title="Reset password"
            altText="We'll send an email with instructions"
            disableFooter>
            <AuthInput
                name="email"
                type="email"
                label="Email*"
                icon={Mail}
                setSubmitDisabled={setSubmitDisabled}
            />
            <AuthSubmitButton disabled={submitDisabled}>
                {submitDisabled ? formError.message : "Continue"}
            </AuthSubmitButton>
        </AuthScreen>
    )
}
