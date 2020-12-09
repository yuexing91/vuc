<template>
  <div :class="className">
    <span
      v-for="n in size + 1"
      :key="n"
      :class="(n-1) % 10 == 0 ? 'vuc-ruler-0' : (n-1) % 5 == 0 ? 'vuc-ruler-50' : ''">
      {{(n - 1) % 10 == 0 ? (n - 1) * scale : ''}}
    </span>
  </div>
</template>
<script>

  export default{
    props: {
      direction: {
        validator: function (value) {
          return ['row', 'column'].indexOf(value) !== -1
        },
      },
      size: Number,
      scale: Number
    },
    computed: {
      className(){
        return ['vuc-ruler', 'vuc-ruler-' + this.direction]
      }
    },
    data(){
      return {}
    },
  }
</script>
<style lang="less">
  .vuc-ruler {
    display: flex;
    & > span {
      font-size: 10px;
      position: relative;
      text-indent: 2px;
      flex-shrink: 0;
      &:after {
        content: '';
        display: block;
        background: #ccc;
        position: absolute;
      }
    }
  }

  .vuc-ruler-row {
    flex-direction: row;
    border-bottom: 1px solid #ccc;
    height: 20px;
    & > span {
      width: 10px;
      height: 20px;
      &:after {
        width: 1px;
        height: 5px;
        bottom: 0px;
      }
    }
    & > .vuc-ruler-0:after {
      height: 14px;
    }
    & > .vuc-ruler-50:after {
      height: 10px;
    }
  }

  .vuc-ruler-column {
    width: 20px;
    flex-direction: column;
    border-right: 1px solid #ccc;
    & > span {
      width: 20px;
      height: 10px;
      writing-mode: vertical-lr;
      letter-spacing: 1px;
      &:after {
        width: 5px;
        height: 1px;
        right: 0px;
        top: 0px;
      }
    }
    & > vuc-ruler-0:after {
      width: 20px;
    }
    & > vuc-ruler-50:after {
      width: 10px;
    }
  }

</style>
