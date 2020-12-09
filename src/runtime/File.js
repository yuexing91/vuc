export default class File {
  constructor (name, isFolder = false) {
    this.name = name;
    this.isFolder = isFolder;
    this.parent = null;
    if (this.isFolder) {
      this.files = [];
    }
  }

  getParentName () {
    if (this.parent) {
      return this.parent.name;
    }
  }

  addFile (file) {
    file.parent = this;
    this.files.push(file);
  }

  getFile (name) {
    return this.files.find(file => file.name === name);
  }

  findFile (path) {
    const ps = path.split('/');
    if (ps.length == 1) return path;
    let temp = this;
    ps.forEach(p => {
      if (p === '.') {
        temp = temp.parent;
      } else if (p === '..') {
        temp = temp.parent.parent;
      } else {
        temp = temp.getFile(p);
      }
    });
    return temp;
  }

  getPath () {
    if (this.parent) {
      return this.parent.getPath() + '/' + this.name;
    }
    return '';
  }

  setContent (content) {
    this.content = content;
    return this;
  }

}
