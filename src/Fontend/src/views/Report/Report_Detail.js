import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Label, FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import decode from 'jwt-decode';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Report_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            reportColor: ['lime', 'DeepSkyBlue', 'gold', 'red', 'black', 'white'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', ''],
            report: null,
            student: null,
            onScreenRate: 5,
            busniessName: '',
            supervisorName: '',
            role: '',
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        var param = window.location.href.split("/").pop();
        var needId = param.split('~');
        const report = await ApiServices.Get(`/supervisor/getEvaluation?id=${needId[0]}`);
        const student = await ApiServices.Get(`/student/student/${needId[1]}`);
        let role = '';
        let owner = await ApiServices.Get(`/supervisor/business?email=${report.supervisor_email}`);
        let businessName = owner.business_name;
        let actor = await ApiServices.Get(`/supervisor/supervisor?email=${report.supervisor_email}`);
        let supervisorName = actor.name;
        if (token != null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        // if (role == 'ROLE_SUPERVISOR') {
        //     owner = await ApiServices.Get(`/supervisor`);
        //     businessName = owner.business.business_name;
        // } else if (role == 'ROLE_HR') {
        //     owner = await ApiServices.Get(`/business/getBusiness`);
        //     businessName = owner.business_name;
        // } else if (role == 'ROLE_ADMIN') {
        //     owner = await ApiServices.Get(`/student/business?email=${needId[1]}`);
        //     businessName = owner.business_name;
        // }
        let onScreenRate = 5;
        if (((report.score_work + report.score_activity + report.score_discipline) / 3) > 9) {
            onScreenRate = 0;
        } else if (((report.score_work + report.score_activity + report.score_discipline) / 3) > 8) {
            onScreenRate = 1;
        } else if (((report.score_work + report.score_activity + report.score_discipline) / 3) > 7) {
            onScreenRate = 2;
        } else if (((report.score_work + report.score_activity + report.score_discipline) / 3) >= 5) {
            onScreenRate = 3;
        } else {
            onScreenRate = 4;
        }
        if (report != null) {
            this.setState({
                loading: false,
                report: report,
                student: student,
                onScreenRate: onScreenRate,
                role: role,
                businessName: businessName,
                supervisorName: supervisorName,
            });
        }
        // console.log(businessName);
        // console.log(supervisorName);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { loading, reportColor, rate, report, role, student, onScreenRate, businessName, supervisorName } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>{report === null ? "" : report.title}
                                        { report === null ? (<></>) : 
                                        ( role && role === 'ROLE_SUPERVISOR' ?
                                            <>
                                            &nbsp;&nbsp;
                                            <Button color="primary" onClick={() => this.handleDirect(`/Report/Update_Report/${report.id}~${student.email}`)}>
                                                Chỉnh sửa
                                            </Button>
                                            </>:
                                            <></>
                                        )
                                        }
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Người tạo:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{supervisorName}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Doanh nghiệp:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{businessName}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Sinh viên:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{student === null ? "" : student.name}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>MSSV:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{student === null ? "" : student.code}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Ngày bắt đầu:</h6>
                                            </Col>
                                            <Col xs="12" md="4">
                                                <Label>{report === null ? "" : report.timeStart}</Label>
                                            </Col>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Ngày kết thúc:</h6>
                                            </Col>
                                            <Col xs="12" md="4">
                                                <Label>{report === null ? "" : report.timeEnd}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Tên dự án</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{report === null ? "" : report.project_name}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm hiệu quả công việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{report === null ? "" : report.score_work}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm thái độ làm việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{report === null ? "" : report.score_activity}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm kỷ luật:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{report === null ? "" : report.score_discipline}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Xếp loại:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label style={{ fontWeight: 'bold', color: reportColor[onScreenRate] }}>{rate[onScreenRate]}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Nhận xét:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{report === null ? "" : report.remark}</Label>
                                            </Col>
                                        </FormGroup>
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
                        <div style={{ paddingLeft: '45%' }}>
                            <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleDirect('/Report/Report')}>
                                Trở về
                            </Button>
                        </div>
                    </div>
                )
        );
    }
}

export default Report_Detail;
