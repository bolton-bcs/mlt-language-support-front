import React, {Component, Suspense} from 'react';
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  CardTitle,
  CardSubtitle,
  CardText,
  CardBody,
  Card,
  CardImg,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import '../../../App.scss'
import {BASE_URL} from "../../../constance/Constance";
import * as ProductService from "../../../services/product";
import * as CommonFunc from "../../../utils/CommonFunc";

class ProductCatalogue extends Component {
  state = {
    list: [],
    filteredResultList: [],
    category: [],
    loading: false,
    selectedCategory: {
      label: '',
      value: ''
    }
  }

  componentDidMount() {
    this.getAllCategories();
  }

  getAllCategories = async () => {
    this.setState({loading: true})
    await ProductService.getAllCategory()
      .then(async response => {
        let list = [];
        if (response.success) {
          response.data.map((items) => {
            list.push({
              label: items.name,
              value: items.id
            })
          })
          await this.setState({category: list, selectedCategory: {value: list[0].value, label: list[0].label}})
          await this.getAllProducts();
        } else {

        }
      })
      .catch(err => {
        this.setState({loading: false})
      })
  }

  getAllProducts = async () => {
    await ProductService.getAllProduct()
      .then(async response => {
        let list = [];

        if (response.success) {

          response.data.map((items) => {
            list.push({
              productId: items.id,
              productName: items.name,
              description: items.description,
              status: items.status,
              unitPrice: items.price,
              // image: items.imageUrl,
              image: 'https://c8.alamy.com/comp/2CBHG1K/red-chilli-powder-with-dried-red-chillies-in-earthen-bowl-2CBHG1K.jpg',
              categoryId: items.categoryId,
              qty: items.qty
            })
          });
          await this.setState({list: list, loading: false});
          await this.onFilteredData();
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

  onSelectCategory = async (item) => {
    await this.setState({
      selectedCategory: {
        label: item.label,
        value: item.value
      }
    })
    await this.onFilteredData()
  }

  onFilteredData = async () => {
    const data = this.state.list.filter(obj => obj.categoryId === this.state.selectedCategory.value);
    this.setState({filteredResultList:data})
  }

  render() {
    return (
      <div>
        <Row>
          <Col md="2">
            <h2 className="text-black-50 mb-4 mt-2">Categories</h2>

            <ListGroup>

              {this.state.category.map((item, i) => (
                <ListGroupItem
                  action
                  active={item.value === this.state.selectedCategory.value}
                  tag="button"
                  onClick={async () => await this.onSelectCategory(item)}
                  key={i}
                >
                  {item.label}
                </ListGroupItem>
              ))}
            </ListGroup>

          </Col>
          <Col md="10">
            <Row>
              <Col md="6"/>
              <Col md="6" className="mt-2 mb-2">
                <InputGroup>
                  <Input type="text" name="searchTxt" placeholder="Search Product"/>
                  <InputGroupAddon addonType="append">
                    <Button type="button" color="primary" className={"shadow"}
                            onClick={() => {
                            }}>Search</Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>

            <Card className="my-2">
              <CardImg
                alt="Card image cap"
                src="https://www.idhsustainabletrade.com/uploaded/2018/04/Spices-1-1440x400-c-default@1x.jpeg"
                style={{
                  height: 180
                }}
                top
                width="100%"
                className="cover-img"
              />
            </Card>

            <h1 className="mt-2 text-black-50">{this.state.selectedCategory.label}</h1>
            <span className="text-black-50">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's</span>

            <Row className="flex-lg-grow-0">
              {this.state.filteredResultList.map((item, i) => (
                <Col md={4} lg={4} sm={12} xl={4}>
                  <Card style={{width: '21.5rem', marginTop: 10}}>
                    <CardBody>
                      <Row>
                        <Col md={5}>
                          <img
                            alt="Sample"
                            src={item.image}
                            style={{width: 120, height: 120}}
                          />
                        </Col>

                        <Col md={7}>
                          <CardTitle tag="h5" className="text-black-50">
                            {item.productName}
                          </CardTitle>
                          <CardSubtitle
                            className="text-muted"
                            tag="h6"
                          >
                            LKR {item.unitPrice}
                          </CardSubtitle>
                          <CardText className="text-black-50">
                            {item.description}
                          </CardText>
                        </Col>


                      </Row>

                      <div className="w-100 justify-content-center align-items-center d-flex mt-2">
                        <Button className="text-center bg-success pl-3 pr-3"
                                onClick={() => this.props.history.push(BASE_URL + '/product-details')}>
                          Order now
                        </Button>
                      </div>

                    </CardBody>
                  </Card>
                </Col>

              ))}
            </Row>


          </Col>
        </Row>
      </div>
    );
  }
}

export default ProductCatalogue;
