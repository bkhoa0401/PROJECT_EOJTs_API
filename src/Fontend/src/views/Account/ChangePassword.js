import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import decode from 'jwt-decode';
import SimpleReactValidator from 'simple-react-validator';

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

    handleSubmit = async () => {
        const { newPassword } = this.state;

        if (this.validator.allValid()) {

            console.log("newPassword", newPassword);

            // const result = await ApiServices.Post('/scheduleparameters/', newPassword);
            // if (result != null) {
            //     Toastify.actionSuccess('Tạo các tham số thành công');
            // } else {
            //     Toastify.actionFail('Tạo các tham số thất bại');
            // }

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
                                            <Input type="password" placeholder="Mật khẩu mới" autoComplete="new-password" onChange={this.handleInput} />
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
                                            <Input type="password" placeholder="Nhập lại mật khẩu mới" autoComplete="confirm-password" onChange={this.handleInput} />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Nhập lại mật khẩu mới', this.state.confirmPassword, 'required')}
                                            </span>
                                        </InputGroup>
                                    </Form>
                                </CardBody>
                                <CardFooter className="p-4">
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <Button onClick={() => this.handleSubmit()} color="primary" block>Đặt lại mật khẩu</Button>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <Button type="reset" color="danger" block><span>Reset</span></Button>
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
