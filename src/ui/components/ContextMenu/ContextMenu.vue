<template>
  <ul class="vuc-ctxmenu" v-show="visible">
    <li :class="['vuc-ctxmenu-item' , { 'vuc-ctxmenu-sub' : item.children ,'vuc-ctxmenu-divided' : item.divided }]"
        v-for="item in datas"
        :key="item.text"
        @click.stop="click($event,item)"
        @mouseenter="item.show = true"
        @mouseleave="item.show = false">
      <span v-html="item.text"></span>
      <ctxmenu
        v-if="item.children"
        :items="item.children"
        v-model="item.show"
        class="vuc-ctxmenu-submenu"
        @click-item="clickSub($event)"
      />
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'ctxmenu',
    props: ['value', 'items'],
    data(){
      return {
        visible: this.value,
        datas: []
      }
    },
    watch: {
      value(){
        this.visible = this.value;
        if (this.visible) {
          document.addEventListener('click', this.addClickHandler)
        } else {
          document.removeEventListener('click', this.addClickHandler)
        }
      },
      items: {
        immediate: true,
        handler(){
          this.datas = this.items.map(item => {
            if (item.children) {
              return Object.assign({ show: false }, item)
            }
            return item;
          })
        }
      }
    },
    methods: {
      click(event, item){
        this.$emit('input', false)
        this.$emit('click-item', Object.assign({ event }, item))
      },
      clickSub(event){
        this.$emit('input', false)
        this.$emit('click-item', event)
      },
      addClickHandler(){
        this.$emit('input', false)
      }
    }
  }
</script>

<style lang="less">
  .vuc-ctxmenu {
    position: absolute;
    overflow: visible;
    margin: 0px;
    padding: 0px;
    list-style: none;
    min-width: 120px;
    border: 1px solid #dddee1;
    background: #fff;
    z-index: 99;
    .vuc-ctxmenu-item {
      position: relative;
      margin: 0;
      padding: 6px 16px;
      color: #495060;
      font-size: 12px;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        background: #f3f3f3;
      }
    }
    vuc-ctxmenu-sub {
      &:before {
        content: " ";
        position: absolute;
        top: 10px;
        right: 6px;
        border-left: 4px solid #4d82b8;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
      }
    }
    vuc-ctxmenu-submenu {
      top: 0px;
      left: 100%;
    }
    vuc-ctxmenu-divided {
      padding: 0px 16px;
      border-bottom: 1px solid #e9eaec;
      margin-bottom: 1px;
    }
  }
</style>
