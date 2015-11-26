var React = require('react');
require('../styles/WinnerPanel.scss');   //stylings for component

var WinnerPanel = React.createClass({



  render() {
    var {moves, startTitle, endTitle} = this.props;
    return (
      <div className="winner">
        <div className="congrats">
          <div className="congrats-subtitle">You Win!</div>
          <div className="congrats-h3">You took {moves} moves to connect</div>
          <div className="congrats-article-title">{startTitle}</div>
          <div className="congrats-h3"> with </div>
          <div className="congrats-article-title">{endTitle}</div>
          <div className="play-again">
            <button onClick={this.props.onPlayAgain}>Again!</button>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = WinnerPanel;