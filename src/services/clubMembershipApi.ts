import { ClubMembership, User } from '@/models'
import { ClubMembershipResponse } from '@/models/api'
import { Api, mapper } from '@/services'

export class ClubMembershipApi extends Api {
  public getActiveMemberCount(clubId: string): Promise<number> {
    return this.get<number>(`club-member-get-active-count/${clubId}`)
      .then(({ data }) => data)
  }

  public getMembership(userId: string, clubId: string): Promise<ClubMembership> {
    return this.get<ClubMembershipResponse>(`club-member-get-by-user/${clubId}/${userId}`)
      .then(({ data }) => mapper.map('ClubMembershipResponse', data, 'ClubMembership'))
  }

  public joinClub(clubId: string, userId: string): Promise<void> {
    return this.post(`club-member-join/${clubId}`, { userId })
  }

  public leaveClub(clubMemberId: string): Promise<void> {
    return this.delete(`club-member-leave/${clubMemberId}`)
  }

  public getClubAdmins(clubId: string): Promise<User[]> {
    return this.post(`club-member-get-list-by-role/${clubId}`, { role: 'admin' })
  }

  public getClubMembers(clubId: string): Promise<User[]> {
    return this.post(`club-member-get-list-by-role/${clubId}`, { role: 'member' })
  }

  public setUserRoleAdmin(clubMembershipId: string): Promise<void> {
    return this.post('club-member-set-admin', { clubMembershipId })
  }

  public setUserRoleMember(clubMembershipId: string): Promise<void> {
    return this.post('club-member-set-member', { clubMembershipId })
  }

  public setPrimaryMember(clubMembershipId: string): Promise<void> {
    return this.post('club-member-set-primary', { clubMembershipId })
  }

  public deleteClubMember(clubMembershipId: string): Promise<void> {
    return this.delete(`club-member-delete/${clubMembershipId}`)
  }
}
