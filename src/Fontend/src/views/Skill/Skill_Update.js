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

class Skill_Update extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            status: '',
            specializeds: [],
            specializedItem: {},
        }
    }

    async componentDidMount() {
        const updatedId = window.location.href.split("/").pop();
        const skill = await ApiServices.Get(`/skill/id?id=${updatedId}`);
        const specializeds = await ApiServices.Get('/specialized');
        if (specializeds != null) {
            this.setState({
                id: skill.id,
                name: skill.name,
                status: skill.status,
                specializeds,
                specializedItem: skill.specialized,
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
        const { id, name, status, specializedItem } = this.state;
        const specialized = {
            id: specializedItem.id
        }
        const skill = {
            id,
            name,
            status,
            specialized
        }

        const result = await ApiServices.Put('/skill', skill);
        if (result.status == 200) {
            Toastify.actionSuccess("Cập nhật kỹ năng thành công!");
            setTimeout(
                function () {
                    this.props.history.push('/skill');
                }
                    .bind(this),
                2000
            );
        } else {
            Toastify.actionFail("Cập nhật kỹ năng thất bại!");
        }
    }


    render() {
        const { specializeds, specializedItem } = this.state;
        console.log(specializedItem);
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Cập nhật kỹ năng</strong>
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
                                                        <option key={i} value={i} selected={specialized.id == specializedItem.id}>{specialized.name}</option>
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
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Cập nhật</Button>
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

export default Skill_Update;
