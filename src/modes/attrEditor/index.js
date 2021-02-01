import AttrEditorGroup from './AttrEditorGroup';
import { registerAttrEditor } from './util';

const requireEditors = require.context(
  // 其组件目录的相对路径
  './editors',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /[A-Z]\w+Editor\.(vue)$/,
);

requireEditors.keys().forEach(fileName => {
  // 获取组件配置
  const EditorsConfig = requireEditors(fileName);
  registerAttrEditor(EditorsConfig.default);
});

export default {
  install(Designer) {
    Designer.registerExtension('registerAttrEditor', registerAttrEditor);
    Designer.registerExtension('getAttrEditorGroup', function () {
      return AttrEditorGroup;
    });
  },
};
