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

class Report_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reportColor:['lime', 'DeepSkyBlue', 'gold', 'red', 'black', 'white'],
            rate:['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', ''],
            report: null,
            student: null,
            onScreenRate: 5,
            busniessName: '',
            role:'',
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        var param = window.location.href.split("/").pop();
        var needId = param.split('~');
        let role = '';
        let actor = null;
        let businessName = '';
        if (token != null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        if (role == 'ROLE_SUPERVISOR') {
            actor = await ApiServices.Get(`/supervisor`);
            businessName = actor.business.business_name;
        } else if (role == 'ROLE_HR') {
            actor = await ApiServices.Get(`/business/getBusiness`);
            businessName = actor.business_name;
        }
        const report = await ApiServices.Get(`/supervisor/getEvaluation?id=${needId[0]}`);
        const student = await ApiServices.Get(`/student/student/${needId[1]}`);
        let onScreenRate = 5;
        if (((report.score_work + report.score_activity + report.score_discipline)/3) > 9) {
            onScreenRate = 0;
        } else if (((report.score_work + report.score_activity + report.score_discipline)/3) > 8) {
            onScreenRate = 1;
        } else if (((report.score_work + report.score_activity + report.score_discipline)/3) > 7) {
            onScreenRate = 2;
        } else if (((report.score_work + report.score_activity + report.score_discipline)/3) >= 5) {
            onScreenRate = 3;
        } else {
            onScreenRate = 4;
        }
        if (report != null) {
          this.setState({
            report: report,
            student: student,
            onScreenRate: onScreenRate,
            actor: actor,
            role: role,
            businessName: businessName,
          });
        }
        console.log(businessName);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { searchValue, reportColor, rate, report, student, onScreenRate, businessName } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>{report === null ? "" : report.title}
                            </CardHeader>
                            <CardBody>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Doanh nghiệp:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>{businessName}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Sinh viên:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>{student === null ? "" : student.name}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>MSSV:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>{student === null ? "" : student.code}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm hiệu quả công việc:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>{report === null ? "" : report.score_work}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm thái độ làm việc:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>{report === null ? "" : report.score_activity}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm kỷ luật:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>{report === null ? "" : report.score_discipline}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Xếp loại:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label style={{fontWeight:'bold', color:reportColor[onScreenRate]}}>{rate[onScreenRate]}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Nhận xét:</h6>
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
                        </Card>
                    </Col>
                </Row>
                <div style={{paddingLeft:'45%'}}>
                    <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleDirect('/Report/Report')}>
                        Trở về
                    </Button>
                </div>
            </div>
        );
    }
}

export default Report_Detail;
