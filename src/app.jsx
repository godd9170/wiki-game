var React = require('react');
//styles
require('./styles/app.scss');   //stylings for component

var App = React.createClass({

  render() {
    return (
      <div className="test"><strong>Muth! Brudz</strong></div>
    );
  }

});

React.render(<App />, document.getElementById('app'));