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
import BG from '../../../assets/img/brand/bg.jpg';
import Logo from '../../../assets/img/brand/proj_logo.png';
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
    loading:false
  }

  loginHandler=async ()=>{
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
    Cookies.set(StorageStrings.ACCESS_TOKEN,'response.access_token');
    localStorage.setItem(StorageStrings.ACCESS_TOKEN,'response.access_token');
    Cookies.set(StorageStrings.REFRESH_TOKEN,'response.refresh_token');
    localStorage.setItem(StorageStrings.REFRESH_TOKEN,'response.refresh_token');
    localStorage.setItem(StorageStrings.USER_NAME,'userName.value');
    localStorage.setItem(StorageStrings.USERID,'1');
    localStorage.setItem(StorageStrings.LOGGED,'true');
    this.setState({loading:false})
    this.props.history.push(BASE_URL+'/manage-products');
  }

  onTextChange=(event)=>{
    let name =event.target.name;
    let item = this.state[name];
    item.value =  event.target.value;
    item.valid = true;
    this.setState({
      [name]: item,
    });
  }

  render() {
    let {userName, password} = this.state;
    return (
      <div className="app flex-row align-items-center" style={{
        backgroundImage: `url(${BG})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{width: '44%'}}>
                  <CardBody className="text-center">
                    <div>
                      <h1>Welcome!</h1>
                      <h2>WOOKS Admin</h2>
                      <img src={Logo} style={{marginTop: 10}} width={200}
                           height={180}/>
                    </div>
                  </CardBody>
                </Card>
                <Card className=" py-5 text-center">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" name={"userName"}
                               value={userName.value} onChange={this.onTextChange}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" name={"password"}
                               value={password.value} onChange={this.onTextChange} children={<input type="text"/>}/>
                      </InputGroup>
                      {/*<Link to={BASE_URL+"/dashboard"} >*/}
                      <Button
                        color="primary"
                        className="px-4"
                        disabled={userName.value==='' | password.value===''}
                        onClick={()=>this.loginHandler()}
                      >
                        Login
                      </Button>
                      {/*</Link>*/}
                    </Form>
                  </CardBody>
                </Card>

              </CardGroup>
            </Col>
          </Row>
        </Container>
        {this.state.loading?(
          <Loader
            asLoading={this.state.loading}
          />
        ):null}
      </div>
    );
  }
}

export default Login;
