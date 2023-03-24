import { json } from "@remix-run/cloudflare"
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
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
]

export default function App() {
    return (
        <html lang="en">
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.env = ${ JSON.stringify(global.env) }`,
                    }}
                />
                <Meta />
                <Links />
            </head>
            <body className="h-full w-full overflow-x-hidden min-h-screen flex flex-col">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
