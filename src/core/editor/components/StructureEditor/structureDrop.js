export default {
  mounted() {
    this.dropPosProxyElement = null;
    window.addEventListener('mousemove', e => {
      if (this.dropPosProxyElement) {
        if (!e._stopMove) {
          this.dropPosProxyElement.style.display = 'none';
        }
      }
    });
    window.addEventListener('mouseup', e => {
      if (this.dropPosProxyElement) {
        document.body.removeChild(this.dropPosProxyElement);
        this.dropPosProxyElement = null;
      }
    });
  },
  methods: {
    dropStart(e, data) {
      this.activeEditor.dropStart(e, data, {
        x: 0,
        y: 0,
        width: '100px',
        height: '30px',
      });
    },

    event(e, node, callback) {
      if (e._stopMove) {
        return;
      }

      let dropManager = this.activeEditor.dropManager;
      let dropData = this.activeEditor.dropManager.dropData;

      if (dropData) {
        if (dropManager.isOffspring(node)) {
          return;
        }

        let pos = getPos(e, node);

        if (pos === 'after' && node.getAfterNode() === dropData) {
          return;
        }

        if (pos === 'before' && node.getBeforeNode() === dropData) {
          return;
        }

        callback.call(this, pos);
        e._stopMove = true;
      }
    },

    dropMove(e, node) {
      this.event(e, node, pos => {
        if (this.dropPosProxyElement == null) {
          this.dropPosProxyElement = document.createElement('div');
          this.dropPosProxyElement.className = 'vuc-structure-pos-proxy';
          document.body.appendChild(this.dropPosProxyElement);
        }

        let rect = e.target.getBoundingClientRect();
        let style = {
          display: 'block',
          top: rect.top + 'px',
          left: rect.left + 'px',
          width: rect.width - 7 + 'px',
          height: '0px',
        };

        let addProxyClass = false;
        if (pos === 'before') {

        } else if (pos === 'after') {
          style.top = rect.top + rect.height + 'px';
        } else {
          addProxyClass = true;
          style.height = rect.height + 'px';
        }

        this.setProxyClass(addProxyClass);
        Object.assign(this.dropPosProxyElement.style, style);
      });
    },

    setProxyClass(add) {
      if (add) {
        this.dropPosProxyElement.classList.add('vuc-structure-pos-proxy-inner');
      } else {
        this.dropPosProxyElement.classList.remove('vuc-structure-pos-proxy-inner');
      }
    },

    dropUp(e, node) {

      this.event(e, node, pos => {

        this.activeEditor.dropManager.getDropVucNode().then(dropNode => {
          if (pos === 'inner') {
            this.activeEditor.applyApi('appendNode', node, dropNode);
          } else {
            this.activeEditor.applyApi('parseNode', node, pos, dropNode, true);
          }
        });

      });

    },
  },
};

function getPos(e, node) {
  let preSize = 6, nextSize = 13;

  if (!_.isEmpty(node.children) || node.tag === undefined) {
    preSize = nextSize = 10;
  }

  if (e.offsetY <= preSize) {
    return 'before';
  } else if (e.offsetY > nextSize) {
    return 'after';
  } else {
    return 'inner';
  }
}
