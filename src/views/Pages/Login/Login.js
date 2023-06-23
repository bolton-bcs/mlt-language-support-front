import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import {BASE_URL} from "../../../constance/Constance";
import * as authService from '../../../services/auth';
import qs from 'qs';
import Cookies from "js-cookie";
import {StorageStrings} from '../../../constance/StorageStrings';
import * as CommonFunc from '../../../utils/CommonFunc';
import Loader from "../../../components/Loader/loading";

class Login extends Component {
  state = {
    userName: {
      value: '',
      valid: false
    },
    password: {
      value: '',
      valid: false
    },
    loading: false
  }

  loginHandler = async () => {
    // let{userName,password}=this.state;
    // const obj = {
    //   username:userName.value,
    //   password:password.value,
    //   grant_type:'password',
    //   user_type:'ADMIN'
    // }
    // this.setState({loading:true});
    // await authService.loginUser(qs.stringify(obj))
    //   .then(response=>{
    //     if (response.access_token){
    //       Cookies.set(StorageStrings.ACCESS_TOKEN,response.access_token);
    //       localStorage.setItem(StorageStrings.ACCESS_TOKEN,response.access_token);
    //       Cookies.set(StorageStrings.REFRESH_TOKEN,response.refresh_token);
    //       localStorage.setItem(StorageStrings.REFRESH_TOKEN,response.refresh_token);
    //       localStorage.setItem(StorageStrings.USER_NAME,userName.value);
    //       localStorage.setItem(StorageStrings.USERID,response.user.id.toString());
    //       localStorage.setItem(StorageStrings.LOGGED,'true');
    //       this.setState({loading:false})
    //       this.props.history.push(BASE_URL+'/dashboard');
    //       return ;
    //     }
    //     if (!response.success){
    //       CommonFunc.notifyMessage(response.message,response.status);
    //       this.setState({loading: false});
    //     }
    //   })
    //   .catch(error=>{
    //     CommonFunc.notifyMessage(error.message, error.status);
    //     this.setState({loading: false});
    //   })
    Cookies.set(StorageStrings.ACCESS_TOKEN, 'response.access_token');
    localStorage.setItem(StorageStrings.ACCESS_TOKEN, 'response.access_token');
    Cookies.set(StorageStrings.REFRESH_TOKEN, 'response.refresh_token');
    localStorage.setItem(StorageStrings.REFRESH_TOKEN, 'response.refresh_token');
    localStorage.setItem(StorageStrings.USER_NAME, 'userName.value');
    localStorage.setItem(StorageStrings.USERID, '1');
    localStorage.setItem(StorageStrings.LOGGED, 'true');
    this.setState({loading: false})
    this.props.history.push(BASE_URL + '/manage-products');
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

  render() {
    let {userName, password} = this.state;
    return (
      <div className="app flex-row align-items-center auth-bg">
        <Container>
          <Row className="justify-content-center">
            <Col md="5" className="auth-container">
              <h2>Login</h2>
              <form className="login-form">
                <label htmlFor="email">email</label>
                <input value={userName.value} onChange={(e) => {
                  this.onTextChange(e)
                }} type="email" placeholder="youremail@gmail.com" id="email" name="email"/>
                <label htmlFor="password">password</label>
                <input value={password.value} onChange={(e) => {
                  this.onTextChange(e)
                }} type="password" placeholder="********" id="password" name="password"/>
                <button type="submit" className="button-auth" onClick={async () => {
                  await this.loginHandler()
                }}>Log In
                </button>
              </form>
              <Link to={BASE_URL + "/register"}>
                <button className="link-btn">Don't have an account? Register here.</button>
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

export default Login;
