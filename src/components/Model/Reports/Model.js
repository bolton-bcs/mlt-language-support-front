import React, {Component} from 'react';
import {Badge, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, ModalBody} from "reactstrap";
import {Multiselect} from "multiselect-react-dropdown";
import Moment from "moment";

class Model extends Component {
  badgeStatusHandler1(status) {
    switch (status) {
      case 'SUCCESS':
        return {color: 'success', title: 'SUCCESS'};
        break;
      case 'FAILED':
        return {color: 'danger', title: 'FAILED'};
        break;
      case 'CANCEL':
        return {color: 'warning', title: 'CANCEL'};
        break;
      case 'PENDING':
        return {color: 'secondary', title: 'PENDING'};
        break;
      case ' UNAUTHORIZED':
        return {color: 'dark', title: 'UNAUTHORIZED'};
        break;
      case ' CHARGED_BACK':
        return {color: 'light', title: 'CHARGED BACK'};
        break;
      default:
        return {}
        break;
    }
  }

  badgeStatusHandler(status) {
    switch (status) {
      case 'ACTIVE':
        return {color: 'success', title: 'DEACTIVATED', text: 'Deactivated'};
        break;
      case 'DEACTIVATED':
        return {color: 'danger', title: 'ACTIVE', text: 'Active'};
        break;
      case 'DELETED':
        return {color: 'danger', title: '', text: ''};
        break;
      default:
        return {}
        break;
    }
  }

  render() {
    return (
      <ModalBody>
        <Col xs="12" sm="12">
          <Card>
            <CardHeader>
              <strong>Report Details</strong>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label htmlFor="vat">Full Name</Label>
                <Input type="text" disabled={true} value={this.props.fullName}/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="vat">Email</Label>
                <Input type="text" disabled={true} value={this.props.email}/>
              </FormGroup>
              <FormGroup>
                <Label>Package</Label>
                <Input type="text" disabled={true} value={this.props.packageType}/>
              </FormGroup>
              <FormGroup row className="my-2">
                <Col xs="6">
                  <FormGroup>
                    <Label>Payment Date</Label>
                    <Input type="text" disabled={true} value={new Date(this.props.paymentDate).toLocaleDateString("fr-ca")}/>
                  </FormGroup>
                </Col>
                <Col xs="6">
                  <FormGroup>
                    <Label>Time</Label>
                    <Input type="text" disabled={true} value={Moment(new Date(this.props.paymentDate), 'hh:mm').format('LT')}/>
                  </FormGroup>
                </Col>
              </FormGroup>
              <FormGroup row className="my-0" style={{height: 40}}>
                <Col xs="6">
                  <FormGroup>
                    <Label>Payment Status :</Label>
                    <Badge color={this.badgeStatusHandler1(this.props.purchaseStatus).color} style={{marginLeft: 15}}>
                      {this.badgeStatusHandler1(this.props.purchaseStatus).title}
                    </Badge>
                  </FormGroup>
                </Col>
                <Col xs="6">
                  <FormGroup>
                    <Label>Account Status :</Label>
                    <Badge color={this.badgeStatusHandler(this.props.status).color}
                           style={{marginLeft: 15}}>{this.props.status}</Badge>
                  </FormGroup>
                </Col>
              </FormGroup>
              {/*<FormGroup row className="my-0">*/}
              {/*  <Col xs="6">*/}
              {/*    <FormGroup>*/}
              {/*      <Label>Date</Label>*/}
              {/*      <Input type="text" disabled={true} value={'this.props.language'}/>*/}
              {/*    </FormGroup>*/}
              {/*  </Col>*/}
              {/*  <Col xs="6">*/}
              {/*    <FormGroup>*/}
              {/*      <Label>Time</Label>*/}
              {/*      <Input type="text" disabled={true} value={'this.props.language'}/>*/}
              {/*    </FormGroup>*/}
              {/*  </Col>*/}
              {/*</FormGroup>*/}
              <FormGroup>
                <Label htmlFor="vat">Payment Status Message</Label>
                <Input type="textarea" disabled={true} value={this.props.statusMessage}/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="vat">Amount</Label>
                <Input type="text" disabled={true} value={this.props.payHereAmount}/>
              </FormGroup>

            </CardBody>
          </Card>
        </Col>
      </ModalBody>
    );
  }
}

export default Model;
