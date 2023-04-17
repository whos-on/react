export default function Index() {
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
            <h1>
                Welcome to <s>Remix</s> Who's On?
            </h1>
            <p>no nav yet pls 4giv :&#40;</p>
            <ul>
                <li>
                    <a href="/login">Log in</a>
                </li>
                <li>
                    <a href="/signup">Sign up</a>
                </li>
                <li>
                    <a href="/app">App Page (REQUIRES LOGIN!!!!)</a>
                </li>
            </ul>
        </div>
    )
}
