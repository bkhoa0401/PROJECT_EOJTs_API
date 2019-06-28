import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import AuthService from '../../../service/auth-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../Toastify/Toastify';
import { async } from 'q';
import decode from 'jwt-decode';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  handleInput = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    });
  }

  handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit = async () => {
    const { email, password } = this.state;
    const result = await AuthService.login(email, password);

    if (result) {
      const token = localStorage.getItem('id_token');
      const decoded = decode(token);
      const role = decoded.role;

      if (role === 'ROLE_ADMIN') {
        this.props.history.push('/admin');
      } else if (role === 'ROLE_HR') {
        this.props.history.push('/hr');
      } else if (role === 'ROLE_SUPERVISOR') {
        this.props.history.push('/supervisor');
      }

    } else {
      Toastify.actionFail("Incorrect Email Or Password!");
    }
  }

  handForgotPassword = async () => {
    this.props.history.push('/forgotpassword');
  }

  // componentWillMount() {
  //   localStorage.clear();
  // }

  render() {
    const { email, password } = this.state;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Đăng nhập</h1>
                      <p className="text-muted">Tài khoản của bạn</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input onChange={this.handleInput} value={email} type="email" placeholder="Email" autoComplete="email" name='email' />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input onChange={this.handleInput} onKeyDown={this.handleKeyDown} value={password} type="password" placeholder="Mật khẩu" autoComplete="current-password" name='password' />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button onClick={this.handleSubmit} color="primary" className="px-4">Đăng nhập</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0" onClick={this.handForgotPassword}>Quên mật khẩu?</Button>
                        </Col>
                      </Row>
                    </Form>
                    <ToastContainer />
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Hệ thống quản lí OJT</h2>
                      <img style={{width: '300px', height:'110px'}} src="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410"/>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
