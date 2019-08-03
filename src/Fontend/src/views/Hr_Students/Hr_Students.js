import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Label, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { forEach } from '@firebase/util';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';


class Hr_Students extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: null,
            searchValue: '',
            loading: true,
            modalDetail: false,
            modalTask: false,
            studentDetail: null,
            listStudentTask: null,
        };
    }

    async componentDidMount() {
        const students = await ApiServices.Get('/supervisor/students');
        if (students != null) {
            this.setState({
                students,
                loading: false
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    toggleModalDetail = async (studentDetail) => {
        if (this.state.modalDetail == false) {
            this.setState({
                modalDetail: !this.state.modalDetail,
                studentDetail: studentDetail,
            });
        } else {
            this.setState({
                modalDetail: !this.state.modalDetail,
            })
        }
    }

    toggleModalTask = async (studentDetail) => {
        if (this.state.modalTask == false) {
            const listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}`);
            this.setState({
                modalTask: !this.state.modalTask,
                studentDetail: studentDetail,
                listStudentTask: listStudentTask,
            });
        } else {
            this.setState({
                modalTask: !this.state.modalTask,
            })
        }
    }

    showTaskLevel(taskLevel) {
        if (taskLevel === 'DIFFICULT') {
            return (
                <Badge color="danger">Khó</Badge>
            )
        } else if (taskLevel === 'EASY') {
            return (
                <Badge color="primary">Dễ</Badge>
            )
        } else if (taskLevel === 'NORMAL') {
            return (
                <Badge color="warning">Trung bình</Badge>
            )
        }
    }

    showTaskState(taskStatus) {
        console.log(taskStatus);
        if (taskStatus === 'NOTSTART') {
            return (
                <Badge color="secondary">Chưa bắt đầu</Badge>
            )
        } else if (taskStatus === 'PENDING') {
            return (
                <Badge color="warning">Chưa xong</Badge>
            )
        } else if (taskStatus === 'DONE') {
            return (
                <Badge color="success">Hoàn Thành</Badge>
            )
        }
    }

    formatDate(inputDate, flag) {
        var date = inputDate.split('-');
        let formattedDate = date[2] + "/" + date[1] + "/" + date[0];
        if (flag == true) {
            return (
                <Badge color="primary">{formattedDate}</Badge>
            )
        } else if (flag == false) {
            return (
                <Badge color="danger">{formattedDate}</Badge>
            )
        }
    }

    render() {
        const { studentDetail, listStudentTask, students, searchValue, loading } = this.state;
        let filteredListStudents;

        if (students != null) {
            filteredListStudents = students.filter(
                (student) => {
                    if (student.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return student;
                    }
                }
            );
        }

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Danh sách sinh viên
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                            </nav>
                                            <Table responsive striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: "center" }}>STT</th>
                                                        <th style={{ textAlign: "center" }}>MSSV</th>
                                                        <th style={{ textAlign: "center" }}>Họ và Tên</th>
                                                        <th style={{ textAlign: "center" }}>Email</th>
                                                        <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                                                        <th style={{ textAlign: "center" }}>GPA</th>
                                                        <th style={{ textAlign: "center" }}>Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListStudents && filteredListStudents.map((student, index) => {
                                                        return (
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{student.code}</td>
                                                                <td style={{ textAlign: "center" }}>{student.name}</td>
                                                                <td style={{ textAlign: "center" }}>{student.email}</td>
                                                                <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                                {/* <td style={{ textAlign: "center" }}>
                                                            {
                                                                student.transcriptLink && student.transcriptLink ? (
                                                                    <a href={student.transcriptLink} download>Tải</a>
                                                                ) :
                                                                    (<label>N/A</label>)
                                                            }
                                                        </td> */}
                                                                <td style={{ textAlign: "center" }}>{student.gpa}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {/* <Button style={{ width: '100px', marginRight: '2px' }} color="primary" onClick={() => this.handleDirect(`/student-detail/${student.email}`)}>Chi tiết</Button> */}
                                                                    <Button style={{ width: '100px', marginRight: "2px" }} color="primary" onClick={() => this.toggleModalDetail(student)}>Chi tiết</Button>
                                                                    {/* <Button style={{ width: '100px' }} color="success" onClick={() => this.handleDirect(`/hr-student-list/details/${student.email}`)}>Nhiệm vụ</Button> */}
                                                                    <Button style={{ width: '100px' }} color="success" onClick={() => this.toggleModalTask(student)}>Nhiệm vụ</Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {studentDetail !== null ?
                            <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                                <ModalBody>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Ảnh đại diện</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            {studentDetail.avatarLink === null ?
                                                <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" style={{ width: "100px", height: "100px" }} alt="usericon" /> :
                                                <img src={studentDetail.avatarLink} className="img-avatar" style={{ width: "100px", height: "100px" }} />
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Họ và Tên</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <label>{studentDetail.name}</label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Mã số sinh viên</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <label>{studentDetail.code}</label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Chuyên ngành</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <label>{studentDetail.specialized.name}</label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Giới thiệu bản thân</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <label>{studentDetail.objective}</label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Bảng điểm</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            {
                                                studentDetail.transcriptLink && studentDetail.transcriptLink ? (
                                                    <a href={studentDetail.transcriptLink} download>Tải về</a>
                                                ) :
                                                    (<label>N/A</label>)
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Kỹ năng</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            {
                                                studentDetail.skills && studentDetail.skills.map((skill, index) => {
                                                    return (
                                                        <div>
                                                            {
                                                                <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>GPA</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <label>{studentDetail.gpa}</label>
                                        </Col>
                                    </FormGroup>
                                </ModalBody>
                                {/* <ModalFooter>
                </ModalFooter> */}
                            </Modal> :
                            <></>
                        }
                        {studentDetail !== null ?
                            <Modal isOpen={this.state.modalTask} toggle={this.toggleModalTask}
                                className={'modal-lg ' + this.props.className}>
                                <ModalHeader style={{ backgroundColor: "#4DBD74", color: "white" }} toggle={this.toggleModalTask}>Nhiệm vụ của sinh viên</ModalHeader>
                                <ModalBody>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Người hướng dẫn</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Label>{studentDetail.supervisor === null ? <></> : (studentDetail.supervisor.name)}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Sinh viên</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <label>{studentDetail.name}</label>
                                        </Col>
                                    </FormGroup>
                                    <Table responsive striped>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: "center" }}>STT</th>
                                                <th style={{ textAlign: "center" }}>Nhiệm vụ</th>
                                                <th style={{ textAlign: "center" }}>Giao bởi</th>
                                                <th style={{ textAlign: "center" }}>Độ ưu tiên</th>
                                                <th style={{ textAlign: "center" }}>Độ khó</th>
                                                <th style={{ textAlign: "center" }}>Ngày tạo</th>
                                                <th style={{ textAlign: "center" }}>Hạn cuối</th>
                                                <th style={{ textAlign: "center" }}>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.listStudentTask && this.state.listStudentTask.map((task, index) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ textAlign: "center" }}>{task.title}</td>
                                                            <td style={{ textAlign: "center" }}>{task.supervisor.name}</td>
                                                            <td style={{ textAlign: "center" }}>{task.priority}</td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {
                                                                    this.showTaskLevel(task.level_task)
                                                                }
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>{this.formatDate(task.time_created, true)}</td>
                                                            <td style={{ textAlign: "center" }}>{this.formatDate(task.time_end, false)}</td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {
                                                                    this.showTaskState(task.status)
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </ModalBody>
                                {/* <ModalFooter>
                </ModalFooter> */}
                            </Modal> :
                            <></>
                        }
                    </div>
                )
        );
    }
}

export default Hr_Students;
