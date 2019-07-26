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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SimpleReactValidator from '../../validator/simple-react-validator';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Skill_Create extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            name: '',
            status: 'true',
            specializeds: [],
            specializedItem: {},
            loading: true
        }
    }

    async componentDidMount() {
        const specializeds = await ApiServices.Get('/specialized');
        if (specializeds != null) {
            this.setState({
                specializeds,
                specializedItem: specializeds[0],
                loading: false
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        const { specializeds } = this.state;
        if (name.includes('name')) {
            await this.setState({
                name: value
            })
        } else if (name.includes('specialized')) {
            await this.setState({
                specializedItem: specializeds[value]
            })
        }
        console.log(this.state.specializedItem);
    }


    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            name: '',
            specializedItem: this.state.specializeds[0],
        })
    }

    handleSubmit = async () => {
        this.setState({
            loading: true
        })
        const { name, status, specializedItem } = this.state;
        const specialized = {
            id: specializedItem.id
        }
        const skill = {
            name,
            status,
            specialized
        }

        const result = await ApiServices.Post('/skill', skill);
        if (result.status == 200) {
            Toastify.actionSuccess("Tạo kỹ năng mới thành công!");
            this.setState({
                loading: false
            })
        } else {
            Toastify.actionFail("Tạo kỹ năng mới thất bại!");
            this.setState({
                loading: false
            })
        }
    }

    handleConfirm = () => {
        const { name, specializedItem } = this.state;
        console.log(name, specializedItem);

        if (this.validator.allValid()) {
            confirmAlert({
                title: 'Xác nhận',
                message: `Bạn chắc chắn muốn tạo kỹ năng '${name}' thuộc ngành '${specializedItem.name}' ?`,
                buttons: [
                    {
                        label: 'Đồng ý',
                        onClick: () => this.handleSubmit()
                    },
                    {
                        label: 'Hủy bỏ',
                    }
                ]
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    };


    render() {
        const { specializeds, specializedItem, loading } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Tạo kỹ năng mới</strong>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="name">Tên kỹ năng</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.name} onChange={this.handleInput} type="text" id="name" name="name" placeholder="Nhập tên kỹ năng" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên kỹ năng', this.state.name, 'required|max:20')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="specialized">Ngành</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input onChange={this.handleInput} type="select" name="specialized">
                                                        {specializeds && specializeds.map((specialized, i) => {
                                                            return (
                                                                <option value={i} selected={specializedItem.id == i + 1}>{specialized.name}</option>
                                                            )
                                                        })}
                                                    </Input>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="4" sm="4">
                                                <Button color="secondary" block onClick={() => this.handleDirect('/skill')}>Trở về</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button onClick={() => this.handleConfirm()} type="submit" color="primary" block>Tạo kỹ năng</Button>
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

export default Skill_Create;
