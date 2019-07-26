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


class Hr_Students extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: null,
            searchValue: '',
            loading: true
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

    render() {
        const { students, searchValue, loading } = this.state;
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
                                                                    <Button style={{ width: '100px', marginRight: '2px' }} color="primary" onClick={() => this.handleDirect(`/student-detail/${student.email}`)}>Chi tiết</Button>
                                                                    <Button style={{ width: '100px' }} color="success" onClick={() => this.handleDirect(`/hr-student-list/details/${student.email}`)}>Nhiệm vụ</Button>
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
                    </div>
                )
        );
    }
}

export default Hr_Students;
