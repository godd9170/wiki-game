//libraries
var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
var HtmlToReact = require('html-to-react');
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

    //create html div
    var content = resp.html.replace(/(href)[^\s]*/g, 'class="wiki-link"'); //lose the hrefs
    var div = '<div>';
    var htmlToReactParser = new HtmlToReact.Parser(React);
    content = htmlToReactParser.parse(div.concat(content.concat("</div>")));

    this.setState({
      title : title,
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
        <ContentPanel onMove={this.onMove} content={this.state.content} />
        <Footer />
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));