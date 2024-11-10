<script setup lang="ts">
import { CreateUser } from '@/types';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
const router = useRouter()
const payload = ref<CreateUser>({
    email: '',
    jenisKelamin: '',
    nama: '',
    password: '',
    pekerjaan: '',
    username: '',
    whatsappNumber: ''
})
const rules = {
    email: { required },
    jenisKelamin: { required },
    nama: { required },
    password: { required },
    pekerjaan: { required },
    username: { required },
    whatsappNumber: { required }
}
const v$ = useVuelidate(rules, payload.value)

const submit = () => {
    v$.value.$touch()
    if (!v$.value.$invalid) {
        apiUserRegister(payload.value)
            .then((res) => {
                if (res.data.code == 200) {
                    useSwal()
                        .fire({
                            title: 'Success',
                            text: 'Acoount Success Registered',
                            icon: 'success'
                        })
                        .then(() => {
                            router.push({ name: 'user-login' })
                        })
                } else {
                    useSwal()
                        .fire({
                            title: 'Failed',
                            text: res.error?.message,
                            icon: 'error'
                        })
                }
            })
            .catch((err) => {
                console.log(err)
                useSwal()
                    .fire({
                        title: 'Failed',
                        text: 'Acoount Failed Registered',
                        icon: 'error'
                    })
            })
    }
}
</script>
<template>
    <div class="w-full min-h-dvh bg-secondary flex flex-col gap-y-4 justify-center items-center">
        <h1 class="text-[2rem] text-white font-bold">Create an Account</h1>
        <div class="w-1/2 flex flex-col bg-white rounded-lg shadow-md p-4">
            <div class="input-group">
                <label for="">Email</label>
                <input type="email" class="" v-model="payload.email">
                <div v-for="error of v$.email.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>

            <div class="input-group">
                <label for="">Username</label>
                <input type="text" v-model="payload.username">
                <div v-for="error of v$.username.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>
            <div class="input-group">
                <label for="">Password</label>
                <input type="password" v-model="payload.password">
                <div v-for="error of v$.password.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>

            <div class="input-group">
                <label for="">Nama Lengkap</label>
                <input type="text" v-model="payload.nama">
                <div v-for="error of v$.nama.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>

            <div class="input-group">
                <label for="">No. Whatsapp</label>
                <input type="text" v-model="payload.whatsappNumber">
                <div v-for="error of v$.whatsappNumber.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>

            <div class="input-group">
                <label for="">Pekerjaan</label>
                <select v-model="payload.pekerjaan">
                    <option value="" selected disabled>--Pilih Pekerjaan--</option>
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="karyawan">Karyawan</option>
                </select>
                <div v-for="error of v$.pekerjaan.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>

            <div class="input-group">
                <select v-model="payload.jenisKelamin">
                    <option value="" selected disabled>--Pilih Jenis Kelamin--</option>
                    <option value="pria">Pria</option>
                    <option value="wanita">Wanita</option>
                </select>
                <div v-for="error of v$.jenisKelamin.$errors" :key="error.$uid">
                    <div class="text-red-500">{{ error.$message }}</div>
                </div>
            </div>


            <button class="btn-primary" @click="submit">Submit</button>
        </div>
    </div>
</template>