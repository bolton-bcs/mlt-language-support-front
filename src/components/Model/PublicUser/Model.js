import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, FormGroup, Input, Label, ModalBody} from "reactstrap";
import * as PublicUserService from "../../../services/users";
import * as CommonFunc from "../../../utils/CommonFunc";
import Loader from "../../Loader/loading";
import NotVerifyIMG from "../../../assets/img/icon/notVerified.jpg";
import VerifyIMG from "../../../assets/img/icon/verified.jpg";
import Countries from "../../Json/countries.json";
import Flag from 'react-world-flags'

function lettersChanges(str) {
  return str.replace(/(\B)[^ ]*/g, match => (match.toLowerCase())).replace(/^[^ ]/g, match => (match.toUpperCase()))
}

class Model extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    creationDate: '',
    loading: true,
    packageName: '',
    packagePrice: '',
    verified: false,
    mobile: '',
    country: '',
    countryCode: '',
    school: ''
  }

  componentDidMount() {
    this.getPublicUserById(this.props.userId);
  }

  getCountryName = (country) => {
    const countries = Countries;
    for (const c of countries) {
      if (c.name === country) {
        return c.alpha2Code;
      }
    }
  }

  getPublicUserById = async (id) => {
    await PublicUserService.getPublicUserById(id)
      .then(response => {
        if (response.success) {
          const firstName = response.body.firstName;
          const lastName = response.body.lastName;
          const email = response.body.email;
          const creationDate = response.body.createDateTime;
          const packageName = response.body.package !== null ? Object.keys(response.body.package).length !== 0 ? response.body.package.name : '' : '';
          const packagePrice = response.body.package !== null ? Object.keys(response.body.package).length !== 0 ? response.body.package.price : '' : '';
          const verified = response.body.verified;
          const mobile = response.body.mobile !== null ? response.body.mobile : "";
          const country = response.body.country !== null ? response.body.country : "";
          const school = response.body.school !== null ? response.body.school.name ? response.body.school.name : "" : "";
          this.setState({
            firstName: firstName,
            lastName: lastName,
            email: email,
            creationDate: new Date(creationDate).toLocaleDateString('fr-ca'),
            packageName: packageName,
            packagePrice: packagePrice,
            loading: false,
            verified: verified,
            mobile: mobile,
            country: country,
            school: school,
            countryCode: this.getCountryName(country)
          })
        } else {
          CommonFunc.notifyMessage(response.message);
        }
      })
      .catch(error => {
        CommonFunc.notifyMessage(error.message, error.status);
      })
  }

  render() {
    const {firstName, lastName, email, creationDate, loading, packagePrice, packageName, verified, mobile, country, countryCode, school} = this.state;
    return (
      <ModalBody>
        <Col xs="12" sm="12">
          <Card>
            <CardHeader>
              <strong>Personal Details</strong>
            </CardHeader>
            <CardBody>
              <FormGroup row className="my-0">
                <Col xs="6">
                  <FormGroup>
                    <Label htmlFor="city">First Name</Label>
                    <Input type="text" id="city" disabled={true} value={firstName}/>
                  </FormGroup>
                </Col>
                <Col xs="6">
                  <FormGroup>
                    <Label htmlFor="postal-code">Last Name</Label>
                    <Input type="text" id="postal-code" disabled={true} value={lastName}/>
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="vat">Email</Label>
                <Input type="text" id="vat" disabled={true} value={email}/>
              </FormGroup>
              <FormGroup row className="my-0">
                <Col xs="6">
                  <FormGroup>
                    <Label htmlFor="vat">Mobile Number</Label>
                    <Input type="text" id="vat" disabled={true} value={mobile}/>
                  </FormGroup>
                </Col>
                <Col xs="6">
                  <FormGroup>
                    <Label htmlFor="vat">School</Label>
                    <Input type="text" id="vat" disabled={true} value={school}/>
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="street">Created Date</Label>
                <Input type="text" id="street" disabled={true} value={creationDate}/>
              </FormGroup>
              <FormGroup row className="my-0">
                <Col xs="8">
                  <FormGroup>
                    <Label htmlFor="city">Package Type</Label>
                    <Input type="text" id="city" disabled={true} value={lettersChanges(packageName)}/>
                  </FormGroup>
                </Col>
                <Col xs="4">
                  <FormGroup>
                    <Label htmlFor="postal-code">Package Price</Label>
                    <Input type="text" id="postal-code" disabled={true}
                           value={packagePrice !== '' ? 'Rs. ' + packagePrice : ''}/>
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="vat">Country</Label>
                <Input type="text" id="vat" disabled={true} value={'           ' + country}/>
                <Flag code={countryCode} height={15} title={country}
                      style={{position: 'absolute', bottom: 90, marginLeft: 10}}/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="postal-code">Email verified ? </Label>
                <img src={!verified ? NotVerifyIMG : VerifyIMG} alt="verify"
                     style={{width: 25, height: 25, borderRadius: 100, marginLeft: 10}}/>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
        {loading ? (
          <Loader
            asLoading={loading}
          />
        ) : null}
      </ModalBody>
    );
  }
}

export default Model;
