import React, {Component, Suspense} from 'react';
import {Button, Col, Container, Input, InputGroup, InputGroupAddon, Row, CardTitle, CardSubtitle, CardText, CardBody,Card,CardImg,ListGroup,ListGroupItem} from "reactstrap";
import '../../../App.scss'
import {BASE_URL} from "../../../constance/Constance";

class ProductCatalogue extends Component {
  state={
    list:[
      {
        id:1,
        productName:'Chilli Powder',
        price:'300.00',
        description:'Chili powder is a red-colored blend of powdered spices. While it contains some cayenne pepper for',
        image:'https://c8.alamy.com/comp/2CBHG1K/red-chilli-powder-with-dried-red-chillies-in-earthen-bowl-2CBHG1K.jpg'
      },
      {
        id:2,
        productName:'Cinnamon',
        price:'1250.00',
        description:'e spice, consisting of the dried inner bark, is brown in colour and has a delicately fragrant aroma and a warm sweet flavour.',
        image:'https://d2jx2rerrg6sh3.cloudfront.net/image-handler/picture/2021/3/shutterstock_1147937015.jpg'
      },
      {
        id:3,
        productName:'Cloves',
        price:'535.50',
        description:'The flavor of Cloves are strong, pungent, sweet--almost hot. They are one of the most penetrating of all spices and their',
        image:'https://cdn.britannica.com/27/171027-050-7F7889C9/flower-buds-clove-tree.jpg'
      },
      {
        id:4,
        productName:'Product name 4',
        price:'892',
        description:'Some quick example text to build on the card title and make up the bulk of the card‘s content.',
        image:''
      }
    ]
  }

  render() {
    return (
      <div>
          <Row>
            <Col md="2">
              <h2 className="text-black-50 mb-4 mt-2">Categories</h2>
              <ListGroup>
                <ListGroupItem
                  action
                  active
                  tag="button"
                >
                  Bark
                </ListGroupItem>
                <ListGroupItem
                  action
                  tag="button"
                >
                  Seed
                </ListGroupItem>
                <ListGroupItem
                  action
                  tag="button"
                >
                  Flower/bud, pistil
                </ListGroupItem>
                <ListGroupItem
                  action
                  tag="button"
                >
                  Fruits/berries
                </ListGroupItem>
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

              <h1 className="mt-2 text-black-50">Bark</h1>
              <span className="text-black-50">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's</span>

              <Row className="flex-lg-grow-0">
                {this.state.list.map((item,i)=>(
                  <Col md={4} lg={4} sm={12} xl={4}>
                    <Card style={{width: '21.5rem',marginTop:10}}>
                      <CardBody>
                        <Row>
                          <Col md={5}>
                            <img
                              alt="Sample"
                              src={item.image}
                              style={{width:120,height:120}}
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
                              LKR {item.price}
                            </CardSubtitle>
                            <CardText className="text-black-50">
                              {item.description}
                            </CardText>
                          </Col>


                        </Row>

                        <div className="w-100 justify-content-center align-items-center d-flex mt-2">
                          <Button className="text-center bg-success pl-3 pr-3" onClick={()=>this.props.history.push(BASE_URL + '/product-details')}>
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
