var React = require('react');
require('../styles/WinnerPanel.scss');   //stylings for component

var WinnerPanel = React.createClass({



  render() {
    var {moves, startTitle, endTitle, titleList} = this.props;
    if (!!endTitle) { titleList.push(endTitle ); }
    var linkPath = titleList.map(title => {
      return <span><span className="link">{title}</span><span className="arrow">&#10137;</span></span>
    });
    return (
      <div className="winner">
        <div className="congrats">
          <div className="congrats-subtitle">You Win!</div>
          <div className="congrats-h3">You took {moves} moves to connect</div>
          <div className="congrats-article-title">{startTitle}</div>
          <div className="congrats-h3"> with </div>
          <div className="congrats-article-title">{endTitle}</div>
          <div className="link-path">{linkPath}</div>
        </div>
      </div>
    );
  }

});

module.exports = WinnerPanel;