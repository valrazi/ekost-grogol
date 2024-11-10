export type User = {
    id: string
    email: string
    username: string
    nama: string
    jenisKelamin: string
    pekerjaan: string
    whatsappNumber: string
    createdAt: string
    updatedAt: string
    deletedAt: any
  }

  export type CreateUser = {
      email: string
      username: string
      password: string
      nama: string
      whatsappNumber: string
      jenisKelamin: string
      pekerjaan: string
  }
  