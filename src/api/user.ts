import api from "./api";
import { UserDTO } from "./models/user.model";

const getUser = async (
    userId: string,
  ): Promise<UserDTO> => {
    const res = await api.get(
      `user/${userId}/`,
    );
  
    if (res.status !== 200) {
      throw new Error("Could not achieve ros2 operation");
    }
    return res.data.user as UserDTO
};

export {
    getUser
}