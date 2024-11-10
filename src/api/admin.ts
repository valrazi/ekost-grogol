import { Response, ResponseAdmin } from "@/types"
import api from "./client"

export const apiAdminAnalytics = () => {
    return api<Response<{room:number, reservation:number, booking:number}>>({
        method: 'get',
        url:'/admin/analytics'
    })
}

export const apiAdminLogin = (email:string, password: string) => {
    return api<Response<ResponseAdmin>>({
        method:'post',
        url:'/admin/login',
        data: {
            email,
            password
        }
    })
}