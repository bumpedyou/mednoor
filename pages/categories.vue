<template>
  <div ref="container" class="pa-6 mh-100v">
    <v-row class='mb-1'>
      <v-col>
        <v-breadcrumbs :items="[
          {
           text: $t('dashboard'),
           disabled: false,
            to: localePath('/dashboard'),
          },
                  {
           text: 'Categories',
           disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <p class="h4 mb-1">Categories</p>
      </v-col>
      <v-col md="12">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-text-field v-model="category" :rules="[
            v => !!v || 'The category is required',
            v => !!v && v.length >= 2 || 'Enter at least 2 characters',
            v => !!v && v.length <= 60 || 'Enter maximum 60 characters'
          ]"  placeholder="Category Name"></v-text-field>
          <div>
            <v-btn v-if="id" color="error" small tile type="button" class="mr-1" @click="cancelUpdate">
              Cancel
            </v-btn>
            <v-btn color="primary" :dark="!id" type="submit" small tile :loading="loadingAction" @click="handleSubmit">
              <span v-if="id">
                  Update Category
                </span>
              <span v-else>
                  Add Category
                </span>
            </v-btn>
          </div>
        </v-form>
      </v-col>
      <v-col md="12">
        <v-skeleton-loader v-if="loading"></v-skeleton-loader>
        <v-data-table v-else :items="categories" :headers="[
          {
            text: 'Category',
            value: 'cate_category'
          },
          {
            text: 'Actions',
            value: 'actions'
          }
        ]">
          <template #[`item.actions`] = "{item}">
            <span class='primary--text clickable' @click="update(item)">Update</span>
            <MedDivider></MedDivider>
            <span class='red--text clickable' @click="askDelete(item.cate_id)">Delete</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <ConfirmDialog v-model="visible" title="Confirm action" description="Do you really want to delete this item." :loading="confirmLoading" @accept="handleOk" @cancel="handleCancel"></ConfirmDialog>
    <RequestModal ref="rmodal"></RequestModal>
  </div>
</template>

<script>


export default {
  name: "Categories",
  layout: 'dashboard',
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted', 'admin-or-super'],
  data() {
    return {
      category: '',
      valid: false,
      visible: false,
      confirmLoading: false,
      loadingAction: false,
      loading: true,
      categories: [],
      columns: [
        {
          title: 'Category',
          dataIndex: 'cate_category',
          key: 'cate_category',
          scopedSlots: {customRender: 'cate_category'}
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: {customRender: 'actions'}
        },
      ],
      id: null,
    }
  },
  mounted() {
    this.$api.get('/category').then(({data}) => {
      this.loading = false
      this.$nextTick(() => {
        if (data) {
          this.categories = data
        }
      })
    })
  },
  methods: {
    handleOk() {
      this.confirmLoading = true
      this.$api.delete('/category/' + this.id).then(() => {
        this.categories = this.categories.filter((cat) => {
          return this.id !== cat.cate_id
        })
        this.$toast.success('Operation successful')
      }).catch((err) => {
        this.$refs.rmodal.$emit('error', err)
      }).finally(() => {
        this.visible = false
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.id = null
    },
    cancelUpdate() {
      this.id = null
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },
    askDelete(id) {
      this.id = id
      this.visible = true
    },
    update(record) {
      this.id = record.cate_id
      this.category = record.cate_category
      if (process.client) {
        document.body.scrollTop = 0
      }
    },
    handleSubmit() {
      this.$refs.form.validate()
      if (this.valid) {
        this.loadingAction = true
        if (this.id) {
          this.$api.put('/category/' + this.id, {
            category: this.category
          }).then(({data}) => {
            this.categories = this.categories.map((cat) => {
              if (cat.cate_id === this.id) {
                cat.cate_category = this.category
              }
              return cat
            })
            this.$toast.success('The category was successfully updated.')
            this.$refs.form.reset()
            this.id = null
          }).catch(err => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.loadingAction = false
          })
        } else {
          this.$api.post('/category', {
            category: this.category
          }).then(({data}) => {
            this.categories.push(data)
            this.$refs.form.reset()
            this.$toast.success('The category was successfully created.')
          }).catch(err => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.loadingAction = false
          })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
