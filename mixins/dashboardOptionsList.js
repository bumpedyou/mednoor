import userRoleMixin from './userRoleMixin'

export default {
  mixins: [userRoleMixin],
  computed: {
    dashboardItems() {
      const i = []
      if (this.isAdminOrSuper) {
        i.push(
          {
            title: 'Website',
            icon: 'application-outline',
            type: 'primary',
            dark: false,
            isOpened: false,
            children: [
              {
                title: 'Sliders',
                to: '/sliders',
              },
              {
                title: 'Home Screen',
                to: '/home-screen',
              },
              {
                title: 'Main Text',
                to: '/main-text',
              },
              {
                title: this.$t('terms_cond'),
                to: '/update-terms-and-conditions',
                icon: 'file-sign',
                type: '#fa8072',
                dark: true,
              },
              {
                title: this.$t('privacy_p'),
                to: '/update-privacy-policy',
                icon: 'shield-lock-outline',
                type: 'purple',
                dark: true,
              },
              {
                title: this.$t('pages'),
                to: '/pages',
                icon: 'file-outline',
                type: 'primary',
              },
            ],
          }

          /*
          {
            title: 'Claims',
            to: '/hcfa',
            icon: 'card-text-outline',
            dark: true,
          } */
        )
      }
      if (this.isModeratorOrHigher) {
        i.push({
          title: this.$t('my_chats'),
          to: '/',
          icon: 'message-outline',
          type: 'success',
        })
        i.push({
          title: this.$t('list_usrs'),
          to: '/users-list',
          icon: 'account-group-outline',
          type: 'pink',
          dark: true,
        })
        i.push({
          title: this.$t('emr'),
          to: '/emr',
          icon: 'medical-bag',
          type: 'purple',
          dark: true,
        })
        i.push({
          title: 'Chat Queue',
          to: '/chat-requests',
          icon: 'forum-outline',
          dark: true,
        })
        /*
        i.push({
          title: 'Claims',
          to: '/hcfa',
          icon: 'card-text-outline',
          dark: true,
        })
        */
      }
      if (this.isAdminOrSuper) {
        i.push(
          {
            title: this.$t('professionals_list'),
            to: {
              path: '/users-list',
              query: {
                view: 'professionals',
              },
            },
            icon: 'account-tie-outline',
            type: 'black',
            dark: true,
          },
          {
            title: 'Categories',
            to: '/categories',
            icon: 'shape-outline',
            type: 'primary',
          },
          {
            title: 'Specialties',
            to: '/specialties',
            icon: 'box-cutter',
            type: 'success',
          },
          {
            title: 'Professional Requests',
            to: '/professional-requests',
            icon: 'account-key-outline',
            type: 'pink',
            dark: true,
          },
          {
            title: 'Archived users',
            to: {
              path: '/users-list',
              query: {
                view: 'archived',
              },
            },
            icon: 'folder-account-outline',
            type: 'primary',
          }
          /*
          {
            title: 'Claims',
            to: '/hcfa',
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
