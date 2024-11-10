export type CreateBooking = {
    startDate: string
    endDate: string
    roomId: null | number
    transferProof: string
}

export type Booking = {
    id: string
    startDate: string
    endDate: string
    totalPrice: number
    transferProof: string
    paymentStatus: boolean
    expired: boolean
    user_id: number
    room_id: number
    createdAt: string
    updatedAt: string
    deletedAt: any
    room: BookingRoom;
    user: UserBooking
}

export type BookingRoom = {
    id: string
    nomorKamar: number
    lantai: number
    room_type_id: number
    status: string
    createdAt: string
    updatedAt: string
    deletedAt: any
    room_type: BookingRoomType
}

export type BookingRoomType = {
    id: string
    nama: string
    harga: number
    quantity: number
    panjang: number
    lebar: number
    isAc: boolean
    isKulkas: boolean
    isTv: boolean
    kasur: string
    createdAt: string
    updatedAt: string
    deletedAt: any
}

export type UserBooking =  {
    id: string
    email: string
    username: string
    nama: string
    jenisKelamin: string
    pekerjaan: string
    whatsappNumber: string
    createdAt: string
    updatedAt: string
    deletedAt: any,
    bookings: Booking[]
}