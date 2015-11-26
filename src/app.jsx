//libraries
var React = require('react');
var $ = require('jquery');
var _ = require('lodash');
//components
var Header = require('./components/Header');
var ScorePanel = require('./components/ScorePanel');
var ContentPanel = require('./components/ContentPanel');
var HistoryPanel = require('./components/HistoryPanel');
var WinnerPanel = require('./components/WinnerPanel');
var Footer = require('./components/Footer');

//styles
require('./styles/app.scss');   //stylings for component

var App = React.createClass({

  getInitialState() {
    return {
      content : null,
      currentTitle : null,
      moves : 0,
      titleList : [],
      winner : false,
      pendingTitle : null,
      backlinks : null,
      keepSearching : true,
    };
  },

  onRandomPageSuccess(resp) {
    //There is a chance that the user could have aborted midway through
    // API call... if that's the case, don't overwrite the state.
    if (this.state.keepSearching) {
      var startTitle = resp.start_article.title;
      var endTitle = resp.end_article.title;
      var endId = resp.end_article.id;
      var links = resp.links;
      var endTitleSummary = resp.summary;
      var titleList = this.state.titleList;
      var backlinks = resp.backlinks;
      var success = resp.success;

      this.setState({
        backlinks : backlinks,
        startTitle : startTitle,
        endTitle : endTitle,
        endId : endId,
        endTitleSummary : endTitleSummary,
        currentTitle : startTitle,
        links : links,
        titleList : titleList,
        keepSearching : !success
      }, function() { 
        //If the API call has returned an article above the Threshold
        // then do not load another page
        if (this.state.keepSearching) {
          this.onPageLoad();
        }
      });
    }
  },

  onArticleSearchAbort() {
    //add to the title list
    var titleList = this.state.titleList;
    var startTitle = this.state.startTitle;
    titleList.push(startTitle);
    this.setState({ 
      keepSearching : false,
      titleList : titleList
    });
  },

  onRandomPageError(resp) {
    console.log("ERROR: ", resp);
  },

  onArticlePageSuccess(resp) {

    console.log('Article: ', resp);
    console.log('Links Length: ', resp.links.length)
    var title = resp.title;
    var links = resp.links;
    var titleList = this.state.titleList;
    //add to the title list if new article
    titleList.push(title);

    this.setState({
      currentTitle : title,
      links : links,
      titleList : titleList
    });
  },

  onArticlePageError(resp) {
    console.log("ERROR: ", resp);
  },

  onHistoryPageSuccess(resp) {

    console.log('Article: ', resp);
    console.log('Links Length: ', resp.links.length)
    var title = resp.title;
    var links = resp.links;

    this.setState({
      currentTitle : title,
      links : links
    });
  },


  fetchHistory(title) {
    var index = this.state.titleList.indexOf(title);
    //lose everything in the title list array after the title
    var keep = true;
    var titleList = this.state.titleList.filter(entry => {
        if (entry === title) {
            keep = false;
            //one last time for the actual article.
            return true
        }
        return keep;
    });

    this.setState({ 
      currentTitle : title,
      moves : index, //set to point in list
      links: null, //force spinner
      titleList : titleList
    });
    var data = JSON.stringify({ title: title });
    var url = "/links";
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        contentType: 'application/json; charset=utf-8',
        success: this.onHistoryPageSuccess,
        error: this.onArticlePageError,
    }); 
  },

  getId(title) {
    var data = JSON.stringify({ title: title });
    var url = "/id";
    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        contentType: 'application/json; charset=utf-8',
        success: this.onPageSuccess,
        error: this.onArticlePageError,
    }); 
  },

  onPageSuccess(resp) {
    console.log("NEW ID: ", resp.id);
    console.log("NEW TITLE: ", resp);
    console.log("END ID: ", this.state.endId);
    if (parseInt(resp.id) === parseInt(this.state.endId)) {
      //enter win mode
      this.setState({ winner : true });
    } else {
      var data = JSON.stringify({ title: resp.title });
      //get the new article
      var url = "/links";
      $.ajax({
          url: url,
          method: 'POST',
          data: data,
          contentType: 'application/json; charset=utf-8',
          success: this.onArticlePageSuccess,
          error: this.onArticlePageError,
      });
    }
  },

  onMove(title) {
    var counter = this.state.moves + 1;
    this.setState({ 
      currentTitle : title,
      moves : counter,
      links : null //force spinner
    });
    this.getId(title);
  },

  onPageLoad() {
    var url = "/random";
    $.ajax({
        url: url,
        method: 'GET',
        success: this.onRandomPageSuccess,
        error: this.onRandomPageError,
      });
  },

  onPlayAgain() {
    this.setState({
      content : null,
      currentTitle : null,
      moves : 0,
      titleList : [],
      winner : false,
      pendingTitle : null,
      backlinks : null,
      keepSearching : true, 
    });

    this.onPageLoad();
  },
 
  componentWillMount() {
    this.onPageLoad()
  },

  render() {
    var url = this.state.url;
    var startTitle = this.state.startTitle;
    var endTitle = this.state.endTitle;
    var endTitleSummary = this.state.endTitleSummary;

    var content = !this.state.winner ? <ContentPanel onMove={this.onMove} 
                                        links={this.state.links} 
                                        onArticleSearchAbort={this.onArticleSearchAbort}
                                        keepSearching={this.state.keepSearching}
                                        title={this.state.currentTitle}
                                        pendingTitle={this.state.endTitle}
                                        backlinks={this.state.backlinks} /> : 
                                        <WinnerPanel 
                                        onPlayAgain={this.onPlayAgain}
                                        startTitle={this.state.startTitle}
                                        endTitle={this.state.endTitle}
                                        moves={this.state.moves} />;

    return (
      <div className="app">
        <HistoryPanel titleList={this.state.titleList} fetchHistory={this.fetchHistory} disabled={this.state.winner}/>
        <ScorePanel onPlayAgain={this.onPlayAgain} startTitle={startTitle} endTitle={endTitle} endTitleSummary={endTitleSummary} moves={this.state.moves}/>
        {content}
        <Footer />
      </div>
    );
  }

});

React.render(<App />, document.getElementById('app'));