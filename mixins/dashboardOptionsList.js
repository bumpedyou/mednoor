import userRoleMixin from './userRoleMixin'

export default {
    mixins: [userRoleMixin],
    computed: {
        dashboardItems(){
            const i = []
            if (this.isSuper || this.isAdmin){
                i.push({
                    shortTitle: 'Home Screen',
                    cardTitle: 'Home Screen',
                    to: '/home-screen',
                    cardDescription: "Update the home screen image.",
                    btnText: 'Update Image',
                    icon: 'home',
                    type: 'primary',       
                })
            }

            if (this.isSuper || this.isAdmin){
                i.push({
                    shortTitle: 'List Of Users',
                    cardTitle: 'List Of Users',
                    to: '/users-list',
                    cardDescription: "Update the home screen image.",
                    btnText: 'Update Image',
                    icon: 'user',
                    type: 'old-rose',
                })
            }
            if (this.isSuper || this.isAdmin || this.isModerator) {
                i.push({
                    shortTitle: 'Add User',
                    cardTitle: 'Add User',
                    to: '/add-user',
                    cardDescription: "Shortcut to add user",
                    btnText: 'Add User',
                    icon: 'user-add',
                    type: 'aero-blue',
                })
                i.push({
                    shortTitle: 'EMR',
                    cardTitle: 'Electronic health record',
                    to: '/emr',
                    cardDescription: "Electronic health record",
                    btnText: 'Go to EMR',
                    icon: 'medicine-box',
                    type: 'success',       
                })
            }
            if (this.isAdmin || this.isSuper){
                i.push({
                    shortTitle: 'Terms and Conditions',
                    cardTitle: 'Terms and conditions',
                    to: '/update-terms-and-conditions',
                    cardDescription: "T & C",
                    btnText: 'Update',
                    icon: 'audit',
                    type: 'primary',       
                }, 
                {
                    shortTitle: 'Privacy Policy',
                    cardTitle: 'Privacy Policy',
                    to: '/update-privacy-policy',
                    cardDescription: "Privacy policy",
                    btnText: 'Update',
                    icon: 'file-protect',
                    type: 'old-rose',       
                })
            }
            return i
        }
    }
}