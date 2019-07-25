import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { forEach } from '@firebase/util';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


class student_list extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            modal: false,
            activeTab: new Array(1).fill('1'),
            // open: false,
            students: null,
            searchValue: '',
            loading: true,
            suggestedBusiness: null,
            otherBusiness: null,
            studentSelect: null,
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
        console.log(result);

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
                                                <th style={{ textAlign: "center" }}>Bảng điểm</th>
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
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                student.transcriptLink && student.transcriptLink ? (
                                                                    <a href={student.student.transcriptLink} download>Tải</a>
                                                                ) :
                                                                    (<label>N/A</label>)
                                                            }
                                                        </td>
                                                        {/* <td style={{ textAlign: "center" }}>{student.gpa}</td> */}
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button style={{ width: "80px" }} color="success" onClick={() => this.handleDirect(`/student/${student.student.email}`)}>Chi tiết</Button>
                                                            &nbsp;
                                                            <Button style={{ width: "90px" }} color="primary" onClick={() => this.handleDirect(`/hr-student-list/details/${student.student.email}`)}>Nhiệm vụ</Button>
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
                                                            <Button onClick={() => this.toggleModal(student.student)} color="primary">Đăng ký</Button>
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
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggleModal}>Do Something</Button>{' '}
                                <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                            </ModalFooter>
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
