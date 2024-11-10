import { CreateRoomType, Response, RoomType } from "@/types"
import api from "./client"

export const apiRommTypeFind = (limit: number) => {
    return api<Response<{rows: RoomType[], meta: {limit: number, total: number}}>>({
        method: 'get',
        url: '/room-type',
        params: {
            limit: limit ?? 10
        }
    })
}

export const apiRoomTypeCreate = (payload: CreateRoomType) => {
    return api<Response<RoomType>>({
        method:'post',
        data: payload,
        url:'/room-type'
    })
}

export const apiRoomTypeUpdate = (id:string, payload: CreateRoomType) => {
    return api<Response<RoomType>>({
        method:'put',
        data: payload,
        url:'/room-type/' + id
    })
}

export const apiRoomTypeDelete = (id: string) => {
    return api<Response<any>>({
        method: 'delete',
        url: '/room-type/' + id
    })
}