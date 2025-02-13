import logger from "@/config/Logger";
import getStatusName from "@/models/Tender/Status";
import { Tender } from "@/models/Tender/Tender";
import { JWT } from "google-auth-library";
import { google } from "googleapis";

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

    private static async updateOrCreateEvent(eventData: EventData) {
        const calendar = google.calendar({ version: 'v3', auth: this.auth });
        try {
            await calendar.events.get({
                calendarId: process.env.CALENDAR_ID,
                eventId: eventData.id,
            })
            await calendar.events.update({
                calendarId: process.env.CALENDAR_ID,
                eventId: eventData.id,
                requestBody: eventData,
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (error: any) {
            if ("code" in error && error.code == 404) {
                await calendar.events.insert({
                    calendarId: process.env.CALENDAR_ID,
                    requestBody: eventData,
                });
            }
            else {
                logger.error("Ошибка обновления/создания события", error);
            }
        }
    }
    static async deleteTenderEvents(tenderId: number) {
        await this.authenticate();
        const calendar = google.calendar({ version: 'v3', auth: this.auth });

        const eventTypes = ['date1start', 'date1finish', 'date2finish', 'datefinish'];
        for (const type of eventTypes) {
            const eventId = `tender${tenderId}${type}`;
            try {
                await calendar.events.delete({
                    calendarId: process.env.CALENDAR_ID,
                    eventId,
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                if ("code" in error && error.code != 410 && error.code != 404) {
                    logger.error(`Failed to delete event with ID ${eventId}:`, error);
                }
            }
        }
    }

    static async handleTenderEvents(tender: Tender) {
        try {
            await this.authenticate();
        }
        catch (error) {
            logger.error("Ошибка авторизации в Google Calendar", error)
            return
        }
        const dates = [
            { type: 'date1start', date: tender.date1_start },
            { type: 'date1finish', date: tender.date1_finish },
            { type: 'date2finish', date: tender.date2_finish },
            { type: 'datefinish', date: tender.date_finish },
        ];

        let previousDate: Date | null = null;

        for (const { type, date } of dates) {
            const currentDate = new Date(date);
            if (previousDate && currentDate <= previousDate) break;
            previousDate = currentDate;
            const eventId = `tender${tender.id}${type}`;
            const eventData = {
                id: eventId,
                summary: `${tender.name}`,
                description: `${getStatusName(tender.status)}`,
                start: { dateTime: currentDate.toISOString(), timeZone },
                end: { dateTime: currentDate.toISOString(), timeZone },
            };
            await this.updateOrCreateEvent(eventData);
        }
    }
}