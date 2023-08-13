export interface CreateOrganizationModel {
    name: string,
    company: string,
    description: string,
    imgUrl: string
}

export interface UserRelationModel {
    userId: string,
    permissions: string[]
}

export interface OrganizationModel {
    name: string;
    company: string;
    description: string;
    imgUrl: string;
    robots: string[];
    active: boolean;
    users: UserRelationModel[]
}