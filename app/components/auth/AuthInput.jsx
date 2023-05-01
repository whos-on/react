export default function AuthInput({
    name,
    type,
    label,
    icon,
    className,
    setSubmitDisabled,
    ...props
}) {
    let Icon = icon
    return (
        <div className={"relative flex w-full flex-row" + className} {...props}>
            <Icon className="pointer-events-none absolute inset-y-0 left-0 my-auto ml-3.5 mr-2 h-4 w-4 text-gray-900/50" />
            <input
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-5 font-sans text-sm font-medium text-gray-900/90 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type={type}
                name={name}
                id={name}
                placeholder={label}
                onChange={e => {
                    setSubmitDisabled(false)
                }}
            />
        </div>
    )
}
