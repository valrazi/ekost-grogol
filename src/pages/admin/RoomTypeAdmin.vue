<script setup lang="ts">
import { moneyFormatter } from '@/helpers/common';
import { CreateRoomType, RoomType } from '@/types';
import { ElNotification } from 'element-plus';
const { setLoading, removeLoading } = useLoaderStore()
const listRoomType = ref<RoomType[]>([]), limit = ref<number>(10), total = ref<number>(0)
const getListRoomType = () => {
    setLoading()
    apiRommTypeFind(limit.value)
        .then((res) => {
            if (res.data.code == 200) {
                listRoomType.value = res.data.data.rows
                total.value = res.data.data.meta.total
            }
        })
        .finally(() => {
            removeLoading()
        })
}

watch(() => limit.value, () => {
    getListRoomType()
})

const createPopup = ref<boolean>(false)
const showCreate = () => {
    createPopup.value = true
}
const closeCreate = () => {
    payloadCreate.value = {
        fasilitas: '',
        harga: 0,
        images: [],
        lebar: 0,
        nama: '',
        panjang: 0
    }
    selectedFiles.value = null
    thumbnailList.value = null
    createPopup.value = false
}

const payloadCreate = ref<CreateRoomType>({
    harga: 0,
    images: [],
    lebar: 0,
    panjang: 0,
    fasilitas: '',
    nama: ''
})
const selectedFiles = ref<File[] | null>(null)
const thumbnailList = ref<string[] | null>(null)
const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFilesArr: File[] = []
    const thumbnailListArr: string[] = []
    if (target.files && target.files.length) {
        for (let index = 0; index < target.files.length; index++) {
            const element = target.files[index];
            selectedFilesArr.push(element)
            thumbnailListArr.push(URL.createObjectURL(element))
        }
    }
    selectedFiles.value = selectedFilesArr
    thumbnailList.value = thumbnailListArr

}

const uploadImage = async (isUpdate?: boolean) => {
    if (!selectedFiles.value) {
        ElNotification({
            title: 'Warning',
            message: 'Please Select Image',
            type: 'warning',
        })
        return
    }
    setLoading()
    const formData = new FormData()
    selectedFiles.value.forEach((f) => {
        formData.append('images', f)
    })

    apiUploadMediaMulti(formData)
        .then((res) => {
            if (res.data.code == 200) {
                payloadCreate.value.images = res.data.data.map((i) => {
                    return {
                        objectKey: i.objectKey,
                        url: i.publicUrl
                    }
                })
                if (!isUpdate) createRoomType()
                else updateRoomType()
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            removeLoading()
        })
}

const createRoomType = () => {
    setLoading()
    apiRoomTypeCreate(payloadCreate.value)
        .then((res) => {
            if (res.error) {
                ElNotification({
                    title: 'Error',
                    message: 'Error Creating Room Type',
                    type: 'error',
                })
                return
            }
            ElNotification({
                title: 'Success',
                message: 'Success Create Room Type',
                type: 'success',
            })
            getListRoomType()
        })
        .catch((err) => {
            console.log(err)
            ElNotification({
                title: 'Error',
                message: 'Error Creating Room Type',
                type: 'error',
            })
            return
        })
        .finally(() => {
            removeLoading()
            closeCreate()
        })
}

const updateRoomType = () => {
    setLoading()
    apiRoomTypeUpdate(detailData.value?.id!,payloadCreate.value)
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
            getListRoomType()
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
            closeUpdate()
        })
}
const deleteRoomType = (id: string) => {
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
                apiRoomTypeDelete(id)
                    .then((res) => {
                        if (res.error) {
                            ElNotification({
                                title: 'Error',
                                message: 'Error Delete Room Type',
                                type: 'error',
                            })
                            return
                        }
                        ElNotification({
                            title: 'Success',
                            message: 'Success Delete Room Type',
                            type: 'success',
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        ElNotification({
                            title: 'Error',
                            message: 'Error Delete Room Type',
                            type: 'error',
                        })
                    })
                    .finally(() => {
                        removeLoading()
                        getListRoomType()
                    })
            }
        })
}

const updatePopup = ref<boolean>(false)
const detailData = ref<RoomType | null>()
const showUpdate = (r: RoomType) => {
    detailData.value = r
    payloadCreate.value = {
        fasilitas: r.fasilitas,
        harga: r.harga,
        images: r.images,
        lebar: r.lebar,
        nama: r.nama,
        panjang: r.panjang
    }
    thumbnailList.value = r.images.map((i) => {
        return i.url
    })
    updatePopup.value = true
}
const closeUpdate = () => {
    updatePopup.value = false
    detailData.value = null
    payloadCreate.value = {
        fasilitas: '',
        harga: 0,
        images: [],
        lebar: 0,
        nama: '',
        panjang: 0
    }
    selectedFiles.value = null
    thumbnailList.value = null
}

onMounted(() => {
    getListRoomType()
})
</script>
<template>
    <el-dialog v-model="createPopup" title="Tips" width="500" :show-close="false" @close="closeCreate">
        <div class="input-group">
            <label for="">Nama</label>
            <input type="text" v-model="payloadCreate.nama">
        </div>

        <div class="input-group">
            <label for="">Harga</label>
            <input type="number" v-model="payloadCreate.harga">
        </div>

        <div class="input-group">
            <label for="">Panjang</label>
            <input type="number" v-model="payloadCreate.panjang">
        </div>

        <div class="input-group">
            <label for="">Lebar</label>
            <input type="number" v-model="payloadCreate.lebar">
        </div>

        <div class="input-group">
            <label for="">Fasilitas</label>
            <textarea rows="5" class="border-2" v-model="payloadCreate.fasilitas"></textarea>
        </div>

        <div class="input-group">
            <label for="">Foto</label>
            <input type="file" accept="image/*" multiple @change="onFileChange">
        </div>

        <div v-if="thumbnailList?.length" class="flex flex-wrap gap-x-4">
            <img v-for="t in thumbnailList" :src="t" alt="Image Preview"
                style="max-width: 100px; max-height: 100px; object-fit: cover;" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeCreate">Cancel</el-button>
                <el-button type="primary" @click="uploadImage(false)">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="updatePopup" title="Tips" width="500" :show-close="false" @close="closeUpdate">
        <div class="input-group">
            <label for="">Nama</label>
            <input type="text" v-model="payloadCreate.nama">
        </div>

        <div class="input-group">
            <label for="">Harga</label>
            <input type="number" v-model="payloadCreate.harga">
        </div>

        <div class="input-group">
            <label for="">Panjang</label>
            <input type="number" v-model="payloadCreate.panjang">
        </div>

        <div class="input-group">
            <label for="">Lebar</label>
            <input type="number" v-model="payloadCreate.lebar">
        </div>

        <div class="input-group">
            <label for="">Fasilitas</label>
            <textarea rows="5" class="border-2" v-model="payloadCreate.fasilitas"></textarea>
        </div>

        <div class="input-group">
            <label for="">Foto</label>
            <input type="file" accept="image/*" multiple @change="onFileChange">
        </div>

        <div v-if="thumbnailList?.length" class="flex flex-wrap gap-x-4">
            <img v-for="t in thumbnailList" :src="t" alt="Image Preview"
                style="max-width: 100px; max-height: 100px; object-fit: cover;" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeUpdate">Cancel</el-button>
                <el-button type="primary" @click="uploadImage(true)">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>

    <div class="w-full min-h-[80dvh] bg-white p-4">
        <button @click="showCreate" class="btn-primary">+ Add Room Type</button>
        <table class="w-full table-auto overflow-scroll my-4">
            <thead class="text-xs text-gray-700 bg-gray-100 rounded-xl">
                <tr>
                    <th scope="col" class="px-6 py-3 ">
                        Nama
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Harga
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Panjang
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Lebar
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Quantity
                    </th>
                    <th scope="col" class="px-6 py-3">
                        #
                    </th>
                </tr>
            </thead>
            <tbody class="text-xs font-normal">
                <tr v-for="b in listRoomType">
                    <th scope="col" class="px-6 py-3 font-bold">
                        {{ b.nama }}
                    </th>
                    <th scope="col" class="px-6 py-3 font-normal">
                        {{ moneyFormatter.format(b.harga) }}
                    </th>
                    <th scope="col" class="px-6 py-3 font-normal">
                        {{ b.panjang }}
                    </th>
                    <th scope="col" class="px-6 py-3 font-normal">
                        {{ b.lebar }}
                    </th>
                    <th scope="col" class="px-6 py-3 font-normal">
                        {{ b.rooms.length }}
                    </th>
                    <th scope="col" class="px-6 py-3 flex justify-center gap-x-2">
                        <el-button type="primary" @click="showUpdate(b)">Edit</el-button>
                        <el-button type="danger" @click="deleteRoomType(b.id)">Delete</el-button>
                    </th>
                </tr>
            </tbody>
        </table>

        <div class="w-full flex justify-center items-center" v-if="limit < total">
            <button @click="limit += 10" class="px-4 py-1 rounded-xl text-white bg-primary">Load More</button>
        </div>
    </div>
</template>