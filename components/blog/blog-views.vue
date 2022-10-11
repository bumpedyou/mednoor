<template>
    <v-container>
        <v-row class="blog-views-contain">
            <v-col cols="12" sm="12" md="8" lg="9" xl="9">
                <v-container class="blogV-left-contain">
                    <v-row v-if="blog_data.length">
                        <v-col v-for="(item, i) in blog_data" :key="i" cols="12" class="blog-item-card-contain">
                            <v-card class="blog-item-card">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="4" lg="3" xl="3" class="item-img">
                                            <v-img :src="item.image"></v-img>
                                        </v-col>

                                        <v-col cols="12" sm="12" md="8" lg="9" xl="9" class="item-content">
                                            <BlogItemContent :blog-item="item" />

                                            <v-card-text v-if="authStatus" tag="div" class="subtitle-1 blog-comments"
                                                @click="openComments(item)">
                                                comments
                                            </v-card-text>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-card-text v-else tag="h6" class="categories-header"> Not matched </v-card-text>
                </v-container>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="3" xl="3">
                <v-container class="blogV-rigt-contain">
                    <v-text-field v-model="FilterData.text" label="Search" @keyup="SearchFunc"></v-text-field>

                    <div class="category-items-contain">
                        <v-card-text class="text-h5 text--primary categories-header"> Categories </v-card-text>

                        <v-list>
                            <v-list-item-group v-model="FilterData.category" @change="BlogDataFilter">
                                <v-list-item v-for="(item, i) in Category_items" :key="i" class="category-item"
                                    :value="i">
                                    <v-card-text tag="span" class="category-item-text">{{item.text}}</v-card-text>

                                    <v-badge v-if="item.count>0" inline :content="item.count"></v-badge>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </div>

                    <div class="Tags-items-contain">
                        <v-card-text tag="h6" class="Tags-header">Tags</v-card-text>

                        <v-chip-group v-model="FilterData.tags" column multiple @change="BlogDataFilter">
                            <v-chip v-for="(item, i) in Tags_items" :key="i" :value="i" filter outlined>
                                {{item.text}}
                            </v-chip>
                        </v-chip-group>
                    </div>
                </v-container>
            </v-col>
        </v-row>

        <CommentsDialog v-if="authStatus" :dialog-status="comments.openDialog" :item-data="comments.commentsItem"
            @close-dialog="closeComments" />
        <Loading :loading="isLoading" />
    </v-container>
</template>
  
<script>
import Loading from './../dialogs/Loading.vue';
import BlogItemContent from './blog-content.vue';
import CommentsDialog from './comments-dialog.vue';

export default {
    components: { Loading, BlogItemContent, CommentsDialog },
    data: () => ({
        authStatus: false,

        isLoading: true,
        Category_items: [],
        Tags_items: [],
        MetaTags_items: [],
        allBlogData: [],
        blog_data: [],

        FilterData: {
            text: '',
            category: null,
            tags: []
        },

        comments: {
            openDialog: false,
            commentsItem: {
                id: null,
                title: '',
                author: '',
                date: '',
                image: '',
                content: '',
                category: '',
                tags: [],
                meta_tags: [],
                comments: null
            }
        }
    }),
    mounted()
    {
        this.authStatus = !!this.$auth.$state.loggedIn;
        console.log(this.authStatus)
        console.log('-----------------')

        this.isLoading = true;
        this.$api.get('/blogs/Initial_data').then(({ data }) =>
        {
            if (data)
            {
                this.Category_items = data.category.map((item) => { return { id: item.id, text: item.name, count: 0 } });
                this.Tags_items = data.tags.map((item) => { return { id: item.id, text: item.name } });
                this.MetaTags_items = data.metatags.map((item) => { return { id: item.id, text: item.name } });
            }

            this.$api.get('/blogs/allBlogData').then(({ data }) =>
            {
                this.allBlogData = data.map((item, index) =>
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
                    return itemdata;
                })

                const categoryKeys = {};
                this.Category_items.forEach((item, index) =>
                {
                    if (!categoryKeys[item.text])
                        categoryKeys[item.text] = { id: item.id, Index: index };
                })

                this.allBlogData.forEach((item) =>
                {
                    if (categoryKeys[item.category])
                        this.Category_items[categoryKeys[item.category].Index].count += 1;
                })
                this.blog_data = this.allBlogData;
            }).catch((err) =>
            { this.$toast.error(err); }).finally(() => { this.isLoading = false; })
        }).catch((err) =>
        { this.$toast.error(err); this.isLoading = false; })
    },
    methods: {
        BlogDataFilter()
        {
            const categoryFData = this.categoryFilter();
            const tagsFData = this.tagsFilter(categoryFData);
            let FilterData = [];

            const text = this.FilterData.text;
            if (text) tagsFData.forEach((item) => { if (item.title.search(text) !== -1) FilterData.push(item); })
            else FilterData = tagsFData;
            this.blog_data = FilterData;
        },
        categoryFilter()
        {
            let FilterBlogData = [];
            if (!!this.FilterData.category || this.FilterData.category === 0)
            {
                const categoryData = this.Category_items[this.FilterData.category];
                if (!!categoryData && categoryData.count > 0)
                {
                    this.allBlogData.forEach((item, index) => { if (item.category === categoryData.text) FilterBlogData.push(item); })
                }
            } else FilterBlogData = this.allBlogData;

            return FilterBlogData;
        },
        tagsFilter(currentData)
        {
            let FilterBlogData = [];

            if (!!this.FilterData.tags && this.FilterData.tags.length && currentData.length > 0)
            {
                const FilterTags = [];
                this.FilterData.tags.forEach((item, index) =>
                {
                    if (!this.Tags_items[item]) return;
                    FilterTags.push(this.Tags_items[item]);
                })

                currentData.forEach((item, index) =>
                {
                    const itemTagKey = {};
                    item.tags.forEach((item) => { itemTagKey[item] = true; });

                    const ifFilter = FilterTags.every((tagitem) => { return !!itemTagKey[tagitem.text]; })
                    if (ifFilter) FilterBlogData.push(item);
                })

            } else FilterBlogData = currentData;

            return FilterBlogData;
        },
        SearchFunc(event) { if (event.key === 'Enter') this.BlogDataFilter(); },

        openComments(item)
        {
            this.comments.commentsItem = item;
            this.comments.openDialog = true;
        },
        closeComments()
        {
            this.comments.openDialog = false;
            this.comments.commentsItem = {
                id: null,
                title: '',
                author: '',
                date: '',
                image: '',
                content: '',
                category: '',
                tags: [],
                meta_tags: [],
                comments: null
            }
        },
    }
}
</script>

<style lang="scss">
@import '~/assets/scss/blog-view.scss';
</style>
  