//libraries
var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
//components
var Header = require('./components/Header');
var ScorePanel = require('./components/ScorePanel');
var ContentPanel = require('./components/ContentPanel');
var Footer = require('./components/Footer');

//styles
require('./styles/app.scss');   //stylings for component

var App = React.createClass({

  getInitialState() {
    return {
      content : null,
      title : null,
      moves : -1
    };
  },

  onRandomPageSuccess(resp) {

    console.log(resp);
    var title = resp.title;
    var content = resp.content;
    var links = resp.links;

    this.setState({
      title : title,
      links : links,
      content : content
    });
  },

  onRandomPageError(resp) {
    console.log("ERROR: ", resp);
  },

  onMove() {
    var counter = this.state.moves++;
    this.setState({
      moves : counter,
    });
  },
 
  componentWillMount() {
    var url = "/article";

    $.ajax({
        url: url,
        method: 'GET',
        success: this.onRandomPageSuccess,
        error: this.onRandomPageError,
      });

  },

  render() {
    var url = this.state.url;
    var title = this.state.title;

    return (
      <div className="app">
        <Header />
        <ScorePanel title={title} moves={this.state.moves}/>
        <ContentPanel onMove={this.onMove} content={this.state.content} links={this.state.links}/>
        <Footer />
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));