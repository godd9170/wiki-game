var React = require('react');
var $ = require('jquery');
require('../styles/ContentPanel.scss');   //stylings for component


var ContentPanel = React.createClass({

  propTypes: {
    content: React.PropTypes.element,
    onMove: React.PropTypes.func
  },

  onMove() {
    this.props.onMove();
  },

  onLinkClick() {
    alert('yo!');
  },


  render() {
    return (
      <div className="content-panel">
        <div className="wiki">
          {this.props.content}
        </div>
      </div>
    );
  }

});

module.exports = ContentPanel;