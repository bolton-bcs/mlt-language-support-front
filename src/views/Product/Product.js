import React, {Component} from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Dropdown, DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal, ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from "reactstrap";
import {Link} from "react-router-dom";
import {BASE_URL} from "../../constance/Constance";
import './Product.scss';
import * as ProductService from '../../services/product';
import * as CommonFunc from '../../utils/CommonFunc';
import Loader from "../../components/Loader/loading";
import {StorageStrings} from "../../constance/StorageStrings";
import swal from "sweetalert";
import {AppSwitch} from "@coreui/react";
import Dropzone from "react-dropzone";

class Product extends Component {
  state = {
    list: [],
    selectedPage: 1,
    totalElements: 0,
    searchTxt: {
      value: '',
      valid: true
    },
    modelVisible: false,
    loading: true,
    asSearch: false,
    editEnabled: false,

    drop: true,
    src: null,
    imgBase64: '',
    asImageEdit: false,
    dropdownOpen: false,
    productId: '',
    productName: '',
    description: '',
    unitPrice: '',
    selectedCategory: '',
    qty: 0,
    status: false,
    category: [
      {label: 'category 1', value: 'category1'},
      {label: 'category 2', value: 'category2'},
      {label: 'category 3', value: 'category3'},
      {label: 'category 4', value: 'category4'},
    ],
  }

  componentDidMount() {
    this.getAllProducts();
  }

  getAllProducts = async () => {
    // this.setState({loading: true})
    this.setState({
      loading: false,

    })
    await ProductService.getAllProduct()
      .then(response => {
        let list = [];

        if (response.success) {

          response.data.map((items) => {
            list.push({
              productId: items.id,
              productName: items.name,
              description: items.description,
              status: items.status,
              unitPrice: items.price,
              image: items.imageUrl,
              category: 'category2',
              qty: items.qty
            })
          });
          this.setState({list: list, loading: false});
        } else {
          CommonFunc.notifyMessage(response.message);
          this.setState({loading: false});
        }
      })
      .catch(error => {
        CommonFunc.notifyMessage(error.message, error.status);
        this.setState({loading: false});
      })
  }

  searchProductByName = async (page, size) => {
    // this.setState({loading: true});
    // await ProductService.searchBook({page: page, size: size, name: this.state.searchTxt.value})
    //   .then(response => {
    //     if (response.success) {
    //       let list = [];
    //
    //       response.body.content.map((items) => {
    //         list.push({
    //           bookId: items.bookId,
    //           bookName: items.title,
    //           author: items.author,
    //           description: items.description,
    //           coverImage: items.coverImage,
    //           folderUrl: items.folderURL,
    //           packages: items.packages,
    //           language: items.language,
    //           status: items.bookStatus,
    //           viewCount: items.viewCount,
    //           bookType: items.bookType ? items.bookType : '______',
    //           grade:items.grade
    //         })
    //       });
    //       const totalElements = response.body.totalElements;
    //
    //
    //       this.setState({list: list, selectedElement: page, totalElements: totalElements, loading: false});
    //
    //     } else {
    //       CommonFunc.notifyMessage(response.message);
    //       this.setState({loading: false});
    //     }
    //   })
    //   .catch(error => {
    //     CommonFunc.notifyMessage(error.message, error.status);
    //     this.setState({loading: false});
    //   })
  }

  updateProductStatus = async (id, status) => {
    // this.setState({loading: true})
    // const body = {
    //   bookId: id,
    //   bookStatus: status
    // }
    // await ProductService.updateBookStatus(body)
    //   .then(response => {
    //     if (response.success) {
    //       if (status === 'DELETED') {
    //         CommonFunc.notifyMessage('Book has been successfully deleted!', 1);
    //       } else if (status === 'ACTIVE') {
    //         CommonFunc.notifyMessage('Book has been successfully activated!', 1);
    //       } else {
    //         CommonFunc.notifyMessage('Book has been successfully deactivated!', 1);
    //       }
    //       this.getAllBooks(0, 10);
    //     } else {
    //       CommonFunc.notifyMessage(response.message);
    //       this.setState({loading: false});
    //     }
    //   })
    //   .catch(error => {
    //     CommonFunc.notifyMessage(error.message, error.status);
    //     this.setState({loading: false});
    //   })
  }

  onTextChange = (event) => {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

  onTogglePopup = (data, isEdit) => {
    this.setState({modelVisible: !this.state.modelVisible})
    if (isEdit) {
      this.setState({
        productId: data.productId,
        productName: data.productName,
        description: data.description,
        unitPrice: data.unitPrice,
        image: data.image,
        selectedCategory: data.category,
        editEnabled: true,
        src: data.image,
        qty: data.qty,
        status: data.status
      })
    } else {
      this.setState({
        productId: '',
        productName: '',
        description: '',
        unitPrice: '',
        image: '',
        selectedCategory: '',
        src: null,
        editEnabled: false,
        qty: 0,
        status: false
      })
      this.setState({editEnabled: false})
    }

  }

  onSaveProduct = async () => {
    this.setState({loading: true})
    const data = {
      name: this.state.productName,
      description: this.state.description,
      imageUrl: this.state.src,
      price: this.state.unitPrice,
      qty: 15,
      status: 1
    }
    await ProductService.saveProduct(data)
      .then(res => {
        if (res.success) {
          this.onTogglePopup()
          this.getAllProducts()
        } else {
          CommonFunc.notifyMessage(res.message);
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  async deleteHandler(id) {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to delete this product?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      className: "swal-footer"
    })
      .then((willDelete) => {
        if (willDelete) {
          this.onDeleteProduct(id)
        }
      });
  }

  onUpdateProduct = async (item,type) => {
    console.log(item)
    let data = {}

    if (type === 'STATUS'){
      data = {
        id: item.productId,
        name: item.productName,
        description: item.description,
        imageUrl: item.image,
        price: item.unitPrice,
        qty: item.qty,
        status: !item.status ? 1 : 0
      }
    }else {
      data = {
        id: this.state.productId,
        name: this.state.productName,
        description: this.state.description,
        imageUrl: this.state.src,
        price: this.state.unitPrice,
        qty: this.state.qty,
        status: this.state.status ? 1 : 0
      }
    }
    await ProductService.updateProduct(data)
      .then(res => {
        if (res.success) {
          if (type === undefined){
            this.onTogglePopup()
          }
          CommonFunc.notifyMessage('Product record has been updated!',1);
          this.getAllProducts()
        } else {
          CommonFunc.notifyMessage(res.message,0);
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  onDeleteProduct=async (id)=>{
    await ProductService.deleteProduct(id)
      .then(res => {
        if (res.success) {
          CommonFunc.notifyMessage('Product has been deleted!',1);
          this.getAllProducts()
        } else {
          CommonFunc.notifyMessage(res.message,0);
        }
      })
      .catch(err => {
        console.log(err)
      })
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
    const {totalElements, list, searchTxt, modelVisible, loading, editEnabled, asImageEdit, asSearch, drop, dropdownOpen, imgBase64, selectedPage, src, selectedCategory, category, description, productName, unitPrice} = this.state;

    const listData = list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.productName}</td>
        <td className={"DescriptionTD"}>{items.description}</td>
        <td className={'btn-align'}>{items.unitPrice}</td>
        <td className={'btn-align'}><a href={items.image} target="_blank"><i className="icon-picture"></i></a></td>
        <td className={'btn-align'}>
          <AppSwitch variant={'pill'} label color={'success'} size={'sm'} checked={items.status} onChange={()=>this.onUpdateProduct(items,'STATUS')}/>
        </td>
        <td className={'btn-align'}>
          <Button color="dark" className="btn-pill shadow" onClick={() => this.onTogglePopup(items, true)}>Edit</Button>
          <Button color="danger" className="btn-pill shadow"
                  onClick={() => this.deleteHandler(items.productId)}>Delete</Button>
        </td>
      </tr>
    ));

    return (
      <div>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <div style={{display: "flex"}}>
                  <Col md="4" xs={8}>
                    <InputGroup>
                      <Input type="text" name="searchTxt" placeholder="Search..." value={searchTxt.value}/>
                      <InputGroupAddon addonType="append">
                        <Button type="button" color="primary" className={"shadow"}
                                onClick={() => {
                                }}>Search</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>

                  <div style={{position: 'absolute', right: 30}}>
                    <Button color="primary mr-2" className="btn-pill shadow" onClick={this.onTogglePopup}>Add
                      New</Button>
                    <Button color="primary" className="btn-pill shadow">Export CSV</Button>
                  </div>

                </div>

              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>{listData}</tbody>
                </Table>

              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modelVisible} toggle={this.onTogglePopup}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.onTogglePopup}>{editEnabled ? 'Edit Product' : 'Add Product'}</ModalHeader>

          <ModalBody>
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>{!editEnabled ? 'Add Product' : 'Edit Product'}</strong>
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
                          <div className={"EditableStyle"}
                               onClick={() => this.setState({asImageEdit: false, src: null})}>
                            <img src={src} alt="img" width={'100%'} height={'100%'}/>
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
                        <Input type="text" name="productName" placeholder="Product Name" value={productName}
                               onChange={this.onTextChange}/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="vat">Description</Label>
                        <Input type="textarea" name="description" placeholder="Description" value={description}
                               onChange={this.onTextChange}/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="vat">Unit Price</Label>
                        <Input type="text" name="unitPrice" placeholder="Unit Price" value={unitPrice}
                               onChange={this.onTextChange}/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="vat">Category</Label>
                        <Input type="select" name="selectedCategory" onChange={this.onTextChange}>
                          <option value="" disabled={selectedCategory !== ""}>Please select category</option>
                          {category.map(item => (
                            <option value={item.value} selected={item.value === selectedCategory}>{item.label}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </FormGroup>

                </CardBody>
              </Card>
            </Col>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={this.onTogglePopup}>Cancel</Button>
            <Button color="primary"
                    onClick={!editEnabled ? this.onSaveProduct : this.onUpdateProduct}>{editEnabled ? 'Edit' : 'Add'}</Button>
          </ModalFooter>
        </Modal>

        {loading && (
          <Loader
            asLoading={loading}
          />
        )}
      </div>
    );
  }
}

export default Product;
