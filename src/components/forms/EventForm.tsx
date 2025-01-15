'use client'

import { eventFormSchema, EventFormSchemaType } from '@/schema/events';
import { createEvent, updateEvent } from '@/server/actions/events';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

type EventFormProps = {
    event?: {
        id: string;
        isActive: boolean;
        name: string;
        description?: string;
        durationInMinutes: number;
    }
}

export default function EventForm({ event }: EventFormProps) {
    const form = useForm<EventFormSchemaType>(
        {
            resolver: zodResolver(eventFormSchema),
            defaultValues: event ?? {
                isActive: true,
                durationInMinutes: 30,
            }
        }
    )
    async function onSubmit(values: EventFormSchemaType) {
        const action = event ? updateEvent.bind(null, event.id) : createEvent;
        const data = await action(values);

        if (data?.error) {
            form.setError('root', {
                message: 'There was an error saving your event'
            })
        }
    }
    return (
        <Form {...form}>
            <form className="flex gap-6 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
                )}
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormDescription>The name users will see when booking.</FormDescription>
                    <FormMessage />
                </FormItem>)} />
                <FormField control={form.control} name="durationInMinutes" render={({ field }) => (<FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>In minutes</FormDescription>
                    <FormMessage />
                </FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem>
                    <FormLabel>Descripton</FormLabel>
                    <FormControl>
                        <Textarea className="resize-none h-32" {...field} />
                    </FormControl>
                    <FormDescription>Optional Description of the event</FormDescription>
                    <FormMessage />
                </FormItem>)} />
                <FormField control={form.control} name="isActive" render={({ field }) => (
                    <FormItem>
                        <div className="flex gap-2 items-center">
                            <FormControl>
                                <Switch checked={field.value ?? ''} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Active</FormLabel>
                        </div>
                        <FormDescription>Inactive events will not be visible for users to book</FormDescription>
                        <FormMessage />
                    </FormItem>)} />
                <div className="flex gap-2 justify-end">
                    <Button type="button" asChild variant='outline'>
                        <Link href="/events">Cancel</Link>
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    );
}