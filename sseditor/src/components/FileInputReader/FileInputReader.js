import React from 'react';
import './FileInputReader.css'
export default class FileInputReader extends React.Component {
  readFile(event) {
    var fileList = [].slice.call(event.target.files);
    if (fileList.length > 0) {
      let $that = this;
      if (this.props.multiple) {
        Promise.all(fileList.map((entry) => new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = function() {
            resolve(reader.result);
          }
          reader.onerror = reader.onabort = function() {
            reject();
          }
          reader.readAsArrayBuffer(entry);
        }))).then(
          (results) => $that.props.onFileRead ? $that.props.onFileRead(results) : console.log(results.map((result)=>new TextDecoder().decode(result))),
          () => console.log('Files failed to load properly.')
        );
      } else {
        let reader = new FileReader();
        reader.onload = function() {
          $that.props.onFileRead ? $that.props.onFileRead(reader.result) : console.log(new TextDecoder().decode(reader.result));
        }
        reader.readAsArrayBuffer(fileList[0]);
      }
    } else {
      this.onNoFileChosen ? this.onNoFileChosen() : console.log(this.props.name+" cleared.");
    }
  }
  render = () =>
    <div className="file-input-reader">
      <label htmlFor={this.props.name}>{this.props.label}</label>
      <input type="file" id={this.props.name} onChange={event=>this.readFile.call(this,event)} multiple={this.props.multiple}/>
    </div>
}
