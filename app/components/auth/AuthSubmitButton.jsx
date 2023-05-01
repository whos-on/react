export default function AuthSubmitButton({ disabled = false, text, children, ...props }) {
    return (
        <button
            disabled={disabled}
            className={
                "rounded-md p-2 text-white " +
                (disabled
                    ? "cursor-not-allowed bg-red-500/40"
                    : "bg-primary/100 hover:bg-primary/80")
            }
            type="submit"
            {...props}>
            {children}
        </button>
    )
}
