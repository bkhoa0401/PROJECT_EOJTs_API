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


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBZRXJdcBsa3i0QXfFKsvNxWhn_1mKjmmc",
    authDomain: "eojts-ddc9e.firebaseapp.com",
    databaseURL: "https://eojts-ddc9e.firebaseio.com",
    projectId: "eojts-ddc9e",
    storageBucket: "gs://eojts-ddc9e.appspot.com",
    messagingSenderId: "365126484633",
    appId: "1:365126484633:web:623e362d3746d457"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const storage = firebase.storage();

class Company extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            image: null,
            logo: '',
            business_name: '',
            business_eng_name: '',
            business_overview: '',
            email: '',
            business_address: '',
            business_phone: '',
            business_website: ''
        }
    }

    async componentDidMount() {
        const business = await ApiServices.Get("/business/getBusiness");

        if (business != null) {
            this.setState({
                logo: business.logo,
                business_name: business.business_name,
                business_eng_name: business.business_eng_name,
                business_overview: business.business_overview,
                email: business.email,
                business_address: business.business_address,
                business_phone: business.business_phone,
                business_website: business.business_website
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleChange = (event) => {
        if (event.target.files[0]) {
            const image = event.target.files[0];
            var output = document.getElementById('img_logo');
            output.src = URL.createObjectURL(image);
            this.setState({
                image: image
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            logo: '',
            business_name: '',
            business_eng_name: '',
            business_overview: '',
            email: '',
            business_address: '',
            business_phone: '',
            business_website: ''
        })
    }

    uploadImageToFireBase = async () => {
        let { image } = this.state;

        const uploadTask = await storage.ref(`images/${image.name}`).put(image);
        await storage.ref('images').child(image.name).getDownloadURL().then(url => {
            this.setState({
                logo: url
            })
        })
        // uploadTask.on('state_changed',
        //     (snapshot) => {
        //         // progress function
        //     },
        //     (error) => {
        //         console.log(error);
        //     },
        //     () => {
        //         //complete function
        //         storage.ref('images').child(image.name).getDownloadURL().then(url => {
        //             this.setState({
        //                 logo: url
        //             })
        //             console.log("logo", this.state.logo);
        //         })
        //     })
    }

    saveBusiness = async () => {
        let { logo, business_name, business_eng_name, business_overview, email,
            business_address, business_phone, business_website } = this.state;

        if (this.validator.allValid()) {
            var company = {
                logo, business_name, business_eng_name, business_overview, email,
                business_address, business_phone, business_website
            }

            const result = await ApiServices.Put('/business/updateBusiness', company);

            if (result.status == 200) {
                Toastify.actionSuccess('Cập nhật thông tin thành công');
            } else {
                Toastify.actionFail('Cập nhật thông tin thất bại');
            }

        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    handleSubmit = async () => {
        await this.uploadImageToFireBase();
        await this.saveBusiness();
    }

    render() {
        const { logo, business_name, business_eng_name, business_overview, email,
            business_address, business_phone, business_website } = this.state;
        return (
            <div className="animated fadeIn">
                <ToastContainer />
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <h4>Thông tin công ty</h4>
                                {/* <Col xs="3" sm="3">
                                    <Button style={{ marginLeft: "800px" }} block color="primary" onClick={() => this.handleDirect("/company/update")}>Chỉnh sửa</Button>
                                </Col> */}
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Logo</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <img src={logo} style={{ width: "750px", height: "400px" }} onChange={this.handleInput} type="file" id="img_logo" name="logo" />
                                            <br /><br />
                                            <input onChange={this.handleChange} type="file" />
                                            <br /><br />
                                            {/* <span className="form-error is-visible text-danger">
                                                    {this.validator.message('logo', logo, 'required')}
                                                </span> */}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Email</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input readOnly="true" value={email} onChange={this.handleInput} type="text" id="email" name="email" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('email', email, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên doanh nghiệp</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_name} onChange={this.handleInput} type="text" id="business_name" name="business_name" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('business_name', business_name, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên tiếng Anh</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_eng_name} onChange={this.handleInput} type="text" id="business_eng_name" name="business_eng_name" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('business_eng_name', business_eng_name, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Giới thiệu</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_overview} onChange={this.handleInput} type="text" id="business_overview" name="business_overview" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('business_overview', business_overview, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Địa chỉ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_address} onChange={this.handleInput} type="text" id="business_address" name="business_address" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('business_address', business_address, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>SĐT</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_phone} onChange={this.handleInput} type="number" id="business_phone" name="business_phone" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('business_phone', business_phone, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Website</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_website} onChange={this.handleInput} type="text" id="business_website" name="business_website" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('business_website', business_website, 'required')}
                                            </span>
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
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Xác nhận</Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                    </Col>
                                    {/* <Col xs="3" sm="3">
                                        <Button color="success" block onClick={() => this.handleDirect("/company")} type="reset">Trở về</Button>
                                    </Col> */}
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Company;
