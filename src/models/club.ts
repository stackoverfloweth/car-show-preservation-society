export type Club = {
  clubId: string,
  name: string,
  description: string,
  contactUserId?: string,
  stripeCustomerId?: string,
  clubLogo?: string,
}