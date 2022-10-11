<template>
    <v-card-text>
        <p class="text-h5 text--primary"> {{BlogIrem.title}} </p>

        <div class="item-text-2">
            <h6>Author: </h6> {{BlogIrem.author}}
        </div>
        <div class="item-text-2">
            <h6>Date: </h6> {{BlogIrem.date}}
        </div>

        <p></p>
        <div class="text--primary"> {{BlogIrem.content}} </div>
    </v-card-text>
</template>
  
<script>

export default {
    props: {
        blogItem: {
            type: Object,
            default: null
        },
    },
    computed: {
        BlogIrem() { return this.$props.blogItem; },
    },

}
</script>

<style lang="scss">
.item-text-2 {
    display: flex;
    flex-direction: row;
    padding-bottom: 3px;

    h6 {
        margin-right: 5px;
    }
}
</style>
  