import React from 'react';
import PropTypes from 'prop-types';

const PortfolioBox = props => {
  //const styles = require('./PortfolioBox.scss');

  const {
    link, thumbnailUrl, projectCategory, projectName
  } = props;

  return (
    <div>PortfolioBox: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et, consequuntur, modi mollitia corporis ipsa voluptate corrupti eum ratione ex ea praesentium quibusdam? Aut, in eum facere corrupti necessitatibus perspiciatis quis?</div>
  );
};

PortfolioBox.propTypes = {
  link: PropTypes.string.isRequired,
  projectCategory: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string.isRequired
};

export default PortfolioBox;
