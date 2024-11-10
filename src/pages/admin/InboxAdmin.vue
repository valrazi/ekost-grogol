<script setup lang="ts">
import { Keluhan } from '@/types';
import { ElNotification } from 'element-plus';
const { setLoading, removeLoading } = useLoaderStore()
const listKeluhan = ref<Keluhan[]>([])

const getListKeluhan = () => {
    setLoading()
    apiKeluhanList({
        from_admin:'true'
    })
        .then((res) => {
            if (res.data.code == 200) {
                listKeluhan.value = res.data.data
            }
        })
        .finally(() => {
            removeLoading()
        })
}

const respondPopup = ref<boolean>(false), replyText = ref<string>('')
const showPopup = (keluhan: Keluhan) => {
    keluhanUpdate.value = keluhan
    respondPopup.value = true
}
const closePopup = () => {
    replyText.value = ''
    respondPopup.value = false
}

const keluhanUpdate = ref<Keluhan>()
const respondKeluhan = () => {
    setLoading()
    apiKeluhanRespond(keluhanUpdate.value?.id!, replyText.value)
        .then((res) => {
            if (res.error) {
                ElNotification({
                    title: 'Error',
                    message: 'Error Respond Keluhan',
                    type: 'error',
                })
                return
            }
            ElNotification({
                title: 'Success',
                message: 'Success Respond Keluhan',
                type: 'success',
            })
        })
        .catch((err) => {
            console.log(err)
            ElNotification({
                title: 'Error',
                message: 'Error Respond Keluhan',
                type: 'error',
            })
        })
        .finally(() => {
            respondPopup.value = false
            removeLoading()
            getListKeluhan()
        })
}

const hideKeluhan = (k_id: string) => {
    useSwal()
        .fire({
            title: 'Hide Keluhan?',
            text: 'This action can\'t be undone',
            icon: 'warning',
            showCancelButton: true
        })
        .then((res) => {
            if (res.isConfirmed) {
                setLoading()
                apiKeluhanHide(k_id)
                    .then((res) => {
                        if (res.error) {
                            ElNotification({
                                title: 'Error',
                                message: 'Error Respond Keluhan',
                                type: 'error',
                            })
                            return
                        }
                        ElNotification({
                            title: 'Success',
                            message: 'Success Respond Keluhan',
                            type: 'success',
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        ElNotification({
                            title: 'Error',
                            message: 'Error Respond Keluhan',
                            type: 'error',
                        })
                    })
                    .finally(() => {
                        removeLoading()
                        getListKeluhan()
                    })
            }
        })
}
onMounted(() => {
    getListKeluhan()
})
</script>
<template>
    <el-dialog v-model="respondPopup" title="Tips" width="500" @close="closePopup">
        <div class="input-group">
            <label for="">Balasan</label>
            <textarea v-model="replyText" class="border"></textarea>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closePopup">Cancel</el-button>
                <el-button type="primary" @click="respondKeluhan">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
    <div class="w-full min-h-dvh p-4">
        <h1 class="font-bold text-[2rem]">Notifikasi Keluhan</h1>
        <div class="w-full max-h-[80dvh] overflow-y-scroll gap-x-4">
            <div v-for="n in listKeluhan" class="flex justify-center items-center gap-x-4">
                <div class="bg-white bg-opacity-80 border flex gap-x-4 w-[80%]  p-4 rounded-lg  my-4">
                    <div @click="showPopup(n)" :class="{ 'bg-secondary': n.responded }"
                        class="w-[50px] h-[50px] rounded-xl bg-gray-100 border bg-opacity-20 cursor-pointer">
                    </div>
                    <div>
                        <h1>{{ n.booking.user.nama }}</h1>
                        <h1 class="text-xs italic mt-2">{{ n.booking.room.lantai }} : {{ n.booking.room.nomorKamar }}
                        </h1>
                        <h1 class="text-xs italic ">{{ n.message }}</h1>
                        <h1 v-if="n.responded" class="text-sm">Balasan: {{ n.reply }}</h1>
                    </div>
                </div>
                <div @click="hideKeluhan(n.id)"
                    class="w-[50px] h-[50px] rounded-full  bg-opacity-20 cursor-pointer text-3xl flex justify-center items-center text-red-500">
                    <font-awesome-icon :icon="['fas', 'circle-xmark']" />
                </div>
            </div>
        </div>
    </div>
</template>