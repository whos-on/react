import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react"

// TailwindCSS
import stylesheet from "public/styles/tailwind.css"

export const meta = () => ({
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
})

export const links = () => [
    { rel: "stylesheet", href: stylesheet },
    {
        rel: "preload",
        as: "font",
        href: "/fonts/Inter.ttf",
        type: "font/ttf",
        crossOrigin: "anonymous",
    },
]

export const loader = () => {
    return {
        env: {
            WHOSON_API_URL: global.env.WHOSON_API_URL,
            WORKER_ENV: global.env.WORKER_ENV,
            MAPBOX_PUBLIC_ACCESS_TOKEN: global.env.MAPBOX_PUBLIC_ACCESS_TOKEN,
        },
    }
}

export default function App() {
    let data = useLoaderData()

    return (
        <html lang="en">
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.env = ${JSON.stringify(data?.env || null)}`,
                    }}
                />
                <Meta />
                <Links />
            </head>
            <body className="flex h-full min-h-screen w-full flex-col overflow-x-hidden">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
