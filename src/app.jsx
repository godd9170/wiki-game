//libraries
var React = require('react');
//components
var Header = require('./components/Header');
var ScorePanel = require('./components/ScorePanel');
var ContentPanel = require('./components/ContentPanel');
var Footer = require('./components/Footer');
//styles
require('./styles/app.scss');   //stylings for component

var App = React.createClass({

  render() {
    var url = "http://www.wikipedia.com";
    return (
      <div className="app">
        <Header />
        <ScorePanel />
        <ContentPanel url={url}/>
        <Footer />
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));