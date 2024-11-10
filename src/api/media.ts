import { Media, Response } from "@/types"
import api from "./client"

export const apiUploadMediaSingle = (payload: FormData) => {
    return api<Response<Media>>({
        method: 'post',
        url: '/media-single',
        headers: {
            'Content-Type' : 'multipart/form-data',
        },
        data: payload
    })
}

export const apiUploadMediaMulti = (payload: FormData) => {
    return api<Response<Media[]>>({
        method: 'post',
        url: '/media-multi',
        headers: {
            'Content-Type' : 'multipart/form-data',
        },
        data: payload
    })
}