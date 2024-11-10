<script setup lang="ts">

const scrollView = (elId: string) => {
    const el = document.getElementById(elId)
    console.log(el)
    if (el) {
        console.log(el)
        el.scrollIntoView({ behavior: 'smooth' })
    }
}
const router = useRouter()
const route = useRoute()
const { user } = storeToRefs(useAuthStore())
const {logout} = useAuthStore()

const logoutAccount = () => {
    logout()
    router.push({ name: 'home' })
}

const userDropdown = ref<boolean>(false)
</script>
<template>
    <div class="sticky top-0 w-full px-4 py-2 bg-white flex justify-between items-center z-[999]">
        <div class="font-semibold hover:cursor-pointer" @click="router.push({ name: 'home' })">
            <h1>08212-435-6789</h1>
            <h1>grogolmansionkost@gmail.com</h1>
        </div>
        <div class="flex gap-x-4" v-if="route.name == 'home'">
            <button @click="scrollView('fasilitas')"
                class="border-b border-b-transparent font-semibold hover:border-b-black">Fasilitas</button>

            <button @click="scrollView('harga')"
                class="border-b border-b-transparent font-semibold hover:border-b-black">Harga Kamar</button>

            <button @click="scrollView('visit')"
                class="border-b border-b-transparent font-semibold hover:border-b-black">Visit</button>
        </div>

        <div class="flex gap-x-4 text-white font-bold" v-if="!user">
            <button @click="router.push({ name: 'user-register' })"
                class="bg-gray-400 px-4 py-1.5 rounded-lg">Register</button>

            <button @click="router.push({ name: 'user-login' })" class="bg-primary px-4 py-1.5 rounded-lg">Login</button>
        </div>

        <div class="flex gap-x-4 text-white font-bold items-center relative" v-else>
            <button @click="userDropdown = !userDropdown"
                class="bg-gray-400 w-[2.5rem] h-[2.5rem] rounded-full"><font-awesome-icon
                    :icon="['fas', 'user']" /></button>

            <div class="text-black font-normal">
                <h1 class="font-semibold">{{ user.nama }}</h1>
                <h2 class="text-sm">{{ user.email }}</h2>
            </div>

            <Transition>
                <div class="w-40 min-h-10 absolute top-14 bg-white text-black flex flex-col justify-center items-center font-normal"
                    v-if="userDropdown">
                    <button @click="router.push({ name: 'user-dashboard' })"
                        class="text-black p-2 border-b w-full">Detail</button>
                    <button @click="logoutAccount" class="text-red-500 p-2">Logout</button>
                </div>
            </Transition>
        </div>


    </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>