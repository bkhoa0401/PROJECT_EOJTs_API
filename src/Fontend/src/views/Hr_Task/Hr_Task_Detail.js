import React, { Component } from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Pagination,
    Table
} from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';

class Hr_Task_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            description: '',
            time_created: '',
            time_end: '',
            level_task: '',
            priority: '',
            state: '',
            supervisorName: '',
            studentName: ''
        }
    }


    async componentDidMount() {
        const id = window.location.href.split("/").pop();
        const task = await ApiServices.Get(`/supervisor/task?id=${id}`);

        if (task != null) {
            this.setState({
                id: task.id,
                title: task.title,
                description: task.description,
                time_created: task.time_created,
                time_end: task.time_end,
                level_task: task.level_task,
                priority: task.priority,
                state: task.state,
                supervisorName: task.supervisor.name,
                studentName: task.ojt_enrollment.student.name
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (id, state) => {
        const result = await ApiServices.Put(`/supervisor/stateTask?id=${id}&state=${state}`);

        if (result.status == 200) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");

            const task = await ApiServices.Get(`/supervisor/task?id=${id}`);

            if (task != null) {
                this.setState({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    time_created: task.time_created,
                    time_end: task.time_end,
                    level_task: task.level_task,
                    priority: task.priority,
                    state: task.state,
                    supervisorName: task.supervisor.name,
                    studentName: task.ojt_enrollment.student.name
                });
            }
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    render() {
        const { id, title, description, time_created, time_end, level_task, priority, state, supervisorName,
            studentName } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Chi tiết nhiệm vụ
                            </CardHeader>
                            <CardBody>
                                <div>
                                    {
                                        state.toString().toLowerCase() === 'true' ? (
                                            <div>
                                                <Button style={{ marginLeft: "700px" }} type="submit" color="danger" onClick={() => this.handleUpdateStatus(id, false)}>Đánh dấu nhiệm vụ chưa hoàn thành</Button>
                                                <Button disabled style={{ marginLeft: "5px" }} type="submit" color="primary" onClick={() => this.handleDirect('')}>Chỉnh sửa</Button>
                                            </div>

                                        ) : (
                                                <div>
                                                    <Button style={{ marginLeft: "720px" }} type="submit" color="success" onClick={() => this.handleUpdateStatus(id, true)}>Đánh dấu nhiệm vụ hoàn thành</Button>
                                                    <Button style={{ marginLeft: "5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/hr-task/update/${id}`)}>Chỉnh sửa</Button>
                                                </div>
                                            )
                                    }
                                </div>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên nhiệm vụ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="title" name="title">{title}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Trạng thái</h6>
                                        </Col>
                                        {
                                            state.toString().toLowerCase() === 'true' ?
                                                (<Col xs="12" md="10">
                                                    <Badge color="success">HOÀN THÀNH</Badge>
                                                </Col>)
                                                :
                                                (
                                                    <Col xs="12" md="10">
                                                        <Badge color="danger">CHƯA HOÀN THÀNH</Badge>
                                                    </Col>)
                                        }
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Ngày tạo</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="time_created" name="time_created">{time_created}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Người giao</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="supervisorName" name="supervisorName">{supervisorName}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Sinh viên</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="studentName" name="studentName">{studentName}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Mô tả</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <label dangerouslySetInnerHTML={{ __html: description }} id="description" name="description" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Ngày hết hạn</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="time_end" name="time_end">{time_end}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Mức độ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="level_task" name="level_task">{level_task}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Độ ưu tiên</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="priority" name="priority">{priority}</Label>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr-task")} type="submit" color="primary" block>Trở về</Button>
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

export default Hr_Task_Detail;
