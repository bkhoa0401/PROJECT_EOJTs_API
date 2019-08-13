import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../Toastify/Toastify';

class Ojt_Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: null,
            business_name: '',
            business_eng_name: '',
            searchValue: '',
            loading: true,
            listInvitation: null,

            modal: false,
            studentDetail: null,
            invitationDetail: null,
            // resumeLink: '',
        }
    }


    async componentDidMount() {
        const students = await ApiServices.Get('/student/getListStudentByOptionAndStatusOption');
        const business = await ApiServices.Get('/business/getBusiness');
        const invitations = await ApiServices.Get('/student/getListStudentIsInvited');
        let listInvitation = [];
        if (students !== null) {
            for (let index = 0; index < students.length; index++) {
                listInvitation.push(false);
                for (let index1 = 0; index1 < invitations.length; index1++) {
                    if (invitations[index1].student.email === students[index].email) {
                        listInvitation.splice(index, 1);
                        listInvitation.push(true);
                        break;
                    }
                }
            }
            this.setState({
                students,
                business_name: business.business_name,
                business_eng_name: business.business_eng_name,
                loading: false,
                listInvitation: listInvitation,
            });
        }
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

    handleConfirm = (student, numberOfOption, statusOfOption) => {

        var messageStatus = '';
        if (statusOfOption) {
            messageStatus = 'duyệt';
        } else {
            messageStatus = 'từ chối';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${messageStatus} sinh viên "${student.name}" ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleIsAcceptedOption(student, numberOfOption, statusOfOption)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleIsAcceptedOption = async (student, numberOfOption, statusOfOption) => {

        var action, message, title;
        if (statusOfOption === true) {
            title = '[' + `${this.state.business_name}` + '] ' + 'ĐÃ CHẤP NHẬN';
            action = 'Duyệt';
            message = `Chúc mừng ${student.name}! Việc đăng kí thực tập của bạn đã được ${this.state.business_name} chấp nhận!`;
        } else {
            title = '[' + `${this.state.business_name}` + '] ' + 'ĐÃ TỪ CHỐI';
            action = 'Từ chối'
            message = `Xin chào ${student.name}! ${this.state.business_name} đã từ chối việc đăng kí thực tập của bạn tại doanh nghiệp của họ!`;
        }

        const notificationDTO = {
            data: {
                title: title,
                body: message,
                click_action: "http://localhost:3000/#/invitation/new",
                icon: "http://url-to-an-icon/icon.png"
            },
            to: `${student.token}`
        }

        this.setState({
            loading: true
        })

        if (numberOfOption === '1, 2') {
            var numberOfOption = [];
            numberOfOption.push(1);
            numberOfOption.push(2);
        }
        const result = await ApiServices.Put(`/business/updateStatusOfStudent?numberOfOption=${numberOfOption}&statusOfOption=${statusOfOption}&emailOfStudent=${student.email}`);

        if (result.status === 200) {
            Toastify.actionSuccess(`${action} thành công!`);
            const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
            this.setState({
                loading: false
            })
        } else {
            Toastify.actionFail(`${action} thất bại!`);
            const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
            this.setState({
                loading: false
            })
        }

        const students = await ApiServices.Get('/student/getListStudentByOptionAndStatusOption');
        const business = await ApiServices.Get('/business/getBusiness');
        if (students !== null) {
            this.setState({
                students,
                business_eng_name: business.business_eng_name
            });
        }
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

    render() {
        const { students, business_eng_name, searchValue, loading, studentDetail, invitationDetail, listInvitation } = this.state;
        // const linkDownCV = ``;
        let filteredListStudents;

        if (students !== null) {
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
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách sinh viên đăng kí thực tập tại công ty
                                    </CardHeader>
                                    <CardBody>
                                        <nav className="navbar navbar-light bg-light justify-content-between">
                                            <form className="form-inline">
                                                <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                            </form>

                                        </nav>
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>MSSV</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Họ và tên</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Chuyên ngành</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Gửi lời mời</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Nguyện vọng</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredListStudents && filteredListStudents.map((student, index) => {

                                                        let email = student.email;
                                                        let numberOfOption = 'N/A';

                                                        if (student.option1 === business_eng_name && student.option2 !== business_eng_name) {
                                                            numberOfOption = "1";
                                                        } else if (student.option2 === business_eng_name && student.option1 !== business_eng_name) {
                                                            numberOfOption = "2";
                                                        } else {
                                                            numberOfOption = "1, 2";
                                                            filteredListStudents.splice(index, 1);
                                                        }


                                                        return (
                                                            <tr key={index}>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{student.code}</td>
                                                                <td style={{ textAlign: "center" }}>{student.name}</td>
                                                                <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {listInvitation && listInvitation[index] === true ?
                                                                        <Badge color="success" style={{ fontSize: '12px' }}>Có</Badge> :
                                                                        <Badge color="danger" style={{ fontSize: '12px' }}>Không</Badge>
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <strong>{numberOfOption}</strong>
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {/* <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleDirect(`/student/${student.email}`)}><i className="fa fa-info"></i></Button> */}
                                                                    <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.toggleModalDetail(student)}><i className="fa fa-info"></i></Button>
                                                                    <Button id={'r' + index} type="submit" style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(student, numberOfOption, false)}><i className="fa cui-ban"></i></Button>
                                                                    <Button id={'a' + index} type="submit" style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(student, numberOfOption, true)}><i className="fa cui-circle-check"></i></Button>
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
                                    {/* <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/invitation")} type="submit" color="primary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter> */}
                                </Card>
                            </Col>
                        </Row>
                        {studentDetail !== null ?
                            <Modal isOpen={this.state.modal} toggle={this.toggleModalDetail}
                                className={'modal-primary ' + this.props.className}>
                                <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                                <ModalBody>
                                    {/* <div style={{ maxHeight: "563px", overflowY: 'auto', overflowX: 'hidden' }}> */}
                                    <div>
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
                                                <h6>Họ và tên</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <label>{studentDetail.name}</label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>MSSV</h6>
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
                                        {/* <FormGroup row>
                                            <Col md="4">
                                                <h6>Bảng điểm</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    studentDetail.transcriptLink && studentDetail.transcriptLink ? (
                                                        <a href={studentDetail.transcriptLink} download>tải</a>
                                                    ) :
                                                        (<label>N/A</label>)
                                                }
                                            </Col>
                                        </FormGroup> */}
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
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Bảng điểm</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    studentDetail.transcriptLink && studentDetail.transcriptLink ? (
                                                        <a href={studentDetail.transcriptLink} download>tải</a>
                                                    ) :
                                                        (<label>N/A</label>)
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>CV</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    studentDetail.resumeLink && studentDetail.resumeLink ?
                                                        <a target="_blank" href={`http://localhost:8000/api/file/downloadFile/${studentDetail.resumeLink}`} download>tải</a>
                                                        :
                                                        <label>N/A</label>
                                                }
                                            </Col>
                                        </FormGroup>
                                    </div>
                                </ModalBody>
                                {invitationDetail !== null ?
                                    <ModalFooter>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Chi tiết lời mời</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <div style={{ maxHeight: "100px", overflowY: 'auto', overflowX: 'hidden' }}>
                                                    <label>{invitationDetail}</label>
                                                </div>
                                            </Col>
                                        </FormGroup>
                                    </ModalFooter> :
                                    <></>
                                }
                            </Modal> :
                            <></>
                        }
                    </div>
                )
        );
    }
}

export default Ojt_Registration;
