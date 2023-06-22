import React, {Component} from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form, FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label, Modal, ModalBody
} from "reactstrap";
import Dropzone from 'react-dropzone'
import './NewBooksForm.scss'
import App from "../../../App";
import * as BookService from '../../../services/books';
import * as PackageService from '../../../services/package';
import * as CommonFunc from '../../../utils/CommonFunc';
import {Multiselect} from 'multiselect-react-dropdown';
import * as Validation from '../../../validation/Validation'
import {BASE_URL} from "../../../constance/Constance";
import Cropper from 'react-easy-crop'
import Loader from "../../../components/Loader/loading";
import PageLoading from "../../../components/Loader/PageLoading";
import axios from 'axios';
import Cookies from "js-cookie";
import {StorageStrings} from "../../../constance/StorageStrings";
import {asDev, DEV_URL_REMOTE, PROD_URL_REMOTE} from "../../../services/apiConfig";
import render from "enzyme/src/render";

export {PROD_URL_REMOTE, DEV_URL_REMOTE} from '../../../services/apiConfig';

/**
 * image dynamic cropping
 * @param url
 * @returns {Promise<unknown>}
 */
const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

/**
 * resize image ratio
 * @param canvas
 * @param newWidth
 * @param newHeight
 * @returns {HTMLCanvasElement}
 */
function getResizedCanvas(canvas, newWidth, newHeight) {
  let tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  let ctx = tmpCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);

  return tmpCanvas;
}

class NewBooksForm extends Component {
  state = {
    bookId: '',
    file: {},
    src: null,
    crop: {x: 0, y: 0},
    zoom: 1,
    aspect: 16 / 10,

    drop: true,
    title: {
      value: '',
      valid: true
    },
    author: {
      value: '',
      valid: true
    },
    description: {
      value: '',
      valid: true
    },
    language: {
      value: '',
      valid: true
    },
    category: {
      value: '',
      valid: true
    },
    grade: {
      value: '',
      valid: true
    },
    packageId: {
      value: '',
      valid: true
    },
    bookStatus: 'ACTIVE',
    zipFolder: '',
    packagesList: [],
    selectedValue: "",
    imgBase64: '',
    selectedPackages: [],
    asImageEdit: false,
    asFormEdit: false,
    asPackageSelect: false,
    asEdit: false,
    loading: false,
    loadingPercent: 0,

  }

  componentDidMount() {
    // window.onbeforeunload = (event) => {
    //   const e = event || window.event;
    //   // Cancel the event
    //   e.preventDefault();
    //   if (e) {
    //     e.returnValue = ''; // Legacy method for cross browser support
    //   }
    //   return ''; // Legacy method for cross browser support
    // };

    // window.onbeforeunload = function() {
    //   this.props.history.push(BASE_URL+'/manage-story-books');
    //   return "";
    // }.bind(this);

    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.getAllPackages();
    if (this.props.location.state === undefined) {
      this.props.history.push(BASE_URL + '/manage-products');
    } else if (this.props.location.state.asEdit) {
      this.loadAllBookDetails();
    }
  }

  loadAllBookDetails = () => {
    const data = this.props.location.state.items;
    this.setState({
      title: {
        value: data.bookName,
        valid: true
      },
      author: {
        value: data.author,
        valid: true
      },
      description: {
        value: data.description,
        valid: true
      },
      language: {
        value: data.language,
        valid: true
      },
      category: {
        value: data.bookType,
        valid: true
      },
      grade: {
        value: data.grade,
        valid: true
      },
      drop: true,
      selectedPackages: data.packages,
      src: data.coverImage,
      asImageEdit: true,
      asFormEdit: true,
      asPackageSelect: true,
      asEdit: this.props.location.state.asEdit,
      zipFolder: data.folderUrl,
      bookId: data.bookId,
      bookStatus: 'ACTIVE',
    })
  }

  /**
   * get all package endpoint
   * */
  getAllPackages = () => {
    PackageService.getAllPackage()
      .then(response => {
        if (response.success) {
          const list = [];
          response.body.map((items) => {
            list.push({
              name: items.name,
              packageId: items.packageId,
              type: items.type,
              price: items.price
            })
          })
          this.setState({
            packagesList: list
          })
        } else {
          CommonFunc.notifyMessage(response.message)
        }
      })
      .catch(error => {
        CommonFunc.notifyMessage(error.message, error.status);
      })
  }

  /**
   * file selection method
   * */
  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({src: reader.result, drop: false})
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onCropChange = (crop) => {
    this.setState({crop})
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels)
    this.resizeImg(croppedAreaPixels);
  }

  onZoomChange = (zoom) => {
    this.setState({zoom})
  }

  resizeImg = async (croppedAreaPixels) => {
    const croppedImageUrl = await this.getCroppedImg(
      this.state.src,
      croppedAreaPixels,
    )
    this.setState({croppedImageUrl})
  }


  /**
   * image crop method
   * */
  async getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

    // set each dimensions to double largest dimension to allow for a safe area for the
    // image to rotate in without being clipped by canvas context
    canvas.width = safeArea
    canvas.height = safeArea

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.translate(-safeArea / 2, -safeArea / 2)

    // draw rotated image and store data.
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    )
    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // paste generated rotate image with correct offsets for x,y crop values.
    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    )

    let smallCanvas = getResizedCanvas(canvas, 960, 600);

    const base64string = smallCanvas.toDataURL('image/jpeg');
    this.setState({imgBase64: base64string.split(',')[1]})


    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise(resolve => {
      canvas.toBlob(file => {
        resolve(URL.createObjectURL(file))
      }, 'image/jpeg')
    })


  }

  /**
   * drag n drop method
   * */
  handleDrop = acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({src: reader.result, drop: false})
      );
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }

  clear = () => {
    this.setState({drop: true, src: null, croppedImageUrl: null})
  }

  dropFile = acceptedFiles => {
    console.log(acceptedFiles)
    console.log(acceptedFiles)
    if (acceptedFiles.length !== 0) {
      this.setState({
        file: acceptedFiles[0],
        asFormEdit: false
      });
    }
  }


  /**
   * book saving endpoint
   * */
  saveBookHandler = () => {
    const bookName = this.state.title;
    const author = this.state.author;
    // const description = this.state.description;
    bookName.valid = Validation.textFieldValidator(this.state.title.value, 1)
    // author.valid = Validation.textFieldValidator(this.state.author.value, 1)
    // description.valid = Validation.textFieldValidator(this.state.description.value, 1)
    this.setState({title: bookName})

    if (!bookName.valid) {
      CommonFunc.notifyMessage('Please Enter Book Title', 0)
    } else if (this.state.selectedPackages.length === 0) {
      CommonFunc.notifyMessage('Please Select Packages', 0)
    } else if (this.state.language.value === '') {
      CommonFunc.notifyMessage('Please Select Language', 0)
    // } else if (this.state.category.value === '') {
    //   CommonFunc.notifyMessage('Please Select Book Category', 0)
    // } else if (this.state.category.value === 'EDUCATIONAL_BOOK' && this.state.grade.value === '') {
    //   CommonFunc.notifyMessage('Please Select Your Grade', 0)
    } else if (this.state.src === null) {
      CommonFunc.notifyMessage('Cover Image Not Found', 0)
    } else if (Object.keys(this.state.file).length === 0) {
      CommonFunc.notifyMessage('File Not Found', 0)
    } else {
      this.setState({loading: true});
      let data = new FormData()
      data.append('zipFolder', this.state.file)
      data.append('title', this.state.title.value)
      data.append('coverImageBase64', this.state.imgBase64)
      data.append('author', this.state.author.value)
      data.append('description', this.state.description.value)
      data.append('language', this.state.language.value)
      data.append('packageIds', this.packageIdString(this.state.selectedPackages))
      data.append('bookStatus', this.state.bookStatus)
      data.append('bookType', 'STORY_BOOK')
      // data.append('bookType', this.state.category.value)
      // if (this.state.category.value === 'EDUCATIONAL_BOOK') {
      //   data.append('grade', this.state.grade.value)
      // }
      // BookService.saveBook(data)
      //   .then(response => {
      //     if (response.success) {
      //       this.setState({loading: false});
      //       this.props.history.push(BASE_URL + '/manage-story-books');
      //     } else {
      //       this.setState({loading: false});
      //       CommonFunc.notifyMessage(response.message)
      //     }
      //   })
      //   .catch(error => {
      //     this.setState({loading: false});
      //     CommonFunc.notifyMessage(error.message, error.status);
      //   })
      this.fetchAPI('post', "web/admin/book/save", data, 'Book has been successfully added!');

    }
  }

  fetchAPI = async (method, url, data, msg) => {
    const basic_url = !asDev ? `${PROD_URL_REMOTE}/wooks/api/v1/` : `${DEV_URL_REMOTE}/storybooks/api/v1/`;
    let access_token = localStorage.getItem(StorageStrings.ACCESS_TOKEN);
    await axios[method](basic_url + url, data, {
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          this.setState({
            loadingPercent: Math.round((100 * event.loaded) / event.total)
          })
        }
      }
    )
      .then(async (response) => {
        if (response.data.success) {
          this.setState({loading: false});
          this.props.history.push(BASE_URL + '/manage-products');
          CommonFunc.notifyMessage(msg, 1);
        } else {
          this.setState({loading: false});
          CommonFunc.notifyMessage(response.data.message)
        }
      })
      .catch(async (error) => {
        this.setState({loading: false});
        CommonFunc.notifyMessage(error.message, 0);
      });
  }

  /**
   * update book
   */
  updateBook = () => {

    const bookName = this.state.title;
    // const author = this.state.author;
    // const description = this.state.description;
    bookName.valid = Validation.textFieldValidator(this.state.title.value, 1)
    // author.valid = Validation.textFieldValidator(this.state.author.value, 1)
    // description.valid = Validation.textFieldValidator(this.state.description.value, 1)
    this.setState({title: bookName})

    if (!bookName.valid) {
      CommonFunc.notifyMessage('Please Enter Book Title', 0)
    } else if (this.state.selectedPackages.length === 0 && !this.state.asPackageSelect) {
      CommonFunc.notifyMessage('Please Select Packages', 0)
    } else if (this.state.language.value === '') {
      CommonFunc.notifyMessage('Please Select Language', 0)
    // } else if (this.state.category.value === '') {
    //   CommonFunc.notifyMessage('Please Select Book Category', 0)
    // } else if (this.state.category.value === 'EDUCATIONAL_BOOK' && this.state.grade.value === '') {
    //   CommonFunc.notifyMessage('Please Select Your Grade', 0)
    } else if (this.state.src === null) {
      CommonFunc.notifyMessage('Cover Image Not Found', 0)
    } else {
      let data = new FormData()
      this.setState({loading: true});
      if (!this.state.asFormEdit) {
        data.append('zipFolder', this.state.file)
      }
      data.append('title', this.state.title.value)
      data.append('coverImageBase64', !this.state.asImageEdit ? this.state.imgBase64 : null)
      data.append('author', this.state.author.value)
      data.append('description', this.state.description.value)
      data.append('language', this.state.language.value)
      // if (!this.state.asPackageSelect) {
      data.append('packageIds', this.packageIdString(this.state.selectedPackages))
      // }
      data.append('bookStatus', this.state.bookStatus)
      data.append('bookId', this.state.bookId)
      data.append('bookType', 'STORY_BOOK')
      // data.append('bookType', this.state.category.value)
      // if (this.state.category.value === 'EDUCATIONAL_BOOK') {
      //   data.append('grade', this.state.grade.value)
      // }

      // BookService.updateBook(data)
      //   .then(response => {
      //     if (response.success) {
      //       this.setState({loading: false});
      //       this.props.history.push(BASE_URL + '/manage-story-books');
      //     } else {
      //       this.setState({loading: false});
      //       CommonFunc.notifyMessage(response.message);
      //     }
      //   })
      //   .catch(error => {
      //     this.setState({loading: false});
      //     CommonFunc.notifyMessage(error.message, error.status);
      //   })
      this.fetchAPI('put', 'web/admin/book/update', data, 'Book has been successfully updated!')
    }


  }

  packageIdString = (val) => {
    let value = '';
    for (let i = 0; i < val.length; i++) {
      value += val[i].packageId + ','
    }
    let n = value.lastIndexOf(",");
    return value.substring(0, n)
  }

  /**
   * input text change method
   * */
  onTextChange = (event) => {
    let name = event.target.name;
    let item = this.state[name];
    item.value = event.target.value;
    item.valid = true;
    if (name === 'category') {
      this.setState({
        grade: {
          value: '',
          valid: true
        },
      })
    }
    this.setState({
      [name]: item,
    });
  }

  onSelect = (selectedList, selectedItem) => {
    this.setState({selectedPackages: selectedList})
    console.log(selectedList)
  }

  onRemove(selectedList, removedItem) {
    this.setState({selectedPackages: selectedList})
  }


  render() {
    const {crop, croppedImageUrl, src, title, author, description, packagesList, language, zipFolder, selectedPackages, asImageEdit, file, asEdit, asFormEdit, loading, loadingPercent, category, grade} = this.state;

    return (
      <div>
        <Card>
          <CardHeader>
            <strong>Add New Book</strong>
          </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Book Title</Label>
                  <span style={{color: 'red', marginLeft: 10}}>*</span>
                </Col>
                <Col xs="12" md="9">
                  {/*<Input type="text"  name="text-input" placeholder="Book Title"/>*/}
                  <Input type="text" id="inputIsInValid" name="title" placeholder="Book Title"
                         onChange={this.onTextChange} value={title.value}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Select Package</Label>
                  <span style={{color: 'red', marginLeft: 10}}>*</span>
                </Col>
                <Col xs="12" md="9">
                  {/*<Input type="select" name="select" id="select">*/}
                  {/*  <option value="0">Please select package</option>*/}
                  {/*  {packageList}*/}
                  {/*</Input>*/}
                  <Multiselect
                    selectedValues={selectedPackages}
                    options={packagesList}
                    onSelect={this.onSelect}
                    onRemove={this.onRemove}
                    displayValue="name"
                    placeholder={'Select Packages'}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Select Language</Label>
                  <span style={{color: 'red', marginLeft: 10}}>*</span>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="language" onChange={this.onTextChange}>
                    <option value="" disabled={language.value !== ''}>Please select language</option>
                    <option value="ENGLISH" selected={language.value === 'ENGLISH'}>English</option>
                    <option value="SINHALA" selected={language.value === 'SINHALA'}>Sinhala</option>
                    <option value="OTHER" selected={language.value === 'OTHER'}>Other</option>
                  </Input>
                </Col>
              </FormGroup>

              {/*<FormGroup row>*/}
              {/*  <Col md="3">*/}
              {/*    <Label htmlFor="select">Select Book Category</Label>*/}
              {/*    <span style={{color: 'red', marginLeft: 10}}>*</span>*/}
              {/*  </Col>*/}
              {/*  <Col xs="12" md="9">*/}
              {/*    <Input type="select" name="category" onChange={this.onTextChange}>*/}
              {/*      <option value="" disabled={category.value !== ''}>Please select book category</option>*/}
              {/*      <option value="STORY_BOOK" selected={category.value === 'STORY_BOOK'}>Story Book</option>*/}
              {/*      <option value="EDUCATIONAL_BOOK" selected={category.value === 'EDUCATIONAL_BOOK'}>Educational Book*/}
              {/*      </option>*/}
              {/*    </Input>*/}
              {/*  </Col>*/}
              {/*</FormGroup>*/}

              {category.value === 'EDUCATIONAL_BOOK' && (
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="select">Select Grade</Label>
                    <span style={{color: 'red', marginLeft: 10}}>*</span>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="select" name="grade" onChange={this.onTextChange}>
                      <option value="" disabled={grade.value !== ''}>Please select grade</option>
                      {[...Array(11)].map((x, i) =>
                        <option value={`GRADE${i + 1}`}
                                selected={grade.value === `GRADE${i + 1}`}>{`Grade ${i + 1}`}</option>
                      )}
                    </Input>
                  </Col>
                </FormGroup>
              )}

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email-input">Author Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="author" placeholder="Author Name" onChange={this.onTextChange}
                         value={author.value}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="textarea-input">Description</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="textarea" name="description" rows="9"
                         placeholder="Description..." onChange={this.onTextChange} value={description.value}
                         maxlength="256"/>
                </Col>
              </FormGroup>

              {/*<FormGroup row>*/}
              {/*  <Col md="3"><Label>Checkboxes</Label></Col>*/}
              {/*  <Col md="9">*/}
              {/*    <FormGroup check className="checkbox">*/}
              {/*      <Input className="form-check-input" type="checkbox" id="checkbox1" name="checkbox1"*/}
              {/*             value="option1"/>*/}
              {/*      <Label check className="form-check-label" htmlFor="checkbox1">Option 1</Label>*/}
              {/*    </FormGroup>*/}
              {/*    <FormGroup check className="checkbox">*/}
              {/*      <Input className="form-check-input" type="checkbox" id="checkbox2" name="checkbox2"*/}
              {/*             value="option2"/>*/}
              {/*      <Label check className="form-check-label" htmlFor="checkbox2">Option 2</Label>*/}
              {/*    </FormGroup>*/}
              {/*    <FormGroup check className="checkbox">*/}
              {/*      <Input className="form-check-input" type="checkbox" id="checkbox3" name="checkbox3"*/}
              {/*             value="option3"/>*/}
              {/*      <Label check className="form-check-label" htmlFor="checkbox3">Option 3</Label>*/}
              {/*    </FormGroup>*/}
              {/*  </Col>*/}
              {/*</FormGroup>*/}
              {/*<FormGroup row>*/}
              {/*  <Col md="3">*/}
              {/*    <Label>Inline Checkboxes</Label>*/}
              {/*  </Col>*/}
              {/*  <Col md="9">*/}
              {/*    <FormGroup check inline>*/}
              {/*      <Input className="form-check-input" type="checkbox" id="inline-checkbox1" name="inline-checkbox1"*/}
              {/*             value="option1"/>*/}
              {/*      <Label className="form-check-label" check htmlFor="inline-checkbox1">One</Label>*/}
              {/*    </FormGroup>*/}
              {/*    <FormGroup check inline>*/}
              {/*      <Input className="form-check-input" type="checkbox" id="inline-checkbox2" name="inline-checkbox2"*/}
              {/*             value="option2"/>*/}
              {/*      <Label className="form-check-label" check htmlFor="inline-checkbox2">Two</Label>*/}
              {/*    </FormGroup>*/}
              {/*    <FormGroup check inline>*/}
              {/*      <Input className="form-check-input" type="checkbox" id="inline-checkbox3" name="inline-checkbox3"*/}
              {/*             value="option3"/>*/}
              {/*      <Label className="form-check-label" check htmlFor="inline-checkbox3">Three</Label>*/}
              {/*    </FormGroup>*/}
              {/*  </Col>*/}
              {/*</FormGroup>*/}
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="file-input">Cover Page <label className="text-muted">(960 x 600)</label></Label>
                  <span style={{color: 'red', marginLeft: 10}}>*</span>
                </Col>
                <Col xs="12" md="5">
                  {asImageEdit ?
                    <div className={"EditableStyle"} onClick={() => this.setState({asImageEdit: false})}>
                      <img src={src} alt="" width={'100%'} height={'100%'}/>
                      <i className="cui-cloud-upload icons font-2xl"></i>
                    </div>
                    :
                    <div className={"App"}>
                      {this.state.drop ? (
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
                      ) : src && (
                        <div style={{width: '100%', height: 250}}>
                          <Cropper
                            image={this.state.src}
                            crop={this.state.crop}
                            zoom={this.state.zoom}
                            aspect={this.state.aspect}
                            onCropChange={this.onCropChange}
                            onCropComplete={this.onCropComplete}
                            onZoomChange={this.onZoomChange}
                            style={{containerStyle: {marginLeft: 12}}}
                          />
                        </div>

                      )}
                    </div>
                  }
                </Col>
                <Col xs="12" md="4">
                  {croppedImageUrl && (
                    <div style={{marginLeft: 20}}>
                      <h6>Preview</h6>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{width: 280, height: 200}}>
                          <img alt={crop} className={"ReactCrop"} src={croppedImageUrl}/>
                        </div>
                        <div className="closeBtn" onClick={() => this.clear()}>╳</div>
                      </div>
                    </div>


                  )}
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="file-input">File Input</Label>
                  <span style={{color: 'red', marginLeft: 10}}>*</span>
                </Col>
                <Col xs="12" md="5">
                  <div className={"App"}>
                    <Dropzone
                      onDrop={this.dropFile}
                      accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                      // accept="application/zip"
                      // minSize={1024}
                      // maxSize={3072000}
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
                            <input {...getInputProps()}/>
                            <span>{isDragActive ? "📂" : "📁"}</span>
                            <p>Drag'n'drop or click to select files</p>
                            <strong>Files:{!asFormEdit ? file.name : zipFolder}</strong>
                          </div>
                        );
                      }}
                    </Dropzone>
                  </div>
                </Col>
              </FormGroup>
              {/*<FormGroup row>*/}
              {/*  <Col md="3">*/}
              {/*    <Label htmlFor="file-multiple-input">Multiple File input</Label>*/}
              {/*  </Col>*/}
              {/*  <Col xs="12" md="9">*/}
              {/*    <Input type="file" id="file-multiple-input" name="file-multiple-input" multiple/>*/}
              {/*  </Col>*/}
              {/*</FormGroup>*/}
              {/*<FormGroup row hidden>*/}
              {/*  <Col md="3">*/}
              {/*    <Label className="custom-file" htmlFor="custom-file-input">Custom file input</Label>*/}
              {/*  </Col>*/}
              {/*  <Col xs="12" md="9">*/}
              {/*    <Label className="custom-file">*/}
              {/*      <Input className="custom-file" type="file" id="custom-file-input" name="file-input"/>*/}
              {/*      <span className="custom-file-control"></span>*/}
              {/*    </Label>*/}
              {/*  </Col>*/}
              {/*</FormGroup>*/}
            </Form>
            <div className="card-header-actions" onClick={() => !asEdit ? this.saveBookHandler() : this.updateBook()}>
              <Button color="primary" className="btn-pill shadow">{!asEdit ? 'Add Book' : 'Update Book'}</Button>
            </div>
            <div className="card-header-actions" style={{marginRight: 10}}>
              <Button color="danger" className="btn-pill shadow"
                      onClick={() => this.props.history.push(BASE_URL + '/manage-products')}>Cancel</Button>
            </div>

          </CardBody>


          {/*<CardFooter>*/}
          {/*  <div className="card-header-actions">*/}
          {/*    <Button type="submit" size="md" color="primary" style={{marginRight:10}}><i className="fa fa-dot-circle-o"></i> Submit</Button>*/}
          {/*    <Button type="reset" size="md" color="danger"><i className="fa fa-ban"></i> Reset</Button>*/}
          {/*  </div>*/}
          {/*</CardFooter>*/}
        </Card>
        <PageLoading loading={loading} loadingPercent={loadingPercent}/>
      </div>
    );
  }
}

export default NewBooksForm;

