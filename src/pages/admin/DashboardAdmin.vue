
<script setup lang="ts">
import { UserBooking } from '@/types';
import moment from 'moment';
const router = useRouter()
const {setLoading, removeLoading} = useLoaderStore()
const analytics = ref<{room: number, reservation:number, booking:number}>({
    room: 0,
    reservation: 0,
    booking: 0
})

const bookings = ref<UserBooking[]>([])

const getAnalytics = () => {
    setLoading()
    apiAdminAnalytics()
    .then((res) => {
        if(res.data.code == 200) {
            console.log(res.data.data)
            analytics.value = res.data.data
        }
    })
    .finally(() => {
        removeLoading()
    })
}

const getBookings = () => {
    setLoading()
    apiBookingByUser()
    .then((res) => {
        if(res.data.code) {
            bookings.value = res.data.data
        }
    })
    .finally(() => {
        removeLoading()
    })
}

onMounted(() => {
    getAnalytics()
    getBookings()
})
</script>
<template>
    <div class="w-full min-h-dvh p-4">
        <h1 class="font-bold text-[2rem]">Dashboard</h1>
        <div class="w-full flex gap-x-4">

            <div 
            @click="router.push({name:'admin-room'})"
            class="bg-white flex gap-x-4 min-w-[25%] max-w-[30%] justify-around py-4 rounded-lg
            cursor-pointer">
                <div>
                    <h1>Kamar</h1>
                    <h1 class="text-xl font-bold">Tersedia</h1>
                    <h1 class="text-xl font-bold">{{ analytics.room }}</h1>
                </div>
                <div
                    class="w-[50px] h-[50px] rounded-full bg-[#8280FF] bg-opacity-20 flex justify-center items-center text-[#8280FF]">
                    <font-awesome-icon :icon="['fas', 'user-group']" />
                </div>
            </div>

            <div 
            @click="router.push({name:'admin-reservation'})"
            class="bg-white flex gap-x-4 min-w-[25%] max-w-[30%] justify-around px-2 py-4 rounded-lg
            cursor-pointer">
                <div>
                    <h1>Schedule Visit</h1>
                    <h1 class="text-xl font-bold w-[90%]">{{analytics.reservation }} Permintaan Masuk</h1>
                </div>
            </div>

            <div 
            @click="router.push({name:'admin-booking'})"
            class="bg-white flex gap-x-4 min-w-[25%] max-w-[30%] justify-around px-2 py-4 rounded-lg
            cursor-pointer">
                <div>
                    <h1>Schedule Visit</h1>
                    <h1 class="text-xl font-bold w-[90%]">{{ analytics.booking }} Pembayaran Masuk</h1>
                </div>
            </div>
        </div>

        <div class="w-full rounded-lg px-4 py-2 bg-white min-h-[60dvh] my-4">
            <h1 class="text-[1.5rem] font-semibold mb-4">Data Penghuni</h1>
            <table class="w-full table-auto overflow-scroll">
                <thead class="text-xs text-gray-700 bg-gray-100">
                    <tr>
                        <th scope="col" class="px-6 py-3 rounded-l-2xl">
                            Nama
                        </th>
                        <th scope="col" class="px-6 py-3">
                            No. Kamar
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Durasi
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Pekerjaan
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Kontak
                        </th>
                        <th scope="col" class="px-6 py-3 rounded-r-2xl">
                            Pembayaran
                        </th>
                    </tr>
                </thead>
                <tbody class="text-xs font-normal">
                    <tr v-for="b in bookings" >
                        <th scope="col" class="px-6 py-3 font-normal">
                            {{ b.nama }}
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            <span v-if="b.bookings.length">{{ b.bookings[0].room.lantai }} : {{ b.bookings[0].room.nomorKamar }}</span>
                            <span v-else>Belum Booking</span>
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            <span v-if="b.bookings.length">{{ moment(b.bookings[0].startDate).format('DD MMM YYYY') }} - {{ moment(b.bookings[0].endDate).format('DD MMM YYYY') }}</span>
                            <span v-else>Belum Booking</span>
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            {{ b.pekerjaan }}
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            {{ b.whatsappNumber }}
                        </th>
                        <th scope="col" class="px-6 font-normal">
                            <div v-if="b.bookings.length">
                                <el-tag effect="dark" type="primary" v-if="b.bookings[0].paymentStatus">VERIFIED</el-tag>
                            <el-tag effect="dark" type="warning" v-else>UNVERIFIED</el-tag>
                            </div>
                            <span v-else>Belum Booking</span>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>