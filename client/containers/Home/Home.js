import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import config from '../../../config/config';


@connect(state => ({
  online: state.online
}))


export default class Home extends Component {

  static propTypes = {
    online: PropTypes.bool.isRequired
  };

  render() {

    const { online } = this.props;


    return (

      <div>
        <Helmet title="Home" />
        <div>
          <div className="container">

            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>

            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed voluptate nihil eum consectetur similique? Consectetur, quod, incidunt, harum nisi dolores delectus reprehenderit voluptatem perferendis dicta dolorem non blanditiis ex fugiat.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe, magni, aperiam vitae illum voluptatum aut sequi impedit non velit ab ea pariatur sint quidem corporis eveniet. Odit, temporibus reprehenderit dolorum!</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et, consequuntur, modi mollitia corporis ipsa voluptate corrupti eum ratione ex ea praesentium quibusdam? Aut, in eum facere corrupti necessitatibus perspiciatis quis?</p>

          </div>
        </div>
      </div>

    );
  }
}
