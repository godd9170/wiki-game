var React = require('react');
var $ = require('jquery');
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

  clearQuery() {
    console.log("CLEARED");
    this.setState({ query : '' });
    this.props.setQuery('');
  },

  render() {
    let searchClasses = classNames(
        'icon-filter',
        this.state.searchActive ? 'active' : null
    );

    return (
      <div className="search-bar">
      <i className={searchClasses} />
        <input ref="input" onFocus={this.setSearchActive} onBlur={this.clearSeachActive} onChange={this.updateQuery} />
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
    title: React.PropTypes.string,
    pendingTitle: React.PropTypes.string,
    backlinks: React.PropTypes.number,
    onArticleSearchAbort: React.PropTypes.func,
    keepSearching: React.PropTypes.bool
  },

  filterLinks() {
    var links = this.props.links;
    if (!!links) {
      return links.filter(l => {return l.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1})
    } else {
      return []
    }
  },

  renderContent() {

    if (!this.props.keepSearching) {
      var links = this.filterLinks();
      var linkElements = links.map(link => {
        return (
          <div className="link" id={link} onClick={this.onLinkClick}>{link}</div> )     
      });
      var result = (
        <div className="wiki">
          <div className="article-title">{this.props.title}</div>
          <SearchBar ref="SearchBar" setQuery={this.setQuery} />
          {linkElements}
        </div>
      );
    } else  { //if (!!this.props.pendingTitle)
      var backlinks = (!!this.props.backlinks && this.props.backlinks) === 500 ? '500+' : this.props.backlinks;
      var backlinksMessage = !!this.props.backlinks ? `${backlinks} Backlinks` : null; 
      var result = (
        <div className="wiki">
          <div className="loader-container">
            <div className="loader-message-title">Wikipedia covers some pretty obscure topics!</div>
            <div className="loader-message">To make reaching your destination possible, only articles with a minimum of 300</div>
            <div className="loader-message">referrring links are considered. I&#39;m searching for a suitable target article now.</div> 
            <div className="loader"></div>
            <div className="loader-text-h1">{this.props.pendingTitle}</div>
            <div className="loader-text-h2">{backlinksMessage}</div>
            <div className="choose-button">
              <button onClick={this.props.onArticleSearchAbort}>Fuck It I&#39;ll do this one</button>
            </div>
          </div>
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
    console.log("SRCHBR: ", this.refs.SearchBar);
    this.refs.SearchBar.clearQuery();
    this.refs.SearchBar.refs.input.getDOMNode().value = '';
    console.log("input", this.refs.SearchBar.refs.input);
  },

  render() {
    var content = this.renderContent();
    return (
      <div className="content-panel">
        {content}
      </div>
    );
  }

});

module.exports = ContentPanel;