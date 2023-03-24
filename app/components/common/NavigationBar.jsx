export default function NavigationBar() {
    return (
        <nav className="flex flex-row justify-between items-center py-2 px-6 rounded-full mx-5 my-3 bg-gray-50 ring-1 ring-gray-700 ring-opacity-20 shadow-lg">
            <a href="/"><img className="mx-auto h-4 w-auto my-2" src="/images/wo_logo_green_nobg_653x100.svg" alt="logo" /></a>
            <div className="rounded-full h-6 w-6 bg-[url('/images/sample_pfp.jpeg')] bg-cover">
            </div>
        </nav>
    )
}
