import React from 'react';
import PropTypes from 'prop-types';

const ServiceBox = props => {
  const {
    icon, title, description
  } = props;

  return (
    <div>ServiceBox:Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe, magni, aperiam vitae illum voluptatum aut sequi impedit non velit ab ea pariatur sint quidem corporis eveniet. Odit,  temporibus reprehenderit dolorum!</div>
  );
};

ServiceBox.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default ServiceBox;
