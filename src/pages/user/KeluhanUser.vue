<script setup lang="ts">
import { Booking, CreateKeluhan, Keluhan } from '@/types';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { ElNotification } from 'element-plus';
import moment from 'moment';
const router = useRouter()
const { setLoading, removeLoading } = useLoaderStore()
const activeBooking = ref<Booking>()
const listKeluhan = ref<Keluhan[]>([])

const getActiveBooking = () => {
    setLoading()
    apiCustomerBooking()
        .then((res) => {
            if (res.data.code == 200) {
                activeBooking.value = res.data.data
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            removeLoading()
            getListKeluhan()
        })
}

const getListKeluhan = () => {
    setLoading()
    apiKeluhanByBooking(activeBooking.value?.id!)
        .then((res) => {
            if (res.data.code == 200) {
                listKeluhan.value = res.data.data
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            removeLoading()
        })
}

const keluhanPopup = ref<boolean>(false)
const payloadKeluhan = ref<CreateKeluhan>({
    bookingId: '',
    message: ''
})
const rules = {
    message: { required }
}
const v$ = useVuelidate(rules, payloadKeluhan.value)

const showKeluhan = () => {
    payloadKeluhan.value.message = ''
    keluhanPopup.value = true
}
const submit = () => {
    v$.value.$touch()
    if (!v$.value.$invalid) {
        setLoading()
        payloadKeluhan.value.bookingId = activeBooking.value?.id!
        apiKeluhanCreate(payloadKeluhan.value)
            .then((res) => {
                if (res.error) {
                    ElNotification({
                        title: 'Error',
                        message: 'Error Send Keluhan',
                        type: 'error'
                    })
                    return
                }
                ElNotification({
                    title: 'Success',
                    message: 'Success Send Keluhan',
                    type: 'success'
                })
            })
            .catch((err) => {
                console.log(err)
                ElNotification({
                    title: 'Error',
                    message: 'Error Send Keluhan',
                    type: 'error'
                })
            })
            .finally(() => {
                removeLoading()
                getActiveBooking()
                keluhanPopup.value = false
            })
    }
}
onMounted(() => {
    getActiveBooking()
})
</script>
<template>
    <el-dialog v-model="keluhanPopup" title="Tambah Keluhan" width="80%" :show-close="false">
        <div class="w-full flex justify-center items-center">
            <div class="flex flex-col w-1/2 items-center ">
                <label for="" class="text-primary text-[2rem] font-bold">Anda Memiliki Keluhan?</label>
                <textarea class="border-2 shadow-md w-full rounded-lg bg-gray-50" rows="10" cols="10"
                    v-model="payloadKeluhan.message"></textarea>
                <div v-for="error of v$.message.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="keluhanPopup = false">Close</el-button>
                <el-button type="primary" @click="submit">
                    Submit
                </el-button>
            </div>
        </template>
    </el-dialog>
    <div class="w-full min-h-dvh">
        <div class="my-header w-full flex justify-between p-4">
                <button @click="router.go(-1)" class="text-secondary text-[2rem]"><font-awesome-icon
                        :icon="['fas', 'circle-chevron-left']" /></button>
            </div>
        <div class="w-full min-h-dvh flex  justify-center ">
            <div class="w-full max-h-[50dvh] flex flex-col justify-center items-center ">
                <h1 class="text-primary font-bold text-[3rem]">Keluhan Anda</h1>
                <div class="w-full flex justify-center items-center">
                    <button @click="showKeluhan" class="bg-primary px-4 py-2 rounded-xl text-white">+ Tambah
                        Keluhan</button>
                </div>
                <div class="w-1/2 max-h-[50dvh] overflow-y-scroll my-2" v-if="listKeluhan.length">
                    <div v-for="k in listKeluhan"
                        class="w-full bg-gray-100 p-2 rounded-xl shadow-md border border-gray-200 my-4">
                        <el-tag type="warning" v-if="!k.responded">Belum Ditanggapi</el-tag>
                        <el-tag type="success" v-else>Sudah Ditanggapi</el-tag>
                        <h1 class="text-xs mt-2">Lantai {{ k.booking.room.lantai }} : Kamar {{ k.booking.room.nomorKamar
                            }}
                            ({{ moment(k.createdAt).format('DD MMM YYYY') }})</h1>
                        <h1 class="italic">{{ k.message }}</h1>
                        <div class="text-xs" v-if="k.responded">
                            <h1>Balasan Admin: {{ k.reply }}</h1>
                            <h1>Ditanggapi Pada: {{ moment(k.respondedAt).format('DD MMM YYYY') }}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>