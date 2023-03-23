import { json } from "@remix-run/cloudflare"
import { Key, Mail, User } from "lucide-react"
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
                    name: "firstname", type: "text", label: "First Name", icon: User, validator: () => true
                },
                {
                    name: "lastname", type: "text", label: "Last Name", icon: User, validator: () => true
                },
                {
                    name: "email", type: "email", label: "Email", icon: Mail, validator: () => true
                }, {
                    name: "password", type: "password", label: "Password", icon: Key, validator: () => true
                }
            ]}
            submitText="Sign up"
        />
    )
}
