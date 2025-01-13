import EventForm from "@/components/forms/EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewEventPage() {
  return <Card className="max-w-md mx-auto">
    <CardHeader>
      <CardTitle>New Eevent</CardTitle>
    </CardHeader>
    <CardContent>
      <EventForm />
    </CardContent>
  </Card>
}
 