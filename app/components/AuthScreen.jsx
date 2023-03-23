import { json } from "@remix-run/cloudflare"
import { Form } from "@remix-run/react"
import Footer from "~/components/common/Footer"

export const action = async () => {
    return json({ message: "Hello World" }) // TODO: Construct form data and hand off to API
}

export default function AuthScreen({title, alt, formFields, submitText}) {
    return (
        <div className="flex flex-col min-h-screen h-full w-full bg-[url('/images/authbg.png')] bg-no-repeat bg-cover">
            <div className="flex flex-col min-h-screen h-full w-full max-h-screen bg-black bg-opacity-40">
                <div className="flex flex-col bg-gray-50 h-screen max-h-full ml-auto px-24 py-8 shadow-lg w-1/3 ring-1 ring-gray-700 ring-opacity-20">

                    <a href="/" className="text-gray-900 text-sm font-sans font-medium opacity-80 hover:opacity-100 mx-auto">← Back</a>

                    <div className="flex flex-col my-auto">
                        <img src="/images/wo_logo_green_nobg_653x100.svg" alt="Who's On? Logo" className="mx-auto mb-8 w-28"/>
                        <h1 className="text-3xl font-extrabold font-sans tracking-tight text-center">{title}</h1>
                        <p className="w-full text-center">Or <a className="text-primary" href={alt.link}>{ alt.text }</a></p>

                        <Form method="post" className="mt-8 flex flex-col space-y-4">
                            {formFields.map(({ name, type, label, validator }) => (
                                <input
                                    className="border border-gray-300 rounded-md p-2"
                                    type={type}
                                    name={name}
                                    id={name}
                                    key={name}
                                    placeholder={label}
                                />
                            ))}
                            <button className="bg-gradient-to-tr from-primary to-secondary text-white rounded-md p-2" type="submit">{ submitText }</button>
                        </Form>

                    </div>

                </div>
                <Footer/>
            </div>
        </div>
    )
}
