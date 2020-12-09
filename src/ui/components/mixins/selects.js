import _ from 'lodash';

export function createSelectMixin(parentProps, multiple) {
  multiple = multiple || 'multiple';

  return {
    props: {
      items: Array,
      objectValue: {
        type: Boolean,
        value: false,
      },
      valueField: {
        type: String,
        default: 'value',
      },
      labelField: {
        type: String,
        default: 'label',
      },
      itemPropHandler: Function,
      ...parentProps,
    },

    data() {
      return {
        val: undefined,
      };
    },

    computed: {
      parentProps() {
        return _.pick(this, Object.keys(parentProps));
      },
    },

    watch: {
      val(val) {
        if (!this.handlerObjectValue(val, 'Val')) {
          this.$emit('input', val);
        }
      },
      value: {
        handler(value) {
          if (!this.handlerObjectValue(value, 'Value')) {
            this.val = value;
          }
        },
        immediate: true,
      },
    },

    methods: {

      handlerObjectValue(value, type) {
        if (this.objectValue) {
          if (multiple == 'multiple' || this.multiple) {
            this[`handlerMultiple${type}`](value);
          } else if (multiple == 'single' || !this.multiple) {
            this[`handlerSingle${type}`](value);
          }
          return true;
        }
      },

      propHandler(item) {
        if (this.itemPropHandler) {
          return this.itemPropHandler(item);
        }
      },

      findItem(v) {
        return this.items.find(item => item[this.valueField] == v);
      },

      getValue(val) {
        return val.map(this.findItem);
      },

      getVal(value) {
        return value.map(v => v[this.valueField]);
      },

      handlerMultipleValue(value) {
        let val = this.getVal(value);
        if (!arrayEqual(val, this.val)) {
          this.val = val;
        }
      },

      handlerMultipleVal(val) {
        if (!arrayEqual(val, this.getVal(this.value))) {
          this.$emit('input', this.getValue(val));
        }
      },

      handlerSingleValue(value) {
        this.val = value[this.valueField];
      },

      handlerSingleVal(val) {
        if (val !== this.value[this.valueField]) {
          this.$emit('input', this.findItem(val));
        }
      },

    },

  };

  function arrayEqual(arr1, arr2) {

    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      return false;
    }

    if (arr1.length != arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i]) {
        return false;
      }
    }

    return true;
  }
}