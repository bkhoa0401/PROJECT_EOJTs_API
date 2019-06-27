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

class Skill_Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            status: 'true',
            specializeds: [],
            specializedItem: {},
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
            setTimeout(
                function () {
                    this.props.history.push('/skill');
                }
                    .bind(this),
                2000
            );
        } else {
            Toastify.actionFail("Tạo kỹ năng mới thất bại!");
        }
    }


    render() {
        const { specializeds, specializedItem } = this.state;
        return (
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
                                    <Col xs="3" sm="3">
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Tạo kỹ năng</Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="success" block onClick={() => this.handleDirect('/skill')}>Trở về</Button>
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

export default Skill_Create;
