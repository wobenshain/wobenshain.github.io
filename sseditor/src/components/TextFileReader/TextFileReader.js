import React from 'react';
import FileInputReader from '../FileInputReader'
export default class TextFileReader extends React.Component {
  convertToText = (filecontents) => this.props.multiple ? this.props.onFileRead(filecontents.map((filecontent)=>new TextDecoder().decode(filecontent))) : this.props.onFileRead(new TextDecoder().decode(filecontents))
  render = () => <FileInputReader
                    name={this.props.name}
                    label={this.props.label}
                    multiple={this.props.multiple}
                    onFileRead={filecontents=>this.convertToText.call(this,filecontents)}
                    onNoFileChosen={this.props.onNoFileChosen}
                    />
}
