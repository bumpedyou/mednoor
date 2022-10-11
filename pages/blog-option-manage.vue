<template>
    <div ref="container" class="pa-6 mh-100v">

        <v-card color="basil">
            <v-card-title class="text-center justify-center py-6">
                <v-row class='mb-1'>
                    <v-col>
                        <v-breadcrumbs :items="[
                          {
                           text: $t('dashboard'),
                           disabled: false,
                            to: localePath('/dashboard'),
                          },
                          {
                           text: 'blog options manage',
                           disabled: true,
                          }
                        ]"></v-breadcrumbs>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-tabs v-model="optionstab" background-color="transparent" color="basil">
                <v-tab href="#category">
                    Category
                </v-tab>

                <v-tab href="#tags">
                    Tags
                </v-tab>

                <v-tab href="#metatags">
                    meta tags
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="optionstab">
                <v-tab-item value="category">
                    <v-card class="pa-2 pa-sm-5 pa-md-5 pa-lg-8 pa-xl-8">
                        <v-row>
                            <v-col cols="12 pb-0">
                                <p class="h4 mt-5 mb-0">Category</p>
                            </v-col>

                            <v-col cols="12">
                                <v-form ref="form" v-model="category.valid" @submit.prevent>
                                    <v-text-field v-model="category.text" :rules="category.rules"
                                        placeholder="Category Name">
                                    </v-text-field>

                                    <div>
                                        <v-btn v-if="category.itemID && !confirmVisible" color="error" small tile
                                            type="button" class="mr-1" @click="cancelUpdate">
                                            Cancel
                                        </v-btn>

                                        <v-btn color="primary" :dark="!category.itemID" type="submit" small tile
                                            :loading="category.submitting" @click="submitClick">
                                            <span v-if="category.itemID && !confirmVisible"> Update Category </span>
                                            <span v-else> Add Category </span>
                                        </v-btn>
                                    </div>
                                </v-form>
                            </v-col>

                            <v-col cols="12">
                                <v-skeleton-loader v-if="category.dataLoading"></v-skeleton-loader>

                                <v-data-table v-else :items="category.items" :headers="category.header">
                                    <template #[`item.actions`]="{item}">
                                        <span class='primary--text clickable' @click="itemUpdate(item)">Update</span>
                                        <MedDivider></MedDivider>
                                        <span class='red--text clickable' @click="askItemDelete(item.id)">Delete</span>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-tab-item>

                <v-tab-item value="tags">
                    <v-card class="pa-2 pa-sm-5 pa-md-5 pa-lg-8 pa-xl-8">
                        <v-row>
                            <v-col cols="12 pb-0">
                                <p class="h4 mt-5 mb-0">Tags</p>
                            </v-col>

                            <v-col cols="12">
                                <v-form ref="form" v-model="tags.valid" @submit.prevent>
                                    <v-text-field v-model="tags.text" :rules="tags.rules" placeholder="tags Name">
                                    </v-text-field>

                                    <div>
                                        <v-btn v-if="tags.itemID && !confirmVisible" color="error" small tile
                                            type="button" class="mr-1" @click="cancelUpdate">
                                            Cancel
                                        </v-btn>

                                        <v-btn color="primary" :dark="!tags.itemID" type="submit" small tile
                                            :loading="tags.submitting" @click="submitClick">
                                            <span v-if="tags.itemID && !confirmVisible"> Update tags </span>
                                            <span v-else> Add tags </span>
                                        </v-btn>
                                    </div>
                                </v-form>
                            </v-col>

                            <v-col cols="12">
                                <v-skeleton-loader v-if="tags.dataLoading"></v-skeleton-loader>

                                <v-data-table v-else :items="tags.items" :headers="tags.header">
                                    <template #[`item.actions`]="{item}">
                                        <span class='primary--text clickable' @click="itemUpdate(item)">Update</span>
                                        <MedDivider></MedDivider>
                                        <span class='red--text clickable' @click="askItemDelete(item.id)">Delete</span>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-tab-item>

                <v-tab-item value="metatags">
                    <v-card class="pa-2 pa-sm-5 pa-md-5 pa-lg-8 pa-xl-8">
                        <v-row>
                            <v-col cols="12 pb-0">
                                <p class="h4 mt-5 mb-0">Meta Tags</p>
                            </v-col>

                            <v-col cols="12">
                                <v-form ref="form" v-model="metatags.valid" @submit.prevent>
                                    <v-text-field v-model="metatags.text" :rules="metatags.rules"
                                        placeholder="metatags Name">
                                    </v-text-field>

                                    <div>
                                        <v-btn v-if="metatags.itemID && !confirmVisible" color="error" small tile
                                            type="button" class="mr-1" @click="cancelUpdate">
                                            Cancel
                                        </v-btn>

                                        <v-btn color="primary" :dark="!metatags.itemID" type="submit" small tile
                                            :loading="metatags.submitting" @click="submitClick">
                                            <span v-if="metatags.itemID && !confirmVisible"> Update metatags </span>
                                            <span v-else> Add metatags </span>
                                        </v-btn>
                                    </div>
                                </v-form>
                            </v-col>

                            <v-col cols="12">
                                <v-skeleton-loader v-if="metatags.dataLoading"></v-skeleton-loader>

                                <v-data-table v-else :items="metatags.items" :headers="metatags.header">
                                    <template #[`item.actions`]="{item}">
                                        <span class='primary--text clickable' @click="itemUpdate(item)">Update</span>
                                        <MedDivider></MedDivider>
                                        <span class='red--text clickable' @click="askItemDelete(item.id)">Delete</span>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-card>

        <ConfirmDialog v-model="confirmVisible" :loading="confirmLoading" title="Confirm action"
            description="Do you really want to delete this item." @accept="ItemDeleteOk" @cancel="ItemDeleteCancel">
        </ConfirmDialog>
        <RequestModal ref="rmodal"></RequestModal>
    </div>
</template>
  
<script>
export default {
    layout: 'dashboard',
    middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted', 'admin-or-super'],
    data: () => ({
        category: {
            header: [
                { text: 'Category', value: 'name' },
                { text: 'Actions', value: 'actions' }
            ],

            valid: false,
            rules: [
                v => !!v || 'The category is required',
                v => !!v && v.length >= 2 || 'Enter at least 2 characters',
                v => !!v && v.length <= 60 || 'Enter maximum 60 characters'
            ],
            text: '',

            items: [],
            itemID: null,

            dataLoading: false,
            submitting: false,
        },
        tags: {
            header: [
                { text: 'tags', value: 'name' },
                { text: 'Actions', value: 'actions' }
            ],

            valid: false,
            rules: [
                v => !!v || 'The tags is required',
                v => !!v && v.length >= 2 || 'Enter at least 2 characters',
                v => !!v && v.length <= 60 || 'Enter maximum 60 characters'
            ],
            text: '',

            items: [],
            itemID: null,

            dataLoading: false,
            submitting: false,
        },
        metatags: {
            header: [
                { text: 'metatags', value: 'name' },
                { text: 'Actions', value: 'actions' }
            ],

            valid: false,
            rules: [
                v => !!v || 'The metatags is required',
                v => !!v && v.length >= 2 || 'Enter at least 2 characters',
                v => !!v && v.length <= 60 || 'Enter maximum 60 characters'
            ],
            text: '',

            items: [],
            itemID: null,

            dataLoading: false,
            submitting: false,
        },

        confirmVisible: false,
        confirmLoading: false,

        optionstab: null,
    }),
    mounted()
    {
        this.$api.get('/blogs/Initial_data').then(({ data }) =>
        {
            this.loading = false;
            this.category.items = data.category;
            this.tags.items = data.tags;
            this.metatags.items = data.metatags;

            console.log(data)
        })
    },
    methods: {
        itemUpdate(item)
        {
            const key = this.optionstab;
            if (!key || !this.keyCheck(key)) return;

            this[key].itemID = item.id;
            this[key].text = item.name;
            if (process.client) document.body.scrollTop = 0;
        },
        cancelUpdate()
        {
            const key = this.optionstab;
            if (!key || !this.keyCheck(key)) return;

            this[key].itemID = null;
            this.$refs.form.reset();
        },

        askItemDelete(id)
        {
            const key = this.optionstab;
            if (!key || !this.keyCheck(key)) return;

            this[key].itemID = id;
            this.confirmVisible = true;
            this.$refs.form.reset();
        },

        ItemDeleteOk()
        {
            const key = this.optionstab;
            if (!key || !this.keyCheck(key)) return;

            this.confirmLoading = true;
            if (this[key].itemID)
            {
                this.$api.delete(`/blogs/option-delete/${key}/${this[key].itemID}`).then(({ data }) =>
                {
                    if (!!data && data.length)
                    {
                        setTimeout(() =>
                        {
                            this[key].items = this[key].items.filter((item) =>
                            {
                                return data[0].id !== item.id;
                            })
                            this.$toast.success(`${key} option delete successful`);
                        }, 1000);

                    } else this.$toast.error(`${key} option delete failure`);
                }).catch((err) => { this.$refs.rmodal.$emit('error', err); }).finally(() =>
                {
                    setTimeout(() =>
                    {
                        this[key].itemID = null;
                        this.confirmVisible = false;
                        this.confirmLoading = false;
                    }, 1000);
                })
            } else
            {
                setTimeout(() =>
                {
                    this[key].itemID = null;
                    this.confirmVisible = false;
                    this.confirmLoading = false;
                    this.$toast.error(`${key} delete failure.`)
                }, 1000);
            }

        },

        ItemDeleteCancel()
        {
            const key = this.optionstab;
            if (!key || !this.keyCheck(key)) return;

            this[key].itemID = null;
            this.confirmVisible = false;
        },

        submitClick()
        {
            const key = this.optionstab;
            if (!key || !this.keyCheck(key)) return;

            const valid = this.$refs.form.validate();
            if (!valid) return;

            this[key].submitting = true;

            const ID = this[key].itemID;
            if (ID)
            {
                const item = this[key].items.filter((item) => { return ID === item.id; });
                if (item.length > 0)
                {
                    const UpdateData = {
                        id: ID,
                        name: this[key].text,
                        beforeName: item[0].name
                    }

                    this.$api.put(`/blogs/option-eidt/${key}`, UpdateData).then(({ data }) =>
                    {
                        if (!!data && data.length > 0)
                        {
                            setTimeout(() =>
                            {
                                this[key].items = this[key].items.map((item) =>
                                {
                                    if (item.id === data[0].id) item.name = data[0].name; return item;
                                })
                                this[key].itemID = null;
                                this.$refs.form.reset();
                                this.$toast.success(`The ${key} was successfully updated.`);
                            }, 1000);
                        } else
                        {
                            this.$refs.form.reset();
                            this.$toast.error(`The ${key} update failure.`);
                        }
                    }).catch(err => { this.$toast.error(err); }).finally(() =>
                    {
                        setTimeout(() => { this[key].submitting = false; }, 1000);
                    })
                } else
                {
                    setTimeout(() =>
                    {
                        this[key].itemID = null;
                        this[key].submitting = false;
                        this.$refs.form.reset();
                        this.$toast.error(`${key} update failure.`)
                    }, 1000);
                }
            } else
            {
                const newName = this[key].text;
                const item = this[key].items.filter((item) => { return newName === item.name; });

                if (!item.length)
                {
                    this.$api.post(`/blogs/option-creat/${key}`, { name: newName }).then(({ data }) =>
                    {
                        if (!!data && data.length > 0)
                        {
                            this[key].items.push(data[0]);
                            this.$refs.form.reset(); setTimeout(() =>
                            { this.$toast.success(`The ${key} was successfully created.`); }, 1000);
                        } else
                        {
                            this.$refs.form.reset();
                            this.$toast.error(`The ${key} create failure.`);
                        }
                    }).catch(err => { this.$toast.error(err); }).finally(() =>
                    {
                        setTimeout(() => { this[key].submitting = false; }, 1000);
                    })
                } else
                {
                    setTimeout(() =>
                    {
                        this[key].submitting = false;
                        this.$refs.form.reset();
                        this.$toast.error(`${key} create failure. current ${newName} key exists.`);
                    }, 1000);
                }
            }
        },

        keyCheck(key) { return key === 'category' || key === 'tags' || key === 'metatags'; }
    }
}
</script>
  
<style scoped>

</style>
  