export type RegistrationRequest = {
  userId: string,
  eventId: string,
  vehicleId?: string,
  stripePaymentId?: string,
  votingCategoryIds?: string[],
}