<template>
  <div class="vuc-codeeditor" :class="{'vuc-codeeditor-inline':inline,'vuc-codeeditor-small':sm}">
  </div>
</template>
<style lang="less">
  .vuc-codeeditor {
    border: 1px solid #dcdee2;
  }

  .vuc-codeeditor-inline {
    border-radius: 3px;
    line-height: 1.5;
    padding: 2px 3px;
    height: 32px;
    max-height: 32px;
  }

  .vuc-codeeditor-small {
    font-size: 12px;
    padding: 1px 3px;
    .CodeMirror-sizer {
      min-height: 20px;
    }
    .CodeMirror-lines {
      padding: 2px 0 !important;
    }
  }

  .vuc-codeeditor .CodeMirror {
    height: auto;
    font: 14px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;
  }

  .vuc-codeeditor, .CodeMirror-hints {
    font-size: 14px;
    .cm-variable {
      /*color: #05a;*/
    }
  }

  .CodeMirror-hints {
    font-family: inherit;
    min-width: 200px;
  }

  .CodeMirror-hints .vuc-code-hintcode {
    line-height: 20px;
  }

  .vuc-code-hintdesc {
    color: #9ea7b4;
    font-size: 12px;
    float: right;
    display: inline-block;
    height: 20px;
    line-height: 20px;
  }

  .CodeMirror-hint-active .vuc-code-hintdesc {
    color: #ccc;
  }
</style>
<script>

  import _ from 'lodash'
  import CodeMirror from 'codemirror';
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/addon/display/fullscreen.css';
  import 'codemirror/addon/display/fullscreen';
  import 'codemirror/addon/fold/foldgutter.css';
  import 'codemirror/addon/fold/foldcode';
  import 'codemirror/addon/fold/foldgutter';
  import 'codemirror/addon/fold/brace-fold';
  import 'codemirror/addon/display/autorefresh';
  import 'codemirror/mode/javascript/javascript';

  import './editorHint';

  const hints = [{
    id: 'Math',
    desc: '基本数学运算的方法',
    children: [{
      id: 'abs',
      desc: '返回参数num的绝对值',
      type: 'method',
      args: [{
        id: 'num',
      }],
    }, {
      id: 'min',
      desc: '返回参数array的最小值',
      type: 'method',
      args: [{
        id: 'array',
        req: true,
      }],
    }]
  }, {
    id: 'String'
  }]

  export default{
    props: {
      value: String,
      hints: Array,
      width: [String, Number],
      height: {
        type: [String, Number],
        default: 300
      },
      inline: Boolean,
      sm: {
        type: Boolean,
        default: false
      }
    },

    data(){
      return {
        code: this.value
      }
    },

    watch: {
      value: {
        handler(){
          if (this.value != this.code) {
            this.code = this.value;
            this.$nextTick(() => {
              this._setValue = true;
              this.codeMirror.setValue(this.code || '');
              this.codeMirror.display.lastWrapHeight = 0;
            });
          }
        },
        immediate: true
      },
      code(){
        if (this.code != this.value) {
          this.$emit('input', this.code);
        }
      }
    },
    mounted(){

      const opts = this.inline ? {
        lineNumbers: false,
        lineWrapping: true,
        viewportMargin: Infinity,
      } : {
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter",],
        foldGutter: true,
      }

      this.codeMirror = CodeMirror(this.$el, Object.assign({
        value: this.value || '',
        lineNumbers: true,
        mode: 'javascript',
        indentWithTabs: false,
        autoCloseBrackets: true,
        autoRefresh: true,
        extraKeys: {
          'Alt-/': (cm) => {
            cm.showHint({
              editor: this
            });
          },
          'Tab': function (cm) {
            if (cm.somethingSelected()) {
              cm.indentSelection('add');
            } else {
              let spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
              cm.replaceSelection(spaces);
            }
          },
          'F11': function (cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
          },
        },
      }, opts))

      this.codeMirror.setSize(this.width, this.inline ? null : this.height)

      this.codeMirror.on('change', _.debounce(() => {
        if (this._setValue) {
          this._setValue = false;
        } else {
          this.code = this.codeMirror.getValue();
        }
      }, 300));

      let focusValue = ''
      this.codeMirror.on('focus', () => {
        focusValue = this.code;
      });

      this.codeMirror.on('blur', () => {
        if (focusValue !== this.code) {
          this.$emit('change', this.code);
        }
      });

      this.codeMirror.on('beforeChange', (cm, obj) => {
        if (obj.origin == '+input') {
          if (this.inline) {
            //阻止Enter事件
            if (obj.text.length == 2 && obj.text.join('') == '') {
              obj.cancel();
              cm.getInputField().blur()
            }
          }
        }
      })

    },
    methods: {
      _getHint(token, context){
        context   = _.castArray(context);
        let ctx;
        let props = this.hints;
        while (ctx = context.pop()) {
          const prop = props.find(p => p.id == ctx.string);
          if (prop == null) return;
          props = prop.children;
        }

        return props.filter(p => p.id.startsWith(token.string));
      },

      getHint(token, context){
        return {
          list: this._getHint(token, context).map(p => {

            if (p.type == 'method') {
              return {
                text: `${p.id}()`,
                render(el){
                  el.innerHTML = `<span class="e-code-hintcode">${p.id}(${_.map(p.args, a => a.req ? a.id : `[${a.id}]`).join(',')})</span><span class="e-code-hintdesc">${p.desc || ''}</span>`
                }
              }
            }

            return {
              text: `${p.id}`,
              render(el){
                el.innerHTML = `<span class="e-code-hintcode">${p.id}</span> <span class="e-code-hintdesc">${p.desc || ''}</span>`
              }
            }
          })
        }
      },

      refresh(){
        this.codeMirror.refresh()
      }
    },


  }
</script>
