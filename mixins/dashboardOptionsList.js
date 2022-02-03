import userRoleMixin from './userRoleMixin'

export default {
  mixins: [userRoleMixin],
  computed: {
    dashboardItems() {
      const i = []
      if (this.isModeratorOrHigher) {
        i.push({
          shortTitle: 'Messenger',
          cardTitle: 'Messenger',
          to: '/',
          btnText: 'Messenger',
          icon: 'message-flash',
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
      }
      if (this.isAdminOrSuper) {
        i.push(
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
          /*
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
           */
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
