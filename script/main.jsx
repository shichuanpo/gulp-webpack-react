var React = require('react');
var ReactDOM = require('react-dom');
var testImg = require('../images/test.png');
require('../style/testcss.less');
ReactDOM.render(
  <div>
  	<h1>Hello World！</h1>
  	<img src={testImg} alt="testImg"/>
  </div>,
  document.getElementById('mainContain')
);