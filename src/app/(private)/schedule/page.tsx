import ScheduleForm from "@/components/forms/ScheduleForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";

export const revalidate = 0;

export default async function SchedulePage() {
    const { userId } = await auth();

    const schedule = await db.query.ScheduleTable.findFirst({
        where: (({ clerkUserId }, { eq }) => eq(clerkUserId, userId ?? '')),
        with: {
            availabilities: true,
        }
    });

    return <Card className="max-w-md mx-auto">
        <CardHeader>
            <CardTitle>New Eevent</CardTitle>
        </CardHeader>
        <CardContent>
            <ScheduleForm schedule={schedule} />
        </CardContent>
    </Card>
}
