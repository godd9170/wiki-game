var React = require('react');
var $ = require('jquery');
require('../styles/ContentPanel.scss');   //stylings for component


var ContentPanel = React.createClass({

  propTypes: {
    content: React.PropTypes.string,
    links: React.PropTypes.array,
    onMove: React.PropTypes.func
  },

  //wrap square brackets around each link
  squareBracketify() {
    var links = this.props.links || [];
    var content = this.props.content || '';
    //wrap each link in square brackets
    links.forEach(link => {
      var reg = new RegExp(link, "gi");
      var replacement = "[" + link + "]";
      content = content.replace(reg,replacement);
    });
    return content;
  },

  //split the content into different sections
  sectionify(content) {
    //find the "=" wraps
    const sectionReg = /==(.*?)==/gi;
    //create sections object
    var sections = [];
    let matches = content.match(sectionReg) || [];
    content = content.replace(sectionReg, "<BREAK>");
    let notMatches = content.split("<BREAK>");
    var i = 0;
    matches.forEach(match => {
      var obj = {};
      obj['title'] = match;
      obj['content'] = notMatches[i];
      sections.push(obj);
      i++;
    });

    console.log(notMatches);
    return sections;
  },

  renderContent() {
    var content = this.squareBracketify();
    var sections = this.sectionify(content);
    var result = [];
    var titleReg = /=+/g;
    sections.forEach(section => {
      //split content into spans
      const bracketReg = /\[(.*?)\]/gi;
      let matches = section.content.match(bracketReg) || [];
      section.content = section.content.replace(bracketReg, "<BREAK>");
      let notMatches = section.content.split("<BREAK>") || [];

      result.push(<span className="run">{notMatches.splice(0, 1)[0]}</span>);
      var i = 0;
      matches.forEach(match => {
        var match = match.replace("[","").replace("]","");
        //regular runs with no mentions formatted as spans
        result.push(<span onClick={this.onLinkClick} className="link" id={match}>{match}</span>);
        result.push(<span className="run">{notMatches[i]}</span>);
        i++;
      });
      result.push(<div className="section"> {section.title.replace(titleReg,"")} </div>);
    });
    return result;
  },

  onMove(e) {
    this.props.onMove(e.target.id);
  },

  onLinkClick(e) {
    this.onMove(e);
  },


  render() {
    var content = this.renderContent();
    return (
      <div className="content-panel">
        <div className="wiki">
          {content}
        </div>
      </div>
    );
  }

});

module.exports = ContentPanel;