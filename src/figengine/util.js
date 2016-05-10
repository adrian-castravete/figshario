export default class Loader {
  loadFile(fileName) {
    let xhr;

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (evt) => this.onxhr(evt);
    xhr.open("GET", fileName);
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
