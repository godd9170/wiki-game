var React = require('react');
var classNames = require('classnames');
require('../styles/ContentPanel.scss');   //stylings for component


var SearchBar = React.createClass({

  propTypes: {
    setQuery : React.PropTypes.func
  },

  getInitialState() {
    return {
      query : '',
      searchActive : false,
    };
  },

  setSearchActive() {
    this.setState({ searchActive : true });
  },

  clearSeachActive() {
    this.setState({ searchActive : false });
  },

  updateQuery(e) {
    var query = e.target.value;
    this.setState({ query : query });
    this.props.setQuery(query);
  },

  render() {
    let searchClasses = classNames(
        'icon-filter',
        this.state.searchActive ? 'active' : null
    );

    return (
      <div className="search-bar">
      <i className={searchClasses} />
        <input onFocus={this.setSearchActive} onBlur={this.clearSeachActive} onChange={this.updateQuery} />
      </div>
    );
  }

});

module.exports = ContentPanel;


var ContentPanel = React.createClass({

  getInitialState() {
    return { query : '' };
  },

  setQuery(query) {
    this.setState({ query : query });
  },

  propTypes: {
    links: React.PropTypes.array,
    onMove: React.PropTypes.func,
    title: React.PropTypes.string
  },

  filterLinks() {
    var links = this.props.links;
    if (!!links) {
      return links.filter(l => {return l.indexOf(this.state.query) > -1})
    } else {
      return []
    }
  },

  renderContent() {

    if (this.props.links) {
      var links = this.filterLinks();
      var result = links.map(link => {
        return (<div className="link" id={link} onClick={this.onLinkClick}>{link}</div> )     
      });
    } else {
      var result = (
        <div className="loader-container">
          <div className="loader">Loading...</div>
        </div>
      );
    }
    return result;
  },

  onMove(e) {
    this.props.onMove(e.target.id);
  },

  onLinkClick(e) {
    this.onMove(e);
  },

  render() {
    var content = this.renderContent();
    return (
      <div className="content-panel">
        <div className="wiki">
          <div className="article-title">{this.props.title}</div>
            <SearchBar setQuery={this.setQuery} />
            {content}
        </div>
      </div>
    );
  }

});

module.exports = ContentPanel;