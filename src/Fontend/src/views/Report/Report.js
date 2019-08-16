import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row, Table, Input, Pagination } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import PaginationComponent from '../Paginations/pagination';

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
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10
        };
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
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
            listStudentAndReport = await ApiServices.Get(`/supervisor/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            for (let index = 0; index < listStudentAndReport.listData.length; index++) {
                students.push(listStudentAndReport.listData[index].student);
                for (let index1 = 0; index1 < listStudentAndReport.listData[index].evaluationList.length; index1++) {
                    overviewReports.push(listStudentAndReport.listData[index].evaluationList[index1]);
                }
            }
        } else if (role === 'ROLE_HR') {
            listStudentAndReport = await ApiServices.Get(`/business/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            console.log(listStudentAndReport);
            for (let index = 0; index < listStudentAndReport.listData.length; index++) {
                students.push(listStudentAndReport.listData[index].student);
                for (let index1 = 0; index1 < listStudentAndReport.listData[index].evaluationList.length; index1++) {
                    overviewReports.push(listStudentAndReport.listData[index].evaluationList[index1]);
                }
            }
        } else if (role === 'ROLE_ADMIN') {
            listStudentAndReport = await ApiServices.Get(`/student/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            console.log(listStudentAndReport);
            for (let index = 0; index < listStudentAndReport.listData.length; index++) {
                students.push(listStudentAndReport.listData[index].student);
                for (let index1 = 0; index1 < listStudentAndReport.listData[index].evaluationList.length; index1++) {
                    overviewReports.push(listStudentAndReport.listData[index].evaluationList[index1]);
                }
            }
        }
        console.log(students);
        // console.log(overviewReports);
        if (overviewReports !== null) {
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
            pageNumber: listStudentAndReport.pageNumber,
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

    handlePageNumber = async (currentPage) => {
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];        

        const { rowsPerPage } = this.state;

        const studentsPaging = await ApiServices.Get(`/student/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
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

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: currentPage,
                pageNumber: studentsPaging.pageNumber,
                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];

        const { rowsPerPage } = this.state;

        const studentsPaging = await ApiServices.Get(`/student/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
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

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: currentPage,
                pageNumber: studentsPaging.pageNumber,
                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
            })
        }
    }

    handlePageNext = async (currentPage) => {
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];

        const { rowsPerPage } = this.state;

        const studentsPaging = await ApiServices.Get(`/student/studentsEvaluations?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
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

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: currentPage,
                pageNumber: studentsPaging.pageNumber,
                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
            })
        }
    }

    handleInputPaging = async (event) => {
        var students = [];
        var overviewReports = [];
        var overviewReportsRate = [];
        var onScreenStatus = [];
        var finalOnScreenStatus = [];
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
            students: null,
        })

        const { rowsPerPage } = this.state;

        const studentsPaging = await ApiServices.Get(`/student/studentsEvaluations?currentPage=0&rowsPerPage=${rowsPerPage}`);
        console.log(studentsPaging);
        for (let index = 0; index < studentsPaging.listData.length; index++) {
            students.push(studentsPaging.listData[index].student);
            for (let index1 = 0; index1 < studentsPaging.listData[index].evaluationList.length; index1++) {
                overviewReports.push(studentsPaging.listData[index].evaluationList[index1]);
            }
            // console.log(studentsPaging.listData[index].evaluationList);
        }
        if (overviewReports !== null) {
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

        if (students !== null) {
            this.setState({
                students: students,
                overviewReports: overviewReports,
                currentPage: 0,
                pageNumber: studentsPaging.pageNumber,

                overviewReportsRate: overviewReportsRate,
                onScreenStatus: onScreenStatus,
                finalOnScreenStatus: finalOnScreenStatus,
            })
        }
    }

    render() {
        const { loading, reportColor, rate, role, students, overviewReports, onScreenStatus, finalOnScreenStatus, finalReportColor } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;

        if (students != null) {
            console.log(students);
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
                                        <Pagination style={{ marginTop: "3%" }}>
                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                            <h6 style={{ marginLeft: "5%", width: "15%", marginTop: "7px" }}>Số dòng trên trang: </h6>
                                            <Input onChange={this.handleInputPaging} type="select" name="rowsPerPage" style={{ width: "7%" }}>
                                                <option value={10} selected={rowsPerPage === 10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </Input>
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
