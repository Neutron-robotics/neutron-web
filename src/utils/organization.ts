import { OrganizationModel } from "../api/models/organization.model";
import { UserDTO, UserModel } from "../api/models/user.model";

export interface UserRanked extends UserDTO {
  rank: string | undefined;
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
    user.roles.includes("admin") ||
    organizationMembers.some(
      (e) => e.id === user.id && ["admin", "owner"].includes(e.rank ?? "")
    )
  );
};

export { isOrganizationUserAdmin };
