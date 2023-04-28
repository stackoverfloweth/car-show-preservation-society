import { startOfDay } from 'date-fns'
import { WithId } from 'mongodb'
import { ImageResults, Event, IEvent } from '@/models'
import { EventRequest, EventsFilter, EventsSort } from '@/models/api'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export class EventsApi extends Api {
  protected override routePrefix = '/events'

  public getEvent(eventId: string): Promise<Event | undefined> {
    return this.get<WithId<IEvent> | undefined>(`events-get-by-id/${eventId}`)
      .then(({ data }) => data ? new Event(data) : undefined)
  }

  public getEvents(filter?: EventsFilter, sort?: EventsSort): Promise<Event[]> {
    return this.get<WithId<IEvent>[]>('events-get-list')
      .then(({ data }) => data.map(event => new Event(event)))
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
    return this.post<string>(`events-create/${request.eventId}`, request)
      .then(({ data }) => data)
  }

  public updateEvent(request: EventRequest): Promise<void> {
    return this.put(`events-update/${request.eventId}`, request)
  }
}
