export default function Footer() {
    return (
        <footer className="flex flex-row items-center space-x-4 bg-gray-50 py-0.5 px-2 text-2xs shadow-lg ring-1 ring-gray-700 ring-opacity-20">
            {[
                { name: "About", href: "/about" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
            ].map(({ name, href }) => (
                <a href={href} key={name} className="text-gray-500 hover:text-gray-700">
                    {name}
                </a>
            ))}
        </footer>
    )
}
