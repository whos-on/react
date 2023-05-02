import { json, redirect } from "@remix-run/cloudflare"
import { useActionData } from "@remix-run/react"
import { KeyIcon } from "lucide-react"
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

export const action = async ({ request, params }) => {
    // Check if user is already logged in and redirect to app
    if (await whoson.user.current(request)) return redirect("/app")

    // Grab user id from url
    const { id = null } = params
    if (!id) throw redirect("/resetpassword")

    // Grab form data and check that all fields are present
    const resetForm = await request?.formData()
    const password = resetForm.get("password")
    if (!password) return json({ message: "Invalid password" }, { status: 400 })

    // Attempt to reset password
    let { error: resetErr } = await whoson.user.updatePassword(request, id, password)
    if (resetErr) return json({ message: resetErr.message }, { status: resetErr.status })

    // Redirect to success page
    throw redirect("/resetpassword/success")
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
        <AuthScreen title="Reset password" altText="Enter your new password below" disableFooter>
            <AuthInput
                name="password"
                type="password"
                label="New Password*"
                icon={KeyIcon}
                setSubmitDisabled={setSubmitDisabled}
            />
            <AuthSubmitButton disabled={submitDisabled}>
                {submitDisabled ? formError.message : "Continue"}
            </AuthSubmitButton>
        </AuthScreen>
    )
}
