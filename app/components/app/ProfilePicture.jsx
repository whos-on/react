import userToBgColor from "~/utils/userToBgColor"
import whoson from "~/utils/whoson"

export default function ProfilePicture({
    user,
    children,
    size = "w-7 h-7",
    textSize = "text-sm",
    onClick = null,
    showStatus = false,
    className,
    ...props
}) {
    if (!user) return null

    const Container = onClick ? "button" : "div"

    return (
        <div className={`relative flex-shrink-0 flex-grow-0 ${className}`} {...props}>
            <Container
                className={`flex aspect-square select-none rounded-full ${size}`}
                style={{ backgroundColor: userToBgColor(user) }}
                onClick={onClick}>
                <div
                    className={`m-auto flex items-center text-center font-sans font-semibold text-gray-50 ${textSize}`}>
                    {user?.firstName?.[0] + user?.lastName?.[0]}
                </div>
            </Container>
            {showStatus && (
                <div
                    className={`absolute left-0 bottom-0 box-content h-3 w-3 rounded-full border-t-2 border-r-2 border-gray-50 ${
                        user?.status == whoson.constants.statuses.AVAILABLE
                            ? "bg-green-500"
                            : user?.status == whoson.constants.statuses.BUSY
                            ? "bg-amber-500"
                            : "bg-gray-500"
                    }`}></div>
            )}
            {children}
        </div>
    )
}
