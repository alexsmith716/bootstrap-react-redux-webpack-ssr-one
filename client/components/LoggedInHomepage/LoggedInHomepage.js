import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LoggedInHomepage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleJarClick = jarName => () => {
    console.log('>>>>>>>>>>>>>>> LoggedInHomepage > handleJarClick > jarName: ', jarName);
  };

  render() {
    //const styles = require('./LoggedInHomepage.scss');
    const voteImg = require('./vote.jpg');
    return (
      <section>
        <div>
          <img src={voteImg} alt="chart" width="100%" />
        </div>
      </section>
    );
  }
}
