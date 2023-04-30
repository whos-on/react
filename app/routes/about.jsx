import Footer from "~/components/app/Footer"

export const meta = () => ({
    title: "Who's On - About",
})

export default function About() {
    return (
        <>
            <main>
                <div className="w-full max-w-full bg-gradient-to-tr from-secondary to-primary px-24 pt-32 pb-24">
                    <h1 className="mx-auto text-center font-sans text-6xl font-extrabold tracking-tight text-gray-50">
                        About
                    </h1>
                </div>
                {[
                    {
                        header: "How it Works",
                        paragraph:
                            "Who's On? provides a new approach to hanging out. Using ourinteractive map, you can find friends nearby and shoot them a message. If they are online, they can set their status and location. Add your friends and family by using usernames and QR codes. Our platform is designed to make it easy and fun for you to stay connected with the people who matter most to you.",
                        content: [
                            {
                                header: "Add Friends",
                                paragraph:
                                    "Who's On? is a revolutionary new online platform that is changing the way people hang out. The Who's On? platform is designed to help users connect with others nearby and schedule hangouts quickly and easily. With Who's On?, users can add friends and family using usernames and QR codes, making it easier than ever to stay connected.",
                            },
                            {
                                header: "Set Your Status",
                                paragraph:
                                    'The status feature is a great way to let your friends know what you are up to. You can set your status to "Online" or "Offline" and optionally add a custom message. Your friends will be able to see your status and location on the interactive map. You can also set your status to "Busy" or "Do Not Disturb" to let your friends know that you are not available.',
                            },
                            {
                                header: "Interactive Map",
                                paragraph:
                                    'The interactive map is a great way to find friends nearby. You can use the map to see where your friends are located and send them a message. You can also use the map to find friends who are online and set their status to "Online" or "Busy". The map is a great way to find friends who are nearby and schedule hangouts.',
                            },
                            {
                                header: "Schedule Hangouts",
                                paragraph:
                                    "Send your friends a message via the chat feature. Schedule hangouts in advance or on the fly. Keep with your friends and never miss a beat.",
                            },
                        ],
                    },
                ].map((content, i) => (
                    <div className="w-full max-w-full bg-gray-50 px-24 py-24" key={i}>
                        <div className="mx-auto w-full max-w-3xl">
                            <h2 className="section-header w-max text-left font-sans text-4xl font-extrabold tracking-tight text-transparent">
                                {content.header}
                            </h2>
                            <div className="mt-2 flex flex-col font-sans text-base font-medium text-gray-900/80">
                                {content.paragraph && <p>{content.paragraph}</p>}
                                {content.content &&
                                    content.content.map((content, i) => (
                                        <div key={i} className="mt-4">
                                            <h3 className="section-header mb-2 w-max text-left font-sans text-2xl font-bold text-transparent">
                                                {content.header}
                                            </h3>
                                            <p>{content.paragraph}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="w-full max-w-full bg-gray-50 px-24 py-24">
                    <div className="mx-auto w-full max-w-3xl">
                        <h2 className="section-header w-max text-left font-sans text-4xl font-extrabold tracking-tight text-transparent">
                            Our Team
                        </h2>
                        <div className="mt-2 grid grid-flow-row auto-rows-auto grid-cols-4 justify-around font-sans text-base font-medium text-gray-900/80">
                            {[
                                /* TODO: Add github links */
                                {
                                    name: "Conor Daly",
                                    title: "Project Manager and Frontend Developer",
                                    image: "https://avatars.githubusercontent.com/u/39171349",
                                },
                                {
                                    name: "Michael Ha",
                                    title: "Backend Developer and Database Administrator",
                                    image: "https://avatars.githubusercontent.com/u/75480742",
                                },
                                {
                                    name: "Stanley Pierre",
                                    title: "Mobile Developer",
                                    image: "https://avatars.githubusercontent.com/u/54913391",
                                },
                                {
                                    name: "Jose Torres",
                                    title: "Frontend Developer",
                                    image: "https://avatars.githubusercontent.com/u/122946006",
                                },
                                {
                                    name: "John Sierra",
                                    title: "Mobile Developer",
                                    image: "https://avatars.githubusercontent.com/u/112599724",
                                },
                                {
                                    name: "Grafton LeGare",
                                    title: "Backend Developer and Database Administrator",
                                    image: "https://avatars.githubusercontent.com/u/122751288",
                                },
                            ].map((member, i) => (
                                <div
                                    className="mt-8 flex flex-shrink flex-grow flex-col px-6 py-3"
                                    key={i}>
                                    <div className="flex flex-col items-center ">
                                        <img
                                            className="aspect-square w-full flex-shrink-0 rounded-full bg-gray-500 bg-cover p-2"
                                            src={member.image}
                                            alt={member.name}
                                        />
                                        <h3 className="mx-auto mt-2 text-center text-lg font-medium text-gray-900">
                                            {member.name}
                                        </h3>
                                        <p className="font-regular mx-auto text-center text-xs text-gray-900/80">
                                            {member.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-full bg-gray-50 px-24 py-24">
                    <div className="mx-auto w-full max-w-3xl">
                        <h2 className="section-header w-max text-left font-sans text-4xl font-extrabold tracking-tight text-transparent">
                            Source Code
                        </h2>
                        <div className="mt-2 flex flex-col font-sans text-base font-medium text-gray-900/80">
                            <p>
                                The source code for Who's On? is available on{" "}
                                <a
                                    className="text-primary/80 hover:text-primary/100"
                                    href="https://github.com/whos-on/">
                                    GitHub
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
