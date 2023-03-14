export default function Footer() {
    return (
        <footer className="flex flex-row space-x-4 items-center py-0.5 px-2 bg-gray-50 ring-1 ring-gray-700 ring-opacity-20 shadow-lg text-2xs">
            {[
                { name: "About", href: "/about" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
            ].map(({ name, href }) => (
                <a href={href} key={name} className="text-gray-500 hover:text-gray-700">{name}</a>
            ))}
        </footer>
    )
}
