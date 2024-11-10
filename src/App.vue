<script setup lang="ts">
const {loading} = storeToRefs(useLoaderStore())
import { ElLoading } from 'element-plus'
let loadingInstance = ElLoading.service({
  fullscreen: true,
  text: 'Loading',
})
nextTick(() => {
  loadingInstance.close()
})

watch(() => loading.value, () => {
  if(loading.value) {
    console.log({b:'aaea'})
    loadingInstance = ElLoading.service({
      fullscreen: true,
      text:'Loading',
    })
  }
  else loadingInstance.close()
})
</script>
<template>
  <RouterView />
</template>