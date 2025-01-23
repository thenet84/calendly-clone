
type BookEventPageProps = {
    params: {
        clerkUserId: string,
        eventId: string
    },
};

export default function BookEventPage({ params: {
    clerkUserId,
    eventId
} }: BookEventPageProps) {
    
    return <h1>Hi!</h1>
}