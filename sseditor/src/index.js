import React from 'react';
import ReactDOM from 'react-dom';
import JsonFileReader from './components/JsonFileReader';

ReactDOM.render(
  <JsonFileReader
    name="gamedata"
    label="Load Base Game Data"
    multiple={true}
    onFileRead={filecontent=>console.log(filecontent)}
    />,
  document.getElementById('root')
);