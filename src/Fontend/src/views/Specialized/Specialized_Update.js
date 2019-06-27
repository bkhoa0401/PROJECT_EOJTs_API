import React, { Component } from 'react';
import moment from 'moment';
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

class Specialized_Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            status: '',
        }
    }



    async componentDidMount() {
        const updatedId = window.location.href.split("/").pop();
        const specialized = await ApiServices.Get(`/specialized/id?id=${updatedId}`);

        this.setState({
            id: specialized.id,
            name: specialized.name,
            status: specialized.status,
        });
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

    handleSubmit = async () => {
        const { id, name, status } = this.state;
        const specialized = {
            id,
            name,
            status,
        }
        const result = await ApiServices.Put('/specialized', specialized);
        if (result) {
            Toastify.actionSuccess("Cập nhật chuyên ngành thành công");
            setTimeout(
                function () {
                    this.props.history.push('/specialized');
                }
                    .bind(this),
                2000
            );
        } else {
            Toastify.actionFail("Cập nhật chuyên ngành thất bại!");
        }

    }
    render() {

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Cập nhật chuyên ngành</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="name">Tên chuyên ngành</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={this.state.name} onChange={this.handleInput} type="text" id="name" name="name" placeholder="Nhập tên chuyên ngành" />
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Cập nhật</Button>
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
        );
    }
}

export default Specialized_Update;
