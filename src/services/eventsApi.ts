import { Event } from '@/models/event'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export class EventsApi extends Api {
  protected override routePrefix = '/events'

  public async getTodaysEvents(): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 1))
  }

  public async getUpcomingEvents(): Promise<Event[]> {
    return await Promise.resolve(mocker.createMany('event', 5))
  }
}
