<template>

  <i-select v-model="val" v-bind="parentProps">
    <slot v-for="item in items" :item="item">
      <i-option
        v-bind="propHandler(item)"
        :value="item[valueField]"
        :label="item[labelField]"
        :key="item[valueField]">
      </i-option>
    </slot>
  </i-select>

</template>

<script>
  import iview from 'view-design';
  import { createSelectMixin } from '../mixins/selects';

  export default {
    mixins: [createSelectMixin(iview.Select.props, 'multiple|single')],
  };

</script>
