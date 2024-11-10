export const useLoaderStore = defineStore('loader', {
    state: () => ({
        loading: 0 as number
    }),
    actions: {
        setLoading() {
            this.loading++
        },
        removeLoading() {
            this.loading--
        }
    },
})