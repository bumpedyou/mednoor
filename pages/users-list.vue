<template>
  <div class="pa-6">
    <a-row class="mb-1">
      <a-col>
        <a-breadcrumb>
          <a-breadcrumb-item>
            <nuxt-link :to="localePath('/dashboard')">{{
              $t('dashboard')
            }}</nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <span v-if="isProfessional">{{ "Patient's List" }}</span>
            <span v-else>{{ $t('list_usrs') }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <a-row class="pa-1">
      <a-col>
        <p class="h4 mb-1 text-capitalize">
          <span v-if="mode === 'archived'"> Archived users </span>
          <span v-else-if="mode === 'professionals'">
            Professional's list.
          </span>
          <span v-else-if="isProfessional"> Patient's list. </span>
          <span v-else> List of users. </span>
        </p>
        <div class="mb-3">
          <v-btn
            v-if="mode !== 'archived'"
            color="primary"
            tile
            small
            @click="addUser"
          >
            <span v-if="isProfessional">Add Patient</span>
            <span v-else> {{ $t('add_urs') }}</span>
            <a-icon type="user-add"></a-icon>
          </v-btn>
        </div>

        <a-input-search
          v-model="search"
          placeholder="Filter by name/last name/email"
          class="mb-1"
        ></a-input-search>

        <a-skeleton v-if="loading" />
        <a-table v-else :columns="columns" :data-source="filteredUsers">
          <div slot="name" slot-scope="text, record">
            <nuxt-link :to="localePath('/user/' + record.user_uuid)">
              {{ record.user_first_name }} {{ record.user_last_name }}
            </nuxt-link>
          </div>

          <div slot="user_date_of_birth" slot-scope="text, record">
            <span v-if="record && record.user_date_of_birth">
              {{ dateString(record.user_date_of_birth) }}
            </span>
          </div>

          <div slot="user_phone_no" slot-scope="text, record">
            <span v-if="record && record.user_country_code">
              +{{ record.user_country_code }} {{ record.user_phone_no }}
            </span>
          </div>
          <div slot="action" slot-scope="text, record">
            <div v-if="mode === 'archived'">
              <a
                v-if="record.user_deleted"
                @click.prevent="askUnarchive(record.user_uuid)"
              >
                Remove from archived users.
              </a>
            </div>

            <div v-if="isProfessional">
              <a
                v-if="Boolean(record.user_deleted) === false"
                @click="deleteUser(record.user_uuid)"
              >
                Delete
              </a>
              
            <span class="ml-5">
                <nuxt-link v-if="record.user_uuid" :to="localePath('/user-profile/' + record.user_uuid)">      <v-icon>   mdi-eye</v-icon></nuxt-link>
            </span>
            </div>

            <div v-else>
              <div v-if="isAdmin || isSuper">
                <a
                  v-if="record.user_blocked"
                  @click="unblock(record.user_uuid)"
                >
                  {{ $t('unblock') }}
                </a>
                <a v-else @click="block(record.user_uuid)">
                  {{ $t('block') }}
                </a>
                <a-divider
                  v-if="Boolean(record.user_deleted) === false"
                  type="vertical"
                />
                <a
                  v-if="Boolean(record.user_deleted) === false"
                  @click="archiveUser(record.user_uuid)"
                >
                  Archive
                </a>

                <a-divider type="vertical" />
                <a @click="deleteUser(record.user_uuid)"> Delete </a>
              </div>
            </div>
          </div>
          <div slot="checkbox" slot-scope="text, record">
            <div v-if="false">No action available.</div>
            <div v-if="false">
              <a-checkbox
                :checked="record.usro_key === 'MODERATOR'"
                @change="changePro(record)"
                >PRO</a-checkbox
              >
            </div>
          </div>
        </a-table>
      </a-col>
    </a-row>
    <RequestModal ref="rmodal"></RequestModal>
    <a-modal
      v-model="visible"
      :title="$t('conf_action')"
      ok-text="Ok"
      :confirm-loading="loadingModal"
      :cancel-text="$t('cancel')"
      @ok="confirmAction"
    >
      <p v-if="action === 'delete'">Archive</p>
      <p v-else>
        {{ $t('conf_act') }}
      </p>
    </a-modal>
    <a-modal
      v-model="unarchiveModal"
      title="Remove from archived."
      ok-text="Ok"
      :confirm-loading="loadingUnarchive"
      :cancel-text="$t('cancel')"
      @ok="archive"
    >
      <p>This user will be active again.</p>
    </a-modal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import userRoleMixin from '~/mixins/userRoleMixin'
import dateMixin from '~/mixins/dateMixin'

export default {
  name: 'UsersList',
  components: {
    RequestModal,
  },
  mixins: [userRoleMixin, dateMixin],
  layout: 'dashboard',
  middleware: [
    'authenticated',
    'moderator-or-higher',
    'not-blocked',
    'not-deleted',
    'verified',
  ],
  data() {
    return {
      loadingUnarchive: false,
      unarchiveModal: false,
      users: [],
      columns: [
        {
          title: this.$route.query.view !== 'professionals' ? 'MRN' : 'PRN',
          dataIndex: 'mrn',
          key: 'mrn',
          slots: { title: this.$route.query.view !==  'professionals' ? 'MRN' : 'PRN' },
          scopedSlots: { customRender: 'mrn' },
        },
        {
          title: 'First Name',
          dataIndex: 'user_first_name',
          key: this.$t('name'),
          slots: { title: this.$t('name') },
          scopedSlots: { customRender: 'first_name' },
        },
        {
          title: 'Last Name',
          dataIndex: 'user_last_name',
          key: 'user_last_name',
          slots: { title: this.$t('name') },
          scopedSlots: { customRender: 'first_name' },
        },
        {
          title: 'Email',
          dataIndex: 'user_email',
          key: 'Email',
          slots: { title: 'Email' },
          scopedSlots: { customRender: 'email' },
        },
        {
          title: 'DOB',
          dataIndex: 'user_date_of_birth',
          key: 'user_date_of_birth',
          scopedSlots: { customRender: 'user_date_of_birth' },
        },
        {
          title: 'Phone No.',
          dataIndex: 'user_phone_no',
          key: 'user_phone_no',
          scopedSlots: { customRender: 'user_phone_no' },
        },
        {
          title: this.$t('action'),
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      visible: false,
      action: '',
      loading: true,
      loadingModal: false,
      uuid: null,
      mode: 'users',
      search: '',
    }
  },
  head() {
    return {
      title: this.$t('list_usrs'),
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
          return (
            fn.includes(search) ||
            ln.includes(search) ||
            email.includes(search) ||
            fullName.includes(search) ||
            inv.includes(search)
          )
        })
      } else {
        return this.users
      }
    },
    query() {
      return this.$route.query
    },
  },
  watch: {
    query(v) {
      this.setView()
      this.loadItems()
    },
  },
  mounted() {
    this.setView()
    this.loadItems()
    if (this.mode === 'hide_prod') {
      this.columns.push({
        title: 'PRO',
        key: 'checkbox',
        scopedSlots: { customRender: 'checkbox' },
      })
    }
  },
  methods: {
    archive() {
      this.loadingUnarchive = true
      this.$userApi
        .post('/unarchive/' + this.uuid)
        .then(() => {
          this.users = this.users.filter((us) => {
            return us.user_uuid !== this.uuid
          })
          this.uuid = null
          this.$toast.success('The user is active again.')
        })
        .catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        })
        .finally(() => {
          this.loadingUnarchive = false
          this.unarchiveModal = false
        })
    },
    askUnarchive(uuid) {
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
      console.log(this.mode)

      if (this.mode === 'professionals') {
        this.loading = true
        this.$api
          .get('/professional')
          .then(({ data }) => {
            this.users = data
          })
          .catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.loading = true
        this.$userApi
          .get('/list', {
            params: {
              view: this.mode,
            },
          })
          .then(({ data }) => {
            this.users = data
          })
          .catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    setView() {
      if (this.$route.query) {
        const q = this.$route.query

        if (
          q.view &&
          ['users', 'professionals', 'archived'].includes(q.view.toLowerCase())
        ) {
          const mode = q.view
          if (typeof mode === 'string') {
            this.mode = q.view.toLowerCase()
            console.log(this.mode)
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
      if (this.isAdmin || this.isSuper || this.isProfessional) {
        this.loadingModal = true
        if (this.action === 'delete') {
          this.$userApi
            .delete('/archive/' + this.uuid)
            .then(() => {
              this.users = this.users.filter((user) => {
                return user.user_uuid !== this.uuid
              })
              this.uuid = null
            })
            .catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
            .finally(() => {
              this.visible = false
              this.loadingModal = false
            })
        } else if (
          this.action === 'update-to-professional' ||
          this.action === 'update-to-user'
        ) {
          this.loadingModal = true
          this.$userApi
            .put('/role/' + this.uuid, {
              key:
                this.action === 'update-to-professional' ? 'MODERATOR' : 'USER',
            })
            .then(({ data }) => {
              this.users = this.users.map((usr) => {
                if (usr.user_uuid === this.uuid) {
                  usr.usro_id = data.usro_id
                  usr.usro_key = data.usro_key
                  usr.usro_role = data.usro_role
                }
                return usr
              })
            })
            .catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
            .finally(() => {
              this.visible = false
              this.loadingModal = false
            })
        } else if (this.action === 'block' || this.action === 'unblock') {
          this.loadingModal = true
          const blocked = this.action === 'block'
          this.$userApi
            .put('/blocked/' + this.uuid, {
              blocked,
            })
            .then(() => {
              this.users = this.users.map((user) => {
                if (user.user_uuid === this.uuid) {
                  user.user_blocked = blocked
                }
                return user
              })
            })
            .catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
            .finally(() => {
              this.loadingModal = false
              this.visible = false
              this.uuid = null
            })
        } else if (this.action === 'delUser') {
          console.log('dd')
          this.$userApi
            .delete('/' + this.uuid)
            .then(() => {
              this.users = this.users.filter((user) => {
                return user.user_uuid !== this.uuid
              })
              this.uuid = null
            })
            .catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
            .finally(() => {
              this.visible = false
              this.loadingModal = false
            })
        }
      }
    },
    updateToProfessional(uuid) {
      this.uuid = uuid
      this.visible = true
      this.action = 'update-to-professional'
    },
    archiveUser(uuid) {
      this.uuid = uuid
      this.visible = true
      this.action = 'delete'
    },
    deleteUser(uuid) {
      this.uuid = uuid
      this.visible = true
      this.action = 'delUser'
    },
  },
}
</script>
