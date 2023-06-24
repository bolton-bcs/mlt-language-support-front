import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  ModalBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";
import Dropzone from "react-dropzone";
import "../Modal.scss"

function lettersChanges(str) {
  return str.replace(/(\B)[^ ]*/g, match => (match.toLowerCase())).replace(/^[^ ]/g, match => (match.toUpperCase()))
}

class Model extends Component {
  state = {
    drop: true,
    src: null,
    imgBase64: '',
    asImageEdit: false,
    dropdownOpen: false,
  }

  componentDidMount() {
    if (this.props.editEnabled) {
      this.setState({src: this.props.image})
    }
  }

  handleDrop = acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({src: reader.result, drop: false, asImageEdit: true})
      );
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({src: reader.result, drop: false, asImageEdit: true})
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  render() {
    const {asImageEdit, drop, imgBase64, src, dropdownOpen} = this.state;
    return (
      <ModalBody>
        <Col xs="12" sm="12">
          <Card>
            <CardHeader>
              <strong>{!this.props.editEnabled?'Add Product':'Edit Product'}</strong>
            </CardHeader>
            <CardBody>

              <FormGroup row className="my-0">
                <Col xs="6" className="mt-2">

                  {asImageEdit ?
                    <div className={"EditableStyle"} onClick={() => this.setState({asImageEdit: false, src: null})}>
                      <img src={src} alt="" width={'100%'} height={'100%'}/>
                      <i className="cui-cloud-upload icons font-2xl"></i>
                    </div>
                    :
                    src ?
                      <div className={"EditableStyle"} onClick={() => this.setState({asImageEdit: false , src: null})}>
                        <img src={this.props.image} alt="img" width={'100%'} height={'100%'}/>
                      </div>
                      :
                    <div className={"App"}>
                      <Dropzone
                        onDrop={this.handleDrop}
                        accept="image/*"
                        minSize={1024}
                        maxSize={3072000}
                      >
                        {({
                            getRootProps,
                            getInputProps,
                            isDragActive,
                            isDragAccept,
                            isDragReject
                          }) => {
                          const additionalClass = isDragAccept
                            ? "accept"
                            : isDragReject
                              ? "reject"
                              : "";

                          return (
                            <div
                              {...getRootProps({
                                className: `dropzone ${additionalClass}`
                              })}
                            >
                              <input {...getInputProps()} onChange={this.onSelectFile}/>
                              <span>{isDragActive ? "📂" : "📁"}</span>
                              <p>Drag'n'drop images</p>
                            </div>
                          );
                        }}
                      </Dropzone>
                    </div>
                  }

                </Col>
                <Col xs="6">
                  <FormGroup>
                    <Label htmlFor="vat">Product Name</Label>
                    <Input type="text" value={this.props.productName}/>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="vat">Description</Label>
                    <Input type="textarea" value={this.props.description}/>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="vat">Unit Price</Label>
                    <Input type="text" value={this.props.unitPrice}/>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="vat">Category</Label>
                    <Dropdown isOpen={dropdownOpen} toggle={() => this.setState({dropdownOpen: !dropdownOpen})}>
                      <DropdownToggle caret className="w-100 text-left bg-white">Category</DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Some Action1</DropdownItem>
                        <DropdownItem>Some Action2</DropdownItem>
                        <DropdownItem>Some Action3</DropdownItem>
                        <DropdownItem>Some Action4</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>
                </Col>
              </FormGroup>

            </CardBody>
          </Card>
        </Col>
      </ModalBody>
    );
  }
}

export default Model;
