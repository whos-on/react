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
        <div className="flex h-full min-h-screen w-full flex-col bg-[url('/images/authbg.png')] bg-cover bg-no-repeat">
            <div className="flex h-full max-h-screen min-h-screen w-full flex-col bg-black bg-opacity-40">
                <div className="ml-auto flex h-screen max-h-full w-1/3 flex-col bg-gray-50 px-24 py-8 shadow-lg ring-1 ring-gray-700 ring-opacity-20">
                    <a
                        href="/"
                        className="mx-auto font-sans text-sm font-medium text-gray-900 opacity-80 hover:opacity-100">
                        ← Back
                    </a>

                    <div className="my-auto flex flex-col">
                        <img
                            src="/images/wo_logo_green_nobg_653x100.svg"
                            alt="Who's On? Logo"
                            className="mx-auto mb-8 w-28"
                        />
                        <h1 className="text-center font-sans text-3xl font-extrabold tracking-tight text-gray-900">
                            {title}
                        </h1>
                        <p className="w-full text-center text-gray-900/80">
                            Or{" "}
                            <a className="text-primary/80 hover:text-primary/100" href={alt.link}>
                                {alt.text}
                            </a>
                        </p>

                        <Form method="post" className="mt-8 flex flex-col space-y-4">
                            {formFields.map(({ name, type, label, validator, icon }) => {
                                let Icon = icon
                                return (
                                    <div key={name} className="relative flex w-full flex-row">
                                        <Icon className="pointer-events-none absolute inset-y-0 left-0 my-auto ml-3.5 mr-2 h-4 w-4 text-gray-900/50" />
                                        <input
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-5 font-sans text-sm font-medium text-gray-900/90 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            type={type}
                                            name={name}
                                            id={name}
                                            placeholder={label}
                                            onChange={e => {
                                                setSubmitDisabled(false)
                                            }}
                                        />
                                    </div>
                                )
                            })}
                            <button
                                disabled={submitDisabled}
                                className={
                                    "rounded-md p-2 text-white " +
                                    (submitDisabled
                                        ? "cursor-not-allowed bg-red-500/40"
                                        : "bg-primary/100 hover:bg-primary/80")
                                }
                                type="submit">
                                {submitDisabled ? formError.message : submitText}
                            </button>
                            <p className="mx-auto pt-2 font-sans text-2xs font-medium text-gray-900/50">
                                By authenticating, you agree to our{" "}
                                <a href="/tos" className="underline">
                                    Terms and Conditions
                                </a>
                            </p>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
