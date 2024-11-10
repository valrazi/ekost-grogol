import { Booking } from "./booking"

export type CreateKeluhan = {
    message: string;
    bookingId: string
}

export type Keluhan = {
    id: string
    message: string
    responded: boolean
    show: boolean
    reply: any
    respondedAt: any
    booking_id: number
    createdAt: string
    updatedAt: string
    deletedAt: any
    booking: Booking;
  }