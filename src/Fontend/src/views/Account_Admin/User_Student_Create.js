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

class User_Student_Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            phone: '',
            address: '',
            code: '',
            dob: '',
            gender: 0,
            specializeds: [],
            specializedItem: {},
            semester: '',
            status: 'ing'
        }
    }

    async componentDidMount() {
        const specializeds = await ApiServices.Get('/specialized');
        if (specializeds != null) {
            this.setState({
                specializeds,
                specializedItem: specializeds[0],
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        const { specializeds } = this.state;
        if (name.includes('specialized')) {
            await this.setState({
                specializedItem: specializeds[value]
            })
        } else {
            await this.setState({
                [name]: value,
            })
        }
    }


    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            email: '',
            name: '',
            phone: '',
            address: '',
            code: '',
            dob: '',
            gender: 0,
            specializedItem: this.state.specializeds[0],
            semester: '',
        })
    }

    handleSubmit = async () => {
        const { email, name, phone, address, code, dob, gender, specializedItem, semester, status } = this.state;
        const specialized = {
            id: specializedItem.id
        }
        const student = {
            email,
            name,
            phone,
            address,
            code,
            dob,
            gender,
            specialized,
            semester,
            status
        }

        console.log(student);

        const result = await ApiServices.Post('/student/new', student);
        if (result.status == 201) {
            Toastify.actionSuccess("Tạo tài khoản mới thành công!");
            setTimeout(
                function () {
                    this.props.history.push('/admin_account/studentList');
                }
                    .bind(this),
                2000
            );
        } else {
            Toastify.actionFail("Tạo tài khoản mới thất bại!");
        }
    }


    render() {
        const { specializeds } = this.state;
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
                                            <Label htmlFor="code">MSSV</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.code} onChange={this.handleInput} type="text" name="code" placeholder="Mã số sinh viên" />
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
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="dob">Ngày sinh</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.dob} onChange={this.handleInput} type="date" name="dob" placeholder="Ngày sinh" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="gender">Giới tính</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.gender} onChange={this.handleInput} type="select" name="gender">
                                                <option value={false}>Nữ</option>
                                                <option value={true}>Nam</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="specialized">Chuyên ngành</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input onChange={this.handleInput} type="select" name="specialized">
                                                {specializeds && specializeds.map((specialized, i) => {
                                                    return (
                                                        <option value={i} selected={this.state.specializedItem.id == i + 1}>{specialized.name}</option>
                                                    )
                                                })}
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="semester">Học kì</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.semester} onChange={this.handleInput} type="number" name="semester" placeholder="Học kì" />
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
                                        <Button color="success" block onClick={() => this.handleDirect('/admin_account/studentList')}>Trở về</Button>
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

export default User_Student_Create;