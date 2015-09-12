var React = require('react');
require('../styles/Header.scss');   //stylings for component

var Header = React.createClass({

  render() {
    return (
      <div className="header">
        <div className="header-wrap">
          <div className="logo">
            <i className="wiki" />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Header;