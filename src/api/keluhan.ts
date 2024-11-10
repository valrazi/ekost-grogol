import { CreateKeluhan, Keluhan, Response } from "@/types";
import api from "./client";

export const apiKeluhanCreate = (payload: CreateKeluhan) => {
    return api<Response<Keluhan>>({
        method: 'post',
        url: '/keluhan',
        data: payload
    })
} 

export const apiKeluhanByBooking = (bookingId: string) => {
    return api<Response<Keluhan[]>>({
        method:'get',
        url:'/keluhan/booking/' + bookingId,
    })
}

export const apiKeluhanList = (query?: any) => {
    return api<Response<Keluhan[]>>({
        method:'get',
        url:'/keluhan',
        params: query
    })
}

export const apiKeluhanRespond = (id: string, reply: string) => {
    return api<Response<any>>({
        method: 'put',
        url:'/keluhan/respond/' +id,
        data: {
            reply
        }
    })
}

export const apiKeluhanHide = (id: string) => {
    return api<Response<any>>({
        method: 'put',
        url:'/keluhan/hide/' +id
    })
}
