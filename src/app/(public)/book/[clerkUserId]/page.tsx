import CopyEventButton from "@/components/CopyEventButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { formatEventDuration } from "@/lib/formatters";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type ScheduleEventCardProps = {
    id: string;
    name: string;
    description: string | null;
    durationInMinutes: number | null;
    clerkUserId: string
}

function ScheduleEventCard({ id, name, description, durationInMinutes, clerkUserId }: ScheduleEventCardProps) {
    return (
        <Card className="flex flex-col" >
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{formatEventDuration(durationInMinutes ?? 0)}</CardDescription> 
            </CardHeader>
            {description && <CardContent>{description}</CardContent>}
            <CardFooter className="flex justify-end gap-2 mt-auto">
                <Button asChild>
                    <Link href={`/book/${clerkUserId}/${id}`}>Select</Link>
                </Button>
            </CardFooter> 
        </Card>
    )
}

export default async function BookingPage({ params: { clerkUserId } }: { params: { clerkUserId: string } }) {
    const { userId } = await auth();

    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
            and(eq(userIdCol, userId ?? ''), eq(isActive, true)),
        orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
    })

    if (events.length === 0) {
        return notFound();
    }

    const { fullName } = await (await clerkClient()).users.getUser(clerkUserId);


    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-4xl md:text-5xl font-semibold mb-4 text-center">
                {fullName}
            </div>
            <div className="text-muted-foreground mb-6 max-w-sm mx-auto text-center">
                Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.
            </div>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {events.map(event => (
                        <ScheduleEventCard key={event.id} {...event}  clerkUserId={clerkUserId}/>
                    ))}
                </div>
        </div>
    );
}