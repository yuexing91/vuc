<template>
  <span class="vuc-style-code"
        v-html="innerText"
        :contenteditable="editable"
        spellcheck="false"
        @keydown.enter.prevent="onEnter"
        @focus="isLocked = true"
        @blur="editover"
        @click="onClick"
        @input="changeText">
  </span>
</template>

<script>

  export default {
    props: {
      value: {
        type: String,
        default: '',
      },
      editstate: Boolean,
    },
    data () {
      return {
        innerText: this.value,
        editable: this.editstate,
        isLocked: false,
      };
    },
    mounted () {
      if (this.editable) {
        this.setFocus();
      }
    },
    watch: {
      editstate (state) {
        this.editable = state;
      },
      value () {
        if (!this.isLocked || !this.innerText) {
          this.innerText = this.value;
        }
      },
      editable: {
        handler (editable) {
          this.$nextTick(() => {
            if (editable) {
              this.setFocus();
            } else {
              window.getSelection().removeAllRanges();
            }
          });
        },
      },
    },
    methods: {
      setFocus () {
        this.$el.focus();
        window.getSelection().selectAllChildren(this.$el);
      },
      changeText () {
        this.$emit('input', this.$el.innerHTML || ' ');
      },
      onClick () {
        this.editable = true;
      },
      editover () {
        this.isLocked = false;
        this.editable = false;
        this.$emit('editover');
      },
      onEnter () {
        this.editover();
        this.$nextTick(() => {
          this.$emit('enter');
        });
      },
    },
  };
</script>

<style lang="less">
  .vuc-style-code {
    word-break: break-all;
    outline: none;
    user-select: text;
    white-space: pre-wrap;
    text-align: left;
    font-size: 16px;
    display: inline-block;
    min-width: 6px;
    height: 24px;

    &[contenteditable=true] {
      user-modify: read-write-plaintext-only;
      box-shadow: 1px 1px 6px 2px rgba(0, 0, 0, 0.2);

      &::selection {
        color: #333;
        background-color: #BBDDFB;
        text-shadow: none;
      }

      &:empty:before {
        content: attr(placeholder);
        display: block;
        color: #ccc;
      }
    }
  }

</style>
