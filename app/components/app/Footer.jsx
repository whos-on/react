export default function Footer() {
    return (
        <footer className="max-w-screen min-w-screen pointer-events-auto relative bottom-0 left-0 right-0 z-40 flex w-full flex-row items-center overflow-hidden bg-gray-50 py-0.5 px-2 text-2xs shadow-lg ring-1 ring-gray-700 ring-opacity-20">
            {[
                { name: "About", href: "/about" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: null },
                {
                    name: "© Mapbox",
                    href: "https://www.mapbox.com/about/maps/",
                    target: "_blank",
                    rel: "noreferrer",
                },
                {
                    name: "© OpenStreetMap",
                    href: "https://www.openstreetmap.org/about/",
                    target: "_blank",
                    rel: "noreferrer",
                },
                {
                    name: "Improve this map",
                    href: "https://apps.mapbox.com/feedback/?owner=skyclo&amp;id=clgk1iq1w00nn01lcmk8g6i1i&amp;access_token=pk.eyJ1Ijoic2t5Y2xvIiwiYSI6ImNsZ2sweDQ4aDFhcnQzZ21vMHpqOW1nZ2sifQ.ZbaPly-mvWd-Gzg8ULMHzg#/-81.2001/28.6024/16",
                    target: "_blank",
                    rel: "noopener nofollow noreferrer",
                },
            ].map(({ name, ...props }) => {
                if (!name) return <span className="mx-auto" key="space"></span>

                return (
                    <a key={name} className="mx-2 text-gray-500 hover:text-gray-700" {...props}>
                        {name}
                    </a>
                )
            })}
        </footer>
    )
}
