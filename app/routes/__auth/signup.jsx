import { Form } from "@remix-run/react"

export default function Signup() {
    return (
        <div className="flex flex-col min-h-screen h-full w-full bg-[url('/images/authbg.png')] bg-no-repeat bg-cover">
            <div className="flex flex-col min-h-screen h-full w-full bg-black bg-opacity-40">

                <nav className="flex flex-row justify-between items-center py-2 px-6 rounded-full mx-5 my-3 bg-gray-50 ring-1 ring-gray-500 ring-opacity-20 shadow-lg">
                    <a href="/"><img className="mx-auto h-4 w-auto my-2" src="/images/wo_logo_green_nobg_653x100.svg" alt="logo" /></a>
                    <div className="rounded-full h-6 w-6 bg-[url('/images/sample_pfp.jpeg')] bg-cover">
                    </div>
                </nav>

                <div className="flex flex-col rounded-lg bg-gray-50 my-auto mx-auto px-12 py-8 shadow-lg w-1/4 ring-1 ring-gray-700 ring-opacity-20">

                    <h1 className="text-2xl font-bold text-center">Create a new account</h1>
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

                <footer className="flex flex-row space-x-4 items-center py-0.5 px-2 bg-gray-50 ring-1 ring-gray-500 ring-opacity-20 shadow-lg text-2xs">
                    {[
                        { name: "About", href: "/about" },
                        { name: "Terms of Service", href: "/terms" },
                        { name: "Privacy Policy", href: "/privacy" },
                    ].map(({ name, href }) => (
                        <a href={href} key={name} className="text-gray-500 hover:text-gray-700">{name}</a>
                    ))}
                </footer>
            </div>
        </div>
    )
}
