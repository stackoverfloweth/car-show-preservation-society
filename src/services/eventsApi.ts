import { EventRequest, EventsFilter, EventsSort } from '@/models/api'
import { Event, IEvent } from '@/models/event'
import { Image } from '@/models/image'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export class EventsApi extends Api {
  protected override routePrefix = '/events'

  public async getEvent(eventId: string): Promise<Event | undefined> {
    return await Promise.resolve(mocker.create('event', [{ eventId }]))
  }

  public async getEvents(filter?: EventsFilter, sort?: EventsSort): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 5))
  }

  public async getTodaysEvents(): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 1))
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

  public async createEvent(request: EventRequest): Promise<Event> {
    return await Promise.resolve(mocker.create('event', [request]))
  }

  public async updateEvent(event: IEvent): Promise<Event> {
    return await Promise.resolve(mocker.create('event', [event]))
  }

  public async getEventImages(eventId: string): Promise<Image[]> {
    return await Promise.resolve(mocker.createMany('image', mocker.create('number', [0, 50])))
  }
}
