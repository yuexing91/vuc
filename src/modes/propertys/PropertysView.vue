<template>
  <div style="height: 100%;overflow: auto">
    <component
      v-for="cfg in configurators"
      :is="cfg"
      :key="cfg">
    </component>
  </div>
</template>
<script>

  export default {
    props: {
      configurators: Array,
    },
    components: {},
  };
</script>
