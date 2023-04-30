import { UserRequest, UserResponse } from '@/models/api'
import { User } from '@/models/user'
import { Api } from '@/services/api'
import { mapper } from '@/services/mapper'

export class UsersApi extends Api {
  public getUser(userId: string): Promise<User | undefined> {
    return this.get<UserResponse | undefined>(`users-get-by-id/${userId}`)
      .then(({ data }) => mapper.map('UserResponse', data, 'User'))
  }

  public findUser({ phoneNumber, emailAddress }: { phoneNumber?: string, emailAddress?: string }): Promise<User | undefined> {
    return this.get<UserResponse | undefined>(`users-get-by-phone-and-email/${phoneNumber}/${emailAddress}`)
      .then(({ data }) => mapper.map('UserResponse', data, 'User'))
  }

  public getUsersFromClub(clubId: string): Promise<User[]> {
    return this.get<UserResponse[]>(`users-get-list-by-club/${clubId}`)
      .then(({ data }) => mapper.map('UserResponse', data, 'User'))
  }

  public createUser(request: UserRequest): Promise<string> {
    return this.post<string>('users-create', request)
      .then(({ data }) => data)
  }

  public updateUser(request: UserRequest): Promise<User> {
    return this.put(`users-update/${request.userId}`, request)
  }
}
