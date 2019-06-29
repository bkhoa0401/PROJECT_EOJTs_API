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
import Toastify from '../../views/Toastify/Toastify';

class Account_Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            phone: '',
            address: '',
            active: true
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
            name: '',
            phone: '',
            address: ''
        })
    }

    handleSubmit = async () => {
        const { email, name, phone, address, active } = this.state;
        const supervisor = {
            email,
            name,
            phone,
            address,
            active
        }

        console.log(supervisor);

        const result = await ApiServices.Post('/business/createSupervisor', supervisor);
        if (result.status == 201) {
            Toastify.actionSuccess("Tạo tài khoản mới thành công!");
            setTimeout(
                function () {
                    this.props.history.push('/manage_account');
                }
                    .bind(this),
                2000
            );
        } else {
            Toastify.actionFail("Tạo tài khoản mới thất bại!");
        }
    }


    render() {
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
                                            <Input value={this.state.email} onChange={this.handleInput} type="text" name="email" placeholder="Email" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="email">Họ Tên</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.name} onChange={this.handleInput} type="text" name="name" placeholder="Họ và tên" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="phone">SĐT</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.phone} onChange={this.handleInput} type="number" name="phone" placeholder="Số điện thoại" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="address">Địa chỉ </Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.address} onChange={this.handleInput} type="text" name="address" placeholder="Địa chỉ" />
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
                                        <Button color="success" block onClick={() => this.handleDirect('/manage_account')}>Trở về</Button>
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

export default Account_Create;
