import { startOfDay } from 'date-fns'
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

  public async getEventsHappeningToday(): Promise<Event[]> {
    // should only include events current user is registered to
    return await Promise.resolve(mocker.createMany('event', mocker.create('number', [0, 1]), [{ start: startOfDay(new Date()) }]))
  }

  public async getEventsHappeningNow(): Promise<Event[]> {
    // should only include events current user is registered to
    return await Promise.resolve(mocker.createMany('event', mocker.create('number', [0, 1]), [{ start: new Date() }]))
  }

  public async getUpcomingEvents(): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 5))
  }

  public async getRelatedEvents(eventId: string): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 5))
  }

  public async getEventsByClubId(clubId: string): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 5, [{ clubId }]))
  }

  public async getEventsByUserId(userId: string): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 5))
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
}
