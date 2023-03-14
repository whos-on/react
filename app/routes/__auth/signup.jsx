import { json } from "@remix-run/cloudflare"
import { Form } from "@remix-run/react"
import Footer from "~/components/common/Footer"
import NavigationBar from "~/components/common/NavigationBar"

export const action = async () => {
    return json({ message: "Hello World" }) // TODO: Construct form data and hand off to API
}

export default function Signup() {
    return (
        <div className="flex flex-col min-h-screen h-full w-full bg-[url('/images/authbg.png')] bg-no-repeat bg-cover">
            <div className="flex flex-col min-h-screen h-full w-full bg-black bg-opacity-40">

                <NavigationBar/>

                <div className="flex flex-col rounded-lg bg-gray-50 my-auto mx-auto px-12 py-8 shadow-lg w-1/4 ring-1 ring-gray-700 ring-opacity-20">

                    <h1 className="text-2xl font-bold text-center">Create a new account</h1>
                    <p className="w-full text-center">Or <a className="text-primary" href="/auth/login">Or log into your account</a></p>

                    <Form method="post" className="mt-8 flex flex-col space-y-4">
                        {[
                            { name: "email", type: "email", label: "Email", validator: () => true
                            },
                            { name: "password", type: "password", label: "Password", validator: () => true
                            },
                            // TODO: Add password confirmation
                        ].map(({ name, type, label, validator }) => (
                            <input
                                className="border border-gray-300 rounded-md p-2"
                                type={type}
                                name={name}
                                id={name}
                                key={name}
                                placeholder={label}
                            />
                        ))}
                        <button className="bg-gradient-to-tr from-primary to-secondary text-white rounded-md p-2" type="submit">Sign up</button>
                    </Form>

                </div>

                <Footer/>
            </div>
        </div>
    )
}
