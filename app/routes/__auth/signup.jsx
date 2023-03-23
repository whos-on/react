import { json } from "@remix-run/cloudflare"
import AuthScreen from "~/components/AuthScreen"

export const action = async () => {
    return json({ message: "Hello World" }) // TODO: Construct form data and hand off to API
}

export default function Signup() {
    return (
        <AuthScreen
            title="Create a new account"
            alt={{
                link: "/auth/login",
                text: "log into your account"
            }}
            formFields={[
                {
                    name: "email", type: "email", label: "Email", validator: () => true
                }, {
                    name: "password", type: "password", label: "Password", validator: () => true
                }
            ]}
            submitText="Sign up"
        />
    )
}
