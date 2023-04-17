import userToBgColor from "~/utils/userToBgColor"

export default function ProfilePicture({
    user,
    children,
    size = "w-7 h-7",
    textSize = "text-sm",
    onClick = null,
    ...props
}) {
    if (!user) return null

    const Container = onClick ? "button" : "div"

    return (
        <div className="relative flex-shrink-0 flex-grow-0 " {...props}>
            <Container
                className={`flex aspect-square select-none rounded-full ${size}`}
                style={{ backgroundColor: userToBgColor(user) }}
                onClick={onClick}>
                <div
                    className={`m-auto flex items-center text-center font-sans font-semibold text-gray-50 ${textSize}`}>
                    {user?.firstName?.[0] + user?.lastName?.[0]}
                </div>
            </Container>
            {children}
        </div>
    )
}
