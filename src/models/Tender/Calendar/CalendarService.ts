import {google} from "googleapis";
import {JWT} from "google-auth-library";
import {Tender} from "@/models/Tender/Tender";
import getStatusName from "@/models/Tender/Status";

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];
const timeZone = 'Asia/Omsk';

type EventData = {
    id: string;
    summary: string;
    description: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
};

export class CalendarService {
    private static auth: JWT

    private static async authenticate() {
        if (this.auth)
            return this.auth
        const jwtClient = new google.auth.JWT(
            process.env.CALENDAR_CLIENT_EMAIL,
            '',
            process.env.CALENDAR_PRIVATE_KEY,
            SCOPES
        );
        await jwtClient.authorize();
        this.auth = jwtClient;
        return this.auth
    }

    private static async fetchExistingEvents(tenderId: number) {
        const calendar = google.calendar({version: 'v3', auth: this.auth});
        const events = await calendar.events.list({
            calendarId: process.env.CALENDAR_ID,
            q: `${tenderId}`,
        });
        return events.data.items as EventData[] || [];
    }

    private static async updateOrCreateEvent(eventData: EventData, existingEvent?: EventData) {
        const calendar = google.calendar({version: 'v3', auth: this.auth});
        if (existingEvent && (eventData.start)) {
            await calendar.events.update({
                calendarId: process.env.CALENDAR_ID,
                eventId: existingEvent.id,
                requestBody: eventData,
            });
        } else {
            await calendar.events.insert({
                calendarId: process.env.CALENDAR_ID,
                requestBody: eventData,
            });
        }
    }

    static async handleTenderEvents(tender: Tender) {
        await this.authenticate();
        const existingEvents = await this.fetchExistingEvents(tender.id);

        const dates = [
            {type: 'date1start', date: tender.date1_start},
            {type: 'date1finish', date: tender.date1_finish},
            {type: 'date2finish', date: tender.date2_finish},
            {type: 'datefinish', date: tender.date_finish},
        ];

        let previousDate: Date | null = null;

        for (const {type, date} of dates) {
            const currentDate = new Date(date);
            if (previousDate && currentDate <= previousDate) break;
            previousDate = currentDate;
            const eventId = `tender${tender.id}${type}`;
            const existingEvent = existingEvents.find((event) => event.id === eventId);
            const eventData = {
                id: eventId,
                summary: `${tender.name}`,
                description: `${getStatusName(tender.status)} (${tender.id})`,
                start: {dateTime: currentDate.toISOString(), timeZone},
                end: {dateTime: currentDate.toISOString(), timeZone},
            };
            await this.updateOrCreateEvent(eventData, existingEvent);
        }
    }
}