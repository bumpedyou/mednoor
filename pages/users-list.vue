<template>
  <div class='pa-6'>
    <v-row class='mb-1'>
      <v-col>
        <v-breadcrumbs :items="[
          {
            text: $t('dashboard'),
            disabled: false,
            to: localePath('/dashboard'),
          },
          {
            text: $t('list_usrs') ,
            disabled: true,
          }
        ]">
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row class='pa-1'>
      <v-col>
        <p class='h4 text-capitalize'>
          <span v-if='mode === "archived"'>
            Archived users
          </span>
          <span v-else-if='mode === "professional"'>
            Professional's list.
          </span>
          <span v-else>
            List of users.
          </span>
        </p>
        <div class='mb-3'>
          <v-btn v-if='mode !== "archived"' color="primary" tile small @click='addUser'>
            {{ $t('add_urs') }}
            <v-icon class="ml-1">mdi-account-plus</v-icon>
          </v-btn>
        </div>

        <v-text-field v-model='search' append-icon="mdi-magnify" placeholder='Filter by name/last name/email' class='mb-1'></v-text-field>
        <v-skeleton-loader v-if='loading' />
        <v-data-table v-else :headers="[
          {
            text: 'MRN',
            value: 'mrn',
            sortable: true,
          },
          {
            text: 'First Name',
            value: 'user_first_name',
            sortable: false,
          },
          {
            text: 'Last Name',
            value: 'user_last_name',
            sortable: false,
          },
          {
            text: 'Email',
            value: 'user_email',
            sortable: false,
          },
          {
            text: 'DOB',
            value: 'user_date_of_birth',
            sortable: false,
          },
          {
            text: 'Phone No.',
            value: 'user_phone_no',
            sortable: false,
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false,
          },
          {
            text: 'PRO',
            value: 'checkbox',
            sortable: false,
          }
        ]" :items="filteredUsers">
          <template #[`item.user_date_of_birth`] = "{value}">
            <span v-if='value'>
              {{ dateString(value) }}
            </span>
          </template>
          <template #[`item.user_phone_no`] = "{item}">
            <span v-if='item && item.user_country_code'>
              +{{ item.user_country_code }} {{ item.user_phone_no }}
            </span>
          </template>
          <template #[`item.actions`] = "{item}">
            <div>
              <div v-if='mode === "archived"'>
                <a v-if='item.user_deleted' @click.prevent='askUnarchive(item.user_uuid)'>
                  Remove from archived users.
                </a>
              </div>
              <div v-else>
                <div v-if='isAdmin || isSuper'>
                  <a v-if='item.user_blocked' @click='unblock(item.user_uuid)'>
                    {{ $t('unblock') }}
                  </a>
                  <a v-else @click='block(item.user_uuid)'>
                    {{ $t('block') }}
                  </a>
                  <MedDivider></MedDivider>
                  <a v-if='(Boolean(item.user_deleted)) === false' @click='deleteUser(item.user_uuid)'>
                    Archive
                  </a>
                </div>
              </div>
            </div>
          </template>
          <template #[`item.checkbox`] = "{item}">
            <div v-if='mode === "archived"'>
              No action available.
            </div>
            <div v-else>
              <v-checkbox :input-value='item.usro_key === "MODERATOR"' @change='changePro(item)'>PRO</v-checkbox>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <RequestModal ref='rmodal'></RequestModal>
    <ConfirmDialog v-model="visible" :title="$t('conf_action')" :loading="loadingModal" :description="action === 'delete' ? 'archive': $t('conf_act')" @accept="confirmAction" @cancel="visible = false"></ConfirmDialog>
    <ConfirmDialog v-model="unarchiveModal" description="This user will be active again" title="Remove from archived" :loading="loadingUnarchive" @accept="archive" @cancel="unarchiveModal = false"></ConfirmDialog>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import userRoleMixin from '~/mixins/userRoleMixin'
import dateMixin from '~/mixins/dateMixin'
import MedDivider from "~/components/MedDivider";
import ConfirmDialog from "~/components/ConfirmDialog";

export default {
  name: 'UsersList',
  components: {
    ConfirmDialog,
    MedDivider,
    RequestModal
  },
  mixins: [userRoleMixin, dateMixin],
  layout: 'dashboard',
  middleware: ['authenticated', 'moderator-or-higher', 'not-blocked', 'not-deleted', 'verified'],
  data() {
    return {
      loadingUnarchive: false,
      unarchiveModal: false,
      users: [],
      columns: [
        {
          title: 'MRN',
          dataIndex: 'mrn',
          key: 'mrn',
          slots: { title: 'MRN' },
          scopedSlots: { customRender: 'mrn' }
        },
        {
          title: 'First Name',
          dataIndex: 'user_first_name',
          key: this.$t('name'),
          slots: { title: this.$t('name') },
          scopedSlots: { customRender: 'first_name' }
        },
        {
          title: 'Last Name',
          dataIndex: 'user_last_name',
          key: 'user_last_name',
          slots: { title: this.$t('name') },
          scopedSlots: { customRender: 'first_name' }
        },
        {
          title: 'Email',
          dataIndex: 'user_email',
          key: 'Email',
          slots: { title: 'Email' },
          scopedSlots: { customRender: 'email' }
        },
        {
          title: 'DOB',
          dataIndex: 'user_date_of_birth',
          key: 'user_date_of_birth',
          scopedSlots: { customRender: 'user_date_of_birth' }
        },
        {
          title: 'Phone No.',
          dataIndex: 'user_phone_no',
          key: 'user_phone_no',
          scopedSlots: { customRender: 'user_phone_no' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      visible: false,
      action: '',
      loading: true,
      loadingModal: false,
      uuid: null,
      mode: 'users',
      search: ''
    }
  },
  head() {
    return {
      title: this.$t('list_usrs')
    }
  },
  computed: {
    filteredUsers() {
      if (this.search) {
        return this.users.filter((r) => {
          const fn = r.user_first_name.toLowerCase()
          const ln = r.user_last_name.toLowerCase()
          const fullName = [fn, ln].join(' ')
          const inv = [ln, fn].join(' ')
          const email = r.user_email ? r.user_email.toLowerCase() : ''
          const search = this.search.toLowerCase()
          return fn.includes(search) || ln.includes(search) || email.includes(search) || fullName.includes(search) || inv.includes(search)
        })
      } else {
        return this.users
      }
    },
    query() {
      return this.$route.query
    }
  },
  watch: {
    query(v) {
      this.setView()
      this.loadItems()
    }
  },
  mounted() {
    this.setView()
    this.loadItems()
    if (this.isAdmin || this.isSuper && this.mode !== 'unarchive') {
      this.columns.push({
        title: 'PRO',
        key: 'checkbox',
        scopedSlots: { customRender: 'checkbox' }
      })
    }
  },
  methods: {
    archive(){
      this.loadingUnarchive = true
      this.$api.post('/user/unarchive/' + this.uuid).then(() =>{
        this.users = this.users.filter((us)=>{
          return us.user_uuid !== this.uuid
        })
        this.uuid = null
        this.$toast.success('The user is active again.')
      }).catch((err)=>{
        this.$refs.rmodal.$emit('error', err)
      }).finally(() => {
        this.loadingUnarchive = false
        this.unarchiveModal = false
      })
    },
    askUnarchive(uuid){
      this.unarchiveModal = true
      this.uuid = uuid
    },
    changePro(r) {
      const key = r.usro_key
      if (key === 'MODERATOR') {
        this.action = 'update-to-user'
      } else {
        this.action = 'update-to-professional'
      }
      this.askConfirmation(r.user_uuid)
    },
    addUser() {
      this.$router.push(this.localePath('/add-user'))
    },
    loadItems() {
      this.loading = true
      this.$api.get('/user', {
        params: {
          view: this.mode
        }
      }).then(({ data }) => {
        this.users = data
      }).catch(err => {
        this.$refs.rmodal.$emit('error', err)
      }).finally(() => {
        this.loading = false
      })
    },
    setView() {
      if (this.$route.query) {
        const q = this.$route.query
        if (q.view && ['users', 'professionals', 'archived'].includes(q.view.toLowerCase())) {
          const mode = q.mode
          if (typeof mode === 'string'){
            this.mode = q.mode.toLowerCase()
          }
        } else {
          this.mode = 'users'
        }
      } else {
        this.mode = 'users'
      }
    },
    askConfirmation(uuid) {
      this.uuid = uuid
      this.visible = true
    },
    block(uuid) {
      this.askConfirmation(uuid)
      this.action = 'block'
    },
    unblock(uuid) {
      this.askConfirmation(uuid)
      this.action = 'unblock'
    },
    downgradeProfessional(uuid) {
      this.askConfirmation(uuid)
      this.action = 'update-to-user'
    },
    confirmAction() {
      console.log('confirm action')
      if (this.isAdmin || this.isSuper) {
        console.log('isAdmin or super')
        console.log('The action is ---->', this.action)
        this.loadingModal = true
        if (this.action === 'delete') {
          this.$api.delete('/user/' + this.uuid).then(() => {
            this.users = this.users.filter((user) => {
              return user.user_uuid !== this.uuid
            })
            this.uuid = null
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.visible = false
            this.loadingModal = false
          })
        } else if (this.action === 'update-to-professional' || this.action === 'update-to-user') {
          this.loadingModal = true
          this.$api.put('/user/role/' + this.uuid, {
            key: this.action === 'update-to-professional' ? 'MODERATOR' : 'USER'
          }).then(({ data }) => {
            this.users = this.users.map((usr) => {
              if (usr.user_uuid === this.uuid) {
                usr.usro_id = data.usro_id
                usr.usro_key = data.usro_key
                usr.usro_role = data.usro_role
              }
              return usr
            })
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.visible = false
            this.loadingModal = false
          })
        } else if (this.action === 'block' || this.action === 'unblock') {
          this.loadingModal = true
          const blocked = this.action === 'block'
          this.$api.put('/user/blocked/' + this.uuid, {
            blocked
          }).then(() => {
            this.users = this.users.map((user) => {
              if (user.user_uuid === this.uuid) {
                user.user_blocked = blocked
              }
              return user
            })
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.loadingModal = false
            this.visible = false
            this.uuid = null
          })
        }
      }
    },
    updateToProfessional(uuid) {
      this.uuid = uuid
      this.visible = true
      this.action = 'update-to-professional'
    },
    deleteUser(uuid) {
      this.uuid = uuid
      this.visible = true
      this.action = 'delete'
    }
  }
}
</script>
