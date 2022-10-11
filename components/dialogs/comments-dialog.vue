<template>
    <v-dialog v-model="IsDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card class="blog-comments-contain">
            <v-toolbar dark color="#455A64" class="comments-toolbar">
                <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Comments</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-title>Comments</v-toolbar-title>
            </v-toolbar>

            <v-container class="comments-body-contain">
                <v-card class="comments-body">
                    <v-card-title class="h2 mt-5">— Comments</v-card-title>
                    <v-divider class="mt-2 mb-2"></v-divider>

                    <CommentCard v-for="(comment, i) in Comments" :key="i" :comment-item="comment" />
                </v-card>
            </v-container>
        </v-card>
    </v-dialog>
</template>
  
<script>
import CommentCard from './../blog/comment-card.vue';

export default {
    components: { CommentCard },
    props: {
        isDialog: { type: Boolean, default: false },
        commentBlogId: { type: Number, default: null }
    },
    data: () => ({
        isLoading: false,
        alldata: {}
    }),
    computed: {
        IsDialog() { return this.$props.isDialog; },

        Comments()
        {
            return this.$props.commentBlogId ? this.alldata['comment' + this.$props.commentBlogId] ? this.alldata['comment' + this.$props.commentBlogId] : [] : [];
        },
    },
    mounted()
    {
        this.$api.get('/blogs/getUserComments').then(({ data }) =>
        {
            const commentsData = {};
            if (data.length)
            {
                data.forEach((item) =>
                {
                    if (!commentsData['comment' + item.blog_id]) commentsData['comment' + item.blog_id] = [];
                    commentsData['comment' + item.blog_id].push(item);
                });
            }
            this.alldata = commentsData;
        }).catch((err) => { this.$toast.error(err); })
    },
    methods: {
        closeDialog() { this.$emit('close-dialog'); },
    }
}
</script>

<style lang="scss">
@import '~/assets/scss/comments-dialog.scss';
</style>
  