import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import decode from 'jwt-decode';
import SimpleReactValidator from 'simple-react-validator';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            email: '',
            newPassword: '',
            confirmPassword: '',
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        const decoded = decode(token);
        const email = decoded.email;

        this.setState({
            email
        });
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleReset = async () => {
        this.setState({
            newPassword: '',
            confirmPassword: '',
        })
    }

    handleSubmit = async () => {
        const { newPassword } = this.state;

        if (this.validator.allValid()) {

            const result = await ApiServices.Put(`/user/updatePassword?password=${newPassword}`);
            if (result.status == 200) {
                Toastify.actionSuccess('Cập nhật mật khẩu thành công');
            } else {
                Toastify.actionFail('Cập nhật mật khẩu thất bại');
            }

        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        return (
            <div className="app flex-row">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="9" lg="7" xl="6">
                            <Card className="mx-4">
                                <CardBody className="p-4">
                                    <Form>
                                        <h1>Đổi mật khẩu</h1>
                                        <p className="text-muted">Email khởi tạo mật khẩu mới</p>
                                        {/* <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="Email" autoComplete="Email" />
                                        </InputGroup> */}
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>@</InputGroupText>
                                            </InputGroupAddon>
                                            <Input value={this.state.email} readOnly="true" type="text" placeholder="Email" autoComplete="email" />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" name="newPassword" id="newPassword" placeholder="Mật khẩu mới" autoComplete="new-password" onChange={this.handleInput} />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Mật khẩu mới', this.state.newPassword, 'required')}
                                            </span>
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Nhập lại mật khẩu mới" autoComplete="confirm-password" onChange={this.handleInput} />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Nhập lại mật khẩu mới', this.state.confirmPassword, 'required')}
                                            </span>
                                        </InputGroup>
                                    </Form>
                                    <ToastContainer />
                                </CardBody>
                                <CardFooter className="p-4">
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <Button onClick={() => this.handleSubmit()} color="primary" block>Đặt lại mật khẩu</Button>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <Button type="reset" color="danger" onClick={() => this.handleReset()} type="reset" block><span>Reset</span></Button>
                                        </Col>
                                    </Row>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ChangePassword;
