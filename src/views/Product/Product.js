import React, {Component} from 'react';
import {
  Badge, Button,
  Card,
  CardBody,
  CardHeader,
  Col, Input, InputGroup, InputGroupAddon, Modal, ModalFooter, ModalHeader,
  Row,
  Table
} from "reactstrap";
import {Link} from "react-router-dom";
import {BASE_URL} from "../../constance/Constance";
import './Product.scss';
import * as ProductService from '../../services/product';
import * as CommonFunc from '../../utils/CommonFunc';
import ModelContent from "../../components/Model/Books/Model";
import Loader from "../../components/Loader/loading";
import {StorageStrings} from "../../constance/StorageStrings";
import swal from "sweetalert";
import {AppSwitch} from "@coreui/react";

let prev = 0;

function lettersChanges(str) {
  return str.replace(/(\B)[^ ]*/g, match => (match.toLowerCase())).replace(/^[^ ]/g, match => (match.toUpperCase()))
}

class Product extends Component {
  state = {
    list: [
      {
        productId: '1',
        productName: 'Chilly Powder',
        description: 'test description',
        status: 'pending',
        unitPrice: '1200',
        image: 'https://www.shutterstock.com/image-photo/red-chilly-powderchilly-powder-260nw-1713369340.jpg'
      }
    ],
    selectedPage: 1,
    totalElements: 0,
    searchTxt: {
      value: '',
      valid: true
    },
    modelVisible: false,
    selectedProductData: {},
    loading: true,
    asSearch: false,
    editEnabled:false
  }

  componentDidMount() {
    this.handleSelected = this.handleSelected.bind(this);
    this.getAllProducts(0, 10);
  }

  getAllProducts = async (page, size) => {
    // this.setState({loading: true})
    this.setState({
      loading: false,

    })
    // await ProductService.getAllBooks({page: page, size: size})
    //   .then(response => {
    //     let list = [];
    //
    //     if (response.success) {
    //       response.body.content.map((items) => {
    //         list.push({
    //           bookId: items.bookId,
    //           bookName: items.title,
    //           author: items.author,
    //           description: items.description,
    //           folderUrl: items.folderURL,
    //           coverImage: items.coverImage,
    //           packages: items.packages,
    //           language: items.language,
    //           status: items.bookStatus,
    //           viewCount: items.viewCount,
    //           bookType: items.bookType ? items.bookType : '______',
    //           grade:items.grade
    //         })
    //       });
    //       const totalElements = response.body.totalElements;
    //       this.setState({list: list, selectedElement: page, totalElements: totalElements, loading: false});
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
    prev = new Date().getTime();
    let name = event.target.name;
    let item = this.state[name];
    if (item.value !== event.target.value) {
      this.setState({list: []});
    }
    item.value = event.target.value;
    item.valid = true;
    this.setState({
      [name]: item,
    });

    if (event.target.value !== '') {
      this.setState({asSearch: true});
    } else {
      this.setState({asSearch: false});
    }

    setTimeout(() => {
      let now = new Date().getTime();
      if (now - prev >= 1000) {
        prev = now;
        this.searchProductByName(0, 10)
      }
    }, 1000)

  }

  onTogglePopup = (data,isEdit) => {
    localStorage.setItem(StorageStrings.BOOK_ID, data.productId);
    this.setState({modelVisible: !this.state.modelVisible})
    if(isEdit){
      this.setState({
        selectedProductData: {
          productId: data.productId,
          productName: data.productName,
          description:data.description,
          unitPrice:data.unitPrice,
          image:data.image,
        },
        editEnabled: true
      })
    }else {
      this.setState({
        selectedProductData: {
          productId: '',
          productName: '',
          description:'',
          unitPrice:'',
          image:'',
        },
        editEnabled: true
      })
      this.setState({editEnabled:false})
    }

  }

  handleSelected(selectedPage) {
    if (!this.state.asSearch) {
      this.getAllProducts(selectedPage - 1, 10)
    } else {
      this.searchProductByName(selectedPage - 1, 10)
    }
  }

  async deleteHandler(productId, status) {
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
          this.updateProductStatus(productId, status);
        }
      });
  }

  checkProductCategory(type) {
    switch (type) {
      case 'EDUCATIONAL_BOOK':
        return 'Educational Book';
      case 'STORY_BOOK':
        return 'Story Book';
      default:
        return '______'
    }
  }

  render() {
    const {totalElements, list, searchTxt, modelVisible, selectedProductData, loading, editEnabled} = this.state;

    const listData = list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.productName}</td>
        <td className={"DescriptionTD"}>{items.description}</td>
        <td className={'btn-align'}>{items.unitPrice}</td>
        <td className={'btn-align'}><a href={items.image} target="_blank"><i className="icon-picture"></i></a></td>
        <td className={'btn-align'}>
          <AppSwitch variant={'pill'} label color={'success'} size={'sm'}/>
        </td>
        <td className={'btn-align'}>
            <Button color="dark" className="btn-pill shadow" onClick={()=>this.onTogglePopup(items,true)}>Edit</Button>
          <Button color="danger" className="btn-pill shadow"
                  onClick={() => this.deleteHandler(items.productId, 'DELETED')}>Delete</Button>
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
          <ModalHeader toggle={this.onTogglePopup}>{editEnabled?'Edit Product':'Add Product'}</ModalHeader>
          <ModelContent
            productId={selectedProductData.productId}
            productName={selectedProductData.productName}
            description={selectedProductData.description}
            image={selectedProductData.image}
            unitPrice={selectedProductData.unitPrice}
            editEnabled={editEnabled}
          />
          <ModalFooter>
            <Button color="secondary" onClick={this.onTogglePopup}>Cancel</Button>
            <Button color="primary" onClick={this.onTogglePopup}>{editEnabled?'Edit':'Add'}</Button>
          </ModalFooter>
        </Modal>

        <Loader
          asLoading={loading}
        />

      </div>
    );
  }
}

export default Product;
