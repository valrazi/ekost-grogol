import { User } from "@/types"
import { Admin } from "@/types/admin"

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token:null as string | null,
        user:null as User | null,
        admin: null as Admin | null,
        tokenAdmin: null as string | null
    }),
    actions: {
        logout() {
            this.user = null
            this.token = null
        },
        loginAdmin(token: string, admin: Admin) {
            this.logout()
            this.tokenAdmin = token
            this.admin = admin
        },
        logoutAdmin() {
            this.tokenAdmin = null
            this.admin = null
        }
    },
    persist: {
        serializer: {
            deserialize: (val) => JSON.parse(atob(val)),
            serialize: (val) => btoa(JSON.stringify(val)),
        }
    }
})