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
      url : null,
      title : null,
    };
  },

  onRandomPageSuccess(resp) {
    //Make HTML
    var el = $( '<div></div>' );
    el.html(resp);

    //Get Title
    var title = $('title', el)[0].innerText.split(' - Wikipedia, the free encyclopedia')[0];
    //Get URL
    var links = $('link', el);
    var url = _.select(links, function (obj) {
      return obj.rel === 'canonical';
    })[0].href;

    // console.log("Title!: ", title);
    // console.log("URL: ", url);
    this.setState({
      title : title,
      url : url
    });
  },

  onRandomPageError(resp) {
    console.log("ERROR: ", resp);
  },
 
  componentWillMount() {
    var url = "http://cors.io/?u=https://en.wikipedia.org/wiki/Special:Random";
    var header = {};

    $.ajax({
        url: url,
        method: 'GET',
        headers: header,
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
        <ScorePanel url={url} title={title}/>
        <ContentPanel url={url}/>
        <Footer />
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));