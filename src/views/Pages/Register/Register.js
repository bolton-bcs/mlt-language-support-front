import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Col,
  Container,
  Row
} from 'reactstrap';
import {BASE_URL} from "../../../constance/Constance";
import * as authService from '../../../services/auth';
import qs from 'qs';
import Cookies from "js-cookie";
import {StorageStrings} from '../../../constance/StorageStrings';
import * as CommonFunc from '../../../utils/CommonFunc';
import Loader from "../../../components/Loader/loading";

class Register extends Component {
  state = {
    fullName: {
      value: '',
      valid: false
    },
    email: {
      value: '',
      valid: false
    },
    password: {
      value: '',
      valid: ''
    },
    loading: false
  }

  signUpHandler = async () => {

  }

  onTextChange = (event) => {
    console.log(event)
    // let name = event.target.name;
    // let item = this.state[name];
    // item.value = event.target.value;
    // item.valid = true;
    // this.setState({
    //   [name]: item,
    // });
  }

  handleSubmit = (e) => {

  }

  render() {
    let {fullName, email, password} = this.state;
    return (
      <div className="app flex-row align-items-center auth-bg">
        <Container>
          <Row className="justify-content-center">
            <Col md="5" className="auth-container">
              <h2>Register</h2>
              <form className="register-form" onSubmit={this.handleSubmit}>
                <label htmlFor="name">Full name</label>
                <input value={fullName.value} name="name" onChange={(e) => this.onTextChange(e)} id="name"
                       placeholder="full Name"/>
                <label htmlFor="email">email</label>
                <input value={email.value} onChange={(e) => this.onTextChange(e)} type="email"
                       placeholder="youremail@gmail.com" id="email" name="email"/>
                <label htmlFor="password">password</label>
                <input value={password.value} onChange={(e) => this.onTextChange(e)} type="password"
                       placeholder="********" id="password" name="password"/>
                <button type="submit" className="button-auth">Sign Up</button>
              </form>
              <Link to={BASE_URL + "/login"}>
                <button className="link-btn">Already have an account? Login here.</button>
              </Link>
            </Col>
          </Row>
        </Container>
        {this.state.loading ? (
          <Loader
            asLoading={this.state.loading}
          />
        ) : null}
      </div>
  );
  }
  }

  export default Register;
