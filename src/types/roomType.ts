export type RoomType = {
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
  rooms: Room[];
  images: Image[];
  fasilitas: string;
  activeImage?: number
}

export type Room = {
  id: string
  nomorKamar: number
  lantai: number
  room_type_id: number
  status: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface Image {
  id: string
  room_type_id: number
  url: string
  objectKey: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export type CreateRoomType = {
  nama: string
  harga: number
  fasilitas: string
  panjang: number
  lebar: number
  images: CreateImage[]
}

export type CreateRoom = {
  nomorKamar: number,
  lantai: number,
  roomTypeId: number,
  status: string
}
export type CreateImage = {
  objectKey: string
  url: string
}