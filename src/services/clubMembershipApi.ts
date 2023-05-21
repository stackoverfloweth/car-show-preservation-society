import { ClubApplication, ClubInvite, ClubMembership } from '@/models'
import { ClubApplicationResponse, ClubInviteResponse, ClubMembershipResponse, isClubInviteResponse, isClubMembershipResponse } from '@/models/api'
import { AuthApi, mapper } from '@/services'

type AnyClubAssociate = ClubMembershipResponse | ClubInviteResponse | ClubApplicationResponse

export class ClubMembershipApi extends AuthApi {
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

  public getAllClubMembers(clubId: string): Promise<(ClubMembership | ClubInvite | ClubApplication)[]> {
    return this.get<AnyClubAssociate[]>(`club-member-get-list/${clubId}`)
      .then(({ data }) => {
        return data.map(member => {
          if (isClubMembershipResponse(member)) {
            return mapper.map('ClubMembershipResponse', member, 'ClubMembership')
          }

          if (isClubInviteResponse(member)) {
            return mapper.map('ClubInviteResponse', member, 'ClubInvite')
          }

          return mapper.map('ClubApplicationResponse', member, 'ClubApplication')
        })
      })
  }

  public getClubAdmins(clubId: string): Promise<ClubMembership[]> {
    return this.post<ClubMembershipResponse[]>(`club-member-get-list-by-role/${clubId}`, { role: 'admin' })
      .then(({ data }) => mapper.map('ClubMembershipResponse', data, 'ClubMembership'))
  }

  public getClubMembers(clubId: string): Promise<ClubMembership[]> {
    return this.post<ClubMembershipResponse[]>(`club-member-get-list-by-role/${clubId}`, { role: 'member' })
      .then(({ data }) => mapper.map('ClubMembershipResponse', data, 'ClubMembership'))
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
