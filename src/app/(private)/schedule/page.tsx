import ScheduleForm from "@/components/forms/ScheduleForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";

export default async function NewEventPage() {
    const { userId } = await auth();

    const schedule = await db.query.ScheduleTable.findFirst({
        where: (({ clerkUserId }, { eq }) => eq(clerkUserId, userId ?? '')),
        with: {
            availabilities: true,
        }
    });

    console.log('schedule', schedule);

    return <Card className="max-w-md mx-auto">
        <CardHeader>
            <CardTitle>New Eevent</CardTitle>
        </CardHeader>
        <CardContent>
            <ScheduleForm schedule={schedule} />
        </CardContent>
    </Card>
}
