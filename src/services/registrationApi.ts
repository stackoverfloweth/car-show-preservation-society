import { ref } from 'vue'
import { RegistrationRequest } from '@/models/api'
import { Registration } from '@/models/registration'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export const isRegistered = ref(false)

export class RegistrationsApi extends Api {
  protected override routePrefix = '/registration'

  public async getRegistration(registrationId: string): Promise<Registration | undefined> {
    return await Promise.resolve(mocker.create('registration', [{ registrationId }]))
  }

  public async findRegistration(eventId: string, userId: string): Promise<Registration | undefined> {
    if (!isRegistered.value) {
      return undefined
    }

    return await Promise.resolve(mocker.create('registration', [{ eventId, userId }]))
  }

  public async createRegistration(request: RegistrationRequest): Promise<Registration> {
    return await Promise.resolve(mocker.create('registration', [request]))
  }

  public async updateRegistration(registration: Registration): Promise<Registration> {
    return await Promise.resolve(mocker.create('registration', [registration]))
  }

  public async deleteRegistration(registrationId: string): Promise<void> {
    await Promise.resolve({ registrationId })
  }
}
