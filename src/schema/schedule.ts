import { DAYS_OF_WEEK } from '@/constants';
import { timeToNumber } from '@/lib/utils';
import { z } from 'zod';

export type ScheduleFormSchemaType = z.infer<typeof scheduleFormSchema>;

export const scheduleFormSchema = z.object({
  timezone: z.string().min(1, 'Required'),
  availabilities: z
    .array(
      z.object({
        dayOfWeek: z.enum(DAYS_OF_WEEK),
        startTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Time must be in the formt HH:MM'
          ),
        endTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            'Time must be in the formt HH:MM'
          ),
      })
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((availability, index) => {
        const overlaps = availabilities.some((a, i) => {
          return (
            i !== index &&
            a.dayOfWeek === availability.dayOfWeek &&
            timeToNumber(a.startTime) < timeToNumber(availability.endTime) &&
            timeToNumber(a.endTime) > timeToNumber(availability.startTime)
          );
        });

        if(overlaps) {
            ctx.addIssue({
                code: 'custom',
                message: "Availavility overlaps with another",
                path: [index],
            })
        }
        if(timeToNumber(availability.endTime) < timeToNumber(availability.startTime)) {
            ctx.addIssue({
                code: 'custom',
                message: "End time must be afer start time",
                path: [index],
            })
        }  
      });
    }),
});


