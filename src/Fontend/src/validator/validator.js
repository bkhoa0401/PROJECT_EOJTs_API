// import validator from 'validator';
// const required = (value) => {
//   if (!value.toString().trim().length) {
//     return 'require';
//   }
// };
 
// const email = (value) => {
//   if (!validator.isEmail(value)) {
//     return `${value} is not a valid email.`
//   }
// };
 
// const length = (value, props) => {
//   if (!value.toString().trim().length > props.maxLength) {
//     return <span className="error">The value exceeded {props.maxLength} symbols.</span>
//   }
// };
 
// const password = (value, props, components) => {
//   if (value !== components['confirm'][0].value) { // components['password'][0].value !== components['confirm'][0].value
//     return <span className="error">Passwords are not equal.</span>
//   }
// };

// const validators = {
//     required,
//     email,
//     length,
//     password
//   }
  
//   export default validators;