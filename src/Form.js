import React, { useEffect, useState } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import "./Form.css";

const OnBoardingForm = ({ errors, touched, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    status && setUsers(prevState => [...prevState, status]);
  }, [status]);
  
  return (
    <Form>
      <label htmlFor="name">Name: </label>
      <Field name="name" id="name" />
      { touched.name && errors.name && <span style={ {color: "red"}}> {errors.name}</span> }
      <label htmlFor="email">E-mail:</label>
      <Field name="email" id="email"/>
      { touched.email && errors.email && <span style={ {color: "red"}}> {errors.email}</span> }
      <label htmlFor="password">Password:</label>
      <Field name="password" id="password"/>
      { touched.password && errors.password && <span style={ {color: "red"}}> {errors.password}</span> }
      <Field name="tos" id="tos" type="checkbox"/>
      <label htmlFor="tos">I agree to the Terms of Service</label>
      { touched.tos && errors.tos && <span style={ {color: "red"}}> {errors.tos}</span> }
      <button type="submit">Submit</button>
      <div className="users-container">
      { 
        users.map(u =>
          <ul key={u.id}>
            <li>Name: {u.name}</li>
            <li>Email: {u.email}</li>
            <li>Password: {u.password}</li>
            <li>ToS: {u.tos ? "Yes" : "No"}</li>
          </ul>)
      }
      </div>
    </Form>
  );
}

const FormikForm = withFormik({
  mapPropsToValues() {
    return {
      name: "",
      email: "",
      password: "",
      tos: false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Required").max(8, "Maximum of 8 characters"),
    email: Yup.string().required("Required").email("Not a valid email address"),
    password: Yup.string().required("Required").min(4, "Minimum of 4 characters"),
    tos: Yup.boolean().oneOf([true], "You must accept the Terms of Service")
  }),
  handleSubmit(values, propBag) {
    console.log("Values:", values);
    Axios
      .post("https://reqres.in/api/users/", values)
      .then(res => propBag.setStatus(res.data))
      .catch(err => console.log("Axios Error:", err));
  }
})(OnBoardingForm);

export default FormikForm;