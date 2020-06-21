import { h, Component } from 'preact';
import { Router, Route } from 'preact-router';

// Code-splitting is automated for routes
import Home from './routes/Home';
import App from './routes/App';

export default class Blaze extends Component {

  /** Gets fired when the route changes.
   *  @param {Object} event       "change" event from [preact-router](http://git.io/preact-router)
   *  @param {string} event.url   The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Route path="/app/:*?" component={App} />
        </Router>
      </div>
    );
  }
}