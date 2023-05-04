import { ClubInvite } from '@/models'
import { ClubInviteResponse } from '@/models/api'
import { Api, mapper } from '@/services'

export class ClubInvitationsApi extends Api {
  public inviteClubMember(clubId: string, emailAddress: string): Promise<void> {
    return this.post(`club-invite-create/${clubId}`, { emailAddress })
  }

  public resendInvitation(clubId: string, emailAddress: string): Promise<void> {
    return this.inviteClubMember(clubId, emailAddress)
  }

  public deleteInvitation(clubInvitationId: string): Promise<void> {
    return this.delete(`club-invite-delete/${clubInvitationId}`)
  }

  public getPendingInvitations(clubId: string): Promise<ClubInvite[]> {
    return this.get<ClubInviteResponse[]>(`club-invite-get-list/${clubId}`)
      .then(({ data }) => mapper.map('ClubInviteResponse', data, 'ClubInvite'))
  }

  public applyToClub(clubId: string, userId: string, message?: string): Promise<void> {
    return this.post(`club-application-create/${clubId}`, { userId, message })
  }

  public acceptApplication(clubApplicationId: string): Promise<void> {
    return this.post(`club-application-accept/${clubApplicationId}`)
  }

  public denyApplication(clubApplicationId: string): Promise<void> {
    return this.post(`club-application-deny/${clubApplicationId}`)
  }
}
