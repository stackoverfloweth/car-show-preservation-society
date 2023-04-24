import { ref } from 'vue'
import { NewUserRegistrationRequest, RegistrationRequest } from '@/models/api'
import { Registration } from '@/models/registration'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export const isRegistered = ref(true)

export class RegistrationsApi extends Api {
  protected override routePrefix = '/registration'

  public async getRegistration(registrationId: string): Promise<Registration | undefined> {
    return await Promise.resolve(mocker.create('registration', [{ registrationId }]))
  }

  public async getRegistrations(eventId: string): Promise<Registration[]> {
    return await Promise.resolve(mocker.createMany('registration', 50, [{ eventId }]))
  }

  public async getRegistrationsForCategory(eventId: string, votingCategoryId: string): Promise<Registration[]> {
    return await Promise.resolve(mocker.createMany('registration', 50, [{ eventId }]))
  }

  public async getRegistrationsCount(eventId: string): Promise<number> {
    return await Promise.resolve(mocker.create('number', [50, 100]))
  }

  public async getRegistrationsCheckedInCount(eventId: string): Promise<number> {
    return await Promise.resolve(mocker.create('number', [0, 65]))
  }

  public async findRegistration(eventId: string, userId: string): Promise<Registration | undefined> {
    if (!isRegistered.value) {
      return undefined
    }

    return await Promise.resolve(mocker.create('registration', [{ eventId, userId }]))
  }

  public async searchRegistrations(needle: string): Promise<Registration[]> {
    const count = 5 - needle.length
    // needle can be firstname, lastname, email, phone, displayName, carId, registrationCode
    return await Promise.resolve(mocker.createMany('registration', count))
  }

  public async createRegistration(request: RegistrationRequest): Promise<Registration> {
    return await Promise.resolve(mocker.create('registration', [request]))
  }

  public async createNewUserRegistration(request: NewUserRegistrationRequest): Promise<Registration> {
    // should notify user to complete profile
    return await Promise.resolve(mocker.create('registration'))
  }

  public async updateRegistration(request: RegistrationRequest): Promise<Registration> {
    return await Promise.resolve(mocker.create('registration', [request]))
  }

  public async deleteRegistration(registrationId: string): Promise<void> {
    await Promise.resolve({ registrationId })
  }

  public async markAsPaid(registrationId: string): Promise<void> {
    await Promise.resolve({ registrationId })
  }

  public async markAsUnpaid(registrationId: string): Promise<void> {
    await Promise.resolve({ registrationId })
  }

  public async checkIn(registrationId: string): Promise<void> {
    await Promise.resolve({ registrationId })
  }
}
