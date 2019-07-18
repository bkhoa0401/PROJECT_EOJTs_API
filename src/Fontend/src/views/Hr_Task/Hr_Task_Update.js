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
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Hr_Task_Update extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            id: '',
            title: '',
            description: '',
            time_end: '',
            level_task: 'EASY',
            priority: '',
            status: '',
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
                loading: false,
                id: task.id,
                title: task.title,
                description: task.description,
                time_end: task.time_end,
                level_task: task.level_task,
                priority: task.priority,
                status: task.status,
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
            level_task: 'EASY',
            priority: '',
            studentItem: this.state.students[0],
        })
    }

    handleSubmit = async () => {
        const { id, title, description, time_end, level_task, priority, status, studentItem } = this.state;
        const emailStudent = studentItem.email;
        const task = {
            id,
            title,
            description,
            time_end,
            level_task,
            priority,
            status,
        }

        console.log('TASK', task);

        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })

            const result = await ApiServices.Put(`/supervisor/task?emailStudent=${emailStudent}`, task);
            if (result.status == 200) {
                Toastify.actionSuccess("Chỉnh sửa nhiệm vụ thành công!");
                this.setState({
                    loading: false
                })
            } else {
                Toastify.actionFail("Chỉnh sửa nhiệm vụ thất bại!");
                this.setState({
                    loading: false
                })
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    render() {
        const { id, title, description, time_end, level_task, priority, students, studentItem, loading } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
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
                                                        {this.validator.message('Thời hạn hoàn thành', time_end, 'required')}
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
                                                        {this.validator.message('Độ ưu tiên', priority, 'required|numberic')}
                                                    </span>
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
                )
        );
    }
}

export default Hr_Task_Update;
