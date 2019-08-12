import React, { Component } from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    // CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    // Input,
    Label,
    Row,
    Pagination,
    Table
} from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
// import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
// import PaginationComponent from '../Paginations/pagination';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Hr_Task extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            loading: true,

            id: '',
            title: '',
            description: '',
            time_created: '',
            time_end: '',
            level_task: '',
            priority: '',
            status: '',
            supervisorName: '',
            studentName: '',
            emailStudent: '',
            modal: false,
        }
    }


    async componentDidMount() {
        const tasks = await ApiServices.Get('/supervisor/tasks');
        console.log(tasks);
        if (tasks !== null) {
            this.setState({
                tasks: tasks,
                loading: false
            });
        }
    }

    toggleModal = async (taskId) => {
        let task = null;
        if (this.state.modal === false) {
            const task = await ApiServices.Get(`/supervisor/task?id=${taskId}`);
            if (task !== null) {
                this.setState({
                    modal: !this.state.modal,
                    id: task.task.id,
                    title: task.task.title,
                    description: task.task.description,
                    time_created: task.task.time_created,
                    time_end: task.task.time_end,
                    level_task: task.task.level_task,
                    priority: task.task.priority,
                    status: task.task.status,
                    supervisorName: task.task.supervisor.name,
                    studentName: task.nameStudent,
                    emailStudent: task.emailStudent
                });
            }
        } else {
            this.setState({
                modal: !this.state.modal,
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

        if (result.status === 200) {
            const tasks = await ApiServices.Get('/supervisor/tasks');
            if (tasks !== null) {
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
        if (taskStatus === 'NOTSTART') {
            return (
                <Badge color="danger">CHƯA BẮT ĐẦU</Badge>
            )
        } else if (taskStatus === 'PENDING') {
            return (
                <Badge color="warning">CHƯA HOÀN THÀNH</Badge>
            )
        } else if (taskStatus === 'DONE') {
            return (
                <Badge color="success">HOÀN THÀNH</Badge>
            )
        }
    }

    showTaskLevel(taskLevel) {
        if (taskLevel === 'DIFFICULT') {
            return (
                <Badge color="danger">KHÓ</Badge>
            )
        } else if (taskLevel === 'EASY') {
            return (
                <Badge color="primary">DỄ</Badge>
            )
        } else if (taskLevel === 'NORMAL') {
            return (
                <Badge color="warning">TRUNG BÌNH</Badge>
            )
        }
    }

    formatDate(inputDate, flag) {
        var date = inputDate.split('-');
        let formattedDate = date[2] + "/" + date[1] + "/" + date[0];
        if (flag === true) {
            return (
                <Badge color="primary" style={{ fontSize: '12px' }}>{formattedDate}</Badge>
            )
        } else if (flag === false) {
            return (
                <Badge color="danger" style={{ fontSize: '12px' }}>{formattedDate}</Badge>
            )
        }
    }

    // showButtonChangeStatus(taskStatus, id) {
    //     if (taskStatus === 'NOTSTART') {
    //         return (
    //             <>
    //                 <Button type="submit" color="primary" onClick={() => this.handleDirect(`/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button>
    //             </>
    //         )
    //     } else if (taskStatus === 'PENDING') {
    //         return (
    //             <>
    //                 <Button type="submit" color="success" onClick={() => this.handleConfirmSetState(id, 3)}><i className="fa cui-circle-check"></i></Button>
    //                 <Button type="submit" color="primary" onClick={() => this.handleDirect(`/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button>
    //             </>
    //         )
    //     } else if (taskStatus === 'DONE') {
    //         return (
    //             <>
    //                 <Button type="submit" color="danger" onClick={() => this.handleConfirmSetState(id, 2)}><i className="fa cui-circle-x"></i></Button>
    //                 <Button hidden disabled type="submit" color="primary" onClick={() => this.handleDirect('')}><i className="fa cui-note"></i></Button>
    //             </>
    //         )
    //     }
    // }


    handleConfirm = (task) => {
        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn chắc chắn muốn xóa nhiệm vụ '${task.title}' của sinh viên ${task.nameStudent}?`,
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

    handleConfirmSetState = (id, status) => {
        var messageStatus = '';
        this.setState({
            modal: false,
        })
        if (status === 3) {
            messageStatus = 'HOÀN THÀNH';
        } else {
            messageStatus = 'CHƯA HOÀN THÀNH';
        }
        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn chuyển trạng thái nhiệm vụ '${this.state.title}' thành '${messageStatus}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(id, status)
                },
                {
                    label: 'Hủy bỏ',
                    onClick: () => this.setState({ modal: true, })
                }
            ]
        });
    };

    handleUpdateStatus = async (id, status) => {
        this.setState({
            loading: true
        })
        const result = await ApiServices.Put(`/supervisor/stateTask?id=${id}&typeTask=${status}`);

        if (result.status === 200) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");

            this.setState({
                loading: false
            })

            const tasks = await ApiServices.Get('/supervisor/tasks');
            const student = await ApiServices.Get(`/student/student/${this.state.emailStudent}`);

            if (tasks !== null) {
                this.setState({
                    tasks: tasks,
                    loading: false
                });
            }

            if (student.token != null) {
                let body = '';
                if (status) {
                    body = 'Trạng thái task ' + '[ ' + this.state.title + '] đã chuyển thành HOÀN THÀNH'
                } else {
                    body = 'Trạng thái task ' + '[' + this.state.title + '] đã chuyển thành CHƯA HOÀN THÀNH'
                }
                const notificationDTO = {
                    data: {
                        title: 'Trạng thái task bị thay đổi',
                        body: body,
                        click_action: "http://localhost:3000/#/invitation/new",
                        icon: "http://url-to-an-icon/icon.png"
                    },
                    to: `${student.token}`
                }

                console.log(notificationDTO);
                //const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
            }
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
            this.setState({
                loading: false
            })
        }
    }

    render() {
        const { tasks, loading } = this.state;
        const { id, title, description, time_created, time_end, level_task, priority, status, supervisorName,
            studentName } = this.state;

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
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Nhiệm vụ</th>
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Ưu tiên</th> */}
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Hạn cuối</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Mức độ</th> */}
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Người giao</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Sinh viên</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    tasks && tasks.map((task, index) => {
                                                        return (
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{task.task.title}</td>
                                                                {/* <td style={{ textAlign: "center" }}>{task.priority}</td> */}
                                                                {/* <td style={{ textAlign: "center" }}>{task.time_end}</td>
                                                                <td style={{ textAlign: "center" }}>{task.level_task}</td> */}
                                                                <td style={{ textAlign: "center" }}>{task.task.supervisor.name}</td>
                                                                <td style={{ textAlign: "center" }}>{task.nameStudent}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        this.showTaskState(task.task.status)
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.toggleModal(task.task.id)}><i className="fa cui-magnifying-glass"></i></Button>
                                                                    {
                                                                        task.status === 'DONE' ? (
                                                                            <Button disabled style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleConfirm(task.task)}><i className="fa cui-trash"></i></Button>
                                                                        ) : (
                                                                                <Button style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleConfirm(task.task)}><i className="fa cui-trash"></i></Button>
                                                                            )
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-primary ' + this.props.className}>
                                            <ModalHeader toggle={this.toggleModal}>
                                                {/* <FormGroup row> */}
                                                Chi tiết nhiệm vụ &nbsp;&nbsp;
                                                    {status !== "DONE" ?
                                                    <Button type="submit" style={{ color: "#20A8D8", backgroundColor: "white" }} onClick={() => this.handleDirect(`/hr-task/update/${id}`)}><i className="fa cui-note"></i></Button> :
                                                    <></>
                                                }
                                                {/* </FormGroup> */}
                                            </ModalHeader>
                                            <ModalBody>
                                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">

                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Tên nhiệm vụ</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="title" name="title">{title}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Trạng thái</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            {
                                                                this.showTaskState(status)
                                                            }
                                                            &nbsp;&nbsp;
                                                            {
                                                                status === "PENDING" ?
                                                                    <Button color="success" onClick={() => this.handleConfirmSetState(id, 3)}><i className="fa cui-circle-check"></i></Button> :
                                                                    <></>
                                                            }
                                                            {
                                                                status === "DONE" ?
                                                                    <Button color="danger" onClick={() => this.handleConfirmSetState(id, 2)}><i className="fa cui-circle-x"></i></Button> :
                                                                    <></>
                                                            }
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Ngày tạo</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="time_created" name="time_created">{this.formatDate(time_created, true)}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Người giao</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="supervisorName" name="supervisorName">{supervisorName}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Sinh viên</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="studentName" name="studentName">{studentName}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Mô tả</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <label dangerouslySetInnerHTML={{ __html: description }} id="description" name="description" />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Ngày hết hạn</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="time_end" name="time_end">{this.formatDate(time_end, false)}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Mức độ</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            {
                                                                this.showTaskLevel(level_task)
                                                            }
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="4">
                                                            <h6>Ưu tiên</h6>
                                                        </Col>
                                                        <Col xs="12" md="8">
                                                            <Label id="priority" name="priority">{priority}</Label>
                                                        </Col>
                                                    </FormGroup>
                                                </Form>
                                            </ModalBody>
                                            {/* <ModalFooter>
                                                <FormGroup row style={{ paddingLeft: "45%" }}>
                                                    <>
                                                        {
                                                            this.showButtonChangeStatus(status, id)
                                                        }
                                                    </>
                                                </FormGroup>
                                            </ModalFooter> */}
                                        </Modal>
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
