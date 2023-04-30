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

export const meta = () => {
    let title = "Who's On"
    let description = "Never miss a hangout again with Who's On. Sign up today for free."
    let image = "/images/wo_embed_1200x628.png"
    return {
        charset: "utf-8",
        lang: "en",
        viewport: "width=device-width,initial-scale=1",

        title,
        description,
        image,
        keywords:
            "meetings, hang outs, friends, social, social apps, whoson, who's on, app, mobile, android, desktop, ios, apple, iphone, people, hangout, hangouts, social media, interactive, map, track, lifestyle, get together",

        "twitter:card": "summary_large_image",
        "twitter:url": "https://whos-on.app",
        "twitter:title": title,
        "twitter:description": description,
        "twitter:image": image,

        "og:type": "website",
        "og:url": "https://whos-on.app",
        "og:title": title,
        "og:description": description,
        "og:image": image,

        "theme-color": "#ffffff",
        "msapplication-TileColor": "#ffffff",
    }
}

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
            <body className="flex h-full min-h-screen w-full min-w-full flex-col overflow-x-hidden">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
