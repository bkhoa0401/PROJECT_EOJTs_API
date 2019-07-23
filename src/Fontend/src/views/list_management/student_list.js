import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { forEach } from '@firebase/util';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';


class student_list extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: new Array(1).fill('1'),
            open: false,
            students: null,
            searchValue: '',
            loading: true
        };
        this.openPopupRegist = this.openPopupRegist.bind(this);
        this.closePopupRegist = this.closePopupRegist.bind(this);
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

    openPopupRegist() {
        this.setState({ open: true })
    }

    closePopupRegist() {
        this.setState({ open: false })
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

    tabPane() {
        const { students, searchValue, loading } = this.state;
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
                                                            <Button onClick={this.openPopupRegist} color="primary">Đăng ký</Button>
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
                        <Popup
                            open={this.state.open}
                            closeOnDocumentClick
                            onClose={this.closePopupRegist}
                        >
                            <div className="TabContent">
                                <Button className="close" onClick={this.closePopupRegist} >
                                    &times;
                        </Button>
                                <h3 style={{ textAlign: "center" }}>Đăng ký công ty thực tập</h3>
                                <br />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Công ty</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Công ty A</td>
                                            <td style={{ textAlign: "right" }}><Button color="primary">Chọn</Button></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Popup>
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
