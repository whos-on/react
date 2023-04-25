import { useState } from "react"

export default function InlineInput({
    placeholder,
    name,
    type = "text",
    className = "",
    error,
    onChange,
    action,
}) {
    const [value, setValue] = useState("")

    return (
        <>
            <input
                className={`w-full rounded-lg border bg-gray-50 py-2 px-3 font-sans text-sm font-medium text-gray-900/90  focus:outline-none focus:ring-1 ${
                    error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary focus:ring-primary"
                } ${className}}`}
                placeholder={placeholder}
                name={name}
                onChange={e => {
                    setValue(e.target.value)
                    onChange()
                }}
            />
            <button
                disabled={!value || error}
                type="submit"
                className={`ml-2 min-w-max rounded-lg bg-green-500 ${
                    value && !error ? "opacity-100" : "opacity-50"
                } px-3 font-sans text-xs font-semibold text-gray-50`}>
                {action}
            </button>
        </>
    )
}
