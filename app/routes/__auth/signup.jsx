import { Form } from "@remix-run/react"

export default function Signup() {
    return (
        <div className="flex flex-col min-h-screen h-full w-full bg-[url('/images/authbg.png')] bg-no-repeat bg-cover">
            <div className="flex flex-col min-h-screen h-full w-full bg-black bg-opacity-40">

                <div className="flex flex-col rounded-lg bg-gray-50 my-auto mx-auto px-12 py-8 shadow-lg w-1/4 ring-1 ring-gray-700 ring-opacity-20">

                    <img className="mx-auto h-4" src="/images/wo_logo_green_nobg_653x100.svg" alt="logo" />

                    <h1 className="mt-8 text-2xl font-bold text-center">Create a new account</h1>
                    <p className="w-full text-center">Or <a className="text-primary" href="/auth/login">Or log into your account</a></p>

                    <Form className="mt-8 flex flex-col space-y-4">
                        {[
                            { name: "email", type: "email", label: "Email", validator: () => true
                            },
                            { name: "password", type: "password", label: "Password", validator: () => true
                            },
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

            </div>
        </div>
    )
}
