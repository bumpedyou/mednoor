<template>
    <div class="blog-header pb-1 pl-1 pb-sm-3 pb-md-5 pb-lg-7 pb-xl-9 d-flex flex-column">
        <v-btn color="success" @click="opendialog()">
            + Add New Blog
        </v-btn>

        <v-dialog v-model="dialog" persistent max-width="80vw">
            <v-form ref="form" v-modal="validate.valided" lazy-validation>
                <v-card class="blog-dialog-contain">
                    <v-card-title class="blog-dialog-header">
                        <span class="text-h5">Add New Post</span>

                        <div class="blog-dialog-closebtn" @click="closedialog()">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                            </svg>
                        </div>
                    </v-card-title>

                    <v-card-text class="blog-dialog-body">
                        <div class="dialog-body-contain">
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field v-model="Bform.title" label="Blog Title" name="title"
                                            :rules="validate.title" required>
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field v-model="Bform.author" label="Blog Author" name="author"
                                            :rules="validate.Author" required>
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-select v-model="Bform.category" :items="Category_items" label="Category"
                                            name="category" :rules="validate.category" required>
                                        </v-select>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-autocomplete v-model="Bform.tags" :items="Tags_items" label="Tags"
                                            name="tags" auto-select-first chips clearable deletable-chips multiple
                                            small-chips :menu-props="{closeOnContentClick:true}" :rules="validate.Tags"
                                            required>
                                        </v-autocomplete>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-autocomplete v-model="Bform.meta_tags" :items="MetaTags_items"
                                            label="Meta Tags" name="meta-tags" auto-select-first chips clearable
                                            deletable-chips multiple small-chips
                                            :menu-props="{closeOnContentClick:true}" :rules="validate.meta_tags"
                                            required>
                                        </v-autocomplete>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                        <v-text-field v-model="Bform.date" label="Blog Date" name="date" type="date"
                                            :rules="validate.date" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                        <v-file-input v-if="!IsEdit" v-model="blog_files" label="Image Url" name="image"
                                            placeholder="Upload image" prepend-icon="mdi-paperclip"
                                            accept=".png,.jpg,.jpeg,.gif" :rules="validate.image" required>
                                            <template #selection="{ text }">
                                                <v-chip small label color="primary">
                                                    {{ text }}
                                                </v-chip>
                                            </template>
                                        </v-file-input>

                                        <div v-else class="blog-new-img">
                                            <img :src="Bform.image" />
                                        </div>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-textarea v-model="Bform.content" label="Blog Content" name="content"
                                            :rules="validate.content" required>
                                        </v-textarea>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </div>
                    </v-card-text>

                    <v-card-actions class="blog-dialog-footer">
                        <v-spacer></v-spacer>
                        <v-btn depressed @click="closedialog()">
                            Cancel
                        </v-btn>

                        <v-btn color="success" @click="saveHandle()">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <Loading :loading="loading" />
    </div>
</template>

<script>
import Loading from './Loading.vue';

export default {
    components: { Loading },
    props: {
        dialogData: {
            type: Object,
            default: null
        },
    },
    data: () => ({
        loading: false,
        blog_files: null,
        validate: {
            valided: true,
            title: [
                v => !!v || 'Title is required'
            ],
            Author: [
                v => !!v || 'Author is required'
            ],
            date: [
                v => !!v || 'Date is required'
            ],
            image: [
                v => !!v || 'Image is required',
                v => !!v && (v.type === 'image/png' || v.type === 'image/jpg' || v.type === 'image/jpeg' || v.type === 'image/gif') || 'Image accepted only jpg/png/gif file'
            ],
            content: [
                v => !!v || 'Content is required'
            ],
            category: [
                v => !!v || 'Category is required'
            ],
            Tags: [
                v => !!v.length || 'Tags is required'
            ],
            meta_tags: [
                v => !!v.length || 'Meta tags is required'
            ],
        },
        Category_items: [],
        Tags_items: [],
        MetaTags_items: []
    }),
    computed: {
        IsEdit() { return this.$props.dialogData.isEdit; },
        dialog() { return this.$props.dialogData.isdialog },
        Bform() { return this.$props.dialogData.itemdata }
    },
    mounted()
    {
        this.$api.get('/blogs/Initial_data').then(({ data }) =>
        {
            if (data)
            {
                if (data.category.length)
                    this.Category_items = data.category.reduce((items, item) => { return [...items, item.name]; }, []);
                if (data.tags.length)
                    this.Tags_items = data.tags.reduce((items, item) => { return [...items, item.name]; }, []);
                if (data.metatags.length)
                    this.MetaTags_items = data.metatags.reduce((items, item) => { return [...items, item.name]; }, []);
            }
        }).catch((err) =>
        {
            console.log('err ==> ', err);
        }).finally(() => { })
    },
    methods: {
        saveHandle()
        {
            const valided = this.$refs.form.validate();
            if (!valided) return;
            this.loading = true;

            if (!this.IsEdit)
            {
                const reader = new FileReader();
                reader.readAsDataURL(this.blog_files);
                reader.onload = event =>
                {
                    this.Bform.image = event.target.result;
                    this.$api.post('/blogs/create', this.Bform).then(({ data }) =>
                    {
                        setTimeout(() =>
                        {
                            if (data && data.state) this.$toast.success(data.message);
                            else if (data && data.state === false) this.$toast.error(data.message);
                            else this.$toast.error('Blog save failure');

                            setTimeout(() => { window.location.href = this.localePath('/admin-blog'); }, 500);
                        }, 1300);

                    }).catch((err) => { this.$toast.error(err) }).finally(() =>
                    {
                        setTimeout(() => { this.loading = false; }, 1500);
                    })
                };
            } else
            {
                this.$api.put('/blogs/edit/' + this.Bform.id, this.Bform).then(({ data }) =>
                {
                    setTimeout(() =>
                    {
                        if (data && data.state) this.$toast.success(data.message);
                        else if (data && data.state === false) this.$toast.error(data.message);
                        else this.$toast.error('Blog edit failure');

                        setTimeout(() => { window.location.href = this.localePath('/admin-blog'); }, 500);
                    }, 1300);
                }).catch((err) => { this.$toast.error(err) }).finally(() =>
                {
                    setTimeout(() => { this.loading = false; }, 1500);
                })
            }
        },
        opendialog()
        {
            this.$emit('change-edit');
            this.$emit('open-dialog');
            // this.$emit('form-clear')
        },
        closedialog()
        {
            this.$emit('close-dialog');
            this.$emit('form-clear');
            this.blog_files = null;
        }
    }
}
</script>

<style lang="scss">
@import '~/assets/scss/blog-dialog.scss';
</style>