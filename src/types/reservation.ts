export type CreateReservation = {
    nama: string;
    phoneNumber: string;
    date: string;
    time: string;
}

export type Reservation = {
    isAccepted: boolean
    id: string
    nama: string
    phoneNumber: string
    dateReservation: string
    updatedAt: string
    createdAt: string;
    time:string;
}