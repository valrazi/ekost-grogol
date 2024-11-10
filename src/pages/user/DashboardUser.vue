<script setup lang="ts">
import { apiUploadMediaSingle } from '@/api/media';
import { moneyFormatter } from '@/helpers/common';
import { Booking, CreateBooking, Room, RoomType } from '@/types';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { ElNotification } from 'element-plus'
const { setLoading, removeLoading } = useLoaderStore()
import moment from 'moment'
const router = useRouter()
const roomTypes = ref<RoomType[]>([])
const roomTypeSelected = ref<string>()
const rooms = ref<Room[]>([])
const roomsSelected = ref<string>()

const activeBooking = ref<Booking>()
const getLatestBooking = () => {
    setLoading()
    apiCustomerBooking()
        .then((res) => {
            if (res.data.code == 200) {
                activeBooking.value = res.data.data
                activeBooking.value.startDate = moment(activeBooking.value.startDate).format('YYYY-MM-DD')
                activeBooking.value.endDate = moment(activeBooking.value.endDate).format('YYYY-MM-DD')
                return
            }
        })
        .finally(() => {
            removeLoading()
        })
}

const getRoomType = () => {
    setLoading()
    apiGetRoomType()
        .then((res) => {
            if (res.data.code == 200) {
                roomTypes.value = res.data.data.rows
            }
        })
        .finally(() => {
            removeLoading()
        })
}

watch(() => roomTypeSelected.value, () => {
    if (roomTypeSelected.value) {
        roomsSelected.value = undefined
        rooms.value = roomTypes.value.find((rt) => rt.id == roomTypeSelected.value)?.rooms!
    }
})

const transferPopup = ref<boolean>(false)
const selectedFile = ref<File | null>(null);
const thumbnailUrl = ref<string | null>(null);
const transferProof = ref<string>('')
const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        selectedFile.value = target.files[0];

        // Release any previously created URL to prevent memory leaks
        if (thumbnailUrl.value) {
            URL.revokeObjectURL(thumbnailUrl.value);
        }

        // Create a new object URL for the selected image
        thumbnailUrl.value = URL.createObjectURL(selectedFile.value);
    }
};

const uploadImage = async () => {
    if (!selectedFile.value) {
        ElNotification({
            title: 'Warning',
            message: 'Please Select Image',
            type: 'warning',
        })
        return
    };
    setLoading()
    const formData = new FormData();
    formData.append('images', selectedFile.value);

    apiUploadMediaSingle(formData)
        .then((res) => {
            if (res.data.code == 200) {
                payloadBooking.value.transferProof = res.data.data.publicUrl
                console.log(res.data.data.publicUrl)
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            createBooking()
            removeLoading()
        })
};

const payloadBooking = ref<CreateBooking>({
    startDate: '',
    endDate: '',
    roomId: null,
    transferProof: transferProof.value
})

const rules = {
    startDate: { required },
    endDate: { required },
    roomId: { required },
}
const v$ = useVuelidate(rules, payloadBooking.value)
const totalPrice = ref<number>(1)
const showTransfer = () => {
    v$.value.$touch()
    const start = moment(payloadBooking.value.startDate)
    const end = moment(payloadBooking.value.endDate)
    if (start.isAfter(end)) {
        ElNotification({
            title: 'Warning',
            message: 'Tanggal Mulai Tidak Boleh Melebihi Tanggal Selesai',
            type: 'warning'
        })
        return
    }
    if (!v$.value.$invalid) {
        const roomType = roomTypes.value.find((rt) => rt.id == roomTypeSelected.value)
        const diff = Math.ceil(end.diff(start, 'weeks'))
        if (diff < 4) {
            totalPrice.value = !diff ? (roomType?.harga! / 4) * 1 : (roomType?.harga! / 4) * diff
        } else {
            const diffMonth = Math.ceil(end.diff(start, 'months'))
            totalPrice.value = roomType?.harga! * diffMonth
        }
        transferPopup.value = true
    }
}
const createBooking = () => {
    v$.value.$touch()
    if (!v$.value.$invalid) {
        setLoading()
        apiCreateBooking(payloadBooking.value)
            .then((res) => {
                if (res.error) {
                    ElNotification({
                        title: 'Failed',
                        message: res.error.message,
                        type: 'error'
                    })
                } else {
                    getLatestBooking()
                }
            })
            .catch((err) => {
                console.log(err)
                ElNotification({
                    title: 'Failed',
                    message: 'Booking Failed',
                    type: 'error'
                })
            })
            .finally(() => {
                transferPopup.value = false
                removeLoading()
            })
    }
}

const showKeluhan = () => {
    if(!activeBooking.value || !activeBooking.value.paymentStatus) {
        ElNotification({
            title:'Warning',
            message:'No Booking Active!',
            type:'warning'
        })
        return
    }
    router.push({name: 'user-keluhan'})
}

onMounted(() => {
    getRoomType()
    getLatestBooking()
})
onUnmounted(() => {
    if (thumbnailUrl.value) {
        URL.revokeObjectURL(thumbnailUrl.value);
    }
});
</script>
<template>
    <el-dialog v-model="transferPopup" :show-close="false" :fullscreen="true" style="background-color: #f3f4f6;">
        <template #header="{ close }">
            <div class="my-header w-full flex justify-between">
                <button @click="close" class="text-secondary text-[2rem]"><font-awesome-icon
                        :icon="['fas', 'circle-chevron-left']" /></button>
            </div>
        </template>
        <div class="w-full h-full flex flex-col justify-center items-center">
            <h1 class="text-[2rem]">Lakukan Pembayaran</h1>
            <div class="w-[50%] py-4 h-full bg-white flex flex-col justify-center items-center">
                <h1>Silahkan lakukan scan QR dibawah</h1>
                <img src="https://pub-1d32d4ccfc5d47758db60374c9329a3a.r2.dev/qr.jpeg" class="w-1/2" alt="">
                <div class="w-full flex justify-center">
                    <h1>Total {{ moneyFormatter.format(totalPrice) }}</h1>
                </div>
                <div class="input-group">
                    <label for="">Bukti Transfer</label>
                    <input type="file" @change="onFileChange" accept="image/*">
                </div>

                <div v-if="thumbnailUrl" class="thumbnail">
                    <img :src="thumbnailUrl" alt="Image Preview"
                        style="max-width: 150px; max-height: 150px; object-fit: cover;" />
                </div>

                <div @click="uploadImage" class="w-full flex justify-center items-center my-4">
                    <button class="btn-primary">Upload Bukti</button>
                </div>
            </div>
        </div>
    </el-dialog>
    <div class="w-full min-h-dvh bg-cover bg-bottom relative flex bg-gr"
        style="background-image: url('https://pub-1d32d4ccfc5d47758db60374c9329a3a.r2.dev/bg-room.jpg');">

        <div class="w-1/2 min-h-dvh bg-secondary flex flex-col px-4 py-8" v-if="!activeBooking">
            <h1 class="text-white text-[2.5rem] font-bold px-[1rem]">Form Booking</h1>

            <div class="w-full mt-4">
                <label for="" class="px-[1rem] font-semibold text-white">Durasi Menyewa</label>
                <div class="flex items-center justify-center gap-x-4 w-full">
                    <div class="input-group w-full">
                        <label for="" class="font-semibold text-white">Tanggal Mulai</label>
                        <input type="date" placeholder="Tanggal Mulai" v-model="payloadBooking.startDate">
                        <div v-for="error of v$.startDate.$errors" :key="error.$uid">
                            <div class="text-red-500">{{ error.$message }}</div>
                        </div>
                    </div>
                    <span class=" text-white font-bold text-center translate-y-3">-</span>
                    <div class="input-group w-full">
                        <label for="" class="font-semibold text-white">Tanggal Selesai</label>
                        <input type="date" placeholder="Tanggal Selesai" v-model="payloadBooking.endDate">
                        <div v-for="error of v$.endDate.$errors" :key="error.$uid">
                            <div class="text-red-500">{{ error.$message }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="input-group ">
                <label for="" class="font-semibold text-white">Tipe Kamar</label>
                <select v-model="roomTypeSelected">
                    <option value="" selected disabled>--Pilih Tipe Kamar--</option>
                    <option :value="r.id" v-for="r in roomTypes" :disabled="!r.rooms.length">
                        {{ r.nama }} ({{ moneyFormatter.format(r.harga) }})
                    </option>
                </select>
                <div v-for="error of v$.roomId.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>

            <div class="input-group " v-if="rooms.length">
                <label for="" class="font-semibold text-white">Kamar</label>
                <select v-model="payloadBooking.roomId">
                    <option value="" selected disabled>--Pilih Kamar--</option>
                    <option :value="r.id" v-for="r in rooms">
                        Lantai {{ r.lantai }} : Nomor {{ r.nomorKamar }}
                    </option>
                </select>
                <div v-for="error of v$.roomId.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>

            <div class="w-full flex px-[1rem]">
                <div class="w-1/5">
                    <button @click="showTransfer" class="px-8 py-1.5 rounded-xl bg-white">Submit</button>
                </div>
            </div>
        </div>
        <div class="w-1/2 min-h-dvh bg-secondary flex flex-col px-4 py-8" v-else>
            <div class="px-[1rem]">
                <el-alert :closable="false" v-if="!activeBooking.paymentStatus" title="Booking Detail" type="info"
                    description="Mohon Tunggu Admin Konfirmasi Pembayaran Anda." show-icon />
                <el-alert :closable="false" v-else title="Booking Detail" type="success"
                    description="Booking Sudah Terverifikasi!" show-icon />
            </div>
            <h1 class="text-white text-[2.5rem] font-bold px-[1rem]">Detail Booking</h1>

            <div class="w-full mt-4">
                <label for="" class="px-[1rem] font-semibold text-white">Durasi Menyewa</label>
                <div class="flex items-center justify-center gap-x-4 w-full">
                    <div class="input-group w-full text-white">
                        <label for="" class="font-semibold ">Tanggal Mulai</label>
                        <input type="date" placeholder="Tanggal Mulai" disabled v-model="activeBooking.startDate">
                    </div>
                    <span class=" text-white font-bold text-center translate-y-3">-</span>
                    <div class="input-group w-full text-white">
                        <label for="" class="font-semibold ">Tanggal Selesai</label>
                        <input type="date" placeholder="Tanggal Selesai" disabled v-model="activeBooking.endDate">
                    </div>
                </div>
            </div>

            <div class="input-group ">
                <label for="" class="font-semibold text-white">Tipe Kamar</label>
                <select v-model="activeBooking.room.room_type_id" disabled>
                    <option value="" selected disabled>--Pilih Tipe Kamar--</option>
                    <option :value="r.id" v-for="r in roomTypes" :disabled="!r.rooms.length">
                        {{ r.nama }} ({{ moneyFormatter.format(r.harga) }})
                    </option>
                </select>
            </div>

            <div class="input-group ">
                <label for="" class="font-semibold text-white">Kamar</label>
                <select disabled>
                    <option value="" selected disabled>Lantai {{ activeBooking.room.lantai }} : Nomor {{
                        activeBooking.room.nomorKamar }}</option>
                </select>
            </div>

            <p class="px-[1rem] text-white font-bold text-[1rem]">Harga: {{
                moneyFormatter.format(activeBooking.totalPrice)
            }}</p>

        </div>

        <div class="absolute bottom-32  right-10 flex flex-col  items-end justify-end gap-y-1">
            <h1 class="bg-white flex text-xl w-[50%] p-4 rounded-xl shadow-md" >Hi! kamu memiliki keluhan
                mengenai kost ini?
                silahkan isi keluhan disini!</h1>
            <button @click="showKeluhan" class=" bg-primary rounded-full w-[4rem] h-[4rem] text-[2rem] text-white">
                <font-awesome-icon :icon="['fas', 'comment-dots']" />
            </button>
        </div>
    </div>
</template>