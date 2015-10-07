var React = require('react');
require('../styles/HistoryPanel.scss');   //stylings for component

var HistoryItem = React.createClass({

  propTypes: {
    title : React.PropTypes.string,
    index : React.PropTypes.number, 
    onHistorySelect : React.PropTypes.func
  },

  onHistorySelect(e) {
    this.props.onHistorySelect(e);
  },


  render() {
    var title = this.props.title;
    return (

        <li id={title} data={this.props.index} onClick={this.onHistorySelect}>
          {title}
        </li>
    );
  }

});

var HistoryPanel = React.createClass({

  propTypes: {
    titleList : React.PropTypes.array,
    fetchHistory : React.PropTypes.func,
  },

  onHistorySelect(e) {
    var title = e.target.id;
    this.props.fetchHistory(title);
  },

  render() {
    var element = -1;
    var titles = this.props.titleList.map(title => {
        element++;
        return (<HistoryItem title={title} key={element} index={element} onHistorySelect={this.onHistorySelect} />);
      });
    return (
      <div className="sidebar">
        <div className="history-panel">
          <div className="timeline">
            <ul>{titles}</ul>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = HistoryPanel;