import { OrganizationModel } from "../api/models/organization.model";
import { UserDTO, UserModel } from "../api/models/user.model";

export interface UserRanked extends UserDTO {
  rank: OrganizationPermissions;
}

export enum OrganizationPermissions {
  Guest = "guest",
  Operator = "operator",
  Analyst = "analyst",
  Owner = "owner",
  Admin = "admin",
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
    user.roles.includes(OrganizationPermissions.Admin) ||
    organizationMembers.some(
      (e) =>
        e.id === user.id &&
        [OrganizationPermissions.Admin, OrganizationPermissions.Owner].includes(
          e.rank
        )
    )
  );
};

export { isOrganizationUserAdmin };
