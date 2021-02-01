<template>
  <AttrEditorGroup :config="propConfig"
                   :editors="defaultEditors"
                   :label="label"
                   :data="propInfo"
                   :context="getContext()"
                   @on-change="savePropData"/>
</template>
<script>

  import AttrEditorGroup from '../attrEditor/AttrEditorGroup';
  import _ from 'lodash';

  export default {
    props: {
      label: String,
      vucNode: Object,
      name: String,
      config: Object,
      defaultEditors: {
        type: Array,
        default() {
          return ['variable', 'expression'];
        },
      },
    },

    components: {
      AttrEditorGroup,
    },

    data() {
      return {
        propConfig: this.config || this.getPropConfig(),
        propInfo: {},
      };
    },

    watch: {
      vucNode: {
        handler: 'updatePropInfo',
        immediate: true,
      },
    },

    methods: {

      getContext(){
        return {

        }
      },

      getPropsInfoCaches() {
        return this.vucNode._props_info_caches_ = this.vucNode._props_info_caches_ || {};
      },

      updatePropInfo() {

        let propName = this.name;
        let propsInfoCaches = this.getPropsInfoCaches();
        let propInfo = propsInfoCaches[propName];

        let value = this.vucNode.getAttr(propName);
        let dynamic = this.vucNode.getAttrDynamic(propName) === 'dynamic';
        if (!propInfo) {
          propInfo = {
            attrData: undefined,
            editorId: null,
            value,
            dynamic,
          };
          propsInfoCaches[propName] = propInfo;
        } else {
          Object.assign(propInfo, { value, dynamic });
        }

        this.propInfo = propInfo;
      },

      getPropConfig() {
        let propsConfig = this.vucNode.getConfig('props');
        return propsConfig ? propsConfig[this.name] : null;
      },

      savePropData(propData) {
        let propName = this.name;
        let vucNode = this.vucNode;
        let { value, dynamic } = propData;
        let isChange = vucNode.setAttr(propName, value, dynamic);
        if (isChange) {
          if (this.propConfig.onChange) {
            this.propConfig.onChange(vucNode, value, dynamic);
          }
          this.$emit('on-change', { vucNode, value, dynamic });
        }
      },

    },
  };
</script>
