<template>
    <v-container>
        <v-card>
            <v-card-text>
                <div class="item-text-2">
                    <h6>Name: </h6> {{CommentItem.name}}
                </div>
                <div class="item-text-2">
                    <h6>Email: </h6> {{CommentItem.gmail}}
                </div>

                <p></p>
                <div class="text--primary"> {{CommentItem.comment}} </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>
  
<script>

export default {
    props: {
        commentItem: {
            type: Object,
            default: null
        },
    },
    computed: {
        CommentItem() { return this.$props.commentItem; },
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
  