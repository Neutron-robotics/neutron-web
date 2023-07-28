export interface UserModel {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imgUrl: string
    active: boolean;
    roles: string[];
}

export interface UserDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imgUrl: string
}

export type UserLight = Partial<UserModel>

export type UserUpdateModel =  Partial<Omit<UserModel, "id">>