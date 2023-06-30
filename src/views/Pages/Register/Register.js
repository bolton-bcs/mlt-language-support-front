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
    email: '',
    password: '',
    loading: false
  }

  signUpHandler = async () => {

  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  handleSubmit = async(e) => {
    const obj = {
      email:this.state.email,
      password: this.state.password
    }
    await authService.registerUser(obj)
      .then(res=>{
        console.log(res)
      })
      .catch(err=>{
        console.log(err)
      })
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
                <label htmlFor="email">email</label>
                <input value={email.value} onChange={(e) => this.onTextChange(e)} type="email"
                       placeholder="youremail@gmail.com" id="email" name="email"/>
                <label htmlFor="password">password</label>
                <input value={password.value} onChange={(e) => this.onTextChange(e)} type="password"
                       placeholder="********" id="password" name="password"/>
                <button type="button" className="button-auth" onClick={this.handleSubmit}>Sign Up</button>
              </form>
              {/*<Link to={BASE_URL + "/login"}>*/}
              {/*  <button className="link-btn">Already have an account? Login here.</button>*/}
              {/*</Link>*/}
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
