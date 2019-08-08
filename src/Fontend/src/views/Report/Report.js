import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            reportColor: ['success', 'primary', 'warning', 'danger', 'dark'],
            finalReportColor: ['lime', 'DeepSkyBlue', 'gold', 'red', 'black'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu'],
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
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        if (role === 'ROLE_SUPERVISOR') {
            students = await ApiServices.Get('/supervisor/students');
            overviewReports = await ApiServices.Get('/supervisor/evaluations');
        } else if (role === 'ROLE_HR') {
            students = await ApiServices.Get('/business/getStudentsByBusiness');
            overviewReports = await ApiServices.Get('/business/evaluations');
        } else if (role === 'ROLE_ADMIN') {
            listStudentAndReport = await ApiServices.Get('/student/studentsEvaluations');
            for (let index = 0; index < listStudentAndReport.length; index++) {
                students.push(listStudentAndReport[index].student);
                for (let index1 = 0; index1 < listStudentAndReport[index].evaluationList.length; index1++) {
                    overviewReports.push(listStudentAndReport[index].evaluationList[index1]);
                }
            }
        }
        // console.log(students);
        // console.log(overviewReports);
    if(overviewReports!==null){
        for (let index = 0; index < overviewReports.length; index++) {
            if (overviewReports[index] !== null) {
                overviewReportsRate.push(overviewReports[index].score_discipline * 0.4 + overviewReports[index].score_work * 0.5 + overviewReports[index].score_activity * 0.1);
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
    }
        // console.log(overviewReportsRate);
        // console.log(students);
        let tmpFinalRate = [];
        for (let index = 0; index < students.length; index++) {
            if (overviewReportsRate[index * 4] !== null && overviewReportsRate[index * 4 + 1] !== null && overviewReportsRate[index * 4 + 2] !== null && overviewReportsRate[index * 4 + 3] !== null) {
                tmpFinalRate.push((overviewReportsRate[index * 4] + overviewReportsRate[index * 4 + 1] + overviewReportsRate[index * 4 + 2] + overviewReportsRate[index * 4 + 3]) / 4);
            } else {
                tmpFinalRate.push(null);
            }
        }
        // console.log(tmpFinalRate);
        for (let index = 0; index < tmpFinalRate.length; index++) {
            // console.log(tmpFinalRate[index]);
            if (tmpFinalRate[index] === null) {
                finalOnScreenStatus.push(null);
            } else {
                if (parseFloat(tmpFinalRate[index]) > 9) {
                    finalOnScreenStatus.push(0);
                } else if (parseFloat(tmpFinalRate[index]) > 8) {
                    finalOnScreenStatus.push(1);
                } else if (parseFloat(tmpFinalRate[index]) > 7) {
                    finalOnScreenStatus.push(2);
                } else if (parseFloat(tmpFinalRate[index]) >= 5) {
                    finalOnScreenStatus.push(3);
                } else if (parseFloat(tmpFinalRate[index]) < 5) {
                    finalOnScreenStatus.push(4);
                }
            }
        }
        this.setState({
            loading: false,
            role: role,
            students: students,
            overviewReports: overviewReports,
            overviewReportsRate: overviewReportsRate,
            onScreenStatus: onScreenStatus,
            finalOnScreenStatus: finalOnScreenStatus,
        });
        // console.log(this.state.onScreenStatus);
        // console.log(this.state.overviewReports);
        // console.log(this.state.students);
        // console.log(this.state.finalOnScreenStatus);
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
        const { loading, reportColor, rate, role, students, overviewReports, onScreenStatus, finalOnScreenStatus, finalReportColor } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Đánh giá
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
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>MSSV</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Họ và tên</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Chuyên ngành</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Đánh giá #1</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Đánh giá #2</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Đánh giá #3</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Đánh giá #4</th>
                                                        <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Kết quả OJT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {students && students.map((student, index) =>
                                                        <tr>
                                                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                            <td style={{ textAlign: "center" }}>{student.code}</td>
                                                            <td style={{ textAlign: "center" }}>{student.name}</td>
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
                                                                        <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4]]} onClick={() => this.handleDirect(`/Report/Report_Detail/${overviewReports[index * 4].id}~${student.email}`)}>
                                                                            {rate[onScreenStatus[index * 4]]}
                                                                        </Button>
                                                                    )
                                                                }
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {onScreenStatus[index * 4 + 1] === null ?
                                                                    (
                                                                        role && role === 'ROLE_SUPERVISOR' ?
                                                                            (onScreenStatus[index * 4] !== null ?
                                                                                <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/2~${student.email}`)}>
                                                                                    Tạo
                                                                            </Button> :
                                                                                <p>N/A</p>
                                                                            ) :
                                                                            <p>N/A</p>
                                                                    ) :
                                                                    (
                                                                        <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 1]]} onClick={() => this.handleDirect(`/Report/Report_Detail/${overviewReports[index * 4 + 1].id}~${student.email}`)}>
                                                                            {rate[onScreenStatus[index * 4 + 1]]}
                                                                        </Button>
                                                                    )
                                                                }
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {onScreenStatus[index * 4 + 2] === null ?
                                                                    (
                                                                        role && role === 'ROLE_SUPERVISOR' ?
                                                                            (onScreenStatus[index * 4 + 1] !== null ?
                                                                                <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/3~${student.email}`)}>
                                                                                    Tạo
                                                                            </Button> :
                                                                                <p>N/A</p>
                                                                            ) :
                                                                            <p>N/A</p>
                                                                    ) :
                                                                    (
                                                                        <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 2]]} onClick={() => this.handleDirect(`/Report/Report_Detail/${overviewReports[index * 4 + 2].id}~${student.email}`)}>
                                                                            {rate[onScreenStatus[index * 4 + 2]]}
                                                                        </Button>
                                                                    )
                                                                }
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>
                                                                {onScreenStatus[index * 4 + 3] === null ?
                                                                    (
                                                                        role && role === 'ROLE_SUPERVISOR' ?
                                                                            (onScreenStatus[index * 4 + 2] !== null ?
                                                                                <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/4~${student.email}`)}>
                                                                                    Tạo
                                                                            </Button> :
                                                                                <p>N/A</p>
                                                                            ) :
                                                                            <p>N/A</p>
                                                                    ) :
                                                                    (
                                                                        <Button style={{ fontWeight: 'bold' }} outline color={reportColor[onScreenStatus[index * 4 + 3]]} onClick={() => this.handleDirect(`/Report/Report_Detail/${overviewReports[index * 4 + 3].id}~${student.email}`)}>
                                                                            {rate[onScreenStatus[index * 4 + 3]]}
                                                                        </Button>
                                                                    )
                                                                }
                                                            </td>
                                                            {finalOnScreenStatus[index] === null ?
                                                                <td style={{ textAlign: "center" }}>N/A</td> :
                                                                <td style={{ textAlign: "center", fontWeight: 'bold', color: finalReportColor[finalOnScreenStatus[index]] }}>{rate[finalOnScreenStatus[index]]}</td>
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
                                    <CardFooter>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Report;
