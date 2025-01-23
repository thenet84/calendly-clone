import 'use-server';
import { clerkClient } from '@clerk/nextjs/server';
import { google } from 'googleapis';
import { startOfDay, endOfDay } from 'date-fns';

async function getOAuthClient(clerkUserId: string) {
  const token = await (
    await clerkClient()
  ).users.getUserOauthAccessToken(clerkUserId, 'oauth_google');

  if (token?.data.length === 0 || token?.data[0].token === null) {
    return;
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URL
   );

   client.setCredentials({ access_token: token?.data[0].token });

   return client;
}

export async function getCalendarEventTimes(
  clerkUserId: string,
  { start, end }: { start: Date; end: Date }
) {
  const oAuthClient = await getOAuthClient(clerkUserId);

  const events = await google.calendar('v3').events.list({
    calendarId: 'primary',
    eventTypes: ['default'],
    singleEvents: true,
    timeMin: start.toISOString(), 
    timeMax: end.toISOString(), 
    maxResults: 2500,
    auth: oAuthClient,
  })

  return events?.data?.items?.map((event) => {
    if(event.start?.date !== null && event.end?.date !== null) {
        return {
            start: startOfDay(event.start?.date ?? ''),
            end: endOfDay(event.start?.date ?? ''),
        }
    }
    if(event.start?.dateTime !== null && event.end?.dateTime !== null) {
        return {
            start: new Date(event.start?.dateTime ?? ''),
            end: new Date(event.start?.dateTime ?? ''),
        }
    }
  }).filter((date) => date != null) || []
}
