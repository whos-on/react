import { Form } from "@remix-run/react"

export default function AuthScreen({ title, altLink, altText, children, disableFooter }) {
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
                            {altLink ? (
                                <>
                                    Or{" "}
                                    <a
                                        className="text-primary/80 hover:text-primary/100"
                                        href={altLink}>
                                        {altText}
                                    </a>
                                </>
                            ) : (
                                altText
                            )}
                        </p>

                        <Form method="post" className="mt-8 flex flex-col space-y-4">
                            {children}
                            {!disableFooter && (
                                <p className="mx-auto pt-2 font-sans text-2xs font-medium text-gray-900/50">
                                    By authenticating, you agree to our{" "}
                                    <a href="/tos" className="underline">
                                        Terms and Conditions
                                    </a>
                                </p>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
