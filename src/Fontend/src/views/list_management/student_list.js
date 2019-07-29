import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Form, Label, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
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

const storage = firebase.storage();

class student_list extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            modal: false,
            modalDetail: false,
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

    toggle(tabPane, tab) {
        const newArray = this.state.activeTab.slice()
        newArray[tabPane] = tab
        this.setState({
            activeTab: newArray,
        });
    }

    toggleModal = async (studentSelect) => {
        let suggestedBusiness = null;
        let otherBusiness = null;
        if (this.state.modal == false) {
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
        });
    }

    toggleModalDetail = async (email) => {
        let students = null;
        let role = '';
        if (this.state.modalDetail == false) {
            students = await ApiServices.Get(`/student/student/${email}`);

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
            });
        } else {
            this.setState({
                modalDetail: !this.state.modalDetail,
            });
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

    handleSubmit = async () => {
        this.setState({
            loading: true
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
            this.setState({
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
        const { students, searchValue, loading, suggestedBusiness, otherBusiness, studentSelect } = this.state;

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
                                                            &nbsp;
                                                            <Button style={{ width: "90px" }} color="success" onClick={() => this.handleDirect(`/hr-student-list/details/${student.student.email}`)}>Nhiệm vụ</Button>
                                                            &nbsp;
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
                        <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail} className={'modal-primary ' + this.props.className}>
                            <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                            <ModalBody>
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
                                </Form>
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
                        </Modal>
                        <TabPane tabId="2">
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
