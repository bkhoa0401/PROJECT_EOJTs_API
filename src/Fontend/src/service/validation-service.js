import React, { Component } from 'react';
import {isEmail} from 'validator';
import validator from 'validator';


const required = (value, props) => {
  if (!value || (props.isCheckable && !props.checked)) {
    return <span className="form-error is-visible text-danger">Required</span>;
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return <span className="form-error is-visible text-danger">${value} is not a valid email.</span>;
  }
};

const isEqual = (value, props, components) => {
  const bothUsed = components.password[0].isUsed && components.confirm[0].isUsed;
  const bothChanged = components.password[0].isChanged && components.confirm[0].isChanged;

  if (bothChanged && bothUsed && components.password[0].value !== components.confirm[0].value) {
    return <span className="form-error is-visible text-danger">Passwords are not equal.</span>;
  }
};

const ValidationService = {
    required,
    email,
    isEqual,
    validator
}

export default ValidationService;