import { CreateRoom, Response, Room } from "@/types"
import api from "./client"

export const apiRoomAll = (limit: number) => {
    return api<Response<{rows: Room[], meta: {total: number, limit: number}}>>({
        method: 'get',
        url:'/room',
        params: {
            limit: limit ?? 10
        }
    })
}

export const apiRoomCreate = (payload: CreateRoom) => {
    return api<Response<Room>>({
        method:'post',
        url:'/room',
        data: payload
    })
}

export const apiRoomUpdate = (id: string, payload: CreateRoom) => {
    return api<Response<Room>>({
        method: 'put',
        url: '/room/' + id,
        data: payload
    })
}

export const apiRoomDelete = (id: string) => {
    return api<Response<any>>({
        method: 'delete',
        url: '/room/' + id,
    })
}