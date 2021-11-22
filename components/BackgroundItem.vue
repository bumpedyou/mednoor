<template>
    <div class="bg-img" :style="backgroundURL">
    </div>
</template>
<script>
export default{
    props: {
        source: {
            type: String,
            default: ''
        },
        file: {
            type: String,
            default: '',
        },
        height: {
            type: String,
            default: '',
        }
    },
    computed:{
        backgroundURL(){
            let path
            const src = this.$props.source.toLowerCase()
            if ( src === 'api'){
                path = process.env.API_URL + '/'
            }else if (src === 'empty'){
                path = ''
            }else{
                path = process.env.BASE_URL + '/'
            }
            path+= this.$props.file
            let s = `background-image: url(${path});`
            if (this.$props.height){
                s+=`height: ${this.$props.height} !important;`
            }
            return s
        }
    },
}
</script>
<style scoped lang="sass">
.bg-img
  background-position: center center
  background-repeat: no-repeat
  background-size: cover
</style>
