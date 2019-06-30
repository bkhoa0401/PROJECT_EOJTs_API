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

class User_Business_Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

        const result = await ApiServices.Post('/business/new', business);
        if (result.status == 201) {
            Toastify.actionSuccess("Tạo tài khoản mới thành công!");
            setTimeout(
                function () {
                    this.props.history.push('/admin_account/businessList');
                }
                    .bind(this),
                2000
            );
        } else {
            Toastify.actionFail("Tạo tài khoản mới thất bại!");
        }
    }


    render() {
        const { email, business_address, business_eng_name, business_name,
            business_overview, business_phone, business_website } = this.state;
        return (
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
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="business_name">Tên doanh nhiệp</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_name} onChange={this.handleInput} type="text" name="business_name" placeholder="Tên doanh nghiệp" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="business_eng_name">Tên tiếng anh</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_eng_name} onChange={this.handleInput} type="text" name="business_eng_name" placeholder="Tên tiếng anh" />
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
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="business_website">Website</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_website} onChange={this.handleInput} type="text" name="business_website" placeholder="Website" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="business_phone">SĐT</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_phone} onChange={this.handleInput} type="number" name="business_phone" placeholder="Số điện thoại" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="business_address">Địa chỉ</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={business_address} onChange={this.handleInput} type="text" name="business_address" placeholder="Địa chỉ" />
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
        );
    }
}

export default User_Business_Create;
