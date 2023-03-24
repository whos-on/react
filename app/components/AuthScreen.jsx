import { json } from "@remix-run/cloudflare"
import { Form, useActionData } from "@remix-run/react"
import { useEffect, useState } from "react"


export const action = async () => {
    return json({ message: "Hello World" }) // TODO: Construct form data and hand off to API
}

export default function AuthScreen({ title, alt, formFields, submitText }) {
    let formError = useActionData()
    const [submitDisabled, setSubmitDisabled] = useState(false)

    useEffect(() => {
        if (formError) {
            setSubmitDisabled(true)
        }
    }, [formError])

    return (
        <div className="flex flex-col min-h-screen h-full w-full bg-[url('/images/authbg.png')] bg-no-repeat bg-cover">
            <div className="flex flex-col min-h-screen h-full w-full max-h-screen bg-black bg-opacity-40">
                <div className="flex flex-col bg-gray-50 h-screen max-h-full ml-auto px-24 py-8 shadow-lg w-1/3 ring-1 ring-gray-700 ring-opacity-20">

                    <a href="/" className="text-gray-900 text-sm font-sans font-medium opacity-80 hover:opacity-100 mx-auto">← Back</a>

                    <div className="flex flex-col my-auto">
                        <img src="/images/wo_logo_green_nobg_653x100.svg" alt="Who's On? Logo" className="mx-auto mb-8 w-28" />
                        <h1 className="text-3xl font-extrabold font-sans tracking-tight text-center text-gray-900">{title}</h1>
                        <p className="w-full text-center text-gray-900/80">Or <a className="text-primary/80 hover:text-primary/100" href={alt.link}>{alt.text}</a></p>

                        <Form method="post" className="mt-8 flex flex-col space-y-4">
                            {formFields.map(({ name, type, label, validator, icon }) => {
                                let Icon = icon
                                return (
                                    <div key={name} className="w-full flex flex-row relative">
                                        <Icon className="absolute inset-y-0 left-0 ml-3.5 pointer-events-none w-4 h-4 text-gray-900/50 my-auto mr-2" />
                                        <input
                                            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-5 bg-gray-50 text-gray-900/90 focus:border-primary focus:ring-1 focus:outline-none focus:ring-primary font-medium font-sans text-sm"
                                            type={type}
                                            name={name}
                                            id={name}
                                            placeholder={label}
                                            onChange={(e) => {
                                                setSubmitDisabled(false)
                                            }}
                                        />
                                    </div>
                                )
                            })}
                            <button disabled={submitDisabled} className={"text-white rounded-md p-2 " + (submitDisabled ?
                                "cursor-not-allowed bg-red-500/40" :
                                "bg-primary/100 hover:bg-primary/80"
                            )} type="submit">{submitDisabled? formError.message : submitText}</button>
                            <p className="font-sans font-medium text-2xs text-gray-900/50 mx-auto pt-2">By signing up, you agree to our <a href="/tos" className="underline">Terms and Conditions</a></p>
                        </Form>

                    </div>

                </div>
            </div>
        </div>
    )
}
