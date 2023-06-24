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

let prev = 0;

function lettersChanges(str) {
  return str.replace(/(\B)[^ ]*/g, match => (match.toLowerCase())).replace(/^[^ ]/g, match => (match.toUpperCase()))
}

class Product extends Component {
  state = {
    list: [
      {
        productId: '1',
        productName: 'items.title',
        description: 'items.description',
        status:'pending',
        unitPrice: '1200',
        image:'items.image'
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
    asSearch: false
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

  badgeStatusHandler(status) {
    switch (status) {
      case 'ACTIVE':
        return {color: 'success', text: 'Inactive', title: 'INACTIVE'};
        break;
      case 'INACTIVE':
        return {color: 'secondary', text: 'Active', title: 'ACTIVE'};
        break;
      case 'DELETED':
        return {color: 'danger', text: '', title: ''};
        break;
      default:
        return {color: '', text: '', title: ''}
        break;
    }
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

  onTogglePopup = (data) => {
    localStorage.setItem(StorageStrings.BOOK_ID, data.productId);
    this.setState({
      modelVisible: !this.state.modelVisible,
      selectedProductData: {
        productId: data.productId,
        title: data.productName,
        author: data.author,
        description: data.description,
        language: data.language,
        coverImage: data.coverImage,
        folderUrl: data.folderUrl,
        packages: data.packages,
        viewCount: data.viewCount,
        productType: this.checkProductCategory(data.productType),
        grade:data.grade
      }
    })
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
    const {totalElements, list, searchTxt, modelVisible, selectedProductData, loading} = this.state;

    const listData = list.map((items, i) => (
      <tr key={i}>
        <td className={"DescriptionTD"}>{items.productName}</td>
        <td className={"DescriptionTD"}>{items.description}</td>
        <td className={'btn-align'}>{items.unitPrice}</td>
        <td className={'btn-align'}>{items.image}</td>
        <td className={'btn-align'}>
          <Badge color={this.badgeStatusHandler(items.status).color} className={"shadow"}>{items.status}</Badge>
        </td>
        <td className={'btn-align'}>
          <Link to={{pathname: BASE_URL + "/manage-product/add-new-product", state: {asEdit: true, items: items}}}>
            <Button color="dark" className="btn-pill shadow">Edit</Button>
          </Link>
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
                                onClick={() =>{}}>Search</Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>

                  <div style={{position: 'absolute', right: 30}}>
                      <Button color="primary mr-2" className="btn-pill shadow" onClick={this.onTogglePopup}>Add New</Button>
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
          <ModalHeader toggle={this.onTogglePopup}>Product Details</ModalHeader>
          <ModelContent
            title={'selectedProductData.title'}
            author={'selectedProductData.author'}
            description={'selectedProductData.description'}
            language={'selectedProductData.language'}
            coverImage={'selectedProductData.coverImage'}
            packages={'selectedProductData.packages'}
            folderUrl={'selectedProductData.folderUrl'}
            viewCount={'selectedProductData.viewCount'}
            bookType={'selectedProductData.bookType'}
            grade={'selectedProductData.grade'}
          />
          <ModalFooter>
            <Button color="secondary" onClick={this.onTogglePopup}>Cancel</Button>
            <Button color="primary" onClick={this.onTogglePopup}>Add</Button>
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
