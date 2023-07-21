export interface UserModel {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    active: boolean;
    roles: string[];
}

export type UserUpdateModel =  Partial<Omit<UserModel, "id">>
