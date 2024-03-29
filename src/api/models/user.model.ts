export interface UserModel {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imgUrl: string
    active: boolean;
    role: string;
}

export interface UserDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imgUrl: string
}

export const defaultUser: UserDTO = {
    id: "default",
    email: "",
    firstName: "",
    lastName: "",
    imgUrl: ""
}

export type UserUpdateModel =  Partial<Omit<UserModel, "id">>