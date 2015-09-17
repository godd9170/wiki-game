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
      currentTitle : null,
      moves : 0,
      titleList : [],
    };
  },

  onRandomPageSuccess(resp) {

    console.log(resp);
    var startTitle = resp.title;
    var endTitle = resp.title2;
    var content = resp.content;
    var links = resp.links;
    var titleList = this.state.titleList;
    //add to the title list
    titleList.push(startTitle);
    console.log("TitleLIST: ", titleList);

    this.setState({
      startTitle : startTitle,
      endTitle : endTitle,
      currentTitle : startTitle,
      links : links,
      content : content,
      titleList : titleList
    });
  },

  onRandomPageError(resp) {
    console.log("ERROR: ", resp);
  },

  onArticlePageSuccess(resp) {

    console.log('Article: ', resp);
    var title = resp.title;
    var content = resp.content;
    var links = resp.links;
    var titleList = this.state.titleList;
    //add to the title list
    titleList.push(title);
    console.log("TitleLIST: ", titleList);

    this.setState({
      currentTitle : title,
      links : links,
      content : content,
      titleList : titleList
    });
  },

  onArticlePageError(resp) {
    console.log("ERROR: ", resp);
  },

  onMove(title) {
    var counter = this.state.moves + 1;
    this.setState({ 
      moves : counter,
      content : null //force spinner
    });
    var data = JSON.stringify({ title: title });
    //get the new article
    var url = "/article";
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        contentType: 'application/json; charset=utf-8',
        success: this.onArticlePageSuccess,
        error: this.onArticlePageError,
    });
  },
 
  componentWillMount() {
    var url = "/random";

    $.ajax({
        url: url,
        method: 'GET',
        success: this.onRandomPageSuccess,
        error: this.onRandomPageError,
      });

  },

  render() {
    var url = this.state.url;
    var startTitle = this.state.startTitle;
    var endTitle = this.state.endTitle;

    return (
      <div className="app">
        <Header />
        <ScorePanel startTitle={startTitle} endTitle={endTitle} moves={this.state.moves}/>
        <ContentPanel 
          onMove={this.onMove} 
          content={this.state.content} 
          links={this.state.links}
          title={this.state.currentTitle}/>
        <Footer />
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));