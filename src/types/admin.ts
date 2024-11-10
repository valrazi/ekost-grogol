export type LoginAdmin = {
    email: string;
    password: string
}

export type ResponseAdmin = {
    admin: Admin
    token: string
}

export interface Admin {
    id: string
    email: string
    username: string
    createdAt: string
    updatedAt: string
    deletedAt: any
}
