var React = require('react');
require('../styles/ContentPanel.scss');   //stylings for component

var ContentPanel = React.createClass({

  propTypes: {
    url: React.PropTypes.string,
  },

  render() {
    return (
      <div className="content-panel">
        <div className="wiki">
          <iframe src={this.props.url}></iframe>
        </div>
      </div>
    );
  }

});

module.exports = ContentPanel;