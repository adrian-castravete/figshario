export default class Loader {
  loadFile(fileName) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (evt) => this.onxhr(evt);
    xhr.open("GET", fileName);
    xhr.send();
  }

  onxhr(evt) {
    let xhr = evt.target;
    if (xhr.readyState === 4 && xhr.status < 400) {
      this.onLoaded(xhr.response);
    }
  }

  onLoaded() {
  }
}

export class AssetLoader extends Loader {
  loadFiles(fileList) {
    this.fileList = fileList;
    for (let i = 0, len = fileList.length; i < len; i += 1) {
      this.loadFile(fileList[i]);
    }
  }

  onxhr(evt) {
    let xhr = evt.target;
    if (xhr.readyState === 4 && xhr.status < 400) {
      this.onLoaded(xhr.responseURL);

      let toRemove = [];
      for (let i = 0, len = this.fileList.length; i < len; i += 1) {
        let file = this.fileList[i];
        if (xhr.responseURL.indexOf(file) >= 0) {
          toRemove.push(i);
        }
      }

      for (let i = 0, len = toRemove.length; i < len; i += 1) {
        this.fileList.splice(toRemove[i], 1);
      }

      if (this.fileList.length === 0) {
        this.onLoadedAll();
      }
    }
  }

  onLoaded() {
  }

  onLoadedAll() {
  }
}
