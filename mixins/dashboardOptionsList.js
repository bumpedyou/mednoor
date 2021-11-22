import userRoleMixin from './userRoleMixin'

export default {
    mixins: [userRoleMixin],
    computed: {
        dashboardItems(){
            const i = []
            if (this.isSuper || this.isAdmin){
                i.push({
                    shortTitle: this.$t('home_screen'),
                    cardTitle: this.$t('home_screen'),
                    to: '/home-screen',
                    btnText: this.$t('home_screen'),
                    icon: 'home',
                    type: 'primary',
                })
            }

            if (this.isSuper || this.isAdmin){
                i.push({
                    shortTitle: this.$t('list_usrs'),
                    cardTitle: this.$t('list_usrs'),
                    to: '/users-list',
                    btnText: this.$t('list_usrs'),
                    icon: 'user',
                    type: 'old-rose',
                })
            }
            if (this.isModerator) {
                i.push({
                    shortTitle: this.$t('add_urs'),
                    cardTitle: this.$t('add_urs'),
                    to: '/add-user',
                    btnText: this.$t('add_urs'),
                    icon: 'user-add',
                    type: 'aero-blue',
                })
            }
            if (this.isAdmin || this.isSuper || this.isModerator){
                i.push({
                    shortTitle: this.$t('emr'),
                    cardTitle: this.$t('emr_lng'),
                    to: '/emr',
                    btnText: this.$t('go_emr'),
                    icon: 'medicine-box',
                    type: 'success',
                })
            }
            if (this.isAdmin || this.isSuper){
                i.push({
                    shortTitle: this.$t('terms_cond'),
                    cardTitle: this.$t('terms_cond'),
                    to: '/update-terms-and-conditions',
                    btnText: this.$t('update'),
                    icon: 'audit',
                    type: 'primary',
                },
                {
                    shortTitle: this.$t('privacy_p'),
                    cardTitle: this.$t('privacy_p'),
                    to: '/update-privacy-policy',
                    btnText: this.$t('update'),
                    icon: 'file-protect',
                    type: 'old-rose',
                },
                {
                    shortTitle: this.$t('pages'),
                    cardTitle: this.$t('pages'),
                    to: '/pages',
                    btnText: this.$t('pages'),
                    icon: 'file',
                    type: 'raisin-black',
                })
            }
            return i
        }
    }
}
