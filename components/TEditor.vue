<template>
<div>
        <div v-if="editor">
        <button :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
            h1
        </button>
        <button :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
            h2
        </button>
        <button :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
            h3
        </button>
        <button :class="{ 'is-active': editor.isActive('paragraph') }" @click="editor.chain().focus().setParagraph().run()">
            paragraph
        </button>
        <button :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
            bold
        </button>
        <button :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
            italic
        </button>
        <button :class="{ 'is-active': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
            strike
        </button>
        <button :class="{ 'is-active': editor.isActive('highlight') }" @click="editor.chain().focus().toggleHighlight().run()">
            highlight
        </button>
        <button :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" @click="editor.chain().focus().setTextAlign('left').run()">
            left
        </button>
        <button :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" @click="editor.chain().focus().setTextAlign('center').run()">
            center
        </button>
        <button :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" @click="editor.chain().focus().setTextAlign('right').run()">
            right
        </button>
        <button :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }" @click="editor.chain().focus().setTextAlign('justify').run()">
            justify
        </button>
    </div>
    <editor-content v-model="localValue" :editor="editor" class="TEditor">
    <div class="content">
        <pre><code>{{ localValue }}</code></pre>
    </div>
    </editor-content>

</div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
// eslint-disable-next-line import/no-named-as-default
import TextAlign from '@tiptap/extension-text-align'
// eslint-disable-next-line import/no-named-as-default
import Highlight from '@tiptap/extension-highlight'
import vmodelMixin from '~/mixins/vmodelMixin'

export default {
  name: "TEditor",
  components: {
    EditorContent,
  },
  mixins: [vmodelMixin],

  data() {
    return {
      editor: null,
    }
  },

  computed :{
    content (){
      if (this.editor){
        return this.editor.getHTML()
      }
      return ''
    }
  },
  watch: {
    content(v){
      this.localValue = v
    }
  },
  mounted() {

    this.editor = new Editor({
      content: '',
      extensions: [
        StarterKit,
        TextAlign,
        Highlight
      ],
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    setHTML(data){
      this.editor.setHTML(data)
    },
  },
}
</script>

<style lang="sass">

.TEditor 
  div
    border: 2px solid $mdn-raisin-black
    min-height: 300px


.ProseMirror
  margin-top: 1rem

  > * + *
    margin-top: 0.75em

  ul,
  ol
    padding: 0 1rem

  

  code 
    background-color: rgba(#616161, 0.1)
    color: #616161
  
  p
    margin-top: 0
    margin-bottom: 0
  pre 
    background: #0D0D0D
    color: #FFF
    font-family: 'JetBrainsMono', monospace
    padding: 0.75rem 1rem
    border-radius: 0.5rem

    code 
      color: inherit
      padding: 0
      background: none
      font-size: 0.8rem
    
  

  mark 
    background-color: #FAF594
  

  img 
    max-width: 100%
    height: auto
  

  blockquote 
    padding-left: 1rem
    border-left: 2px solid rgba(#0D0D0D, 0.1)
  

  hr 
    border: none
    border-top: 2px solid rgba(#0D0D0D, 0.1)
    margin: 2rem 0



</style>