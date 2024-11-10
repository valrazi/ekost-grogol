import { CreateUser, Response, User } from "@/types";
import api from "./client";

export const apiUserRegister = (payload: CreateUser) => {
    return api<Response<User>>({
        method: 'post',
        data: payload,
        url: '/user/register'
    })
}

export const apiUserLogin = (username:string, password:string) => {
    return api<Response<{token: string; user: User}>>({
        method: 'post',
        data: {username, password},
        url: '/user/login'
    })
}