'use client'

import { eventFormSchema, EventFormSchemaType } from '@/schema/events';
import { createEvent, deleteEvent, updateEvent } from '@/server/actions/events';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogTitle, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from '../ui/alert-dialog';
import { Fragment, useState, useTransition } from 'react';
import { DAYS_OF_WEEK } from '@/constants';
import { scheduleFormSchema, ScheduleFormSchemaType } from '@/schema/schedule';
import { timeToNumber } from '@/lib/utils';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { formatTimezoneOffset } from '@/lib/formatters';
import { Plus, X } from 'lucide-react';
import { saveSchedule } from '@/server/actions/schedule';

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
    const [successMessage, setSuccessMessage] = useState<string>();
    const [isDeletePending, startDeleteTransition] = useTransition();
    const form = useForm<ScheduleFormSchemaType>(
        {
            resolver: zodResolver(scheduleFormSchema),
            defaultValues: {
                timezone: schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
                availabilities: schedule?.availabilities.toSorted((a, b) => {
                    return timeToNumber(a.startTime) - timeToNumber(b.startTime);
                })
            }
        }
    )

    const {
        append: addAvailability,
        remove: removeAvailability,
        fields: availabilityFields
    } = useFieldArray({ name: 'availabilities', control: form.control });

    const groupedAvailabiltyFields = Object.groupBy(
        availabilityFields.map((field, index) => ({
            ...field, index
        })),
        (availability) => availability.dayOfWeek,
    );

    async function onSubmit(values: ScheduleFormSchemaType) {
        const data = await saveSchedule(values);

        if (data?.error) {
            form.setError('root', {
                message: 'There was an error saving your schedule'
            })
        } else {
            setSuccessMessage('Schedule Saved!')
        }
    }

    return (
        <Form {...form}>
            <form className="flex gap-6 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
                )}
                {successMessage && (
                    <div className="text-green-500 text-sm">{successMessage}</div>
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
                <div className="grid grid-cols-[auto,1fr] gap-y-6 gap-x-4">
                    {DAYS_OF_WEEK.map((dayOfWeek) => (
                        <Fragment key={dayOfWeek}>
                            <div className="capitalize text-sm font-semibold">
                                {dayOfWeek.substring(0, 3)}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Button type="button" className="size-6 p-1" variant="outline" onClick={() => { addAvailability({ dayOfWeek, startTime: '9:00', endTime: '17:00' }) }}>
                                    <Plus />
                                </Button>
                                {groupedAvailabiltyFields[dayOfWeek]?.map((field, labelIndex) => (
                                    <div key={field.id} className="flex flex-col gap-1">
                                        <div className="flex gap-2 items-center">
                                            <FormField control={form.control} name={`availabilities.${field.index}.startTime`} render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input className="w-24" aria-label={`${dayOfWeek} Start time ${labelIndex + 1}`} {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                            -
                                            <FormField control={form.control} name={`availabilities.${field.index}.endTime`} render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input className="w-24" aria-label={`${dayOfWeek} End time ${labelIndex + 1}`} {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                            <Button type="button" className="size-6 p-1" variant="destructiveGhost" onClick={() => { removeAvailability(field.index) }}>
                                                <X />
                                            </Button>
                                        </div>
                                        <FormMessage>
                                            {form.formState.errors.availabilities?.at?.(field.index)?.root?.message}
                                        </FormMessage>
                                        <FormMessage>
                                            {form.formState.errors.availabilities?.at?.(field.index)?.startTime?.message}
                                        </FormMessage>
                                        <FormMessage>
                                            {form.formState.errors.availabilities?.at?.(field.index)?.endTime?.message}
                                        </FormMessage>
                                    </div>
                                ))}
                            </div>
                        </Fragment>
                    ))}
                </div>
                <div className="flex gap-2 justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
                </div>
            </form>
        </Form>
    );
}