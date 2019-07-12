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

class Create_Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reportColor:['lime', 'DeepSkyBlue', 'gold', 'red', 'black'],
            rate:['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu'],
            title:'',
            timeStart: '',
            timeEnd: '',
            remark:'',
            score_discipline:'',
            score_work:'',
            score_activity:'',
            project_name:'',

            emailStudent:'',

            student: null,
            businessName: '',
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
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
        var param = window.location.href.split("/").pop();
        var needParam = param.split('~');
        let title = '';
        let emailStudent = '';
        title = "Báo cáo tháng #" + needParam[0];
        emailStudent = needParam[1];
        const student = await ApiServices.Get(`/student/student/${needParam[1]}`);
        this.setState({
            title: title,
            emailStudent: emailStudent,
            student: student,
            businessName: businessName,
        });
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleSubmit = async () => {
        const emailStudent = this.state.emailStudent;
        const { title, timeStart, timeEnd, remark, score_discipline, score_work, score_activity, project_name } = this.state;
        const evaluation = {
            title,
            timeStart,
            timeEnd,
            remark,
            score_discipline,
            score_work,
            score_activity,
            project_name,
        }
        const result = await ApiServices.Post(`/supervisor/evaluation?emailStudent=${emailStudent}`, evaluation);
        console.log(result);
        console.log(emailStudent);
        console.log(evaluation);
        if (result.status == 201) {
            Toastify.actionSuccess("Tạo thông báo thành công!");
            this.props.history.push("/InformMessage/InformMessage");
        } else {
            Toastify.actionFail("Tạo thông báo thất bại!");
        }
    }

    render() {
        const { reportColor, rate, title, student, businessName, score_work, score_activity, score_discipline, remark, project_name, timeStart, timeEnd } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>{title}
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
                                        <h6>Ngày bắt đầu:</h6>
                                    </Col>
                                    <Col xs="12" md="4">
                                        <Input value={timeStart} type="date" onChange={this.handleInput} id="timeStart" name="timeStart"></Input>
                                    </Col>
                                    <Col md="2">
                                        <h6>Ngày kết thúc:</h6>
                                    </Col>
                                    <Col xs="12" md="4">
                                        <Input value={timeEnd} type="date" onChange={this.handleInput} id="timeEnd" name="timeEnd"></Input>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Tên dự án</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Input value={project_name} type="text" onChange={this.handleInput} id="project_name" name="project_name"></Input>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm hiệu quả công việc:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Input value={score_work} type='number' style={{width:'70px'}} onChange={this.handleInput} id="score_work" name="score_work"></Input>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm thái độ làm việc:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Input value={score_activity} type='number' style={{width:'70px'}} onChange={this.handleInput} id="score_activity" name="score_activity"></Input>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm kỷ luật:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Input value={score_discipline} type='number' style={{width:'70px'}} onChange={this.handleInput} id="score_discipline" name="score_discipline"></Input>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Xếp loại:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label style={{fontWeight:'bold', color:reportColor[0]}}>{rate[0]}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Nhận xét:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                    <Input value={remark} type="textarea" rows="9" placeholder="Nhập nhận xét..." onChange={this.handleInput} id="remark" name="remark"/>
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
                <div style={{paddingLeft:'40%'}}>
                    <Button style={{ width: '100px' }} outline color="primary" onClick={() => this.handleDirect('/Report/Report')}>
                        Trở về
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleSubmit()}>
                        Tạo
                    </Button>
                </div>
            </div>
        );
    }
}

export default Create_Report;
