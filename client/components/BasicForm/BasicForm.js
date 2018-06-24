import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';

const BasicForm = ({ onSubmit }) => (
  <Form
    onSubmit={values => onSubmit(values).then(() => {}, err => err)}
    render={({ handleSubmit, pristine, invalid }) => (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <h2>Simple Default Input</h2>
        <div>
          <label>First Name</label>
          <Field name="firstName" component="input" placeholder="First Name" />
        </div>
        <button className="btn btn-success" type="submit" disabled={pristine || invalid}>
          <i className="fa fa-sign-in" /> Submit
        </button>
      </form>
    )}
  />
);

BasicForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default BasicForm;
