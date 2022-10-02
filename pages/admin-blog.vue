<template>
    <div class="blog-containner pa-1 pl-1 pa-sm-3 pa-md-5 pa-lg-7 pa-xl-9">
        <!-- <div class="blog-header pb-1 pl-1 pb-sm-3 pb-md-5 pb-lg-7 pb-xl-9 d-flex flex-column"> -->
        <BlogModal :dialog-data="dialog_data" @change-edit="changeEdit" @open-dialog="opendialog"
            @close-dialog="closedialog" @form-clear="formClearFunc" />
        <!-- </div> -->

        <div class="blog-component-contain rounded-sm">
            <div class="blog-component">
                <div class="blog_com-header pa-2 pa-sm-2 pa-md-3 pa-lg-4 pa-xl-4 font-weight-medium">
                    News
                </div>

                <div class="blog_com-body">
                    <div class="blog_com-body-contain  pa-1 pa-sm-1 pa-md-2 pa-lg-3 pa-xl-4">
                        <v-simple-table height="100%">
                            <thead>
                                <tr>
                                    <th class="text-left">#</th>
                                    <th class="text-left">Image</th>
                                    <th class="text-left">Title</th>
                                    <th class="text-left">Date</th>
                                    <th class="text-left">Author</th>
                                    <th class="text-left">Content</th>
                                    <th class="text-left">Comments</th>
                                    <th class="text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in blog_data" :key="index">
                                    <td>
                                        <div class="blogT-column"> {{index + 1}} </div>
                                    </td>

                                    <td>
                                        <div class="blogT-column"> <img :src="item.image" class="blogT-img" /> </div>
                                    </td>

                                    <td>
                                        <div class="blogT-column"> {{item.title}} </div>
                                    </td>

                                    <td>
                                        <div class="blogT-column"> {{item.date}} </div>
                                    </td>

                                    <td>
                                        <div class="blogT-column"> {{item.author}} </div>
                                    </td>

                                    <td>
                                        <div class="blogT-column"> {{item.content}} </div>
                                    </td>

                                    <td>
                                        <div class="blogT-column tabl_comments" @click="commentsFunc(item)">
                                            Comments({{item.comments}})
                                        </div>
                                    </td>

                                    <td>
                                        <div class="blogT-column">
                                            <div class="blogT-actionbtn">
                                                <v-btn depressed class="mr-0 mr-md-1 mr-lg-1 mr-xl-1" color="error"
                                                    @click="()=>{BlogDeleteFunc(item.id)}">Delete</v-btn>

                                                <v-btn depressed color="primary" @click="()=>{BlogEditFunc(item)}">
                                                    Edit</v-btn>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </div>
                </div>
            </div>
        </div>

        <CommentsDialog :is-dialog="isComments" :comment-blog-id="commentBlogID" @close-dialog="closeComments" />
        <Loading :loading="loading" />
    </div>
</template>

<script>
import BlogModal from './../components/dialogs/Blog-dialog.vue';
import CommentsDialog from './../components/dialogs/comments-dialog.vue';
import Loading from './../components/dialogs/Loading.vue';

export default {
    components: { BlogModal, CommentsDialog, Loading },
    layout: 'dashboard',
    middleware: [
        'authenticated',
        'not-blocked',
        'not-deleted',
        'verified',
        'pin-set',
        'view-set',
    ],
    data: () => ({
        loading: false,
        dialog_data: {
            isEdit: true,
            isdialog: false,
            itemdata: {
                id: null,
                title: '',
                author: '',
                date: '',
                image: '',
                content: '',
                category: '',
                tags: [],
                meta_tags: []
            }
        },
        blog_data: [],

        isComments: false,
        commentBlogID: null
    }),
    mounted()
    {
        this.$api.get('/blogs/usernews').then(({ data }) =>
        {
            this.blog_data = data.map((item, index) =>
            {
                const itemdata = {
                    id: item.id,
                    title: item.title.trim(),
                    author: item.author.trim(),
                    date: item.date.trim(),
                    image: item.image.trim(),
                    content: item.content.trim(),
                    category: item.category.trim(),
                    tags: item.tags.map((item) => item.trim()),
                    meta_tags: item.meta_tags.map((item) => item.trim()),
                    comments: item.comments
                }
                return itemdata
            })
        }).catch((err) =>
        {
            console.log('err ==> ', err);
        }).finally(() => { })
    },
    methods: {
        BlogEditFunc(item)
        {
            this.dialog_data.itemdata = item;
            this.dialog_data.isEdit = true;
            this.dialog_data.isdialog = true;
        },
        BlogDeleteFunc(id)
        {
            this.loading = true;
            this.$api.delete('/blogs/delete/' + id).then(({ data }) =>
            {
                setTimeout(() =>
                {
                    if (data && data.state) this.$toast.success(data.message);
                    else if (data && data.state === false) this.$toast.error(data.message);
                    else this.$toast.error('blog delete failure');

                    setTimeout(() => { window.location.href = this.localePath('/admin-blog'); }, 500);
                }, 1300);
            }).catch((err) =>
            {
                console.log('err ==> ', err);
                this.$toast.error('blog delete failure');
            }).finally(() =>
            {
                setTimeout(() => { this.loading = false; }, 1500);
            })
        },
        changeEdit()
        {
            this.dialog_data.isEdit = false;
        },
        opendialog() { this.dialog_data.isdialog = true; },
        closedialog() { this.dialog_data.isdialog = false; },
        formClearFunc()
        {
            this.dialog_data.itemdata = {
                id: null,
                title: '',
                author: '',
                date: '',
                image: '',
                content: '',
                category: '',
                tags: [],
                meta_tags: []
            }
        },

        commentsFunc(item)
        {
            const id = item.id;
            const comments = item.comments;
            if (!id && !comments && comments < 1) return;

            this.commentBlogID = id;

            console.log(this.commentBlogID)
            this.isComments = true;
        },
        closeComments() { this.isComments = false; }
    },
}
</script>

<style lang="scss">
@import '~/assets/scss/blog.scss';
</style>