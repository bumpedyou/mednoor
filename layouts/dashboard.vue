<template>
  <v-app>
    <Navbar></Navbar>
    <v-container :class="sidebarClassess" style="background: #f6f7f6">
      <div class="sidebar custom-scrollbar">
        <div class="indicators">
          <v-icon color="#c3c3c3" class="close" @click="close">mdi-chevron-left</v-icon>
          <v-icon color="#c3c3c3" class="open" @click="open">mdi-chevron-right</v-icon>
        </div>
        <ul>
          <li v-for="(o, i) in dashboardItems" :key="'it-' + i + '-' + key" >
            <a v-if="o.children && o.children.length" href="#" @click.prevent="openItem(i)">
              <v-icon>mdi-{{ o.icon }}</v-icon>
              <span>{{ o.title }}</span>
              <v-icon color="#333" class="submenu--icon">mdi-chevron-down</v-icon>
            </a>
            <nuxt-link v-else :to="localePath(o.to)">
              <v-icon>mdi-{{ o.icon }}</v-icon>
              <span>{{ o.title }}</span>
            </nuxt-link>
            <ul v-if="o.children && isSublistOpened(i)" class="sublist--items">
              <li v-for="(c, idx) in o.children" :key="'list-item-' + idx">
                <nuxt-link :to="localePath(c.to)">
                  {{c.title}}
                </nuxt-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="content">
        <nuxt />
      </div>
    </v-container>
  </v-app>
</template>
<script>
import dashboardOptionsList from '~/mixins/dashboardOptionsList'

export default {
  mixins: [dashboardOptionsList],
  data() {
    return {
      path: '',
      opened: false,
      key: 0,
    }
  },
  computed: {
    sidebarClassess() {
      const c = ['sidebar-options']
      if (this.opened) {
        c.push('opened')
      }
      return c.join(' ')
    },
  },
  mounted() {
    this.path = this.$route.path
  },
  methods: {
    openItem(index){
        this.open()
        this.$nextTick(()=>{
            const item = this.dashboardItems[index]
            if (item){
                item.isOpened = !item.isOpened
                this.dashboardItems[index] = item
            }
            this.key++  
        })
    },
    isSublistOpened(index){
        const item = this.dashboardItems[index]
        if (item) {
            return item.isOpened || false        
        }
        return false
    },
    close() {
      this.opened = false
      this.dashboardItems = this.dashboardItems.map((item)=>{
          item.isOpened = false
          return item

      })
    },
    open() {
      console.log('Open!', this.opened)
      this.opened = true
    },
  },
}
</script>
<style scoped lang="sass">

.sidebar
    transition: all 10ms ease
    background: #eee
    color: #333
    height: 100vh
    position: fixed
    left: 0
    top: 50px
    bottom: 0
    width: 60px
    overflow-y: auto
    display: none
    font-size: 0.7em !important

    ul
        padding: 0
        margin: 0
        li
            word-break: break-all
            padding: 0
            margin: 0
            list-style: none
            color: #333
            i
              color: #333
            a
                color: #333
                padding: 0.7rem 0.5rem
                display: flex
                &:hover
                    background: #ccc
                    cursor: pointer
                span
                    margin-right: 3px
                    display: none
                    flex: 1
                    align-items: center
                    margin-left: 6px
            .sublist--items
                li
                    a
                        padding-left: 30px !important
    .indicators
        display: flex
        padding: 0.7rem 0.5rem
        color: #333

        .close
            display: none
.opened
    .sidebar
        width: 200px
        ul
            li

              a
                    span
                        display: flex
        .indicators
            .close
                display: block
                margin-left: auto
            .open
                display: none
    .content
        left: 200px


.content
    position: fixed
    left: 0
    bottom: 0
    top: 50px
    right: 0
    overflow-y: auto
    transition: all 100ms ease
@media screen and (min-width: $md)
    .sidebar
        display: block
    .content
        left: 60px
</style>
