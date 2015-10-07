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

  renderTopic() {
    if (this.props.title) {
      return <div className="topic-title">{this.props.title}</div>;
    } else {
      return <div className="text-loader"/>;
    }
  },

  render() { 
    let topicClasses = classNames(
        'topic',
        this.props.isRight ? 'right' : null
    );
    var topic = this.renderTopic();
    return ( 
      <div className={topicClasses}>
        {topic}
      </div>
    ); 
  }

});

module.exports = ScorePanel;

var ScorePanel = React.createClass({

  propTypes: {
    startTitle: React.PropTypes.string,
    endTitle: React.PropTypes.string,
    moves: React.PropTypes.number
  },

  render() {
    return (
      <div className="score-panel">
        <div className="logo-wrap">
          <div className="logo">
            <i className="wiki" />
          </div>
        </div>
        <div className="wrapper">
          <TopicPanel title={this.props.startTitle}/>
          <MoveCounter moves={this.props.moves}/>
          <TopicPanel title={this.props.endTitle} isRight={true}/>
        </div>
      </div>
    );
  }

});

module.exports = ScorePanel;