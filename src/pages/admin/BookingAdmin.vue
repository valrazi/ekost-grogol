<script setup lang="ts">
import { moneyFormatter } from '@/helpers/common';
import { Booking } from '@/types';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import moment from 'moment';
const { setLoading, removeLoading } = useLoaderStore()
const baseUrl = import.meta.env.VITE_API_URL
const bookings = ref<Booking[]>([]), limit = ref<number>(10), total = ref<number>(0), month_count = ref<string>('0')
const notifBooking = ref<Booking[]>([])


const getNotifBooking = () => {
    setLoading()
    apiBookingAll({
        status: 'not_paid'
    })
        .then((res) => {
            if (res.data.code == 200) {
                notifBooking.value = res.data.data.rows
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            removeLoading()
        })
}
const getBookings = () => {
    setLoading()
    apiBookingAll({
        limit: limit.value,
        month_count: month_count.value
    })
        .then((res) => {
            if (res.data.code) {
                bookings.value = res.data.data.rows
                total.value = res.data.data.meta.total
            }
        })
        .finally(() => {
            removeLoading()
        })
}

const verifyPayment = (id: string) => {
    useSwal()
        .fire({
            title: 'Verify Payment',
            text: 'This action can\'t be undone',
            icon: 'warning',
            showCancelButton: true
        })
        .then((res) => {
            if (res.isConfirmed) {
                setLoading()
                apiBookingVerifyPayment(id)
                    .then((res) => {
                        if (res.error) {
                            ElNotification({
                                title: 'Error',
                                message: 'Error Delete Room',
                                type: 'error',
                            })
                            return
                        }
                        ElNotification({
                            title: 'Success',
                            message: 'Success Delete Room',
                            type: 'success',
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        ElNotification({
                            title: 'Error',
                            message: 'Error Delete Room',
                            type: 'error',
                        })
                    })
                    .finally(() => {
                        removeLoading()
                        getNotifBooking()
                        getBookings()
                    })
            }
        })
}

const exportData = async () => {
    const url = `${baseUrl}/booking/export`
    try {
        const response = await axios.get(url, {
            responseType: 'blob',
            params: {
                month_count: month_count.value,
                limit: limit.value
            }
        })
        const urlCsv = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a');
        link.href = urlCsv;
        console.log(response.data)
        link.setAttribute('download', `data_booking_${moment().format('YYYY-MM-DD')}.xlsx`);
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.log(error)
        useSwal().fire({
            title: "Error!",
            text: 'Data for the range date is empty!',
            icon: 'warning'
        })
    }
}
onMounted(() => {
    getBookings()
    getNotifBooking()
})

watch(() => limit.value, () => {
    getBookings()
})

watch(() => month_count.value, () => {
    limit.value = 10
    getBookings()
})
</script>
<template>
    <div class="w-full min-h-dvh p-4">
        <h1 class="font-bold text-[2rem]">Notifikasi Pembayaran</h1>
        <div class="w-full max-h-[40dvh] overflow-y-scroll gap-x-4">
            <div v-for="n in notifBooking"
                class="bg-white bg-opacity-80 border flex gap-x-4 w-[80%]  p-4 rounded-lg  my-4">
                <div @click="verifyPayment(n.id)"
                    class="w-[50px] h-[50px] rounded-xl bg-gray-100 border bg-opacity-20 cursor-pointer">
                </div>
                <div>
                    <h1>{{ n.user.email }} ({{ n.user.whatsappNumber }})</h1>
                    <h1 class="text-xs italic mt-2">{{ moment(n.createdAt).format('DD MMM YYYY') }}</h1>
                    <h1 class="text-xs italic ">{{ moneyFormatter.format(n.totalPrice) }}</h1>
                    <a class="text-xs text-primary hover:text-primary" :href="n.transferProof" target="_blank">Bukti
                        Transfer</a>
                </div>
            </div>
        </div>

        <div class="w-full rounded-lg px-4 py-2 bg-white min-h-[60dvh] my-4">
            <h1 class="text-[1.5rem] font-semibold mb-4">Data Booking</h1>
            <div class="w-full flex justify-end items-center">
                <div class="input-group">
                    <select v-model="month_count">
                        <option value="0">Semua</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
                <button 
                class="bg-secondary px-4 py-1 text-white rounded-md"
                @click="exportData">Export</button>
            </div>
            <table class="w-full table-auto overflow-scroll">
                <thead class="text-xs text-gray-700 bg-gray-100">
                    <tr>
                        <th scope="col" class="px-6 py-3 rounded-l-xl">
                            Nama Penghuni
                        </th>
                        <th scope="col" class="px-6 py-3">
                            No. Kamar
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Durasi
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Tanggal
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Harga
                        </th>
                        <th scope="col" class="px-6 py-3 rounded-r-xl">
                            Bukti
                        </th>
                        <th scope="col" class="px-6 py-3 rounded-r-xl">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody class="text-xs font-normal">
                    <tr v-for="b in bookings">
                        <th scope="col" class="px-6 py-3 font-normal">
                            {{ b.user.nama }}
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            {{ b.room.lantai }} : {{ b.room.nomorKamar }}
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            {{ moment(b.startDate).format('DD MMM YYYY') }} - {{
                                moment(b.endDate).format('DD MMM YYYY') }}
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            {{ moment(b.createdAt).format('DD MMM YYYY') }}
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            {{ moneyFormatter.format(b.totalPrice) }}
                        </th>
                        <th scope="col" class="px-6 font-normal">

                            <a :href="b.transferProof" target="_blank" class="flex justify-center items-center">
                                <img :src="b.transferProof" class="w-[30px] h-[30px]" alt="">
                            </a>
                        </th>
                        <th scope="col" class="px-6 py-3 font-normal">
                            <el-tag type="success" v-if="b.paymentStatus">LUNAS</el-tag>
                            <el-tag type="info" v-else>PENDING</el-tag>
                        </th>
                    </tr>
                </tbody>
            </table>
            <div class="w-full flex justify-center items-center" v-if="limit < total">
                <button @click="limit += 10" class="px-4 py-1 rounded-xl text-white bg-primary">Load More</button>
            </div>
        </div>
    </div>
</template>