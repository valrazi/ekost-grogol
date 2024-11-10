import { Booking, CreateBooking, Response, UserBooking } from "@/types";
import api from "./client";

export const apiCreateBooking = (payload: CreateBooking) => {
    return api<Response<Booking>>({
        method: 'post',
        url: '/booking',
        data: payload
    })
}

export const apiCustomerBooking = () => {
    return api<Response<Booking>>({
        method: 'get',
        url: '/booking/user'
    })
}

export const apiBookingAll = (query?: any) => {
    return api<Response<{rows: Booking[], meta: {total: number, limit: number}}>>({
        method: 'get',
        url: '/booking',
        params: query
    })
} 

export const apiBookingByUser = () => {
    return api<Response<UserBooking[]>>({
        method: 'get',
        url: '/user/booking',
    })
} 

export const apiBookingVerifyPayment = (id: string) => {
    return api<Response<any>>({
        method: 'put',
        url:'/booking/verify/' + id
    })
}