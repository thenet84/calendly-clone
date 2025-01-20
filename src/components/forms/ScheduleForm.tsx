'use client'

import { eventFormSchema, EventFormSchemaType } from '@/schema/events';
import { createEvent, deleteEvent, updateEvent } from '@/server/actions/events';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogTitle, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from '../ui/alert-dialog';
import { useTransition } from 'react';
import { DAYS_OF_WEEK } from '@/constants';
import { scheduleFormSchema, ScheduleFormSchemaType } from '@/schema/schedule';
import { timeToNumber } from '@/lib/utils';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { formatTimezoneOffset } from '@/lib/formatters';

type Availability = {
    startTime: string;
    endTime: string;
    dayOfWeek: (typeof DAYS_OF_WEEK)[number];
};

type ScheduleFormProps = {
    schedule?: {
        timezone: string;
        availabilities: Availability[];
    };
};

export default function ScheduleForm({ schedule }: ScheduleFormProps) {
    const [isDeletePending, startDeleteTransition] = useTransition();
    const form = useForm<ScheduleFormSchemaType>(
        {
            resolver: zodResolver(scheduleFormSchema),
            defaultValues: {
                timezone:  schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone, 
                 availabilities: schedule?.availabilities.toSorted((a,b) => {
                    return timeToNumber(a.startTime) - timeToNumber(b.startTime);
                 })
            }
        }
    )

    async function onSubmit(values: ScheduleFormSchemaType) {
    }

    return (
        <Form {...form}>
            <form className="flex gap-6 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
                )}
                <FormField control={form.control} name="timezone" render={({ field }) => (<FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Intl.supportedValuesOf('timeZone').map(timezone => (
                                <SelectItem key={timezone} value={timezone}>
                                    {timezone}
                                    {` (${formatTimezoneOffset(timezone)})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>)} />
                <div className="flex gap-2 justify-end"> 
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
                </div>
            </form>
        </Form>
    );
}