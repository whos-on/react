import { json } from "@remix-run/cloudflare"
import { Link, useLoaderData } from "@remix-run/react"
import whoson from "~/utils/whoson"

export const loader = async ({ request }) => {
    return json({ user: await whoson.user.current(request) })
}

export default function Index() {
    const { user } = useLoaderData() || {}

    return (
        <div
            className="h-screen min-h-full w-full min-w-full bg-gray-50"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.5'%3E%3Cpath opacity='.65' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}>
            <div className="relative h-full min-h-full w-full min-w-full bg-gradient-to-b from-gray-50/10 via-gray-50 to-gray-50">
                <nav className="pointer-events-auto absolute left-0 right-0 top-0 z-40 mx-5 my-3 flex flex-row items-center justify-between rounded-full bg-gray-50 py-2 px-6 shadow-lg ring-1 ring-gray-700 ring-opacity-20">
                    <Link href="/">
                        <img
                            className="mx-auto my-2 h-4 w-auto"
                            src="/images/wo_logo_green_nobg_653x100.svg"
                            alt="logo"
                        />
                    </Link>
                    <div className="ml-auto flex flex-row items-center space-x-8">
                        <Link to="/about" className="text-sm font-medium text-gray-900/80">
                            About
                        </Link>
                        <a
                            href="https://github.com/whos-on"
                            className="text-sm font-medium text-gray-900/80">
                            GitHub
                        </a>
                        {user ? (
                            <Link to="/app" className="text-sm font-bold text-primary">
                                Go to App
                            </Link>
                        ) : (
                            <Link to="/login" className="text-sm font-bold text-primary">
                                Log In
                            </Link>
                        )}
                    </div>
                </nav>
                <div className="flex h-screen min-h-full w-full min-w-full flex-row items-center px-32">
                    <div className="flex w-1/2 flex-col pr-24">
                        <h1 className="text-left font-sans text-7xl font-extrabold tracking-tight text-gray-900">
                            Never miss out on a hangout again
                        </h1>
                        <p className="mt-8 text-left font-sans text-lg font-medium leading-relaxed text-gray-900/70">
                            Add your closest friends and share your location in real time. Set your
                            status and use the interactive map to find friends nearby. Schedule
                            hangouts in advance or on the fly. Keep up to date with your friends and
                            never miss a beat.
                        </p>
                        <Link
                            to="/app"
                            className="mt-8 mr-auto rounded-xl bg-primary px-6 py-3 font-sans text-base font-bold text-gray-50 shadow-sm hover:shadow-lg">
                            Get Started
                        </Link>
                    </div>
                    <div className="flex w-1/2 flex-col items-center">
                        <img src="/images/whosonhero.png" alt="" className="h-auto w-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}
