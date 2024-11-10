<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
const router = useRouter()
const {loginAdmin} = useAuthStore()
const payload = ref<{email: string; password:string}>({
    password: '',
    email: '',
})
const rules = {
    password: { required },
    email: { required }
}
const v$ = useVuelidate(rules, payload.value)

const submit = () => {
    v$.value.$touch()
    if (!v$.value.$invalid) {
        apiAdminLogin(payload.value.email, payload.value.password)
            .then((res) => {
                if (res.data.code == 200) {
                    useSwal()
                        .fire({
                            title: 'Success',
                            text: 'Login Success',
                            icon: 'success'
                        })
                        .then(() => {
                            loginAdmin(res.data.data.token, res.data.data.admin)
                            router.push({ name: 'admin-dashboard' })
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
        <h1 class="text-[2rem] text-white font-bold">Login Admin</h1>
        <div class="w-1/2 flex flex-col bg-white rounded-lg shadow-md p-4">
            <div class="input-group">
                <label for="">Username</label>
                <input type="text" v-model="payload.email">
                <div v-for="error of v$.email.$errors" :key="error.$uid">
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

            <button class="btn-primary" @click="submit">Submit</button>
        </div>
    </div>
</template>