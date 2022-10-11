<template >
    <v-dialog v-model="Loading" persistent width="auto">
        <v-progress-circular :size="50" color="primary" class="progress-circular-load" indeterminate>
        </v-progress-circular>
    </v-dialog>
</template>

<script>
export default {
    props: {
        loading: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        Loading() { return this.$props.loading; }
    }
}
</script>

<style lang="scss">
@import '~/assets/scss/loading.scss';
</style>