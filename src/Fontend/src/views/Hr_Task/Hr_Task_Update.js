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

class Hr_Task_Update extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            description: '',
            time_end: '',
            level_task: 'Easy',
            priority: '',
            state: '',
            students: [],
            studentItem: {},
        }
    }

    async componentDidMount() {
        const id = window.location.href.split("/").pop();
        const task = await ApiServices.Get(`/supervisor/task?id=${id}`);
        const students = await ApiServices.Get('/supervisor/students');

        if (students != null) {
            this.setState({
                students,
            });
        }

        if (task != null) {
            this.setState({
                id: task.id,
                title: task.title,
                description: task.description,
                time_end: task.time_end,
                level_task: task.level_task,
                priority: task.priority,
                state: task.status,
                studentItem: task.ojt_enrollment.student
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
        } else {
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
            level_task: 'Easy',
            priority: '',
            studentItem: this.state.students[0],
        })
    }

    handleSubmit = async () => {
        const { id, title, description, time_end, level_task, priority, state, studentItem } = this.state;
        const emailStudent = studentItem.email;
        const task = {
            id,
            title,
            description,
            time_end,
            level_task,
            priority,
            state,
        }

        console.log('TASK', task);

        const result = await ApiServices.Put(`/supervisor/task?emailStudent=${emailStudent}`, task);
        if (result.status == 200) {
            Toastify.actionSuccess("Chỉnh sửa nhiệm vụ thành công!");
        } else {
            Toastify.actionFail("Chỉnh sửa nhiệm vụ thất bại!");
        }
    }


    render() {
        const { id, title, description, time_end, level_task, priority, students, studentItem } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Cập nhật nhiệm vụ</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="title">Tên nhiệm vụ</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={title} onChange={this.handleInput} type="text" id="title" name="title" placeholder="Tên nhiệm vụ" />
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
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="time_end">Thời hạn hoàn thành</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={time_end} onChange={this.handleInput} type="date" id="time_end" name="time_end" placeholder="Thời hạn hoàn thành" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="level_task">Mức độ</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {/* <Input value={level_task} onChange={this.handleInput} type="text" id="level_task" name="level_task" placeholder="Mức độ" /> */}
                                            <Input onChange={this.handleInput} type="select" name="level_task">
                                                <option selected={level_task === 'Easy'} value='Easy'>Dễ</option>
                                                <option selected={level_task === 'Normal'} value='Normal'>Bình thường</option>
                                                <option selected={level_task === 'Difficult'} value='Difficult'>Khó</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <Label htmlFor="priority">Độ ưu tiên</Label>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={priority} onChange={this.handleInput} type="number" id="priority" name="priority" placeholder="Độ ưu tiên" />
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
                                        <Button color="success" block onClick={() => this.handleDirect(`/hr-task/details/${id}`)}>Trở về</Button>
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

export default Hr_Task_Update;
