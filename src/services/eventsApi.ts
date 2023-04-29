import { Event } from '@/models'
import { EventRequest, EventResponse, EventsFilter, EventsSort } from '@/models/api'
import { Api } from '@/services/api'
import { mapper } from '@/services/mapper'
import { mocker } from '@/services/mocker'

export class EventsApi extends Api {
  public getEvent(eventId: string): Promise<Event | undefined> {
    return this.get<EventResponse | undefined>(`events-get-by-id/${eventId}`)
      .then(({ data }) => mapper.map('EventResponse', data, 'Event'))
  }

  public getEvents(filter?: EventsFilter, sort?: EventsSort): Promise<Event[]> {
    return this.get<EventResponse[]>('events-get-list')
      .then(({ data }) => mapper.map('EventResponse', data, 'Event'))
  }

  public getEventsHappeningToday(): Promise<Event[]> {
    return this.get<EventResponse[]>('events-get-list-today')
      .then(({ data }) => mapper.map('EventResponse', data, 'Event'))
  }

  public getEventsHappeningNow(): Promise<Event[]> {
    return this.get<EventResponse[]>('events-get-list-now')
      .then(({ data }) => mapper.map('EventResponse', data, 'Event'))
  }

  public getUpcomingEvents(): Promise<Event[]> {
    return this.get<EventResponse[]>('events-get-list-upcoming')
      .then(({ data }) => mapper.map('EventResponse', data, 'Event'))
  }

  public async getRelatedEvents(eventId: string): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 5))
  }

  public getEventsByClubId(clubId: string): Promise<Event[]> {
    return this.get<EventResponse[]>(`events-get-list-by-club/${clubId}`)
      .then(({ data }) => mapper.map('EventResponse', data, 'Event'))
  }

  public createEvent(request: EventRequest): Promise<string> {
    return this.post<string>('events-create', request)
      .then(({ data }) => data)
  }

  public updateEvent(request: EventRequest): Promise<void> {
    return this.put(`events-update/${request.eventId}`, request)
  }

  public deleteEvent(eventId: string): Promise<void> {
    return this.delete(`events-delete/${eventId}`)
  }

  public getUpcomingEventsCount(clubId: string): Promise<number> {
    return this.get<number>(`events-get-count-by-club/${clubId}`)
      .then(({ data }) => data)
  }
}
