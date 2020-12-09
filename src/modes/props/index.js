import PropsView from './PropsView.vue';
import PropItem from './PropItem.vue';

const requireEditors = require.context(
  // 其组件目录的相对路径
  './propEditors',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /[A-Z]\w+Editor\.(vue)$/,
);

requireEditors.keys().forEach(fileName => {
  // 获取组件配置
  const EditorsConfig = requireEditors(fileName);
  PropItem.components[EditorsConfig.default.propEditorConfig.id] = EditorsConfig.default;
});

export default {
  install (Designer) {
    Designer.registerConfigurator('PropsView', PropsView);
  },
};
