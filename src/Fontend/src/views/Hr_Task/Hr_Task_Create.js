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
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SimpleReactValidator from '../../validator/simple-react-validator';

class Hr_Task_Create extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            title: '',
            description: '',
            time_end: '',
            level_task: 'EASY',
            priority: '',
            state: 'NOTSTART',
            students: [],
            studentItem: {},
        }
    }

    async componentDidMount() {
        const students = await ApiServices.Get('/supervisor/students');
        if (students != null) {
            this.setState({
                students,
                studentItem: students[0],
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        const { students } = this.state;
        if (name.includes('student')) {
            await this.setState({
                studentItem: students[value]
            })
        } else if (name.includes('level_task')) {
            await this.setState({
                level_task: value
            })
        }
        else {
            await this.setState({
                [name]: value
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            title: '',
            description: '',
            time_end: '',
            level_task: 'EASY',
            priority: '',
            studentItem: this.state.students[0],
        })
    }

    handleSubmit = async () => {
        const { title, description, time_end, level_task, priority, state, studentItem } = this.state;
        const emailStudent = studentItem.email;
        const task = {
            title,
            description,
            time_end,
            level_task,
            priority,
            state
        }
        console.log(task);

        if (this.validator.allValid()) {
            const result = await ApiServices.Post(`/supervisor?emailStudent=${emailStudent}`, task);
            if (result.status == 201) {
                Toastify.actionSuccess("Tạo nhiệm vụ mới thành công!");
            } else {
                Toastify.actionFail("Tạo nhiệm vụ mới thất bại!");
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    render() {
        const { title, description, time_end, level_task, priority, students, studentItem } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Tạo nhiệm vụ mới</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="title">Tên nhiệm vụ</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={title} onChange={this.handleInput} type="text" id="title" name="title" placeholder="Tên nhiệm vụ" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Tên nhiệm vụ', title, 'required|max:50')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="student">Giao cho</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input onChange={this.handleInput} type="select" name="student">
                                                {students && students.map((student, i) => {
                                                    return (
                                                        <option value={i} selected={studentItem.email === students[i].email}>{student.name}</option>
                                                    )
                                                })}
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="description">Mô tả</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={description}
                                                onChange={(event, editor) => {
                                                    this.setState({
                                                        description: editor.getData(),
                                                    })
                                                }}
                                            />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Mô tả', description, 'required|max:255')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="time_end">Thời hạn hoàn thành</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={time_end} onChange={this.handleInput} type="date" id="time_end" name="time_end" placeholder="Thời hạn hoàn thành" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Thời hạn hoàn thành', description, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="level_task">Mức độ</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {/* <Input value={level_task} onChange={this.handleInput} type="text" id="level_task" name="level_task" placeholder="Mức độ" /> */}
                                            <Input onChange={this.handleInput} type="select" name="level_task">
                                                <option selected={level_task === 'EASY'} value='EASY'>Dễ</option>
                                                <option selected={level_task === 'NORMAL'} value='NORMAL'>Bình thường</option>
                                                <option selected={level_task === 'DIFFICULT'} value='DIFFICULT'>Khó</option>
                                            </Input>
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Mức độ', description, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="priority">Độ ưu tiên</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={priority} onChange={this.handleInput} type="number" id="priority" name="priority" placeholder="Độ ưu tiên" />
                                            <span className="form-error is-visible text-danger">
                                                {/* <i class="fa fa-exclamation-circle" /> */}
                                                {this.validator.message('Độ ưu tiên', description, 'required|numberic')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Tạo nhiệm vụ</Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="success" block onClick={() => this.handleDirect('/hr-task')}>Trở về</Button>
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

export default Hr_Task_Create;
