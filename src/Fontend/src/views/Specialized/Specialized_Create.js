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

class Specialized_Create extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            name: '',
            status: 'true',
            loading: false
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        if (name.includes('name')) {
            await this.setState({
                name: value,
            })
        }
    }


    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            name: '',
        })
    }

    handleConfirm = () => {
        const { name } = this.state;
        if (this.validator.allValid()) {
            confirmAlert({
                title: 'Xác nhận',
                message: `Bạn chắc chắn muốn tạo chuyên ngành '${name}' ?`,
                buttons: [
                    {
                        label: 'Xác nhận',
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

    handleSubmit = async () => {
        this.setState({
            loading: true
        })
        const { name, status } = this.state;
        const specialized = {
            name,
            status,
        }

        const result = await ApiServices.Post('/specialized', specialized);
        if (result.status == 200) {
            Toastify.actionSuccess("Tạo chuyên ngành mới thành công!");
            this.setState({
                loading: false
            })
        } else {
            Toastify.actionFail("Tạo chuyên ngành mới thất bại!");
            this.setState({
                loading: false
            })
        }
    }


    render() {
        const { loading } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Tạo chuyên ngành mới</strong>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label htmlFor="name">Tên chuyên ngành</Label>
                                                </Col>
                                                <Col xs="12" md="10">
                                                    <Input value={this.state.name} onChange={this.handleInput} type="text" id="name" name="name" placeholder="Nhập tên chuyên ngành" />
                                                    <span className="form-error is-visible text-danger">
                                                        {this.validator.message('Tên chuyên ngành', this.state.name, 'required|max:20')}
                                                    </span>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                        <ToastContainer />
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Row>
                                            <Col xs="3" sm="3">
                                                <Button onClick={() => this.handleConfirm()} type="submit" color="primary" block>Tạo chuyên ngành</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button color="success" block onClick={() => this.handleDirect('/specialized')}>Trở về</Button>
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

export default Specialized_Create;
