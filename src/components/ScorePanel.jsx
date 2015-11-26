var React = require('react');
var classNames = require('classnames');
var $ = require('jquery');
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

  getInitialState() {
    return { showSummaryPopover : false };
  },

  propTypes: {
    title: React.PropTypes.string,
    isRight: React.PropTypes.bool, /* justify right if right topic */
    summary: React.PropTypes.string,
  },

  showSummaryPopover() {
    this.setState({ showSummaryPopover : true });
  },

  hideSummaryPopover() {
    this.setState({ showSummaryPopover : false });
  },


  renderTopic() {
    if (this.props.title) {
      return <div className="topic-title">{this.props.title}</div>;
    } else {
      return <div className="text-loader"/>;
    }
  },

  generateSummaryPopover() {
    if (this.state.showSummaryPopover && !!this.props.summary) {
      return (
        <div className="summary-popover">
          {this.props.summary}
        </div>
        );
    } else {
      return null
    }
  },

  render() { 
    let topicClasses = classNames(
        'topic',
        this.props.isRight ? 'right' : null
    );
    var topic = this.renderTopic();
    return ( 
      <div onMouseOver={this.showSummaryPopover} onMouseLeave={this.hideSummaryPopover}  className={topicClasses}>
        {topic}
        {this.generateSummaryPopover()}
      </div>
    ); 
  }

});

module.exports = ScorePanel;

var ScorePanel = React.createClass({

  getInitialState() {
    return {
      logoMouseover : false 
    };
  },



  propTypes: {
    startTitle: React.PropTypes.string,
    endTitle: React.PropTypes.string,
    moves: React.PropTypes.number,
    endTitleSummary: React.PropTypes.string,
    onPlayAgain: React.PropTypes.func
  },

  onLogoMouseEnter() {
    this.setState({
      logoMouseover : true 
    });
  },

  onLogoMouseLeave() {
    this.setState({
      logoMouseover : false 
    });
  },

  onRefreshClick() {
    this.props.onPlayAgain();
  },


  render() {
    let iconClasses = classNames(
        this.state.logoMouseover ? 'icon-refresh active' : 'icon-wikipedia'
    );
    return (
      <div className="score-panel">
        <div className="logo-wrap" onMouseOver={this.onLogoMouseEnter} onMouseOut={this.onLogoMouseLeave} onClick={this.props.onPlayAgain}>
          <div className="logo">
            <i className={iconClasses} />
          </div>
        </div>
        <div className="wrapper">
          <TopicPanel title={this.props.startTitle}/>
          <MoveCounter moves={this.props.moves}/>
          <TopicPanel title={this.props.endTitle} summary={this.props.endTitleSummary} isRight={true} />
        </div>
      </div>
    );
  }

});

module.exports = ScorePanel;