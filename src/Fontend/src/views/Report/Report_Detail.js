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
import moment from 'moment';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup,
} from '@progress/kendo-react-excel-export';

class Report_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            reportColor: ['lime', 'DeepSkyBlue', 'gold', 'red', 'black', 'white'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', ''],
            report: null,
            reportDownload: null,
            student: null,
            onScreenRate: 5,
            busniessName: '',
            supervisorName: '',
            role: '',
            // data: null,
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        var param = window.location.href.split("/").pop();
        var needId = param.split('~');
        const report = await ApiServices.Get(`/supervisor/getEvaluation?id=${needId[0]}`);
        let timeStart = report.timeStart;
        let formatTimeStart = timeStart.split('-');
        report.timeStart = formatTimeStart[2] + "/" + formatTimeStart[1] + "/" + formatTimeStart[0];
        let timeEnd = report.timeEnd;
        let formatTimeEnd = timeEnd.split('-');
        report.timeEnd = formatTimeEnd[2] + "/" + formatTimeEnd[1] + "/" + formatTimeEnd[0];
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
        if ((report.score_work*0.5 + report.score_activity*0.1 + report.score_discipline*0.4) > 9) {
            onScreenRate = 0;
        } else if ((report.score_work*0.5 + report.score_activity*0.1 + report.score_discipline*0.4) > 8) {
            onScreenRate = 1;
        } else if ((report.score_work*0.5 + report.score_activity*0.1 + report.score_discipline*0.4) > 7) {
            onScreenRate = 2;
        } else if ((report.score_work*0.5 + report.score_activity*0.1 + report.score_discipline*0.4) >= 5) {
            onScreenRate = 3;
        } else {
            onScreenRate = 4;
        }
        if (report != null) {
            let averageScore = (report.score_work*0.5 + report.score_activity*0.1 + report.score_discipline*0.4);
            let rating = '';
            if (averageScore > 9) {
                rating = "Xuất sắc";
            } else if (averageScore > 8) {
                rating = "Tốt";
            } else if (averageScore > 7) {
                rating = "Khá";
            } else if (averageScore >= 5) {
                rating = "Trung bình";
            } else {
                rating = "Yếu";
            }
            // let reportDownload = [{
            //     MSSV: student.code,
            //     name: student.name,
            //     companyName: businessName,
            //     projectName: report.project_name,
            //     startDate: report.timeStart,
            //     endDate: report.timeEnd,
            //     discipline: report.score_discipline,
            //     workEffect: report.score_work,
            //     activity: report.score_activity,
            //     averageScore: averageScore,
            //     rating: rating,
            //     daysWork: 30,
            //     remark: report.remark,
            // }];
            // const data =  process(reportDownload).data;
            this.setState({
                loading: false,
                report: report,
                student: student,
                onScreenRate: onScreenRate,
                role: role,
                businessName: businessName,
                supervisorName: supervisorName,
                reportDownload: [{
                    MSSV: student.code,
                    name: student.name,
                    companyName: businessName,
                    projectName: report.project_name,
                    startDate: report.timeStart,
                    endDate: report.timeEnd,
                    discipline: report.score_discipline,
                    workEffect: report.score_work,
                    activity: report.score_activity,
                    averageScore: averageScore,
                    rating: rating,
                    daysWork: report.workDays,
                    remark: report.remark,
                }],
                // reportDownload: reportDownload,
                // data: data,
            });
            console.log(this.state.reportDownload);
        }
        // console.log(businessName);
        // console.log(supervisorName);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    _exporter;
    export = () => {
        this._exporter.save();
    }

    render() {
        const { loading, reportColor, rate, report, role, student, onScreenRate, businessName, supervisorName, reportDownload } = this.state;
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
                                        {report === null ? (<></>) :
                                            (role && role === 'ROLE_SUPERVISOR' ?
                                                <>
                                                    &nbsp;&nbsp;
                                            <Button color="primary" onClick={() => this.handleDirect(`/Report/Update_Report/${report.id}~${student.email}`)}>
                                                        Chỉnh sửa
                                            </Button>
                                                </> :
                                                <></>
                                            )
                                        }
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup row style={{paddingLeft:'90%'}}>
                                            {report === null ? "" :
                                                <>
                                                    <Button outline color="primary" onClick={this.export}>Tải đánh giá</Button>
                                                    <ExcelExport
                                                        data={reportDownload}
                                                        fileName={report.title}
                                                        ref={(exporter) => { this._exporter = exporter; }}
                                                    >
                                                        <ExcelExportColumnGroup title={report.title}
                                                            headerCellOptions={{ textAlign: 'center', background:'#ffffff', bold:true, color:'#000000', fontSize:18}}
                                                        >
                                                            <ExcelExportColumn field="MSSV" title="MSSV" 
                                                                headerCellOptions={{ textAlign: 'center', bold:true, background:'#ffffff', color:'#000000', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}} />
                                                            <ExcelExportColumn field="name" title="Họ Tên" 
                                                                headerCellOptions={{ textAlign: 'center', bold:true, background:'#ffffff', color:'#000000', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                            <ExcelExportColumn field="companyName" title="Tên Doanh Nghiệp" 
                                                                headerCellOptions={{ textAlign: 'center', bold:true, background:'#ffffff', color:'#000000', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                            <ExcelExportColumn field="projectName" title="Tên Dự Án"
                                                                headerCellOptions={{ textAlign: 'center', bold:true, background:'#ffffff' , color:'#000000', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                            <ExcelExportColumn field="startDate" title="Ngày bắt đầu đánh giá" 
                                                                headerCellOptions={{ textAlign: 'center', bold:true, background:'#ffffff', color:'#000000', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                            <ExcelExportColumn field="endDate" title="Ngày kết thúc đánh giá" 
                                                                headerCellOptions={{ textAlign: 'center', bold:true, background:'#ffffff', color:'#000000', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                            <ExcelExportColumnGroup title="Đánh giá OJT" 
                                                                headerCellOptions={{ textAlign: 'center', bold:true, color:'#000000', background:'#FFFF00', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}>
                                                                <ExcelExportColumn field="discipline" title="Kỷ luật(40%)" 
                                                                    headerCellOptions={{ textAlign: 'center', bold:true, color:'#000000', background:'#FFFF00', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                                <ExcelExportColumn field="workEffect" title="Hiệu quả công việc(50%)" 
                                                                    headerCellOptions={{ textAlign: 'center', bold:true, color:'#000000', background:'#FFFF00', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                                <ExcelExportColumn field="activity" title="Tham gia các hoạt động(10%)" 
                                                                    headerCellOptions={{ textAlign: 'center', bold:true, color:'#000000', background:'#FFFF00', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                                <ExcelExportColumn field="averageScore" title="Kết quả thực tập" 
                                                                    headerCellOptions={{ textAlign: 'center', bold:true, color:'#000000', background:'#FFFF00', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                                <ExcelExportColumn field="rating" title="Xếp loại" 
                                                                    headerCellOptions={{ textAlign: 'center', bold:true, color:'#000000', background:'#FFFF00', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                                <ExcelExportColumn field="daysWork" title="Số ngày làm việc" 
                                                                    headerCellOptions={{ textAlign: 'center', bold:true, color:'#000000', background:'#FFFF00', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                                <ExcelExportColumn field="remark" title="Nhận xét" 
                                                                    headerCellOptions={{ textAlign: 'center', bold:true, color:'#000000', background:'#FFFF00', borderTop:"size:2", borderLeft:"size:2", borderRight:"size:2", borderBottom:"size:2"}}/>
                                                            </ExcelExportColumnGroup>
                                                        </ExcelExportColumnGroup>
                                                    </ExcelExport>
                                                </>
                                            }
                                        </FormGroup>
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
                                                <Badge className="mr-1" color="primary" pill style={{ fontSize: "16px" }}>{report === null ? "" : report.timeStart}</Badge>
                                            </Col>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Ngày kết thúc:</h6>
                                            </Col>
                                            <Col xs="12" md="4">
                                                <Badge className="mr-1" color="danger" pill style={{ fontSize: "16px" }}>{report === null ? "" : report.timeEnd}</Badge>
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
                                                <h6 style={{ fontWeight: "bold" }}>Điểm kỷ luật:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{report === null ? "" : report.score_discipline}</Label>
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
                                                <h6 style={{ fontWeight: "bold" }}>Xếp loại:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label style={{ fontWeight: 'bold', color: reportColor[onScreenRate] }}>{rate[onScreenRate]}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Số ngày làm việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{report === null ? "" : report.workDays}</Label>
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
