import Cookies from "js-cookie";
import api from "./api";
import RegisterModel from "./models/register.model";
import { UserUpdateModel, UserModel } from "./models/user.model";

const tryLoginFromCookie = () => {
  const token = Cookies.get("_neutron_token");
  if (!token) return false;

  startRefreshTokenTimer(token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return true;
};

const login = async (email: string, password: string) => {
  const res = await api.post(`auth/login`, {
    email,
    password,
  });

  if (res.status !== 200) {
    throw new Error("Email or password incorrect");
  }
  startRefreshTokenTimer(res.data.token);
  api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

  const cookieExpirationDate = new Date();
  cookieExpirationDate.setHours(cookieExpirationDate.getHours() + 12);

  Cookies.set("_neutron_token", res.data.token, {
    expires: cookieExpirationDate,
  });

  return res.data.token;
};

const logout = () => {
    stopRefreshTokenTimer()
    api.defaults.headers.common["Authorization"] = null;
    Cookies.remove("_neutron_token")
}

const refreshToken = () => {
  api.post("/auth/refresh-token").then((res) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    startRefreshTokenTimer(res.data.token);
    const cookieExpirationDate = new Date();
    cookieExpirationDate.setHours(cookieExpirationDate.getHours() + 12);
    Cookies.set("_neutron_token", res.data.token, {
      expires: cookieExpirationDate,
    });
  });
};

const register = async (model: RegisterModel) => {
  const res = await api.post("/auth/register", model);
  if (res.status !== 200) {
    throw new Error("An error occured during the registration");
  }
};

const me = async () => {
  const res = await api.get("/auth/me");
  if (res.status !== 200) throw new Error("Cannot fetch self informations");

  const user: UserModel = {
    ...res.data.me,
    id: res.data.me._id,
    _id: undefined,
  };
  return user;
};

const verify = async (key: string) => {
  const res = await api.post(`/auth/verify?key=${key}`);
  if (res.status !== 200) {
    throw new Error("An error occured during while verifying the account");
  }
};

const reset = async (email: string) => {
  const res = await api.post(`/auth/reset`, { email });
  if (res.status !== 200) {
    throw new Error("An error occured while reseting the account");
  }
};

const update = async (model: UserUpdateModel) => {
  const res = await api.post(`/auth/update`, model);
  if (res.status !== 200) {
    throw new Error("An error occured when updating");
  }
};

const deactivate = async () => {
  const res = await api.post(`/auth/deactivate`);
  if (res.status !== 200) {
    throw new Error("An error occured when updating");
  }
};

let refreshTokenTimeout: NodeJS.Timeout;

function startRefreshTokenTimer(token: string) {
  // parse json object from base64 encoded jwt token
  const jwtToken = JSON.parse(atob(token.split(".")[1]));

  // set a timeout to refresh the token a minute before it expires
  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() - 60 * 1000;
  refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
  clearTimeout(refreshTokenTimeout);
}

export {
  login,
  logout,
  register,
  me,
  verify,
  reset,
  update,
  deactivate,
  tryLoginFromCookie,
};
