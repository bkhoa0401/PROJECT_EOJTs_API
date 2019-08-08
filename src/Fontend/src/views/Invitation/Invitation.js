import orderBy from "lodash/orderBy";
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

const invertDirection = {
    asc: 'desc',
    desc: 'asc'
};
class Invitation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: null,
            business_eng_name: '',
            searchValue: '',
            columnToSort: '',
            sortDirection: 'desc',
            loading: true,
            modal: false,
            studentDetail: null,
            invitationDetail: null,
        }
    }


    async componentDidMount() {
        const students = await ApiServices.Get('/student/getListStudentIsInvited');
        const business = await ApiServices.Get('/business/getBusiness');
        if (students !== null) {
            this.setState({
                students,
                business_eng_name: business.business_eng_name,
                loading: false
            });
        }

        console.log(this.state.students);
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
        let invitationDetail = null;
        let invitation = null;
        if (this.state.modal === false) {
            invitation = await ApiServices.Get(`/business/getInvitationOfStudent?emailStudent=${studentDetail.email}`);
            invitationDetail = invitation.description;
            this.setState({
                modal: !this.state.modal,
                studentDetail: studentDetail,
                invitationDetail: invitationDetail,
            });
        } else {
            this.setState({
                modal: !this.state.modal,
            })
        }
    }


    // handleSort = (columnName) => {
    //     this.setState({
    //         columnToSort: columnName,
    //         sortDirection: state.columnToSort === columnName ? invertDirection[state.sortDirection] : "asc"
    //     })
    //     console.log(this.state);
    // }

    render() {
        const { students, business_eng_name, searchValue, columnToSort, sortDirection, loading, studentDetail, invitationDetail } = this.state;
        let filteredListStudents = orderBy(students, columnToSort, sortDirection);

        if (students !== null) {
            filteredListStudents = students.filter(
                (studentList) => {
                    if (studentList.student.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return studentList.student;
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
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách các lời mời đã gửi hiện tại
                                    </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/invitation/new')}>Gửi lời mời cho sinh viên</Button>
                                        <br />
                                        <br />
                                        <br />
                                        <nav className="navbar navbar-light bg-light justify-content-between">
                                            <form className="form-inline">
                                                <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                                            </form>

                                        </nav>
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>MSSV</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Họ và tên</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Chuyên ngành</th>
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}><div onClick={() => this.handleSort('Chuyên ngành')}>Chuyên ngành</div></th> */}
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Kỹ năng</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>GPA</th> */}
                                                    {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Nguyện vọng của sinh viên</th> */}
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Trạng thái lời mời</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredListStudents && filteredListStudents.map((student, index) => {

                                                        const invitations = student.invitations;
                                                        var invitationDetail = null;

                                                        invitations && invitations.map((invitation, index) => {
                                                            const business_eng_name_invitation = invitation.business.business_eng_name;
                                                            if (business_eng_name === business_eng_name_invitation) {
                                                                invitationDetail = invitation;
                                                            }
                                                        })

                                                        const skills = student.student.skills;

                                                        let tmp = 'N/A';
                                                        if (invitationDetail !== null && invitationDetail.state !== 'false') {
                                                            if (student.student.option1 === business_eng_name) {
                                                                tmp = 1;
                                                            }
                                                            if (student.student.option2 === business_eng_name) {
                                                                tmp = 2;
                                                            }
                                                        }

                                                        return (
                                                            <tr key={index}>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{student.student.code}</td>
                                                                <td style={{ textAlign: "center" }}>{student.student.name}</td>
                                                                <td style={{ textAlign: "center" }}>{student.student.specialized.name}</td>
                                                                {/* <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        skills && skills.map((skill, index) => {
                                                                            return (
                                                                                <div>
                                                                                    {
                                                                                        <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>{student.student.gpa}</td> */}
                                                                {/* <td style={{ textAlign: "center" }}>
                                                                    <strong>
                                                                        {tmp}
                                                                    </strong>
                                                                </td> */}
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        invitationDetail && (
                                                                            invitationDetail.state.toString() === 'true' ? (
                                                                                <Badge color="success" style={{fontSize:'12px'}}>Đã chấp nhận</Badge>
                                                                            ) : (
                                                                                    <Badge color="danger" style={{fontSize:'12px'}}>Đang chờ</Badge>
                                                                                )
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <Button color="primary" onClick={() => this.toggleModalDetail(student.student)}><i className="fa cui-magnifying-glass"></i></Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {studentDetail !== null ?
                            <Modal isOpen={this.state.modal} toggle={this.toggleModalDetail}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                                <ModalBody>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Họ và tên</h6>
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
                                <ModalFooter>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Chi tiết lời mời</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <label>{invitationDetail}</label>
                                        </Col>
                                    </FormGroup>
                                </ModalFooter>
                            </Modal> :
                            <></>
                        }
                    </div>
                )
        );
    }
}

export default Invitation;
