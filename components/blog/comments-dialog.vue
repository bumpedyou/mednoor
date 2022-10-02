<template>
    <v-dialog v-model="DialogStatus" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card class="blog-comments-contain">
            <v-toolbar dark color="#455A64" class="comments-toolbar">
                <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Comments</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark text @click="SubmitComment"> Add Comments </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-container class="comments-body-contain">
                <v-card class="comments-body">
                    <BlogItemContent :blog-item="ItemData" />

                    <v-divider></v-divider>
                    <p></p>

                    <v-container>
                        <v-card-title class="h3">Leave a comment</v-card-title>
                        <v-form ref="form" v-modal="validate.valided" lazy-validation>
                            <v-row>
                                <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                    <v-container>
                                        <v-text-field v-model="commentData.name" dense label="Name"
                                            :rules="validate.nameRules" required></v-text-field>
                                    </v-container>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                    <v-container>
                                        <v-text-field v-model="commentData.email" dense label="Email"
                                            :rules="validate.emailRules" required></v-text-field>
                                    </v-container>
                                </v-col>
                            </v-row>
                            <v-card-title class="subtitle-1 font-weight-bold">Your message</v-card-title>

                            <v-textarea v-model="commentData.comment" class="mx-2" label="comments" rows="6" auto-grow
                                shaped prepend-icon="mdi-comment" :rules="validate.commentRules" required>
                            </v-textarea>
                        </v-form>


                        <p></p>

                        <v-card class="d-flex justify-end" flat tile>
                            <v-btn class="commit-submit-btn" color="primary" elevation="24" large x-large
                                @click="SubmitComment">Add Comment
                            </v-btn>
                        </v-card>

                        <p></p>
                        <v-divider></v-divider>

                        <v-card-title class="h2 mt-16">— Comments</v-card-title>

                        <CommentCard v-for="(comment, i) in Comments" :key="i" :comment-item="comment" />
                    </v-container>
                </v-card>
            </v-container>
        </v-card>

        <Loading :loading="isLoading" />
    </v-dialog>
</template>

<script>
import BlogItemContent from './blog-content.vue';
import CommentCard from './comment-card.vue';
import Loading from './../dialogs/Loading.vue';

export default {
    components: { BlogItemContent, CommentCard, Loading },
    props: {
        dialogStatus: { type: Boolean, default: false },
        itemData: { type: Object, default: null }
    },
    data: () => ({
        isLoading: false,
        commentData: {
            blog_id: null,
            name: 'name',
            email: 'email@gmail.com',
            comment: 'comments'
        },
        validate: {
            valided: true,
            nameRules: [v => !!v || 'Name is required'],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            commentRules: [v => !!v || 'Comment is required'],
        },
        alldata: {}
    }),
    computed: {
        DialogStatus() { return this.$props.dialogStatus; },
        ItemData() { return this.$props.itemData; },
        Comments()
        {
            return this.$props.itemData.id ? this.alldata['comment' + this.$props.itemData.id] ? this.alldata['comment' + this.$props.itemData.id] : [] : [];
        },
    },
    mounted()
    {
        this.$api.get('/blogs/getComments').then(({ data }) =>
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

        SubmitComment()
        {
            const valided = this.$refs.form.validate();
            if (!valided) return;

            this.isLoading = true;

            this.commentData.blog_id = this.ItemData.id;

            this.$api.post('/blogs/createComments', this.commentData).then(({ data }) =>
            {
                setTimeout(() =>
                {
                    if (data && data.state) this.$toast.success(data.message);
                    else if (data && data.state === false) this.$toast.error(data.message);
                    else this.$toast.error('comments submit failure');

                    setTimeout(() => { window.location.href = this.localePath('/blog-view'); }, 500);
                }, 1300);

            }).catch((err) => { this.$toast.error(err); }).finally(() =>
            { setTimeout(() => { this.loading = false; }, 1500); })
        }
    }
}
</script>

<style lang="scss">
@import '~/assets/scss/comments-dialog.scss';
</style>