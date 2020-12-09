import CodeList from './components/CodeList';
import CodeEditor from './components/CodeEditor';
import ArgumentTable from './components/ArgumentTable';
import ContextMenu from './components/ContextMenu';
import CollapsePanel from './components/CollapsePanel';
import TableEditor from './components/TableEditor';
import Select from './components/Select';

export default {
  install(Vue){
    Vue.component('VucCodeList', CodeList);
    Vue.component('VucCodeEditor', CodeEditor);
    Vue.component('VucArgumentTable', ArgumentTable);
    Vue.component('VucCollapsePanel', CollapsePanel);
    Vue.component('VucTableEditor', TableEditor);
    Vue.component('VucContextMenu', ContextMenu);
    Vue.component('VucSelect', Select);
  },
};
