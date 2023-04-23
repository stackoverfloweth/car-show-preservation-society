import { User } from '@/models/user'
import { Vehicle } from '@/models/vehicle'
import { VotingCategory } from '@/models/votingCategory'

export interface IRegistration {
  registrationId: string,
  registrationCode: string,
  eventId: string,
  registrationDate: Date,
  carId?: string,
  stripePaymentId?: string,
  userId: string,
  user: User,
  vehicleId?: string,
  vehicle: Vehicle,
  votingCategories: VotingCategory[],
}

export class Registration implements IRegistration {
  public readonly registrationId: string
  public registrationCode: string
  public eventId: string
  public registrationDate: Date
  public carId?: string
  public stripePaymentId?: string
  public userId: string
  public user: User
  public vehicleId?: string
  public vehicle: Vehicle
  public votingCategories: VotingCategory[]

  public constructor(registration: IRegistration) {
    this.registrationId = registration.registrationId
    this.registrationCode = registration.registrationCode
    this.eventId = registration.eventId
    this.registrationDate = registration.registrationDate
    this.carId = registration.carId
    this.stripePaymentId = registration.stripePaymentId
    this.userId = registration.userId
    this.user = registration.user
    this.vehicleId = registration.vehicleId
    this.vehicle = registration.vehicle
    this.votingCategories = registration.votingCategories
  }

  public get isCheckedIn(): boolean {
    return this.carId !== undefined
  }
}