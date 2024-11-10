import { CreateReservation, Reservation, Response, RoomType } from "@/types"
import api from "./client"

export const apiGetRoomType = () => {
    return api<Response<{rows: RoomType[], total: number}>>({
        method:'get',
        url:'/public/room-type'
    })
}
export const apiCreateReservation = (data: CreateReservation) => {
    return api<Response<Reservation>>({
        method: 'post',
        data,
        url: '/public/reservation'
    })
}