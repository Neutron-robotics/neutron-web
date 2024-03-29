import { UserDTO, UserModel } from "../api/models/user.model";

export interface UserRanked extends UserDTO {
  ranks: OrganizationPermissions[];
}

export enum OrganizationPermissions {
  Admin = "admin",
  Owner = "owner",
  Operator = "operator",
  Analyst = "analyst",
  Guest = "guest",
}

/**
 * Verify if the provided user is administrator of the given organization, or, the global platform.
 * @param user
 * @param organization
 */
const isOrganizationUserAdmin = (
  user: UserModel,
  organizationMembers: UserRanked[]
) => {
  return (
    user.role === OrganizationPermissions.Admin ||
    organizationMembers.some(
      (e) =>
        e.id === user.id &&
        (e.ranks.includes(OrganizationPermissions.Admin) || e.ranks.includes(OrganizationPermissions.Owner))
    )
  );
};

export { isOrganizationUserAdmin };
