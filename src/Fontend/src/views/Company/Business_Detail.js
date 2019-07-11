import React, { Component } from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
import SimpleReactValidator from 'simple-react-validator';
import firebase from 'firebase/app';
import 'firebase/storage';
import { async } from 'q';
import { initializeApp } from '../Invitation/push-notification';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


// // Your web app's Firebase configuration
// var firebaseConfig = {
//     apiKey: "AIzaSyBZRXJdcBsa3i0QXfFKsvNxWhn_1mKjmmc",
//     authDomain: "eojts-ddc9e.firebaseapp.com",
//     databaseURL: "https://eojts-ddc9e.firebaseio.com",
//     projectId: "eojts-ddc9e",
//     storageBucket: "gs://eojts-ddc9e.appspot.com",
//     messagingSenderId: "365126484633",
//     appId: "1:365126484633:web:623e362d3746d457"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);


const storage = firebase.storage();

class Company extends Component {

    constructor(props) {
        super(props);
        this.state = {
            business: null,
        }
    }

    async componentDidMount() {
        const businessEmail = window.location.href.split("/").pop();
        const business = await ApiServices.Get(`/business/business?email=${businessEmail}`);
        if (business != null) {
            this.setState({
                business:business,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { business } = this.state;
        return (
            <div className="animated fadeIn">
                <ToastContainer />
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <h4>Thông tin công ty</h4>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Logo</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {business === null ?
                                                <></> :
                                                <img src={business.logo} style={{ width: "160px", height: "160px" }}/>
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Email</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {business === null ?
                                                <></> :
                                                <Label>{business.email}</Label>
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên doanh nghiệp</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {business === null ?
                                                <></> :
                                                <Label>{business.business_name}</Label>
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên tiếng Anh</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {business === null ?
                                                <></> :
                                                <Label>{business.business_eng_name}</Label>
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>SĐT</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {business === null ?
                                                <></> :
                                                <Label>{business.business_phone}</Label>
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Website</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {business === null ?
                                                <></> :
                                                <Label>{business.business_website}</Label>
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Địa chỉ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {business === null ?
                                                <></> :
                                                <Label>{business.business_address}</Label>
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Giới thiệu</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {business === null ?
                                                <></> :
                                                <Label>{business.business_overview}</Label>
                                            }
                                        </Col>
                                    </FormGroup>
                                    {/* <FormGroup row>
                                        <Col md="2">
                                            <h6>Image</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value="Đây là 1 gallery" onChange={this.handleInput} type="text" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup> */}
                                </Form>
                            </CardBody>
                            <CardFooter className="p-4">
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
                <div style={{ paddingLeft: '45%' }}>
                    <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleDirect('/list_management/business_list')}>
                        Trở về
                    </Button>
                </div>
            </div>
        );
    }
}

export default Company;
