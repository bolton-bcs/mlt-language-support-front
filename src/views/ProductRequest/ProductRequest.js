import React, {Component} from 'react';
import {
  Badge,
  Button, ButtonDropdown,
  Card,
  CardBody,
  CardHeader,
  Col, DropdownItem, DropdownMenu, DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon, Modal, ModalFooter, ModalHeader,
  Row,
  Table
} from "reactstrap";
import './ProductRequest.scss';
import * as PublicUserService from '../../services/users';
import * as CommonFunc from "../../utils/CommonFunc";
import VerifyIMG from '../../assets/img/icon/verified.jpg';
import NotVerifyIMG from '../../assets/img/icon/notVerified.jpg';
import ModelContent from "../../components/Model/PublicUser/Model";
import userImg from '../../assets/img/brand/user.jpg';
import Loader from "../../components/Loader/loading";
import * as PackageService from "../../services/package";
import {DateRangePickerComponent} from '@syncfusion/ej2-react-calendars';
import PaginationComponent from "react-reactstrap-pagination";
import swal from "sweetalert";
import '../../scss/sweetalert.scss';
import {CSVLink} from "react-csv";
import DownloadPng from "../../assets/img/DownloadPng.jpg";
import ReactFlagsSelect from 'react-flags-select';
import CloseIMG from '../../assets/img/icon/close.png'
import Countries from '../../components/Json/countries.json';

let prev = 0;

function lettersChanges(str) {
  return str.replace(/(\B)[^ ]*/g, match => (match.toLowerCase())).replace(/^[^ ]/g, match => (match.toUpperCase()))
}

class ProductRequest extends Component {
  state = {
    list: [
      {
        date:'2023/06/07',
        orderNo:'123',
        itemName:'Papper',
        qty:'10',
        price:'100',
        expectedDate:'2023/06/10',
        country:'SL'
      }
    ],
    selectedPages: 0,
    totalElements: 0,
    paginateData: [],
    searchTxt: {
      value: '',
      valid: true
    },
    modelVisible: false,
    selectedUserData: {},
    loading: true,
    dropdownOpen: new Array(3).fill(false),
    dropdownOpen2: new Array(3).fill(false),
    packageList: [],
    selectedPackage: '',
    selectedPackageName: '',
    selectedStatus: '',
    startDate: '',
    endDate: '',
    asSearch: false,
    downloadList: [],
    userStatus: [{name: 'ACTIVE'}, {name: 'PENDING_PAYMENT'}, {name: 'UNSUBSCRIBED'}],
    countryCode: '',
    countryName: ''
  }

  csvLinkRef = React.createRef();

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  toggle2(i) {
    const newArray = this.state.dropdownOpen2.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen2: newArray,
    });
  }

  componentDidMount() {
    this.setState({loading: false})
    this.handleSelected = this.handleSelected.bind(this);
    this.onTogglePopup = this.onTogglePopup.bind(this);
    // this.getAllPublicUsers(0, 10);
    // this.getAllPackages();
  }

  getAllPublicUsers = async (page, size) => {
    let list = [];
    await PublicUserService.getAllPublicUsers({page: page, size: size})
      .then(response => {
        if (response.success) {
          response.body.content.map((items) => {
            list.push({
              userId: items.userId,
              createDate: items.createDateTime,
              firstName: items.firstName,
              lastName: items.lastName,
              verified: items.verified,
              status: items.status,
              contact: items.email,
              school: items.school,
              package: items.package,
              mobile: items.mobile !== null ? items.mobile : '___'
            })
          });
          const totalElements = response.body.totalElements;

          this.setState({list: list, selectedElement: page, totalElements: totalElements, loading: false});
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

  searchUserByName = async (page, size, packageType, selectedStatus, paginate, countryName) => {
    this.setState({loading: true, asSearch: true});
    if (paginate) {
      this.setState({totalElements: 0})
    }
    await PublicUserService.searchPublicUsers({
      page: page,
      size: size,
      name: this.state.searchTxt.value,
      packageType: packageType,
      startDateTime: this.state.startDate,
      endDateTime: this.state.endDate,
      publicUserStatus: selectedStatus,
      country: countryName
    })
      .then(response => {
        if (response.success) {
          let list = [];

          response.body.content.map((items) => {
            list.push({
              userId: items.userId,
              createDate: items.createDateTime,
              firstName: items.firstName,
              lastName: items.lastName,
              verified: items.verified,
              status: items.status,
              contact: items.email,
              school: items.school,
              package: items.package,
              mobile: items.mobile !== null ? items.mobile : '___'
            })
          });
          const totalElements = response.body.totalElements;

          this.setState({list: list, selectedElement: page, totalElements: totalElements, loading: false});

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

  updatePublicUserStatus = async (userId, status) => {
    this.setState({loading: true});
    const body = {
      userId: userId,
      status: status
    }
    await PublicUserService.updateUserStatus(body)
      .then(response => {
        if (response.success) {
          if (status === 'DELETED') {
            CommonFunc.notifyMessage('User has been successfully deleted!', 1);
          } else if (status === 'ACTIVE') {
            CommonFunc.notifyMessage('User has been successfully activated!', 1);
          } else {
            CommonFunc.notifyMessage('User has been successfully deactivated!', 1);
          }
          this.getAllPublicUsers(0, 10);
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

  getAllPackages = async () => {
    await PackageService.getAllPackage()
      .then(response => {
        if (response.success) {
          const list = [];
          response.body.map((items) => {
            list.push({
              id: items.packageId,
              name: items.name,
              type: items.type
            })
          })
          this.setState({
            packageList: list
          })
        } else {
          CommonFunc.notifyMessage(response.message)
        }
      })
      .catch(error => {
        CommonFunc.notifyMessage(error.message, error.status);
      })
  }

  badgeStatusHandler(status) {
    switch (status) {
      case 'ACTIVE':
        return {color: 'success', title: 'DEACTIVATED', text: 'Deactivate', visible: true};
        break;
      case 'DEACTIVATED':
        return {color: 'danger', title: 'ACTIVE', text: 'Active', visible: true};
        break;
      case 'DELETED':
        return {color: 'danger', title: '', text: '', visible: true};
        break;
      case 'PENDING_PAYMENT':
        return {color: '', title: '', text: '', visible: false};
        break;
      default:
        return 'none'
        break;
    }
  }

  onTextChange = (event) => {
    prev = new Date().getTime();
    let name = event.target.name;
    let item = this.state[name];
    item.value = event.target.value;
    item.valid = true;
    this.setState({
      [name]: item,
    });

    setTimeout(() => {
      let now = new Date().getTime();
      if (now - prev >= 1000) {
        prev = now;
        this.searchUserByName(0, 10, this.state.selectedPackage, this.state.selectedStatus, true, this.state.countryName)
      }
    }, 1000)
  }

  onTogglePopup = (data) => {
    this.setState({
      modelVisible: !this.state.modelVisible,
      selectedUserData: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        contact: data.contact,
      }
    })
  }

  dropdownSelectHandler = (name, id) => {
    this.setState({selectedPackage: id, selectedPackageName: name})
    this.searchUserByName(0, 10, id, this.state.selectedStatus, true, this.state.countryName)
  }

  dropdownSelectHandler2 = (name) => {
    this.setState({selectedStatus: name})
    this.searchUserByName(0, 10, this.state.selectedPackage, name, true, this.state.countryName)
  }

  onChangeDate = (event) => {
    const startDateTime = new Date(new Date(event.startDate).getTime() + 1000 * 60 * 30 * 10 + 30 * 60000).toISOString();
    const endDateTime = new Date(new Date(event.endDate).getTime() + 5900 * 60 * 30 * 10 - 1).toISOString();
    const startDate = startDateTime.split('.')[0];
    const endDate = endDateTime.split('.')[0]
    if (startDate !== '1970-01-01T05:30:00') {
      this.setState({
        endDate: endDate,
        startDate: startDate
      })
    } else {
      this.setState({
        endDate: '',
        startDate: ''
      })
    }

    this.searchUserByName(0, 10, this.state.selectedPackage, this.state.selectedStatus, true, this.state.countryName)
  }

  handleSelected(selectedPage) {
    if (!this.state.asSearch) {
      this.getAllPublicUsers(selectedPage - 1, 10)
    } else {
      this.searchUserByName(selectedPage - 1, 10, this.state.selectedPackage, this.state.selectedStatus, false, this.state.countryName)
    }
  }

  async deleteHandler(userId, status) {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      className: "swal-footer"
    })
      .then((willDelete) => {
        if (willDelete) {
          this.updatePublicUserStatus(userId, status);
        }
      });
  }

  getAllUsersToDownloadAsCSV() {
    this.setState({loading: true})
    PublicUserService.getPublicUserCSV()
      .then(async response => {
        if (response.success) {
          let list = [];

          response.body.map((items) => {
            list.push({
              userId: items.userId,
              createDate: items.createDateTime,
              firstName: items.firstName,
              lastName: items.lastName,
              verified: items.verified,
              status: items.status,
              email: items.email,
              package: items.package ? items.package.name : 'n/a',
              mobile: items.mobile ? items.mobile : 'n/a',
              country: items.country ? items.country : 'n/a',
              school: items.school ? items.school.name ? items.school.name : 'n/a' : 'n/a'
            })
          });

          await this.setState({downloadList: list, loading: false});
          this.csvLinkRef.current.link.click();

        } else {
          CommonFunc.notifyMessage(response.message);
          this.setState({loading: false});
        }
      })
      .catch(error => {
        CommonFunc.notifyMessage(error.message, error.status);
        this.setState({loading: false});
      });
  }

  getCountryName = (countryCode) => {
    const countries = Countries;
    for (const c of countries) {
      if (c.alpha2Code === countryCode) {
        return c.name;
      }
    }
  }

  countryDropDownSelector = (countryCode) => {
    let countryName;
    if (countryCode !== '') {
      countryName = this.getCountryName(countryCode);
      this.setState({
        countryCode: countryCode,
        countryName: countryName
      })
    } else {
      countryName = '';
      this.setState({
        countryCode: countryCode,
        countryName: countryName
      })
    }
    this.searchUserByName(0, 10, this.state.selectedPackage, this.state.selectedStatus, true, countryName);
  }

  render() {
    const {list, modelVisible, selectedUserData, loading, selectedPackage, totalElements, selectedPackageName, selectedStatus, userStatus, packageList, countryCode, countryName} = this.state;
    const listData = list.map((items, i) => (
      <tr key={i}>
        <td>{items.date}</td>
        <td>{items.orderNo}</td>
        <td>{items.itemName}</td>
        <td>{items.qty}</td>
        <td>{items.price}</td>
        <td>{items.expectedDate}</td>
        <td className={'btn-align'}>
          {items.country}
        </td>
        <td className={'btn-align'}>
          <Button color="success" className="btn-pill shadow"
                  // onClick={() => this.onTogglePopup(items)}
          >View More</Button>
        </td>
      </tr>
    ));

    const listPackages = packageList.map((items, i) => (
      <DropdownItem
        key={i}
        onClick={() => this.dropdownSelectHandler(items.name, items.id)}
        active={selectedPackage === items.id}>
        {lettersChanges(items.name)}
      </DropdownItem>
    ))

    const statusList = userStatus.map((items, i) => (
      <DropdownItem
        key={i}
        onClick={() => this.dropdownSelectHandler2(items.name)}
        active={selectedStatus === items.name}>
        {lettersChanges(items.name) !== 'Pending_payment' ? lettersChanges(items.name) : 'Pending Payment'}
      </DropdownItem>
    ))

    return (
      <div>

        <br/>

        <Row>
          <Col>
            <Card>
              <CardHeader>
                <div style={{display: "flex", alignItems: 'center'}}>
                  <Col md="4" xs={8}>
                    <InputGroup>
                      <Input type="text" name="searchTxt" placeholder="Search Order Number"/>
                      <InputGroupAddon addonType="append">
                        <Button type="button" color="primary" className={"shadow"}
                                onClick={() => {}}>Search</Button>
                      </InputGroupAddon>
                    </InputGroup>

                  </Col>

                  <div className={"SelectContainer"}>
                    <ReactFlagsSelect
                      selected={countryCode}
                      // onSelect={countryCode => this.countryDropDownSelector(countryCode)}
                      showSelectedLabel={true}
                      selectedSize={countryName.length < 20 || window.innerWidth >= 1700 ? 15.5 : 10}
                      fullWidth={false}
                      showSecondarySelectedLabel={true}
                      selectButtonClassName={"CountryDropdown"}
                      showSecondaryOptionLabel={true}
                      placeholder={'All Countries'}
                      className={countryName.length < 20 || window.innerWidth >= 1700 ?'':'max-width'}
                    />

                    {countryCode !== '' && (
                      <img src={CloseIMG} width={14} height={14}
                           // onClick={() => this.countryDropDownSelector('')}
                           alt={'close'}
                           className={countryName.length < 20 || window.innerWidth >= 1700 ?"closeBtn":"closeBtn2"}
                      />
                    )}

                  </div>


                  <div style={{position: 'absolute', right: 20}}>
                    <DateRangePickerComponent
                      placeholder={'Select Date Range'}
                      enablePersistence={false}
                      format="dd-MMM-yy"
                      width={'100%'}
                      // change={this.onChangeDate}
                      allowEdit={false}
                    />
                  </div>
                </div>

              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className={"Table"}>
                  <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order No</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Expected Date</th>
                    <th>Country</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>{listData}</tbody>
                </Table>
                {/*{totalElements !== 0 ? (*/}
                {/*  <nav>*/}
                {/*    <PaginationComponent*/}
                {/*      totalItems={totalElements}*/}
                {/*      pageSize={10}*/}
                {/*      onSelect={this.handleSelected}*/}
                {/*      firstPageText={"<<"}*/}
                {/*      lastPageText={">>"}*/}
                {/*      nextPageText={">"}*/}
                {/*      previousPageText={"<"}*/}
                {/*    />*/}
                {/*  </nav>*/}
                {/*) : null}*/}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modelVisible} toggle={this.onTogglePopup}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.onTogglePopup}>Public User Details</ModalHeader>
          <ModelContent
            // firstName={selectedUserData.firstName}
            // lastName={selectedUserData.lastName}
            // contact={selectedUserData.contact}
            userId={selectedUserData.userId}
          />
          <ModalFooter>
            <Button color="secondary" onClick={this.onTogglePopup}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Loader
          asLoading={loading}
        />

      </div>
    );
  }
}

export default ProductRequest;
