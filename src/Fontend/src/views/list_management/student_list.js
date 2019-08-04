import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { ListGroup, ListGroupItem, Input, Form, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { forEach } from '@firebase/util';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import firebase from 'firebase/app';
import decode from 'jwt-decode';
import { async } from 'q';

const storage = firebase.storage();

class student_list extends Component {

    constructor(props) {
        super(props);

        // this.toggle = this.toggle.bind(this);
        this.state = {
            modal: false,
            modalDetail: false,
            modalTask: false,
            activeTab: new Array(1).fill('1'),
            // open: false,
            students: null,
            searchValue: '',
            loading: true,
            suggestedBusiness: null,
            otherBusiness: null,
            studentSelect: null,
            isUploadTranscriptLink: false,


            student: null,
            name: '',
            code: '',
            email: '',
            phone: '',
            address: '',
            specialized: '',
            objective: '',
            gpa: '',
            resumeLink: '',
            transcriptLink: '',
            file: null,
            skills: [],
            role: '',

            listStudentTask: null,
            studentDetail: null,
            months: null,
            isThisMonth: -1,

            typesOfStudent: ['Tổng', 'Rớt'],
            typeSelected: 1,

            isViewSurvey: 0,
            survey: null,
            businessSurvey: null,
        };
        // this.toggleModal = this.toggleModal.bind(this);
    }

    async componentDidMount() {
        const students = await ApiServices.Get('/student/getAllStudent');
        if (students != null) {
            this.setState({
                students,
                loading: false
            });
        }
    }

    toggle = async (tabPane, tab) => {
        const newArray = this.state.activeTab.slice();
        newArray[tabPane] = tab;
        let students = null;
        let typeSelected;
        if (tab == 1) {
            students = await ApiServices.Get('/student/getAllStudent');
        } else if (tab == 2) {
            students = await ApiServices.Get('/student/getStudentsWithNoCompany');
            typeSelected = 1;
        }
        this.setState({
            activeTab: newArray,
            students: students,
            typeSelected: typeSelected,
        });
        // console.log(tabPane);
        // console.log(tab);
        // console.log(this.state.activeTab);
    }

    toggleModal = async (studentSelect) => {
        let suggestedBusiness = null;
        let otherBusiness = null;
        if (this.state.modal == false) {
            this.setState({
                loading: true,
            })
            suggestedBusiness = await ApiServices.Get(`/admin/getSuggestedBusinessForFail?email=${studentSelect.email}`);
            otherBusiness = await ApiServices.Get(`/admin/getOtherBusiness?email=${studentSelect.email}`);
        }
        // console.log(suggestedBusiness);
        // console.log(otherBusiness);
        this.setState({
            modal: !this.state.modal,
            suggestedBusiness: suggestedBusiness,
            otherBusiness: otherBusiness,
            studentSelect: studentSelect,
            loading: false,
        });
    }

    toggleModalDetail = async (email) => {
        let students = null;
        let businessSurvey = null;
        let survey = null;
        let role = '';
        if (this.state.modalDetail == false) {
            students = await ApiServices.Get(`/student/student/${email}`);
            businessSurvey = await ApiServices.Get(`/student/business?email=${email}`);
            survey = await ApiServices.Get(`/student/answersOfStudent?studentEmail=${email}`);
            // console.log(survey.length);
            if (survey.length == 0) {
                survey = null;
            }
            const token = localStorage.getItem('id_token');
            if (token != null) {
                const decoded = decode(token);
                role = decoded.role;
            }

            this.setState({
                student: students,
                name: students.name,
                code: students.code,
                email: students.email,
                phone: students.phone,
                address: students.address,
                specialized: students.specialized.name,
                objective: students.objective,
                gpa: students.gpa,
                skills: students.skills,
                resumeLink: students.resumeLink,
                transcriptLink: students.transcriptLink,
                role: role,
                modalDetail: !this.state.modalDetail,

                businessSurvey: businessSurvey,
                survey: survey,
            });
        } else {
            this.setState({
                modalDetail: !this.state.modalDetail,
                isViewSurvey: 0,
            });
        }
    }

    handleSelectMonth = async (event, studentDetail) => {
        const { name, value } = event.target;
        const { months } = this.state;
        var date = months[value].split(" - ");
        // console.log(date[0]);
        // console.log(date[1]);
        var formatDateStart = date[0].split("/");
        let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
        // console.log(dateStart);
        var formatDateEnd = date[1].split("/");
        let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
        // console.log(dateEnd);
        const listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
        await this.setState({
            listStudentTask: listStudentTask,
            isThisMonth: -1,
        })
    }

    toggleModalTask = async (studentDetail) => {
        if (this.state.modalTask == false) {
            this.setState({
                loading: true,
            })
            let months = [];
            var date = new Date();
            let isThisMonth = -1;
            let listStudentTask = null;

            const ojtEnrollment = await ApiServices.Get(`/enrollment/getSelectedStuEnrollment?email=${studentDetail.email}`);
            var dateEnroll = ojtEnrollment.timeEnroll;
            if (dateEnroll != null) {
                var splitDate = dateEnroll.split('-');
                let dd = parseInt(splitDate[2]);
                let mm = parseInt(splitDate[1]);
                // let mm31 = [1, 3, 5, 7, 8, 10, 12];
                let mm30 = [4, 6, 9, 11];
                let yyyy = parseInt(splitDate[0]);
                for (let index = 1; index < 5; index++) {
                    let timeStartShow = "";
                    if (mm + parseInt(index) > 13) {
                        if ((mm + parseInt(index) - 12 - 1) == 2 && (yyyy + 1) % 4 == 0 && dd > 29) {
                            timeStartShow = 29 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
                        } else if ((mm + parseInt(index) - 12 - 1) == 2 && (yyyy + 1) % 4 != 0 && dd > 28) {
                            timeStartShow = 28 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
                        } else if (mm30.includes((mm + parseInt(index) - 12 - 1)) && dd > 30) {
                            timeStartShow = 30 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
                        } else {
                            timeStartShow = dd + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
                        }
                    } else {
                        if ((mm + parseInt(index) - 1) == 2 && yyyy % 4 == 0 && dd > 29) {
                            timeStartShow = 29 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
                        } else if ((mm + parseInt(index) - 1) == 2 && yyyy % 4 != 0 && dd > 28) {
                            timeStartShow = 28 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
                        } else if (mm30.includes((mm + parseInt(index) - 1)) && dd > 30) {
                            timeStartShow = 30 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
                        } else {
                            timeStartShow = dd + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
                        }
                    }
                    let formatTimeStartShow = timeStartShow.split('/');
                    // console.log(formatTimeStartShow[1]);
                    // console.log(formatTimeStartShow[0]);
                    if (parseInt(formatTimeStartShow[1]) < 10) {
                        formatTimeStartShow[1] = "0" + formatTimeStartShow[1];
                    }
                    if (parseInt(formatTimeStartShow[0]) < 10) {
                        formatTimeStartShow[0] = "0" + formatTimeStartShow[0];
                    }
                    timeStartShow = formatTimeStartShow[0] + "/" + formatTimeStartShow[1] + "/" + formatTimeStartShow[2];
                    // console.log(timeStartShow);
                    let timeEndShow = "";
                    if (mm + parseInt(index) > 12) {
                        if ((mm + parseInt(index) - 12) == 2 && (yyyy + 1) % 4 == 0 && dd > 29) {
                            timeEndShow = 29 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
                        } else if ((mm + parseInt(index) - 12) == 2 && (yyyy + 1) % 4 != 0 && dd > 28) {
                            timeEndShow = 28 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
                        } else if (mm30.includes((mm + parseInt(index) - 12)) && dd > 30) {
                            timeEndShow = 30 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
                        } else {
                            timeEndShow = dd + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
                        }
                    } else {
                        if ((mm + parseInt(index)) == 2 && yyyy % 4 == 0 && dd > 29) {
                            timeEndShow = 29 + "/" + (mm + parseInt(index)) + "/" + yyyy;
                        } else if ((mm + parseInt(index)) == 2 && yyyy % 4 != 0 && dd > 28) {
                            timeEndShow = 28 + "/" + (mm + parseInt(index)) + "/" + yyyy;
                        } else if (mm30.includes((mm + parseInt(index))) && dd > 30) {
                            timeEndShow = 30 + "/" + (mm + parseInt(index)) + "/" + yyyy;
                        } else {
                            timeEndShow = dd + "/" + (mm + parseInt(index)) + "/" + yyyy;
                        }
                    }
                    let formatTimeEndShow = timeEndShow.split('/');
                    if (parseInt(formatTimeEndShow[1]) < 10) {
                        formatTimeEndShow[1] = "0" + formatTimeEndShow[1];
                    }
                    if (parseInt(formatTimeEndShow[0]) < 10) {
                        formatTimeEndShow[0] = "0" + formatTimeEndShow[0];
                    }
                    timeEndShow = formatTimeEndShow[0] + "/" + formatTimeEndShow[1] + "/" + formatTimeEndShow[2];
                    // console.log(timeEndShow);
                    var date1 = new Date();
                    var date2 = new Date();
                    date1.setFullYear(parseInt(formatTimeStartShow[2]), parseInt(formatTimeStartShow[1] - 1), parseInt(formatTimeStartShow[0]));
                    // console.log(formatTimeStartShow[1]);
                    date2.setFullYear(parseInt(formatTimeEndShow[2]), parseInt(formatTimeEndShow[1] - 1), parseInt(formatTimeEndShow[0]));
                    if (date >= date1 && date <= date2) {
                        isThisMonth = index - 1;
                    }
                    // console.log(date);
                    // console.log(date1);
                    // console.log(date2);
                    // console.log(date >= date1);
                    // console.log(date <= date2);
                    months.push(`${timeStartShow} - ${timeEndShow}`);
                }
                // console.log(months);
                // console.log(isThisMonth);
                var date = months[isThisMonth].split(" - ");
                var formatDateStart = date[0].split("/");
                let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
                var formatDateEnd = date[1].split("/");
                let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
                listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
            }

            this.setState({
                modalTask: !this.state.modalTask,
                studentDetail: studentDetail,
                listStudentTask: listStudentTask,
                months: months,
                loading: false,
                isThisMonth: isThisMonth,
            });
        } else {
            this.setState({
                modalTask: !this.state.modalTask,
            })
        }
    }

    uploadTranscriptToFireBase = async () => {
        let { file } = this.state;

        const uploadTask = await storage.ref(`transcripts/${file.name}`).put(file);
        await storage.ref('transcripts').child(file.name).getDownloadURL().then(url => {
            this.setState({
                transcriptLink: url
            })
        })
    }

    saveTranscript = async () => {
        const { student, transcriptLink } = this.state;
        student.transcriptLink = transcriptLink;
        const result = await ApiServices.Put('/business/updateLinkTranscript', student);

        if (result.status == 200) {
            Toastify.actionSuccess('Cập nhật bảng điểm thành công');
            this.setState({
                loading: false,
                modalDetail: !this.state.modalDetail,
            })
        } else {
            Toastify.actionFail('Cập nhật bảng điểm thất bại');
            this.setState({
                loading: false
            })
        }
    }

    handleChange = (event) => {
        if (event.target.files[0]) {
            const file = event.target.files[0];
            this.setState({
                file: file,
                isUploadTranscriptLink: true,
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
        // console.log(taskStatus);
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

    checkChose(quesAns, ans) {
        // console.log(quesAns.includes(ans));
        // console.log(quesAns);
        // console.log(quesAns.length);
        // console.log(ans);
        let isChecked = false;
        for (let index = 0; index < quesAns.length; index++) {
            if (quesAns[index].id == ans.id) {
                isChecked = true;
            }
        }
        return isChecked;
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

    handleViewSurvey = async () => {
        this.setState({
            isViewSurvey: 1,
        })
    }

    handleBackSurvey = async () => {
        this.setState({
            isViewSurvey: 0,
        })
    }


    handleSubmit = async () => {
        this.setState({
            loading: true,
            isUploadTranscriptLink: false,
        })
        await this.uploadTranscriptToFireBase();
        await this.saveTranscript();
    }

    showTranscript(transcriptLink) {
        if (transcriptLink != null) {
            return (
                <a href={transcriptLink}>Tải về</a>
            )
        } else {
            return (
                <label>N/A</label>
            )
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleInputSelect = async (event) => {
        const { name, value } = event.target;
        let typeSelected = this.state.typeSelected;
        let students = null;
        // console.log(name);
        // console.log(value);
        if (value == 0) {
            typeSelected = 0;
            students = await ApiServices.Get('/student/getAllStudent');
        } else if (value == 1) {
            typeSelected = 1;
            students = await ApiServices.Get('/student/getStudentsWithNoCompany');
        }
        await this.setState({
            typeSelected: typeSelected,
            students: students,
        })
        // console.log(this.state.typeSelected);
        // console.log(this.state.students);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirm = (studentSelect, businessEmail, businessName) => {
        this.setState({
            modal: !this.state.modal,
            open: true
        });
        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn đăng ký công ty ${businessName} cho sinh viên ${studentSelect.name}?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleYes(studentSelect, businessEmail, businessName)
                },
                {
                    label: 'Hủy bỏ',
                    onClick: () => this.toggleModal(studentSelect)
                }
            ]
        });
    };

    handleYes = async (studentSelect, businessEmail, businessName) => {

        var message = `Chúc mừng ${studentSelect.name}! Bạn đã được đăng ký thực tập tại ${businessName}!`;

        const notificationDTO = {
            data: {
                title: `Kết quả đăng kí thực tập tại doanh nghiệp ${businessName}`,
                body: message,
                click_action: "http://localhost:3000/#/invitation/new",
                icon: "http://url-to-an-icon/icon.png"
            },
            to: `${studentSelect.token}`
        }

        this.setState({
            loading: true
        })

        const result = await ApiServices.Put(`/admin/setBusinessForStudent?emailOfBusiness=${businessEmail}&emailOfStudent=${studentSelect.email}`);
        // console.log(result);

        if (result.status == 200) {
            Toastify.actionSuccess(`Đăng ký thành công!`);
            const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);
            const students = await ApiServices.Get('/student/getAllStudent');
            this.setState({
                students: students,
                loading: false
            })
        } else {
            Toastify.actionFail(`Đăng ký thất bại!`);
            this.setState({
                loading: false
            })
        }
    }

    tabPane() {
        const { student, businessSurvey, months, isThisMonth, isViewSurvey, survey, students, searchValue, loading, suggestedBusiness, otherBusiness, studentSelect, studentDetail, typesOfStudent } = this.state;

        const { name, code, email, phone, address, specialized, objective, gpa, skills, resumeLink, transcriptLink, role, isUploadTranscriptLink } = this.state;
        const linkDownCV = `http://localhost:8000/api/file/downloadFile/${resumeLink}`;
        let filteredListStudents;

        if (students != null) {
            filteredListStudents = students.filter(
                (student) => {
                    if (student.student.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return student;
                    }
                }
            );
        }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <>
                        <TabPane tabId="1">
                            {
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
                                                {/* <th style={{ textAlign: "center" }}>Bảng điểm</th> */}
                                                {/* <th style={{ textAlign: "center" }}>GPA</th> */}
                                                <th style={{ textAlign: "center" }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredListStudents && filteredListStudents.map((student, index) => {
                                                return (
                                                    <tr>
                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.code}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.name}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.email}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.specialized.name}</td>
                                                        {/* <td style={{ textAlign: "center" }}>
                                                            {
                                                                student.transcriptLink && student.transcriptLink ? (
                                                                    <a href={student.student.transcriptLink} download>Tải về</a>
                                                                ) :
                                                                    (<label>N/A</label>)
                                                            }
                                                        </td> */}
                                                        {/* <td style={{ textAlign: "center" }}>{student.gpa}</td> */}
                                                        <td style={{ textAlign: "center" }}>
                                                            {/* <Button style={{ width: "80px" }} color="primary" onClick={() => this.handleDirect(`/student/${student.student.email}`)}>Chi tiết</Button> */}
                                                            <Button style={{ width: "80px" }} color="primary" onClick={() => this.toggleModalDetail(student.student.email)}>Chi tiết</Button>
                                                            &nbsp;&nbsp;
                                                            {/* <Button style={{ width: "90px" }} color="success" onClick={() => this.handleDirect(`/hr-student-list/details/${student.student.email}`)}>Nhiệm vụ</Button> */}
                                                            <Button style={{ width: '90px' }} color="success" onClick={() => this.toggleModalTask(student.student)}>Nhiệm vụ</Button>
                                                            {/* <Button style={{ width: "70px" }} color="danger">Xoá</Button> */}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            }
                        </TabPane>
                        <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail}
                            className={'modal-primary ' + this.props.className}>
                            <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                            <ModalBody>
                                {isViewSurvey === 0 ?
                                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Họ và Tên</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Label id="" name="">{name}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>MSSV</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Label id="" name="">{code}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Email</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Label id="" name="">{email}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>SĐT</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Label id="" name="">{phone}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Chuyên ngành</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Label id="" name="">{specialized}</Label>
                                            </Col>
                                        </FormGroup>
                                        {/* <FormGroup row>
                                        <Col md="4">
                                            <h6>Học kỳ</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Label id="" name="">{}</Label>
                                        </Col>
                                    </FormGroup> */}
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Địa chỉ</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Label id="" name="">{address}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Mục tiêu</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Label id="" name="">{objective}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>GPA</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                <Label id="" name="">{gpa}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Kỹ năng</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    skills && skills.map((skill, index) => {
                                                        return (
                                                            <div>
                                                                {
                                                                    skill.name && skill.name ? (
                                                                        <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                    ) : (
                                                                            <label style={{ marginRight: "15px" }}>N/A</label>
                                                                        )
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>CV</h6>
                                            </Col>
                                            {
                                                resumeLink && resumeLink ?
                                                    (<Col xs="12" md="8">
                                                        <a target="_blank" href={linkDownCV} download>Tải về</a>
                                                    </Col>)
                                                    :
                                                    (
                                                        <Col xs="12" md="8">
                                                            <label>N/A</label>
                                                        </Col>)
                                            }
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Bảng điểm</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    role && role === 'ROLE_HR' ?
                                                        (
                                                            this.showTranscript(transcriptLink)
                                                        ) :
                                                        (<input onChange={this.handleChange} type="file" />)
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Khảo sát ý kiến</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {
                                                    survey === null ?
                                                        <></> :
                                                        <Button color="primary" onClick={() => this.handleViewSurvey()}>Xem</Button>
                                                }
                                            </Col>
                                        </FormGroup>
                                    </Form> :
                                    <Form>
                                        <div style={{ height: '563px', overflowY: 'scroll', width: "100%", overflowX: "hidden" }}>
                                            <div style={{ textAlign: "center" }}>
                                                <img src="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410" width="96%" />
                                                <br /><br /><br />
                                                <h3 style={{ fontWeight: "bold" }}>PHIẾU KHẢO SÁT NƠI THỰC TẬP</h3>
                                            </div>
                                            <div>
                                                {/* <FormGroup row>
                                                <h4 style={{ fontWeight: "bold" }}>&emsp;Thông tin cá nhân</h4>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="5">
                                                    <h6 style={{ fontWeight: "bold" }}>Họ tên sinh viên:</h6>
                                                </Col>
                                                <Col xs="12" md="7">
                                                    <Label>Nguyễn Văn A</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="5">
                                                    <h6 style={{ fontWeight: "bold" }}>MSSV:</h6>
                                                </Col>
                                                <Col xs="12" md="7">
                                                    <Label>SE60000</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="5">
                                                    <h6 style={{ fontWeight: "bold" }}>Ngành:</h6>
                                                </Col>
                                                <Col xs="12" md="7">
                                                    <Label>IS</Label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="5">
                                                    <h6 style={{ fontWeight: "bold" }}>Nơi học tập:</h6>
                                                </Col>
                                                <Col xs="12" md="7">
                                                    <Label>FPT University</Label>
                                                </Col>
                                            </FormGroup> */}
                                                <FormGroup row>
                                                    <h4 style={{ fontWeight: "bold" }}>&emsp;&emsp;Thông tin nơi thực tập</h4>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="5">
                                                        <h6 style={{ fontWeight: "bold" }}>Tên công ty thực tập:</h6>
                                                    </Col>
                                                    <Col xs="12" md="7">
                                                        {businessSurvey === null ? <></> : <Label>{businessSurvey.business_name}</Label>}
                                                    </Col>
                                                </FormGroup>
                                                {/* <FormGroup row>
                                                    <Col md="5">
                                                        <h6 style={{ fontWeight: "bold" }}>Lĩnh vực hoạt động:</h6>
                                                    </Col>
                                                    <Col xs="12" md="7">
                                                        <Label>Ngân hàng</Label>
                                                    </Col>
                                                </FormGroup> */}
                                                <FormGroup row>
                                                    <Col md="5">
                                                        <h6 style={{ fontWeight: "bold" }}>Địa chỉ:</h6>
                                                    </Col>
                                                    <Col xs="12" md="7">
                                                        {businessSurvey === null ? <></> : <Label>{businessSurvey.business_address}</Label>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="5">
                                                        <h6 style={{ fontWeight: "bold" }}>Số điện thoại:</h6>
                                                    </Col>
                                                    <Col xs="12" md="7">
                                                        {businessSurvey === null ? <></> : <Label>{businessSurvey.business_phone}</Label>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="5">
                                                        <h6 style={{ fontWeight: "bold" }}>Tên người hướng dẫn:</h6>
                                                    </Col>
                                                    <Col xs="12" md="7">student
                                                        {student === null ? <></> : (student.supervisor === null ? <></> : <Label>{student.supervisor.name}</Label>)}
                                                    </Col>
                                                </FormGroup>
                                                {/* <FormGroup>
                                                <Col md="4">
                                                    <h6 style={{ fontWeight: "bold" }}>Chức vụ:</h6>
                                                </Col>
                                                <Col xs="12" md="8">
                                                    <Label>Trưởng phòng thực tập</Label>
                                                </Col>
                                            </FormGroup> */}
                                            </div>
                                            <hr />
                                            <div style={{ paddingTop: "10px", paddingLeft: "5%", paddingRight: "5%" }}>
                                                {survey && survey.map((ques, index) => {
                                                    return (
                                                        <>
                                                            <FormGroup>
                                                                <row>
                                                                    &emsp;<u><b>Câu {index + 1}</b></u>: {ques.question.content}
                                                                </row>
                                                                <row>
                                                                    <ListGroup>
                                                                        {ques.question.answers && ques.question.answers.map((answer, index1) => {
                                                                            return (
                                                                                <ListGroupItem tag="button" action active={this.checkChose(ques.answers, answer)} disabled>
                                                                                    <FormGroup check className="radio">
                                                                                        <Input className="form-check-input" type="radio" id={answer.id} name={ques.question.id} value={answer.content} checked={this.checkChose(ques.answers, answer)} readOnly />
                                                                                        <Label check className="form-check-label" htmlFor="radio1">{answer.content}</Label>
                                                                                    </FormGroup>
                                                                                </ListGroupItem>
                                                                            )
                                                                        })}
                                                                    </ListGroup>
                                                                </row>
                                                            </FormGroup>
                                                            {index === survey.length ? <></> : <hr />}
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </Form>
                                }
                            </ModalBody>
                            {isUploadTranscriptLink === true ?
                                <ModalFooter>
                                    {role && role === 'ROLE_ADMIN' ?
                                        (
                                            <Button onClick={() => this.handleSubmit()} type="submit" color="primary">Xác nhận</Button>
                                        ) :
                                        (<></>)
                                    }
                                </ModalFooter> :
                                <></>
                            }
                            {
                                isViewSurvey === 1 ?
                                    <ModalFooter>
                                        <Button onClick={() => this.handleBackSurvey()} color="secondary">Trở về</Button>
                                    </ModalFooter> :
                                    <></>
                            }
                        </Modal>
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
                                    <FormGroup row style={{ paddingLeft: '38%' }}>
                                        <Input onChange={e => { this.handleSelectMonth(e, studentDetail) }} type="select" name="months" style={{ width: '250px' }}>
                                            {months && months.map((month, i) => {
                                                return (
                                                    <option value={i} selected={i === isThisMonth}>{month}</option>
                                                )
                                            })}
                                        </Input>
                                    </FormGroup>
                                    <div style={{ height: '492px', overflowY: 'scroll' }}>
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
                                    </div>
                                </ModalBody>
                                {/* <ModalFooter>
                                </ModalFooter> */}
                            </Modal> :
                            <></>
                        }
                        <TabPane tabId="2">
                            {
                                <div>
                                    <nav className="navbar navbar-light bg-light justify-content-between">
                                        <form className="form-inline">
                                            <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                        </form>
                                        <div style={{ marginRight: "4px" }}>
                                            <Input style={{ width: '100px' }} onChange={e => { this.handleInputSelect(e) }} type="select" name="typeStudent">
                                                {typesOfStudent && typesOfStudent.map((typeStudent, i) => {
                                                    return (
                                                        <option value={i} selected={i === this.state.typeSelected}>{typeStudent}</option>
                                                    )
                                                })}
                                            </Input>
                                        </div>
                                    </nav>
                                    <Table responsive striped>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: "center" }}>STT</th>
                                                <th style={{ textAlign: "center" }}>MSSV</th>
                                                <th style={{ textAlign: "center" }}>Họ và Tên</th>
                                                <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                                                <th style={{ textAlign: "center" }}>Nguyện vọng 1</th>
                                                <th style={{ textAlign: "center" }}>Nguyện vọng 2</th>
                                                <th style={{ textAlign: "center" }}>Trạng thái</th>
                                                <th style={{ textAlign: "center" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredListStudents && filteredListStudents.map((student, index) => {
                                                return (
                                                    <tr>
                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.code}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.name}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.specialized.name}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.option1 === null ? 'N/A' : student.student.option1}</td>
                                                        <td style={{ textAlign: "center" }}>{student.student.option2 === null ? 'N/A' : student.student.option2}</td>
                                                        <td style={{ textAlign: "center" }}>{student.businessEnroll === null ? 'N/A' : student.businessEnroll}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                student.businessEnroll === null ?
                                                                    <Button onClick={() => this.toggleModal(student.student)} color="primary">Đăng ký</Button> :
                                                                    <></>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            }
                        </TabPane>
                        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-primary ' + this.props.className}>
                            <ModalHeader toggle={this.toggleModal}>Đăng ký công ty thực tập</ModalHeader>
                            <ModalBody>
                                <h6 style={{ fontWeight: 'bold' }}>Công ty được đề cử(Theo thứ tự):</h6>
                                <hr />
                                {suggestedBusiness && suggestedBusiness.map((business, index) =>
                                    <FormGroup row>
                                        <Col md="10">
                                            <h6>{index + 1}. {business.business_eng_name}</h6>
                                        </Col>
                                        <Col xs="12" md="2">
                                            <Button color="primary" onClick={() => this.handleConfirm(studentSelect, business.email, business.business_eng_name)}>Chọn</Button>
                                        </Col>
                                    </FormGroup>
                                )}
                                <br />
                                <h6 style={{ fontWeight: 'bold' }}>Các công ty khác có tuyển cùng chuyên ngành:</h6>
                                <hr />
                                {otherBusiness && otherBusiness.map((business, index) =>
                                    <FormGroup row>
                                        <Col md="10">
                                            <h6>{business.business_eng_name}</h6>
                                        </Col>
                                        <Col xs="12" md="2">
                                            <Button color="primary">Chọn</Button>
                                        </Col>
                                    </FormGroup>
                                )}
                            </ModalBody>
                            {/* <ModalFooter>
                                <Button color="primary" onClick={this.toggleModal}>Do Something</Button>{' '}
                                <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                            </ModalFooter> */}
                        </Modal>
                    </>
                )
        );
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Danh sách sinh viên
                            </CardHeader>
                            <CardBody>
                                <Nav tabs style={{ fontWeight: "bold" }}>
                                    <NavItem>
                                        <NavLink
                                            active={this.state.activeTab[0] === '1'}
                                            onClick={() => { this.toggle(0, '1'); }}
                                        >
                                            Tổng
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            active={this.state.activeTab[0] === '2'}
                                            onClick={() => { this.toggle(0, '2'); }}
                                        >
                                            Nguyện vọng
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab[0]}>
                                    {this.tabPane()}
                                </TabContent>
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
            </div>
        );
    }
}

export default student_list;
