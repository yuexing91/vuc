<template>
  <Dropdown trigger="click">
    <Input :prefix="value" icon="ios-arrow-down" v-model="val" :clearable="true"/>

    <div style="height: 200px;width: 260px;" slot="list" ref="div">
      <div :style="topHeight"></div>
      <span
        v-for="item in curItems" class="icon-option" :class="{'icon-option-selected':item.name==value}"
        @click="selectIcon(item)" :key="item.name">
        <i class="ivu-icon" :class="'ivu-icon-'+item.name"></i>
      </span>
      <div :style="bottomHeight"></div>
    </div>
  </Dropdown>
</template>
<script>

  import Icon from './Icon';

  export default{
    props: {
      value: String,
    },
    data(){
      return {
        val: this.value || '',
        icons: Icon,
        state: 'input',
        visible: false,
        index: 0
      }
    },
    computed: {
      items(){
        return this.icons.filter(icon => icon.tag.indexOf(this.val) != -1 || icon.name === this.val)
      },
      curItems(){
        return this.items.slice(this.index, this.index + 40)
      },
      topHeight(){
        let u = (this.index) / 4;
        return {
          height: (u === parseInt(u) ? u : u + 1) * 46 + 'px'
        }
      },
      bottomHeight(){
        let u = (this.items.length - this.index - 40) / 4;
        if (u < 0) u = 0;
        return {
          height: (u === parseInt(u) ? u : u + 1) * 46 + 'px'
        }
      }
    },
    mounted(){
      this.$refs.div.parentElement.addEventListener('scroll', this.scroll)
    },
    methods: {
      selectIcon(item){
        this.$emit('input', item.name)
      },
      scroll: _.throttle(function () {
        const lineNo = parseInt(this.$refs.div.parentElement.scrollTop / 46);
        this.index   = (lineNo - 2) * 4
        if (this.index < 0) {
          this.index = 0;
        }
      }, 40)
    },
    propEditorConfig: {
      id: 'PropIconEditor',
      type: 'icon',
      name: '图标',
      dynamic: false,
    }
  }
</script>
<style lang="less">
  .icon-option {
    display: inline-block;
    width: 25%;
    text-align: center;
    font-size: 28px !important;
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    color: #515a6e;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      background: #f3f3f3;
    }
    .icon-option:hover {
      color: #2d8cf0;
    }
  }

  .icon-option-selected {
    background: #f3f3f3;
    color: #2d8cf0;
  }

</style>
