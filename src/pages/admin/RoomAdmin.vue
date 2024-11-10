<script setup lang="ts">
import { moneyFormatter } from '@/helpers/common';
import { CreateRoom, Room, RoomType } from '@/types';
import { ElNotification } from 'element-plus';
const { setLoading, removeLoading } = useLoaderStore()
const listRoom = ref<Room[]>([]), limit = ref<number>(10), total = ref<number>(0)
const listRoomType = ref<RoomType[]>([])

const getListRoomType = () => {
    setLoading()
    apiRommTypeFind(999)
        .then((res) => {
            if (res.data.code == 200) {
                listRoomType.value = res.data.data.rows
            }
        })
        .finally(() => {
            removeLoading()
        })
}
const getListRoom = () => {
    setLoading()
    apiRoomAll(limit.value)
        .then((res) => {
            if (res.data.code == 200) {
                listRoom.value = res.data.data.rows
                total.value = res.data.data.meta.total
            }
        })
        .finally(() => {
            removeLoading()
        })
}

const payload = ref<CreateRoom>({
    lantai: 0,
    nomorKamar: 0,
    roomTypeId: 0,
    status: ''
})
const popup = ref<boolean>(false)

const roomUpdate = ref<Room>()
const showPopup = (data?: Room) => {
    if (data) {
        roomUpdate.value = data
        payload.value = {
            lantai: data.lantai,
            nomorKamar: data.nomorKamar,
            roomTypeId: data.room_type_id,
            status: data.status
        }
    }
    popup.value = true
}
const closePopup = () => {
    payload.value = {
        lantai: 0,
        nomorKamar: 0,
        roomTypeId: 0,
        status: ''
    }
    roomUpdate.value = undefined
    popup.value = false
}

const sendData = () => {
    if (!roomUpdate.value) {
        //create
        setLoading()
        apiRoomCreate(payload.value)
            .then((res) => {
                if (res.error) {
                    ElNotification({
                        title: 'Error',
                        message: 'Error Update Room Type',
                        type: 'error',
                    })
                    return
                }
                ElNotification({
                    title: 'Success',
                    message: 'Success Update Room Type',
                    type: 'success',
                })
                getListRoom()
            })
            .catch((err) => {
                console.log(err)
                ElNotification({
                    title: 'Error',
                    message: 'Error Update Room Type',
                    type: 'error',
                })
                return
            })
            .finally(() => {
                removeLoading()
                closePopup()
            })
    } else {
        //update
        setLoading()
        apiRoomUpdate(roomUpdate.value.id, payload.value)
            .then((res) => {
                if (res.error) {
                    ElNotification({
                        title: 'Error',
                        message: 'Error Update Room Type',
                        type: 'error',
                    })
                    return
                }
                ElNotification({
                    title: 'Success',
                    message: 'Success Update Room Type',
                    type: 'success',
                })
                getListRoom()
            })
            .catch((err) => {
                console.log(err)
                ElNotification({
                    title: 'Error',
                    message: 'Error Update Room Type',
                    type: 'error',
                })
                return
            })
            .finally(() => {
                removeLoading()
                closePopup()
            })
    }
}

const deleteRoom = (id: string) => {
    useSwal()
        .fire({
            title: 'Delete Room Type',
            text: 'This action can\'t be undone!',
            icon: 'warning',
            showCancelButton: true
        })
        .then((res) => {
            if (res.isConfirmed) {
                setLoading()
                apiRoomDelete(id)
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
                        getListRoom()
                    })
            }
        })
}
onMounted(() => {
    getListRoomType()
    getListRoom()
})

watch(() => limit.value, () => {
    getListRoom()
})


</script>
<template>
    <el-dialog v-model="popup" title="Tips" width="500" :show-close="false" @close="closePopup">
        <div class="input-group">
            <label for="">Lantai</label>
            <input type="number" v-model="payload.lantai">
        </div>

        <div class="input-group">
            <label for="">Nomor Kamar</label>
            <input type="number" v-model="payload.nomorKamar">
        </div>

        <div class="input-group">
            <label for="">Status</label>
            <select v-model="payload.status">
                <option value="available">Ada</option>
                <option value="booked">Terisi</option>
                <option value="maintenance">Perbaikan</option>
            </select>
        </div>

        <div class="input-group">
            <label for="">Room Type</label>
            <select v-model="payload.roomTypeId">
                <option value="" disabled selected>--Pilih Room Type--</option>
                <option v-for="rt in listRoomType" :value="rt.id">{{ rt.nama }} ({{ moneyFormatter.format(rt.harga) }})
                </option>
            </select>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closePopup">Cancel</el-button>
                <el-button type="primary" @click="sendData">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
    <div class="w-full min-h-[80dvh] bg-white p-4">
        <button @click="showPopup()" class="btn-primary">+ Add Room</button>
        <table class="w-full table-auto overflow-scroll my-4">
            <thead class="text-xs text-gray-700 bg-gray-100 rounded-xl">
                <tr>
                    <th scope="col" class="px-6 py-3 ">
                        Lantai
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Nomor Kamar
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Status
                    </th>
                    <th scope="col" class="px-6 py-3">
                        #
                    </th>
                </tr>
            </thead>
            <tbody class="text-xs font-normal">
                <tr v-for="b in listRoom">
                    <th scope="col" class="px-6 py-3 font-bold">
                        {{ b.lantai }}
                    </th>
                    <th scope="col" class="px-6 py-3 font-normal">
                        {{ b.nomorKamar }}
                    </th>
                    <th scope="col" class="px-6 py-3 font-normal">
                        <el-tag type="success" effect="dark" v-if="b.status.toLowerCase() == 'available'">Ada</el-tag>
                        <el-tag type="warning" effect="dark"
                            v-else-if="b.status.toLowerCase() == 'booked'">Terisi</el-tag>
                        <el-tag type="danger" effect="dark"
                            v-else-if="b.status.toLowerCase() == 'maintenance'">Perbaikan</el-tag>
                    </th>
                    <th scope="col" class="px-6 py-3 flex justify-center gap-x-2">
                        <el-button type="primary" @click="showPopup(b)">Edit</el-button>
                        <el-button type="danger" @click="deleteRoom(b.id)">Delete</el-button>
                    </th>
                </tr>
            </tbody>
        </table>

        <div class="w-full flex justify-center items-center" v-if="limit < total">
            <button @click="limit += 10" class="px-4 py-1 rounded-xl text-white bg-primary">Load More</button>
        </div>
    </div>
</template>