export default function BackgroundFiller({ text, icon }) {
    const Icon = icon

    return (
        <div className="flex h-full w-full flex-col opacity-20">
            <div className="m-auto flex flex-col text-gray-900">
                <Icon className="mx-auto mb-2 h-14 w-14" />
                <p className="text-center font-sans text-sm font-medium">{text}</p>
            </div>
        </div>
    )
}
