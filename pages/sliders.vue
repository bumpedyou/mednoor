<template>
    <div class="pa-6 mh-100v">
        <v-row>
            <v-col md="12">
                <v-breadcrumbs :items="[
                {
                    text: 'Dashboard',
                    to: localePath('/dashboard'),
                    disabled: false,
                },{
                    text: $t('home_screen'),
                    disabled: true,
                }
                ]"></v-breadcrumbs>
            </v-col>
        </v-row>
        <v-row>
            <v-col md="12">
                <p class='h4 mb-1'> Sliders</p>
                <p>
                    Here you can control the home screen sliders
                </p>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    layout: 'dashboard'
}
</script>