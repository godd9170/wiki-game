var React = require('react');
var classNames = require('classnames');
require('../styles/ScorePanel.scss');   //stylings for component

var MoveCounter = React.createClass({
  
  render() {

    return (
      <div className="move-counter">
        <div className="moves">10</div>
        <div className="moves-title">Moves</div>
      </div>
    );
  }

});

var TopicPanel = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    url: React.PropTypes.string,
    isRight: React.PropTypes.bool /* justify right if right topic */
  },

  openUrl() {
    window.open(this.props.url,'_blank');
  },

  render() {
    let topicClasses = classNames(
      'topic',
      this.props.isRight ? 'right' : null
    );

    return (
      <div className={topicClasses}>
        <div className="topic-title">{this.props.title}</div>
        <div onClick={this.openUrl} className="topic-url">{this.props.url}</div>
      </div>
    );
  }

});

module.exports = ScorePanel;

var ScorePanel = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    url: React.PropTypes.string,
  },

  render() {
    return (
      <div className="score-panel">
        <div className="wrapper">
          <TopicPanel title={this.props.title} url={this.props.url}/>
          <MoveCounter />
          <TopicPanel title="Forks" url="https://www.wikipedia.com/forks" isRight={true}/>
        </div>
      </div>
    );
  }

});

module.exports = ScorePanel;