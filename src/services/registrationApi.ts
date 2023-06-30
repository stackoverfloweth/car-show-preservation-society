import { NewUserRegistrationRequest, RegistrationRequest, RegistrationResponse } from '@/models/api'
import { Registration } from '@/models/registration'
import { composeAuthHeaders } from '@/services/auth'
import { AuthApi } from '@/services/authApi'
import { mapper } from '@/services/mapper'

export class RegistrationsApi extends AuthApi {
  public getRegistration(registrationId: string): Promise<Registration | undefined> {
    return this.get<RegistrationResponse | undefined>(`registrations-get-by-id/${registrationId}`)
      .then(({ data }) => mapper.map('RegistrationResponse', data, 'Registration'))
  }

  public getRegistrations(eventId: string): Promise<Registration[]> {
    return this.get<RegistrationResponse[]>(`registrations-get-list/${eventId}`)
      .then(({ data }) => mapper.map('RegistrationResponse', data, 'Registration'))
  }

  public getRegistrationsForCategory(eventId: string, votingCategoryId: string): Promise<Registration[]> {
    return this.get<RegistrationResponse[]>(`registrations-get-list-by-category/${eventId}/${votingCategoryId}`)
      .then(({ data }) => mapper.map('RegistrationResponse', data, 'Registration'))
  }

  public getRegistrationsCount(eventId: string): Promise<number> {
    return this.get<number>(`registrations-get-count/${eventId}`)
      .then(({ data }) => data)
  }

  public getRegistrationsCheckedInCount(eventId: string): Promise<number> {
    return this.get<number>(`registrations-get-count-by-checked-in/${eventId}`)
      .then(({ data }) => data)
  }

  public findRegistration(eventId: string, userId: string): Promise<Registration | undefined> {
    return this.get<RegistrationResponse | undefined>(`registrations-get-by-event-and-user/${eventId}/${userId}`)
      .then(({ data }) => mapper.map('RegistrationResponse', data, 'Registration'))
  }

  public findCurrentUserRegistration(eventId: string): Promise<Registration | undefined> {
    return this.get<RegistrationResponse | undefined>(`registrations-get-by-token-and-event/${eventId}`, { headers: composeAuthHeaders() })
      .then(({ data }) => mapper.map('RegistrationResponse', data, 'Registration'))
  }

  public searchRegistrations(needle: string): Promise<Registration[]> {
    return this.post<RegistrationResponse[]>('registrations-search-list', { needle })
      .then(({ data }) => mapper.map('RegistrationResponse', data, 'Registration'))
  }

  public createRegistration(request: RegistrationRequest): Promise<string> {
    return this.post<string>('registrations-create', request)
      .then(({ data }) => data)
  }

  public createNewUserRegistration(request: NewUserRegistrationRequest): Promise<string> {
    // should notify user to complete profile, must be event admin
    return this.post<string>('registrations-create-as-admin', request)
      .then(({ data }) => data)
  }

  public updateRegistration(request: RegistrationRequest): Promise<void> {
    return this.put(`registrations-update/${request.registrationId}`, request)
  }

  public deleteRegistration(registrationId: string): Promise<void> {
    return this.delete(`registrations-delete/${registrationId}`)
  }

  public markAsPaid(registrationId: string): Promise<void> {
    return this.post(`registrations-mark-paid/${registrationId}`)
  }

  public markAsUnpaid(registrationId: string): Promise<void> {
    return this.post(`registrations-mark-unpaid/${registrationId}`)
  }

  public checkIn(registrationId: string): Promise<string> {
    return this.post<string>(`registrations-check-in/${registrationId}`)
      .then(({ data }) => data)
  }
}
