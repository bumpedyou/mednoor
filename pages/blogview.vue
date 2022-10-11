<template>
    <v-card>
        <v-tabs v-model="tabs">
            <v-tab href="#blog-news">Blog Posts</v-tab>
            <v-tab to="view-mode">Home</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabs">
            <v-tab-item value="blog-news">
                <v-card flat>
                    <BlogViews />
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template> 
  
<script>
import BlogViews from '../components/blog/blog-views.vue';

export default {
    components: { BlogViews },
    middleware: [
        'unauthenticated',
    ],
    data: () => ({ tabs: null })
}
</script>
  