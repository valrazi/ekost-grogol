import { Reservation, Response } from "@/types"
import api from "./client"

export const apiReservationAll = (limit: number) => {
    return api<Response<{rows: Reservation[], meta: {total: number, limit:number}}>>({
        method:'get',
        url:'/reservation',
        params: {
            limit: limit ?? 10
        }
    })
}

export const apiReservationAccept = (id: string) => {
    return api<Response<any>>({
        method:'put',
        url:'/reservation/accept/' + id
    })
}