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


class Company extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
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
        console.log("business", business);

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

    handleSubmit = async () => {

        const { logo, business_name, business_eng_name, business_overview, email,
            business_address, business_phone, business_website } = this.state;


        if (this.validator.allValid()) {
            var company = {
                logo, business_name, business_eng_name, business_overview, email,
                business_address, business_phone, business_website
            }

            console.log(company);

            const result = await ApiServices.Put('/business/updateBusiness', company);
            console.log("STATUS", result.status);
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
                                            <img src="https://i-dulich.vnecdn.net/2019/03/16/1-3-1552732057_680x0.jpg" onChange={this.handleInput} type="file" id="logo" name="logo" />
                                            <br /><br />
                                            <Input onChange={this.handleInput} type="file" id="logo" name="logo" />
                                            <br /><br />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('logo', logo, 'required')}
                                            </span>
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
