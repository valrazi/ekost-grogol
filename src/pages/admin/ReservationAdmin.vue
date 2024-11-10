<script setup lang="ts">
import { Reservation } from '@/types';
import { ElNotification } from 'element-plus';
import moment from 'moment';

const { setLoading, removeLoading } = useLoaderStore()
const listReservation = ref<Reservation[]>([]), limit = ref<number>(999), total = ref<number>(0)

const getListReservation = () => {
    setLoading()
    apiReservationAll(limit.value)
        .then((res) => {
            if (res.data.code == 200) {
                listReservation.value = res.data.data.rows
                total.value = res.data.data.meta.total
            }
        })
        .finally(() => {
            removeLoading()
        })
}

const showPopup = (reservation: Reservation) => {
    useSwal()
        .fire({
            title: 'Accept Reservation?',
            icon: 'question',
            showCancelButton: true
        })
        .then((res) => {
            if (res.isConfirmed) {
                setLoading()
                apiReservationAccept(reservation.id)
                    .then((res) => {
                        if (res.error) {
                            ElNotification({
                                title: 'Error',
                                message: 'Error Accept Reservation',
                                type: 'error',
                            })
                            return
                        }
                        ElNotification({
                            title: 'Success',
                            message: 'Success Accept Reservation',
                            type: 'success',
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        ElNotification({
                            title: 'Error',
                            message: 'Error Accept Reservation',
                            type: 'error',
                        })
                    })
                    .finally(() => {
                        removeLoading()
                        getListReservation()
                    })
            }
        })
}

onMounted(() => {
    getListReservation()
})
</script>
<template>
    <div class="w-full min-h-dvh p-4">
        <h1 class="font-bold text-[2rem]">Notifikasi Visit</h1>
        <div class="w-full max-h-[80dvh] overflow-y-scroll gap-x-4">
            <div v-for="n in listReservation" class="flex justify-center items-center gap-x-4">
                <div class="bg-white bg-opacity-80 border flex gap-x-4 w-[80%]  p-4 rounded-lg  my-4">
                    <div @click="showPopup(n)" :class="{ 'bg-secondary': n.isAccepted }"
                        class="w-[50px] h-[50px] rounded-xl bg-gray-100 border bg-opacity-20 cursor-pointer">
                    </div>
                    <div>
                        <h1>{{n.phoneNumber}} - {{ n.nama }}</h1>
                        <h1 class="text-xs italic mt-2">{{ moment(n.dateReservation).format('DD MMM YYYY') }}</h1>
                        <h1 class="text-xs italic ">{{ n.time }}</h1>
                        <a v-if="n.isAccepted" :href="`https://wa.me/${n.phoneNumber}`" target="_blank" class="text-sm text-secondary">Kirim Notifikasi</a>
                    </div>
                </div>
                <!-- <div @click="hideKeluhan(n.id)"
                    class="w-[50px] h-[50px] rounded-full  bg-opacity-20 cursor-pointer text-3xl flex justify-center items-center text-red-500">
                    <font-awesome-icon :icon="['fas', 'circle-xmark']" />
                </div> -->
            </div>
        </div>
    </div>
</template>