import React, { Component } from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Fade,
    Form,
    FormGroup,
    FormText,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    InputGroupText,
    Label,
    Row,
} from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SimpleReactValidator from '../../validator/simple-react-validator';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class User_Business_Create extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: false,
            email: '',
            business_address: '',
            business_eng_name: '',
            business_name: '',
            business_overview: '',
            business_phone: '',
            business_website: ''
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
            email: '',
            business_address: '',
            business_eng_name: '',
            business_name: '',
            business_overview: '',
            business_phone: '',
            business_website: ''
        })
    }

    handleSubmit = async () => {
        const { email, business_address, business_eng_name, business_name,
            business_overview, business_phone, business_website } = this.state;
        const business = {
            email,
            business_address,
            business_eng_name,
            business_name,
            business_overview,
            business_phone,
            business_website
        }

        console.log(business);

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })
            const result = await ApiServices.Post('/business/new', business);
            if (result.status == 201) {
                Toastify.actionSuccess("Tạo tài khoản mới thành công!");
                this.setState({
                    loading: false
                })
            } else {
                Toastify.actionFail("Tạo tài khoản mới thất bại!");
                this.setState({
                    loading: false
                })
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    render() {
        const { email, business_address, business_eng_name, business_name,
            business_overview, business_phone, business_website, loading } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Tạo tài khoản mới</strong>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="email">Email</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={email} onChange={this.handleInput} type="text" name="email" placeholder="Email" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('email', email, 'required')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_name">Tên doanh nhiệp</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_name} onChange={this.handleInput} type="text" name="business_name" placeholder="Tên doanh nghiệp" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên doanh nghiệp', business_name, 'required|min:7|max:50|alpha_num_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_eng_name">Tên tiếng anh</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_eng_name} onChange={this.handleInput} type="text" name="business_eng_name" placeholder="Tên tiếng anh" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên tiếng Anh', business_eng_name, 'required|min:3|max:15|alpha_num_space')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_overview">Giới thiệu</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={business_overview}
                                                        onChange={(event, editor) => {
                                                            this.setState({
                                                                business_overview: editor.getData(),
                                                            })
                                                        }}
                                                    />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Giới thiệu', business_overview, 'required|max:255')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_website">Website</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_website} onChange={this.handleInput} type="text" name="business_website" placeholder="Website" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Website của doanh nghiệp', business_website, 'required|min:5|max:20')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_phone">SĐT</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_phone} onChange={this.handleInput} type="number" name="business_phone" placeholder="Số điện thoại" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Số điện thoại', business_phone, 'required|min:10|max:11|numeric')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="business_address">Địa chỉ</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={business_address} onChange={this.handleInput} type="text" name="business_address" placeholder="Địa chỉ" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Địa chỉ', business_address, 'required|min:7|max:100|alpha_num_dot_splash')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="3" sm="3">
                                                <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Tạo tài khoản</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button color="success" block onClick={() => this.handleDirect('/admin_account/businessList')}>Trở về</Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default User_Business_Create;
