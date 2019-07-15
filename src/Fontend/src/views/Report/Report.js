import React, { Component } from 'react';
import { FormGroup, ButtonGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import decode from 'jwt-decode';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';

class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reportColor: ['success', 'primary', 'warning', 'danger', 'dark', 'black'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', 'N/A'],
            role: '',
            students: null,
            overviewReports: null,
            overviewReportsRate: null,
            onScreenStatus: null,
            finalOnScreenStatus: null,
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let overviewReportsRate = [];
        let onScreenStatus = [];
        let role = '';
        let students = [];
        let overviewReports = [];
        let finalOnScreenStatus = [];
        let listStudentAndReport = null;
        if (token != null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        if (role == 'ROLE_SUPERVISOR') {
            students = await ApiServices.Get('/supervisor/students');
            overviewReports = await ApiServices.Get('/supervisor/evaluations');
        } else if (role == 'ROLE_HR') {
            students = await ApiServices.Get('/business/getStudentsByBusiness');
            overviewReports = await ApiServices.Get('/business/evaluations');
        } else if (role == 'ROLE_ADMIN') {
            listStudentAndReport = await ApiServices.Get('/student/studentsEvaluations');
            for (let index = 0; index < listStudentAndReport.length; index++) {
                students.push(listStudentAndReport[index].student);
                for (let index1 = 0; index1 < listStudentAndReport[index].evaluationList.length; index1++) {
                    overviewReports.push(listStudentAndReport[index].evaluationList[index1]);
                }
            }
        }
        console.log(students);
        console.log(overviewReports);
        for (let index = 0; index < overviewReports.length; index++) {
            if (overviewReports[index] != null) {
                overviewReportsRate.push((overviewReports[index].score_discipline + overviewReports[index].score_work + overviewReports[index].score_activity) / 3);
                if (overviewReportsRate[index] > 9) {
                    onScreenStatus.push(0);
                } else if (overviewReportsRate[index] > 8) {
                    onScreenStatus.push(1);
                } else if (overviewReportsRate[index] > 7) {
                    onScreenStatus.push(2);
                } else if (overviewReportsRate[index] >= 5) {
                    onScreenStatus.push(3);
                } else {
                    onScreenStatus.push(4);
                }
            } else {
                overviewReportsRate.push(null);
                onScreenStatus.push(null);
            }
        }
        for (let index = 0; index < students.length; index++) {
            if (overviewReportsRate[index] != null && overviewReportsRate[index + 1] != null && overviewReportsRate[index + 2] != null && overviewReportsRate[index + 3] != null) {
                let tmpFinalRate = (overviewReportsRate[index] +  overviewReportsRate[index + 1] + overviewReportsRate[index + 2] + overviewReportsRate[index + 3])/4;
                if (tmpFinalRate > 9) {
                    finalOnScreenStatus.push(0);
                } else if (tmpFinalRate > 8) {
                    finalOnScreenStatus.push(1);
                } else if (tmpFinalRate > 7) {
                    finalOnScreenStatus.push(2);
                } else if (tmpFinalRate >= 5) {
                    finalOnScreenStatus.push(3);
                } else if (tmpFinalRate < 5) {
                    finalOnScreenStatus.push(4);
                }
            } else {
                finalOnScreenStatus.push(5);
            }
        }
        this.setState({
            role: role,
            students: students,
            overviewReports: overviewReports,
            overviewReportsRate: overviewReportsRate,
            onScreenStatus: onScreenStatus,
            finalOnScreenStatus: finalOnScreenStatus,
        });
        console.log(this.state.onScreenStatus);
        console.log(this.state.overviewReports);
        console.log(this.state.students);
        console.log(this.state.finalOnScreenStatus);
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

    render() {
        const { searchValue, reportColor, rate, role, students, overviewReports, onScreenStatus, finalOnScreenStatus } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Báo cáo
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
                                                <th style={{ textAlign: "center" }}>Họ và tên</th>
                                                <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                                                <th style={{ textAlign: "center" }}>Báo cáo #1</th>
                                                <th style={{ textAlign: "center" }}>Báo cáo #2</th>
                                                <th style={{ textAlign: "center" }}>Báo cáo #3</th>
                                                <th style={{ textAlign: "center" }}>Báo cáo #4</th>
                                                <th style={{ textAlign: "center" }}>Kết quả OJT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students && students.map((student, index) =>
                                                <tr>
                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                    <td style={{ textAlign: "center" }}>{student.code}</td>
                                                    <td style={{ textAlign: "center" }}>{student.email}</td>
                                                    <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {onScreenStatus[index * 4] === null ?
                                                            (
                                                                role && role === 'ROLE_SUPERVISOR' ?
                                                                    <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/1~${student.email}`)}>
                                                                        Tạo
                                                                    </Button> :
                                                                    <p>N/A</p>
                                                            ) :
                                                            (
                                                                <Button style={{fontWeight:'bold'}} outline color={reportColor[onScreenStatus[index * 4]]} onClick={() => this.handleDirect(`/Report/Report_Detail/${overviewReports[index * 4].id}~${student.email}`)}>
                                                                    {rate[onScreenStatus[index * 4]]}
                                                                </Button>
                                                            )
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {onScreenStatus[index * 4 + 1] === null ?
                                                            (
                                                                role && role === 'ROLE_SUPERVISOR' ?
                                                                    <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/2~${student.email}`)}>
                                                                        Tạo
                                                                    </Button> :
                                                                    <p>N/A</p>
                                                            ) :
                                                            (
                                                                <Button style={{fontWeight:'bold'}} outline color={reportColor[onScreenStatus[index * 4 + 1]]} onClick={() => this.handleDirect(`/Report/Report_Detail/${overviewReports[index * 4 + 1].id}~${student.email}`)}>
                                                                    {rate[onScreenStatus[index * 4 + 1]]}
                                                                </Button>
                                                            )
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {onScreenStatus[index * 4 + 2] === null ?
                                                            (
                                                                role && role === 'ROLE_SUPERVISOR' ?
                                                                    <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/3~${student.email}`)}>
                                                                        Tạo
                                                                    </Button> :
                                                                    <p>N/A</p>
                                                            ) :
                                                            (
                                                                <Button style={{fontWeight:'bold'}} outline color={reportColor[onScreenStatus[index * 4 + 2]]} onClick={() => this.handleDirect(`/Report/Report_Detail/${overviewReports[index * 4 + 2].id}~${student.email}`)}>
                                                                    {rate[onScreenStatus[index * 4 + 2]]}
                                                                </Button>
                                                            )
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {onScreenStatus[index * 4 + 3] === null ?
                                                            (
                                                                role && role === 'ROLE_SUPERVISOR' ?
                                                                    <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/4~${student.email}`)}>
                                                                        Tạo
                                                                    </Button> :
                                                                    <p>N/A</p>
                                                            ) :
                                                            (
                                                                <Button style={{fontWeight:'bold'}} outline color={reportColor[onScreenStatus[index * 4 + 3]]} onClick={() => this.handleDirect(`/Report/Report_Detail/${overviewReports[index * 4 + 3].id}~${student.email}`)}>
                                                                    {rate[onScreenStatus[index * 4 + 3]]}
                                                                </Button>
                                                            )
                                                        }
                                                    </td>
                                                    { finalOnScreenStatus === null ? 
                                                    <td style={{ textAlign: "center"}}>N/A</td> :
                                                    <td style={{ textAlign: "center", color: reportColor[finalOnScreenStatus[index]] }}>{rate[finalOnScreenStatus[index]]}</td>
                                                    }
                                                </tr>
                                            )}
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
        );
    }
}

export default Report;
