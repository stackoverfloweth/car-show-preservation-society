import { Api } from '@/services'

export class ClubInvitationsApi extends Api {
  protected override routePrefix = '/club-invites'

  public async inviteClubMember(clubId: string, emailAddress: string): Promise<void> {
    await Promise.resolve({ clubId, emailAddress })
  }

  public async resendInvitation(clubId: string, emailAddress: string): Promise<void> {
    await Promise.resolve({ clubId, emailAddress })
  }

  public async requestInvitation(clubId: string, userId: string, message?: string): Promise<void> {
    // shouldn't work for non-public
    await Promise.resolve({ clubId, userId, message })
  }

  public async deleteInvitation(clubId: string, emailAddress: string): Promise<void> {
    await Promise.resolve({ clubId, emailAddress })
  }
}
