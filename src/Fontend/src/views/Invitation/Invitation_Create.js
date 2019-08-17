// import { askForPermissioToReceiveNotifications } from '../../service/push-notification';
// import { initializeApp } from '../../service/push-notification';
import firebase from 'firebase';
import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, Pagination, Row, TabContent, Table, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import SimpleReactValidator from '../../validator/simple-react-validator';
import Toastify from '../Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

class Invitation_Create extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            modal: false,
            students: null,
            suggestedStudents: null,
            business_name: '',
            searchValue: '',
            searchSuggestedValue: '',
            isAction: '',
            activeTab: new Array(1).fill('1'),
            loading: true,
            large: false,
            studentDetail: null,
            invitationContent: '',
            student: null,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,
            pageNumberSuggest: 1,
            currentPageSuggest: 0,
            rowsPerPageSuggest: 10
        }
        // this.toggleLarge = this.toggleLarge.bind(this);
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage, currentPageSuggest, rowsPerPageSuggest } = this.state;

        const students = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const suggestedStudents = await ApiServices.Get(`/student/studentsSuggest?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);

        const business = await ApiServices.Get('/business/getBusiness');
        if (students !== null && suggestedStudents !== null) {
            this.setState({
                students: students.listData,
                pageNumber: students.pageNumber,
                suggestedStudents: suggestedStudents.listData,
                pageNumberSuggest: suggestedStudents.pageNumber,
                business_name: business.business_name,
                loading: false,
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

    handleInputInvite = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    toggleLarge = (studentDetail) => {
        this.setState({
            large: !this.state.large,
            studentDetail: studentDetail
        });
        // console.log(this.state.large);
    }

    showModal = () => {
        const { studentDetail } = this.state;
        if (studentDetail !== null && this.state.large) {
            return (
                <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                    className={'modal-primary ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge}>Chi tiết sinh viên</ModalHeader>
                    <ModalBody>
                        {/* <div style={{maxHeight:"663px", overflowY:'auto', overflowX:'hidden'}}> */}
                        <div>
                            <FormGroup row>
                                <Col md="3">
                                    <h6>Họ và tên:</h6>
                                </Col>
                                <Col xs="12" md="9">
                                    <label>{studentDetail.name}</label>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <h6>MSSV</h6>
                                </Col>
                                <Col xs="12" md="9">
                                    <label>{studentDetail.code}</label>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <h6>Chuyên ngành:</h6>
                                </Col>
                                <Col xs="12" md="9">
                                    <label>{studentDetail.specialized.name}</label>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <h6>Giới thiệu bản thân:</h6>
                                </Col>
                                <Col xs="12" md="9">
                                    <label>{studentDetail.objective}</label>
                                </Col>
                            </FormGroup>
                            {/* <FormGroup row>
                            <Col md="3">
                                <h6>Bảng điểm:</h6>
                            </Col>
                            <Col xs="12" md="9">
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
                                    <h6>Kỹ năng chuyên ngành</h6>
                                </Col>
                                <Col xs="12" md="8">
                                    {
                                        studentDetail.skills && studentDetail.skills.map((skill, index) => {
                                            return (
                                                <div>
                                                    {
                                                        skill.name && skill.name && skill.softSkill.toString() === 'false' ? (
                                                            <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                        ) : (
                                                                <></>
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
                                    <h6>Kỹ năng mềm</h6>
                                </Col>
                                <Col xs="12" md="8">
                                    {
                                        studentDetail.skills && studentDetail.skills.map((skill, index) => {
                                            return (
                                                <div>
                                                    {
                                                        skill.softSkill.toString() === 'true' ? (
                                                            <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                        ) : (
                                                                <></>
                                                            )
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <h6>GPA:</h6>
                                </Col>
                                <Col xs="12" md="9">
                                    <label>{studentDetail.gpa}</label>
                                </Col>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button style={{ marginRight: "42%", width: "100px" }} color="primary" onClick={this.toggleLarge}>Xác nhận</Button>
                    </ModalFooter> */}
                </Modal>
            )
        }
    }
    handlePageNumberSuggest = async (currentPageSuggest) => {
        const { rowsPerPageSuggest } = this.state;
        const studentsSuggest = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);

        if (studentsSuggest !== null) {
            this.setState({
                suggestedStudents: studentsSuggest.listData,
                currentPageSuggest,
                pageNumberSuggest: studentsSuggest.pageNumber
            })
        }
    }

    handlePagePreviousSuggest = async (currentPageSuggest) => {
        const { rowsPerPageSuggest } = this.state;
        const studentsSuggest = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);

        if (studentsSuggest !== null) {
            this.setState({
                suggestedStudents: studentsSuggest.listData,
                currentPageSuggest,
                pageNumberSuggest: studentsSuggest.pageNumber
            })
        }
    }

    handlePageNextSuggest = async (currentPageSuggest) => {
        const { rowsPerPageSuggest } = this.state;
        const studentsSuggest = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);

        if (studentsSuggest !== null) {
            this.setState({
                suggestedStudents: studentsSuggest.listData,
                currentPageSuggest,
                pageNumberSuggest: studentsSuggest.pageNumber
            })
        }
    }

    handleInputSuggest = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPageSuggest } = this.state;
        const studentsSuggest = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=0&rowsPerPage=${rowsPerPageSuggest}`);

        if (studentsSuggest !== null) {
            this.setState({
                studentsSuggest: studentsSuggest.listData,
                currentPageSuggest: 0,
                pageNumberSuggest: studentsSuggest.pageNumber
            })
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage,
                pageNumber: students.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage,
                pageNumber: students.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage,
                pageNumber: students.pageNumber
            })
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const students = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (students !== null) {
            this.setState({
                students: students.listData,
                currentPage: 0,
                pageNumber: students.pageNumber
            })
        }
    }

    tabPane() {
        const { students, suggestedStudents, business_name, searchValue, searchSuggestedValue, loading } = this.state;
        const { pageNumber, currentPage, rowsPerPage, pageNumberSuggest, currentPageSuggest, rowsPerPageSuggest } = this.state;
        let filteredListStudents, filteredSuggestedListStudents;

        if (students !== null) {
            filteredListStudents = students.filter(
                (student) => {
                    if (student.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return student;
                    }
                }
            );
        }


        if (suggestedStudents !== null) {
            filteredSuggestedListStudents = suggestedStudents.filter(
                (suggestedStudent) => {
                    if (suggestedStudent.name.toLowerCase().indexOf(searchSuggestedValue.toLowerCase()) !== -1) {
                        return suggestedStudent;
                    }
                }
            );
        }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <>
                        {
                            this.showModal()
                        }
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
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>MSSV</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Họ và tên</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Chuyên ngành</th>
                                                {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Kỹ năng</th> */}
                                                {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>GPA</th> */}
                                                {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Bảng điểm</th> */}
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredListStudents && filteredListStudents.map((student, index) => {
                                                    const skills = student.skills;

                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ textAlign: "center" }}>{student.code}</td>
                                                            <td style={{ textAlign: "center" }}>{student.name}</td>
                                                            <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
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
                                                            </td> */}
                                                            {/* <td style={{ textAlign: "center" }}>{student.gpa}</td> */}
                                                            {/* <td style={{ textAlign: "center" }}>
                                                                {
                                                                    student.transcriptLink && student.transcriptLink ? (
                                                                        <a href={student.transcriptLink} download>tải</a>
                                                                    ) :
                                                                        (<label>N/A</label>)
                                                                }
                                                            </td> */}
                                                            <td style={{ textAlign: "center" }}>
                                                                <Button color="primary" style={{ marginRight: "1.5px" }} onClick={() => this.toggleLarge(student)}><i className="fa fa-eye"></i></Button>
                                                                &nbsp;&nbsp;
                                                                <Button onClick={() => this.toggleModal(student)} type="submit" color="success" id={"btnSendInvitation" + index}>Gửi lời mời</Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                    <Pagination style={{ marginTop: "3%" }}>
                                        <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                        <h6 style={{ marginLeft: "5%", width: "15%", marginTop: "7px" }}>Số dòng trên trang: </h6>
                                        <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{ width: "7%" }}>
                                            <option value={10} selected={rowsPerPage === 10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </Input>
                                    </Pagination>
                                </div>
                            }
                        </TabPane>
                        <TabPane tabId="2">
                            {
                                <div>
                                    <nav className="navbar navbar-light bg-light justify-content-between">
                                        <form className="form-inline">
                                            <input onChange={this.handleInput} name="searchSuggestedValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                        </form>

                                    </nav>
                                    <Table responsive striped>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>MSSV</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Họ và tên</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Chuyên ngành</th>
                                                {/* <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Kỹ năng</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>GPA</th>
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Bảng điểm</th> */}
                                                <th style={{ textAlign: "center", whiteSpace: "nowrap" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredSuggestedListStudents && filteredSuggestedListStudents.map((suggestedStudent, index) => {
                                                    const skills = suggestedStudent.skills;

                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ textAlign: "center" }}>{suggestedStudent.code}</td>
                                                            <td style={{ textAlign: "center" }}>{suggestedStudent.name}</td>
                                                            <td style={{ textAlign: "center" }}>{suggestedStudent.specialized.name}</td>
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
                                                            <td style={{ textAlign: "center" }}>{suggestedStudent.gpa}</td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {
                                                                    suggestedStudent.transcriptLink && suggestedStudent.transcriptLink ? (
                                                                        <a href={suggestedStudent.transcriptLink} download>Tải</a>
                                                                    ) :
                                                                        (<label>N/A</label>)
                                                                }
                                                            </td> */}
                                                            <td style={{ textAlign: "center" }}>
                                                                <Button color="primary" style={{ marginRight: "1.5px" }} onClick={() => this.toggleLarge(suggestedStudent)}><i className="fa fa-eye"></i></Button>
                                                                &nbsp;&nbsp;
                                                                <Button onClick={() => this.toggleModal(suggestedStudent)} type="submit" style={{ marginRight: "1.5px" }} color="success" id={"btnSendInvitation" + index}>Gửi lời mời</Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                    <Pagination style={{ marginTop: "3%" }}>
                                        <PaginationComponent pageNumber={pageNumberSuggest} handlePageNumber={this.handlePageNumberSuggest} handlePageNext={this.handlePageNextSuggest} handlePagePrevious={this.handlePagePreviousSuggest} currentPage={currentPageSuggest} />
                                        <h6 style={{ marginLeft: "5%", width: "15%", marginTop: "7px" }}>Số dòng trên trang: </h6>
                                        <Input onChange={this.handleInputSuggest} type="select" name="rowsPerPageSuggest" style={{ width: "7%" }}>
                                            <option value={10} selected={rowsPerPageSuggest === 10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </Input>
                                    </Pagination>
                                </div>
                            }
                        </TabPane>
                    </>
                )
        );
    }


    handleConfirm = (invitation) => {
        const student = this.state.student;
        if (this.validator.allValid()) {
            this.setState({
                modal: !this.state.modal,
            });
            confirmAlert({
                title: 'Xác nhận',
                message: `Bạn có chắc chắn muốn gửi lời mời thực tập đến sinh viên '${student.name}' ?`,
                buttons: [
                    {
                        label: 'Đồng ý',
                        onClick: () => this.handleSubmit(invitation)
                    },
                    {
                        label: 'Hủy bỏ',
                        onClick: () => this.setState({
                            modal: !this.state.modal,
                        })
                    }
                ]
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }

    };

    handleSubmit = async (invitationContent) => {
        this.setState({
            loading: true
        })
        const student = this.state.student;
        const { business_name } = this.state;
        const studentName = student.name;
        const email = student.email;
        const deviceToken = student.token;
        const code = student.code;

        var studentNumber = student.phone;

        // while (studentNumber.charAt(0) === '0') {
        //     studentNumber = studentNumber.substr(1);
        // }

        // studentNumber = '84' + studentNumber;

        var sms = {
            receiverNumber: `${studentNumber}`,
            content: invitationContent,
        }

        const invitation = {
            description: invitationContent,
            state: 0,
            timeCreated: "2019-09-09",
            title: `Lời mời thực tập từ công ty ${business_name}`
        }

        const result = await ApiServices.Post(`/business/createInvitation?emailStudent=${email}`, invitation);

        const notificationDTO = {
            data: {
                title: `Lời mời thực tập từ công ty ${business_name}`,
                body: invitationContent,
                click_action: "http://localhost:3000/#/invitation/new",
                icon: "http://url-to-an-icon/icon.png"
            },
            to: `${deviceToken}`
        }

        const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);

        if (result.status === 201) {
            Toastify.actionSuccess('Gửi lời mời thành công');
            this.setState({
                loading: false
            })

        } else {
            Toastify.actionFail('Gửi lời mời thất bại');
            this.setState({
                loading: false
            })
        }
        const { currentPage, rowsPerPage, currentPageSuggest, rowsPerPageSuggest } = this.state;

        const students2nd = await ApiServices.Get(`/student/getListStudentNotYetInvited?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        const suggestedStudents = await ApiServices.Get(`/student/studentsSuggest?currentPage=${currentPageSuggest}&rowsPerPage=${rowsPerPageSuggest}`);

        const business = await ApiServices.Get('/business/getBusiness');
        if (students2nd !== null && suggestedStudents !== null) {
            this.setState({
                students: students2nd.listData,
                pageNumber: students2nd.pageNumber,
                suggestedStudents: suggestedStudents.listData,
                pageNumberSuggest: suggestedStudents.pageNumber,
                business_name: business.business_name,
                loading: false,
            });
        }

        // const students2nd = await ApiServices.Get('/student/getListStudentNotYetInvited');
        // const suggestedStudents = await ApiServices.Get('/student/studentsSuggest');
        // const business = await ApiServices.Get('/business/getBusiness');
        // if (students2nd !== null && suggestedStudents !== null) {
        //     this.setState({
        //         students: students2nd,
        //         suggestedStudents: suggestedStudents,
        //         business_name: business.business_name
        //     });
        // }


        setTimeout(
            function () {
                var tempDate = new Date();
                console.log(tempDate);

                let ref = firebase.database().ref('Users');
                ref.on('value', snapshot => {
                    const state = snapshot.val();

                    var codes = Object.keys(state);

                    var index = codes.indexOf(code);

                    if (index !== -1) {
                        var codeFound = codes[index];
                        var dateFirebase = state[codeFound].userState.date;
                        var timeFirebase = state[codeFound].userState.time;
                        var tempDateFirebase = new Date(dateFirebase + ' ' + timeFirebase);
                        console.log('dateFirebase', dateFirebase);
                        console.log('timeFirebase', timeFirebase);
                        console.log('tempDateFirebase', tempDateFirebase);
                        var type = state[codeFound].userState.type;

                        var seconds = (tempDate - tempDateFirebase) / 1000;
                        console.log(seconds);

                        if (type === 'offline') {
                            const result = ApiServices.Post('/business/sms', sms);
                        } else if (type === 'online') {
                            if (seconds > 10) {
                                const result = ApiServices.Post('/business/sms', sms);
                            }
                        }
                    }
                });
            }
                .bind(this),
            5000
        );
    }
    toggle(tabPane, tab) {
        const newArray = this.state.activeTab.slice()
        newArray[tabPane] = tab
        this.setState({
            activeTab: newArray,
        });
    }

    toggleModal = async (suggestedStudent) => {
        const { business_name } = this.state;
        let invitationContent = `Xin chào ${suggestedStudent.name}! Chúng tôi có lời mời bạn tham gia phỏng vấn tại công ty ${business_name}!`;
        this.setState({
            modal: !this.state.modal,
            invitationContent: invitationContent,
            student: suggestedStudent,
        });
    }

    render() {
        const { invitationContent, student } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách sinh viên thực tập
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
                                            Danh sách sinh viên gợi ý
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
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/invitation")} type="submit" color="secondary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-primary ' + this.props.className}>
                    <ModalHeader toggle={this.toggleModal}>Gửi lời mời cho sinh viên</ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            <Col md="1">
                                <Label style={{ fontWeight: "bold", fontSize: "18px" }}>Tới: </Label>
                            </Col>
                            <Col md="11">
                                {student === null ?
                                    <></> :
                                    <Input type="text" value={student.name} disabled></Input>
                                }
                            </Col>
                        </FormGroup>
                        <hr />
                        <Input type="textarea" name="invitationContent" id="invitationContent" rows="9" value={invitationContent} onChange={this.handleInputInvite} />
                        <span className="form-error is-visible text-danger">
                            {this.validator.message('Chi tiết lời mời', invitationContent, 'required')}
                        </span>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Huỷ</Button>{' '}
                        <Button color="primary" onClick={() => this.handleConfirm(invitationContent)}>Gửi</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Invitation_Create;
