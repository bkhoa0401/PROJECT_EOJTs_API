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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Hr_Task extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            loading: true
        }
    }


    async componentDidMount() {
        const tasks = await ApiServices.Get('/supervisor/tasks');

        if (tasks != null) {
            this.setState({
                tasks: tasks,
                loading: false
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleDelete = async (deletedId) => {
        this.setState({
            loading: true
        })
        const result = await ApiServices.Delete(`/supervisor/task?id=${deletedId}`);

        if (result.status == 200) {
            const tasks = await ApiServices.Get('/supervisor/tasks');
            if (tasks != null) {
                this.setState({
                    tasks: tasks
                });
            }
            Toastify.actionSuccess("Xóa nhiệm vụ thành công!");
            this.setState({
                loading: false
            })
        } else {
            Toastify.actionFail("Xóa nhiệm vụ thất bại!");
            this.setState({
                loading: false
            })
        }
    }

    showTaskState(taskStatus) {
        console.log(taskStatus);
        if (taskStatus === 'NOTSTART') {
            return (
                <Badge color="danger">Chưa bắt đầu</Badge>
            )
        } else if (taskStatus === 'PENDING') {
            return (
                <Badge color="warning">Chưa hoàn thành</Badge>
            )
        } else if (taskStatus === 'DONE') {
            return (
                <Badge color="success">Hoàn Thành</Badge>
            )
        }
    }


    handleConfirm = (task) => {
        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn chắc chắn muốn xóa nhiệm vụ '${task.title}' của sinh viên ${task.ojt_enrollment.student.name}?`,
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => this.handleDelete(task.id)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    render() {
        const { tasks, loading } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách nhiệm vụ
                            </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/hr-task/create')}>Tạo nhiệm vụ mới</Button>
                                        <br />
                                        <br />
                                        <br />
                                        <ToastContainer />
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center" }}>STT</th>
                                                    <th style={{ textAlign: "center" }}>Nhiệm vụ</th>
                                                    {/* <th style={{ textAlign: "center" }}>Độ ưu tiên</th> */}
                                                    {/* <th style={{ textAlign: "center" }}>Hạn cuối</th>
                                            <th style={{ textAlign: "center" }}>Mức độ</th> */}
                                                    <th style={{ textAlign: "center" }}>Người giao</th>
                                                    <th style={{ textAlign: "center" }}>Sinh viên</th>
                                                    <th style={{ textAlign: "center" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    tasks && tasks.map((task, index) => {
                                                        return (
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{task.title}</td>
                                                                {/* <td style={{ textAlign: "center" }}>{task.priority}</td> */}
                                                                {/* <td style={{ textAlign: "center" }}>{task.time_end}</td>
                                                        <td style={{ textAlign: "center" }}>{task.level_task}</td> */}
                                                                <td style={{ textAlign: "center" }}>{task.supervisor.name}</td>
                                                                <td style={{ textAlign: "center" }}>{task.ojt_enrollment.student.name}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        this.showTaskState(task.status)
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/hr-task/details/${task.id}`)}>Chi tiết</Button>
                                                                    {
                                                                        task.status === 'DONE' ? (
                                                                            <Button disabled style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleConfirm(task)}>Xóa</Button>
                                                                        ) : (
                                                                                <Button style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleConfirm(task)}>Xóa</Button>
                                                                            )
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    {/* <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr-student-list")} type="submit" color="primary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter> */}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Hr_Task;
