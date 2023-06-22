import React, {Component} from 'react';
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, ModalBody} from "reactstrap";
import {Multiselect} from "multiselect-react-dropdown";

function lettersChanges(str) {
  return str.replace(/(\B)[^ ]*/g, match => (match.toLowerCase())).replace(/^[^ ]/g, match => (match.toUpperCase()))
}

class Model extends Component {
  render() {
    return (
      <ModalBody>
        <Col xs="12" sm="12">
          <Card>
            <CardHeader>
              <strong>Book Details</strong>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label htmlFor="vat">Book Title</Label>
                <Input type="text" disabled={true} value={this.props.title}/>
              </FormGroup>
              <FormGroup row className="my-0">
                {/*<Col xs={this.props.grade !== null ? "6" : "12"}>*/}
                {/*  <FormGroup>*/}
                {/*    <Label htmlFor="vat">Book Category</Label>*/}
                {/*    <Input type="text" disabled={true} value={this.props.bookType}/>*/}
                {/*  </FormGroup>*/}
                {/*</Col>*/}
                {this.props.grade && (
                  <Col xs="6">
                    <FormGroup>
                      <Label htmlFor="vat">Grade</Label>
                      <Input type="text" disabled={true} value={lettersChanges(this.props.grade)}/>
                    </FormGroup>
                  </Col>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="vat">Author</Label>
                <Input type="text" disabled={true} value={this.props.author}/>
              </FormGroup>
              <FormGroup row className="my-0">
                <Col xs="6">
                  <FormGroup>
                    <Label>Language</Label>
                    <Input type="text" disabled={true} value={this.props.language}/>
                  </FormGroup>
                </Col>
                <Col xs="6">
                  <FormGroup>
                    <Label>Package</Label>
                    <Multiselect
                      selectedValues={this.props.packages}
                      displayValue="name"
                      disable={true}
                      keepSearchTerm={true}
                      hidePlaceholder={true}
                    />
                  </FormGroup>
                </Col>
              </FormGroup>
              {this.props.description !== "" ? (
                <FormGroup>
                  <Label htmlFor="vat">Description</Label>
                  <Input type="textarea" disabled={true} value={this.props.description}/>
                </FormGroup>

              ) : null}
              <FormGroup>
                <Label htmlFor="vat">View Count</Label>
                <Input type="text" disabled={true} value={this.props.viewCount}/>
              </FormGroup>
              <FormGroup>
                <Label>View Book</Label>
                <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                  <i className="icon-link icons" style={{marginRight: 10}}/>
                  <a href={this.props.folderUrl} target="_blank">{this.props.folderUrl}</a>
                </div>
              </FormGroup>
              {this.props.coverImage !== null ? (
                <FormGroup>
                  <Label>Cover Image</Label>
                  <div style={{width: '100%', justifyContent: 'center'}}>
                    <img src={this.props.coverImage} width={'100%'}/>
                  </div>
                </FormGroup>
              ) : null}

            </CardBody>
          </Card>
        </Col>
      </ModalBody>
    );
  }
}

export default Model;
