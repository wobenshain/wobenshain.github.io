import React from 'react';
import TextFileReader from '../TextFileReader'
export default class JsonFileReader extends React.Component {
  convertToJSON = (filecontents) => {
    try {
      this.props.multiple ? this.props.onFileRead(filecontents.map((filecontent)=>JSON.parse(filecontent))) : this.props.onFileRead(JSON.parse(filecontents));
    } catch(error) {
      console.log(error);
    }
  }
  render = () => <TextFileReader
                    name={this.props.name}
                    label={this.props.label}
                    multiple={this.props.multiple}
                    onFileRead={filecontents=>this.convertToJSON.call(this,filecontents)}
                    onNoFileChosen={this.props.onNoFileChosen}
                    />
}
