<template>
  <ul class="vuc-code-list">
    <li v-for="item in data" :key="item.id">
      <code class="vuc-code" @click="clickItem(item)">{{item.id}}</code>
      <span>{{item.name}}</span>
      <Icon @click.native="delItem(item)" class="vuc-code-list__close" type="ios-close" size="18"></Icon>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      data: Array,
    },
    methods: {
      clickItem (item) {
        this.$emit('click-item', item);
      },
      delItem (item) {
        this.$emit('delete-item', item);
      },
    },
  };
</script>

<style>
  .vuc-list {
    padding: 0px 16px;
    padding-top: 8px;
    list-style: none;
  }

  .vuc-list-tools {
    padding: 10px 16px;
    border-bottom: 1px solid #e8eaec;
  }

  .vuc-list > li {
    margin-bottom: 5px;
    cursor: pointer;
  }

  .vuc-list > li:hover {
    color: #5cadff;
  }

  .vuc-list > li > span {
    float: right;
  }
</style>
