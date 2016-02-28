export class Loader {
  loadFile(fileName) {
    let xhr;

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (evt) => this.onxhr(evt);
    xhr.open('GET', fileName);
    xhr.send();
  }

  onxhr(evt) {
    let xhr;

    xhr = evt.target;
    if (xhr.readyState === 4 && xhr.status < 400) {
      this.onLoaded(xhr.response);
    }
  }
}

export default class Preload extends Loader {
  constructor() {
    super();
    this.fileList = [];
    this.loadedCount = 0;
    this.callback = null;
  }

  preload(fileList, callback) {
    this.fileList = fileList;
    this.loadedCount = 0;
    this.callback = callback;
    for (let i = 0; i < fileList.length; i++) {
      this.loadFile(fileList[i]);
    }
  }

  onLoaded(data) {
    this.loadedCount++;
    if (this.loadedCount === this.fileList.length && this.callback) {
      this.callback();
    }
  }
}

