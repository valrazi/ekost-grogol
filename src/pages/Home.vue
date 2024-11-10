<script setup lang="ts">
import { RoomType } from "@/types";
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import "swiper/css";
import { moneyFormatter } from "@/helpers/common";
const router = useRouter()
const benefits = ref([
  {
    text: "Free Wifi",
    iconName: "wifi",
    iconType: "fas",
  },
  {
    text: "200m ke UNTIRTA",
    iconName: "graduation-cap",
    iconType: "fas",
  },
  {
    text: "Dekat Kawasan Pabrik",
    iconName: "industry",
    iconType: "fas",
  },
  {
    text: "0km ke Cafetaria",
    iconName: "mug-saucer",
    iconType: "fas",
  },
  {
    text: "Satu Langkah ke Minimarket",
    iconName: "cart-shopping",
    iconType: "fas",
  },
  {
    text: "100m ke Transportasi Umum",
    iconName: "bus",
    iconType: "fas",
  },
  {
    text: "1km ke Rumah Sakit",
    iconName: "hospital",
    iconType: "fas",
  },
  {
    text: "CCTV 24 Jam",
    iconName: "video",
    iconType: "fas",
  },
  {
    text: "Ada Penjaga",
    iconName: "person-military-pointing",
    iconType: "fas",
  },
  {
    text: "Free Cleaning Service + Laundry",
    iconName: "broom",
    iconType: "fas",
  },
]);
const roomType = ref<RoomType[]>([]), total = ref<number>(), activeItem = ref<number>(0), arrActiveItem = ref<RoomType[]>([]);


const moveActiveItem = () => {
  arrActiveItem.value = roomType.value.slice(activeItem.value, activeItem.value + 3)
}

const fetchRoomType = async () => {
  apiGetRoomType().then((res) => {
    if (res.data.code == 200) {
      roomType.value = res.data.data.rows.map((r) => {
        if (r.images.length) r.activeImage = 0
        return r
      })
      total.value = res.data.data.total
      moveActiveItem()
    }
  });
};

const nextActive = () => {
  if ((activeItem.value + 3) < total.value!) {
    activeItem.value++
    moveActiveItem()
  }
}

const backActive = () => {
  if (activeItem.value > 0) {
    activeItem.value--
    moveActiveItem()
  }
}

const backImage = (id: string) => {
  const el = roomType.value.find(((e) => e.id == id))
  if (el?.activeImage! > 0) {
    roomType.value.find((e) => e.id == id)!.activeImage! -= 1
  }
  console.log(roomType.value.find((e) => e.id == id)!.activeImage!)
}

const nextImage = (id: string) => {
  const el = roomType.value.find(((e) => e.id == id))
  console.log({ el })
  if (el?.activeImage! < el?.images.length! - 1) {
    roomType.value.find((e) => e.id == id)!.activeImage! += 1
  }
  console.log(roomType.value.find((e) => e.id == id)!.activeImage!)
}

const reservationForm = ref({
  nama: '',
  phoneNumber: '',
  date: '',
  time: ''
})

const rules = {
  nama: { required },
  phoneNumber: { required },
  date: { required },
  time: { required }
}
const v$ = useVuelidate(rules, reservationForm.value)

const submitReservation = () => {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    apiCreateReservation(reservationForm.value)
      .then((res) => {
        if (res.data.code == 200) {
          useSwal()
            .fire({
              title: 'Thank You',
              text: 'We will contact you through WhatsApp',
              icon: 'success'
            }).then(() => {
              window.location.reload()
            })
          return
        }
        useSwal()
          .fire({
            title: 'Failed',
            text: 'Reservation Failed',
            icon: 'error'
          }).then(() => {
            window.location.reload()
          })
      })
      .catch((err) => {
        console.log(err)
        useSwal()
          .fire({
            title: 'Failed',
            text: 'Reservation Failed',
            icon: 'error'
          }).then(() => {
            window.location.reload()
          })
      })
  }
}
onMounted(() => {
  fetchRoomType();
});

</script>
<template>
  <div class="w-full min-h-dvh">
    <div 
    id="hero"
    class="flex justify-center items-center flex-col w-full min-h-[500px] bg-cover bg-no-repeat text-white scroll-m-10"
      style="background-image: url('/public/apartment.jpg')">
      <h1 class="text-[4rem] font-bold">Grogol Mansion</h1>
      <h2 class="text-[2rem] font-semibold">"A Higher Quality for Living"</h2>
      <button
      @click="router.push({name:'user-dashboard'})"
      class="bg-primary px-4 py-2 rounded-xl">BOOK NOW</button>
    </div>

    <div class="flex justify-center items-center flex-col w-full min-h-[700px] bg-white text-secondary scroll-m-10"
    id="fasilitas">
      <h2 class="text-[3rem] font-bold">Kenapa harus Grogol Mansion?</h2>
      <div class="flex gap-x-8 gap-y-12 flex-wrap w-[100%] h-full justify-center items-center py-4">
        <div v-for="b in benefits"
          class="min-w-[15rem] max-w-[15rem] h-40 min-h-40 max-h-40 flex flex-col justify-center items-center gap-x-8 text-[4rem]">
          <font-awesome-icon :icon="[b.iconType, b.iconName]" />
          <p class="text-center font-bold h-1/5 min-h-1/5 max-h-1/5 text-[1.5rem]">
            {{ b.text }}
          </p>
        </div>
      </div>
    </div>

    <div class="w-full min-h-[700px] bg-secondary flex justify-center items-center scroll-m-10"
    id="harga">
      <div class="w-[90%] flex justify-between items-center">
        <button @click="backActive" class="text-[2rem]" :disabled="activeItem <= 0"
          :class="{ 'text-white': activeItem > 0 }"><font-awesome-icon
            :icon="['fas', 'circle-chevron-left']" /></button>
        <div v-for="(rt) in arrActiveItem" class="w-1/4  flex flex-col justify-center items-center gap-y-4">
          <h1 class="text-white text-[2rem] font-bold">{{ rt.nama }}</h1>

          <div class="min-w-64 max-w-64 w-64 relative" v-if="rt.images.length">

            <button @click="backImage(rt.id)" class="text-[1.5rem] absolute left-1 top-[40%]"
              :disabled="rt.activeImage! <= 0" :class="{ 'text-primary': rt.activeImage! > 0 }"><font-awesome-icon
                :icon="['fas', 'circle-chevron-left']" /></button>

            <img :src="rt.images[rt.activeImage!].url" alt="" class="w-full rounded-lg shadow-md">

            <button @click="nextImage(rt.id)" class="text-[1.5rem] absolute right-1 top-[40%]"
              :disabled="rt.activeImage == rt.images.length - 1"
              :class="{ 'text-primary': rt.activeImage! < rt.images.length - 1 }"><font-awesome-icon
                :icon="['fas', 'circle-chevron-right']" /></button>
          </div>
          
          <img src="/public/noimage.png" alt="" class="min-w-64 max-w-64 w-64" v-if="!rt.images">
          <div class="w-full flex flex-col justify-center items-center gap-y-2 min-h-64 max-h-64 text-white">
            <h1 v-if="rt.rooms.length">
              <span class="text-red-400" v-if="rt.rooms.length == 1">Sisa {{ rt.rooms.length }} Kamar</span>
              <span class="text-yellow-400" v-else>Tersedia {{ rt.rooms.length }} Kamar</span>
            </h1>
            <h1 v-else>
              <span class="text-red-400">Kamar Kosong</span>
            </h1>
            <h1 class="text-white text-[2rem] font-bold">{{ moneyFormatter.format(rt.harga) }}</h1>
            <p>Ukuran {{ rt.panjang }} x {{ rt.lebar }}</p>
            <p v-if="rt.isAc">AC</p>
            <p v-if="rt.isKulkas">Kulkas</p>
            <p v-if="rt.isTv">TV</p>
            <p v-if="rt.kasur">{{ rt.kasur }}</p>
            <p>{{ rt.fasilitas }}</p>
          </div>
        </div>
        <button @click="nextActive" class="text-[2rem]" :disabled="(activeItem + 3) == total!"
          :class="{ 'text-white': (activeItem + 3) < total! }"><font-awesome-icon
            :icon="['fas', 'circle-chevron-right']" /></button>
      </div>
    </div>

    <div class="w-full min-h-[700px] bg-gray-100 flex flex-col justify-center items-center scroll-m-10"
    id="visit">
      <h1 class="text-[2rem] font-bold">Schedule Visit</h1>
      <div class="w-full flex justify-center">
        <div class="w-full flex flex-col justify-start items-end gap-y-2">
          <div class="w-[60%]">
            <label for="">Nama</label>
            <input v-model="reservationForm.nama" type="text" class="p-2 rounded-lg shadow-md w-full border border-gray-200">
            <div v-for="error of v$.nama.$errors" :key="error.$uid">
              <div class="text-red-500">{{ error.$message }}</div>
            </div>
          </div>

          <div class="w-[60%]">
            <label for="">Phone Number</label>
            <input v-model="reservationForm.phoneNumber" type="text" class="p-2 rounded-lg shadow-md w-full border border-gray-200">
            <div v-for="error of v$.phoneNumber.$errors" :key="error.$uid">
              <div class="text-red-500">{{ error.$message }}</div>
            </div>
          </div>

          <div class="w-[60%] flex gap-x-4">
            <div class="flex flex-col w-full">
              <label for="">Date</label>
              <input v-model="reservationForm.date" type="date" class="p-2 rounded-lg shadow-md border border-gray-200">
              <div v-for="error of v$.date.$errors" :key="error.$uid">
                <div class="text-red-500">{{ error.$message }}</div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <label for="">Time</label>
              <input v-model="reservationForm.time" type="time" class="p-2 rounded-lg shadow-md border border-gray-200">
              <div v-for="error of v$.time.$errors" :key="error.$uid">
                <div class="text-red-500">{{ error.$message }}</div>
              </div>
            </div>
          </div>
          <div class="w-[60%] flex justify-center my-4">
            <button @click="submitReservation" class="px-8 py-1.5 rounded-xl bg-secondary text-white">Submit</button>
          </div>
        </div>

        <div class="w-full flex flex-col justify-center items-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15872.172446351897!2d106.00439127581012!3d-5.988801964477102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e4191eb85423c85%3A0x94936708f1fee784!2sKost%20Syariah%20%22%20Grogol%20Mansion%20%22!5e0!3m2!1sid!2sid!4v1731007790423!5m2!1sid!2sid"
            width="500" height="300" style="border:0;" allowfullscreen="false" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
          <div class="w-[500px]">
            <a href="https://maps.app.goo.gl/D8NGzhEynTdsxHHM9" target="_blank" class="border-b border-black">Lihat
              Lokasi Lengkap</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
