import { json } from "@remix-run/cloudflare"
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"

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

export default function App() {
    return (
        <html lang="en">
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.env = ${JSON.stringify(global.env)}`,
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
