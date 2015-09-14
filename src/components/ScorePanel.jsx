var React = require('react');
var classNames = require('classnames');
require('../styles/ScorePanel.scss');   //stylings for component

var MoveCounter = React.createClass({
  
  render() {

    return (
      <div className="move-counter">
        <div className="moves">{this.props.moves}</div>
        <div className="moves-title">Moves</div>
      </div>
    );
  }

});

var TopicPanel = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    isRight: React.PropTypes.bool /* justify right if right topic */
  },

  render() {
    let topicClasses = classNames(
      'topic',
      this.props.isRight ? 'right' : null
    );

    return (
      <div className={topicClasses}>
        <div className="topic-title">{this.props.title}</div>
      </div>
    );
  }

});

module.exports = ScorePanel;

var ScorePanel = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    moves: React.PropTypes.number
  },

  render() {
    return (
      <div className="score-panel">
        <div className="wrapper">
          <TopicPanel title={this.props.title}/>
          <MoveCounter moves={this.props.moves}/>
          <TopicPanel title="Forks" isRight={true}/>
        </div>
      </div>
    );
  }

});

module.exports = ScorePanel;