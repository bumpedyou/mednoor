import userRoleMixin from './userRoleMixin'

export default {
  mixins: [userRoleMixin],
  computed: {
    dashboardItems() {
      const i = []
      if (this.isAdminOrSuper) {
        i.push(
          {
            shortTitle: this.$t('home_screen'),
            cardTitle: this.$t('home_screen'),
            to: '/home-screen',
            btnText: this.$t('home_screen'),
            icon: 'home',
            type: 'primary',
            dark: false,
          },
          {
            shortTitle: 'Main Text',
            cardTitle: 'Main Text',
            to: '/main-text',
            btnText: 'Main Text',
            icon: 'card-text',
            dark: true,
          },
          /*
          {
            shortTitle: 'Claims',
            cardTitle: 'Claims',
            to: '/hcfa',
            btnText: 'Claims',
            icon: 'card-text',
            dark: true,
          } */
        )
      }
      if (this.isModeratorOrHigher) {
        i.push({
          shortTitle: this.$t('my_chats'),
          cardTitle: this.$t('my_chats'),
          to: '/',
          btnText: this.$t('my_chats'),
          icon: 'message',
          type: 'success',
        })
        i.push({
          shortTitle: this.$t('list_usrs'),
          cardTitle: this.$t('list_usrs'),
          to: '/users-list',
          btnText: this.$t('list_usrs'),
          icon: 'account-group',
          type: 'pink',
          dark: true,
        })
        i.push({
          shortTitle: this.$t('emr'),
          cardTitle: this.$t('emr_lng'),
          to: '/emr',
          btnText: this.$t('go_emr'),
          icon: 'medical-bag',
          type: 'purple',
          dark: true,
        })
        i.push({
            shortTitle: 'Chat Queue',
            cardTitle: 'Chat Queue',
            to: '/chat-requests',
            btnText: 'Chat Queue',
            icon: 'forum',
            dark: true,
          }
        )
        /*
        i.push({
          shortTitle: 'Claims',
          cardTitle: 'Claims',
          to: '/hcfa',
          btnText: 'Claims',
          icon: 'card-text',
          dark: true,
        })
        */
      }
      if (this.isAdminOrSuper) {
        i.push(
          {
            shortTitle: this.$t('terms_cond'),
            cardTitle: this.$t('terms_cond'),
            to: '/update-terms-and-conditions',
            btnText: this.$t('update'),
            icon: 'file-sign',
            type: '#fa8072',
            dark: true,
          },
          {
            shortTitle: this.$t('privacy_p'),
            cardTitle: this.$t('privacy_p'),
            to: '/update-privacy-policy',
            btnText: this.$t('update'),
            icon: 'shield-lock',
            type: 'purple',
            dark: true,
          },
          {
            shortTitle: this.$t('pages'),
            cardTitle: this.$t('pages'),
            to: '/pages',
            btnText: this.$t('pages'),
            icon: 'file',
            type: 'primary',
          },
          {
            shortTitle: this.$t('professionals_list'),
            cardTitle: this.$t('professionals_list'),
            to: {
              path: '/users-list',
              query: {
                view: 'professionals',
              },
            },
            btnText: this.$t('professionals_list'),
            icon: 'account-tie',
            type: 'black',
            dark: true,
          },
          {
            shortTitle: 'Categories',
            cardTitle: 'Categories',
            to: '/categories',
            btnText: 'Categories',
            icon: 'shape',
            type: 'primary',
          },
          {
            shortTitle: 'Specialties',
            cardTitle: 'Specialties',
            to: '/specialties',
            btnText: 'Specialties',
            icon: 'box-cutter',
            type: 'success',
          },
          {
            shortTitle: 'Professional Requests',
            cardTitle: 'Professional Requests',
            to: '/professional-requests',
            btnText: 'List of requests',
            icon: 'account-key',
            type: 'pink',
            dark: true,
          },
          {
            shortTitle: 'Archived users',
            cardTitle: 'Archived users',
            to: {
              path: '/users-list',
              query: {
                view: 'archived',
              },
            },
            btnText: 'Archived users',
            icon: 'folder-account',
            type: 'primary',
          },
          /*
          {
            shortTitle: 'Claims',
            cardTitle: 'Claims',
            to: '/hcfa',
            btnText: 'Claims',
            icon: 'card-text',
            dark: true,
          }
           */
        )
      }
      return i
    },
  },
}
