import EventForm from "@/components/forms/EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function EditEventPage( {params: { eventId }}:  {params: { eventId: string}}) {

    const { userId, redirectToSignIn } = await auth();

    if (userId === null) {
        return redirectToSignIn();
    }

    const event = await db.query.EventTable.findFirst({
        where: ({ id, clerkUserId }, { eq, and }) => and(eq(clerkUserId, userId), eq(id, eventId))
    })
   
    if (!event) {
        return notFound();
    }

    return <Card className="max-w-md mx-auto">
        <CardHeader>
            <CardTitle>Edit Eevent</CardTitle>
        </CardHeader>
        <CardContent>
            <EventForm event={{ ...event, description: event?.description ?? ''}} />
        </CardContent>
    </Card>
}
