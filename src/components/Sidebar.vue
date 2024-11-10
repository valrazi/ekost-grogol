<script setup lang="ts">
const router = useRouter()
const sidebarItems = ref([
    {
        to: 'admin-dashboard',
        text: 'Dashboard',
        icon: 'table-columns'
    },
    {
        to: 'admin-room-type',
        text: 'Room Type',
        icon: 'house'
    },
    {
        to: 'admin-room',
        text: 'Room',
        icon: 'door-closed'
    },
    {
        to: 'admin-booking',
        text: 'Booking',
        icon: 'bookmark'
    },
    {
        to: 'admin-inbox',
        text: 'Inbox',
        icon: 'comment'
    },
    {
        to: 'admin-reservation',
        text: 'Reservation',
        icon: 'eye'
    }
])
const route = useRoute()
const {logoutAdmin} = useAuthStore()
const logout = () => {
    logoutAdmin()
    router.push({name:'admin-login'})
}
</script>
<template>
    <aside class="min-w-[15%] max-w-[15%] min-h-dvh bg-white text-black">
        <h1 class="text-xl font-bold p-4"><span>Grogol</span> <span class="text-secondary">Mansion</span></h1>

        <ul>
            <li
            @click="router.push({name: s.to})" 
            :class="{'bg-secondary text-white' : route.name == s.to}"
            v-for="s in sidebarItems" class="flex items-center gap-x-2 my-4  cursor-pointer p-4">
                <font-awesome-icon :icon="['fas', s.icon]" />
                <span>{{ s.text }}</span>
            </li>
            <li 
            @click="logout"
            class="flex items-center gap-x-2 my-4  cursor-pointer p-4 text-red-500">
                <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
                <span>Logout</span>
            </li>
        </ul>
    </aside>
</template>