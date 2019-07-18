import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Label, FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import decode from 'jwt-decode';
import Toastify from '../Toastify/Toastify';
import SimpleReactValidator from '../../validator/simple-react-validator';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class Create_Report extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            reportColor: ['lime', 'DeepSkyBlue', 'gold', 'red', 'black', 'black'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', 'N/A'],
            onScore: 5,
            title: '',
            timeStart: '',
            timeEnd: '',
            remark: '',
            score_discipline: '0',
            score_work: '0',
            score_activity: '0',
            project_name: '',

            emailStudent: '',

            student: null,
            businessName: '',

            validatorNumRange_score_work: '',
            validatorNumRange_score_activity: '',
            validatorNumRange_score_discipline: '',
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
        title = "Đánh giá tháng #" + needParam[0];
        emailStudent = needParam[1];
        const student = await ApiServices.Get(`/student/student/${needParam[1]}`);
        this.setState({
            loading: false,
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

    handleInputScore = async (event) => {
        const { name, value } = event.target;
        let validatorNumRange_score_work = '';
        let validatorNumRange_score_activity = '';
        let validatorNumRange_score_discipline = '';
        // if ((parseFloat(score_work) >= 0 && parseFloat(score_work) <= 10) ||
        //         (parseFloat(score_activity) >= 0 && parseFloat(score_activity) <= 10) ||
        //         (parseFloat(score_discipline) >= 0 && parseFloat(score_discipline) <= 10)) {
        //         if (parseFloat(score_work) >= 0 && parseFloat(score_work) <= 10) {
        //             validatorNumRange_score_work = '';
        //         }
        //         if (parseFloat(score_activity) >= 0 && parseFloat(score_activity) <= 10) {
        //             validatorNumRange_score_activity = '';
        //         }
        //         if (parseFloat(score_discipline) >= 0 && parseFloat(score_discipline) <= 10) {
        //             validatorNumRange_score_discipline = '';
        //         }
        // }
        let score_discipline = this.state.score_discipline;
        if (event.target.name == "score_discipline") {
            score_discipline = value;
        }
        // console.log("score_discipline " + score_discipline);
        let score_work = this.state.score_work;
        if (event.target.name == "score_work") {
            score_work = value;
        }
        // console.log("score_discipline " + score_work);
        let score_activity = this.state.score_activity;
        if (event.target.name == "score_activity") {
            score_activity = value;
        }
        // console.log("score_discipline " + score_activity);
        let onScore = this.state.onScore;
        if (score_discipline == "" || score_work == "" || score_activity == "") {
            onScore = 5;
        } else {
            let tmpScore = parseFloat((parseFloat(score_discipline) + parseFloat(score_activity) + parseFloat(score_activity)) / 3);
            // console.log("score_discipline " + tmpScore);
            if (tmpScore > 9) {
                onScore = 0;
            } else if (tmpScore > 8) {
                onScore = 1;
            } else if (tmpScore > 7) {
                onScore = 2;
            } else if (tmpScore >= 5) {
                onScore = 3;
            } else if (tmpScore < 5) {
                onScore = 4;
            } else {
                onScore = 5;
            }
        }
        await this.setState({
            [name]: value,
            onScore: onScore,
            validatorNumRange_score_work: validatorNumRange_score_work,
            validatorNumRange_score_activity: validatorNumRange_score_activity,
            validatorNumRange_score_discipline: validatorNumRange_score_discipline,
        })
        // console.log(this.state.onScore);
        // console.log("score_discipline " + score_discipline);
        // console.log("score_discipline " + score_work);
        // console.log("score_discipline " + score_activity);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleSubmit = async () => {
        const { title, timeStart, timeEnd, remark, score_discipline, score_work, score_activity, project_name } = this.state;
        let validatorNumRange_score_work = '';
        let validatorNumRange_score_activity = '';
        let validatorNumRange_score_discipline = '';
        if (this.validator.allValid()) {
            if ((parseFloat(score_work) < 0 || parseFloat(score_work) > 10) ||
                (parseFloat(score_activity) < 0 || parseFloat(score_activity) > 10) ||
                (parseFloat(score_discipline) < 0 || parseFloat(score_discipline) > 10)) {
                if (parseFloat(score_work) < 0 || parseFloat(score_work) > 10) {
                    validatorNumRange_score_work = 'Điểm hiệu quả công việc không hợp lệ.';
                }
                if (parseFloat(score_activity) < 0 || parseFloat(score_activity) > 10) {
                    validatorNumRange_score_activity = 'Điểm thái độ làm việc không hợp lệ';
                }
                if (parseFloat(score_discipline) < 0 || parseFloat(score_discipline) > 10) {
                    validatorNumRange_score_discipline = 'Điểm kỷ luật không hợp lệ';
                }
                this.setState({
                    validatorNumRange_score_work: validatorNumRange_score_work,
                    validatorNumRange_score_activity: validatorNumRange_score_activity,
                    validatorNumRange_score_discipline: validatorNumRange_score_discipline,
                })
            } else {
                this.setState({
                    loading: true
                })
                const emailStudent = this.state.emailStudent;
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
                // console.log(result);
                // console.log(emailStudent);
                // console.log(evaluation);
                if (result.status == 201) {
                    Toastify.actionSuccess("Tạo đánh giá tháng thành công!");
                    this.props.history.push("/Report/Report");
                } else {
                    Toastify.actionFail("Tạo đánh giá tháng thất bại!");
                    this.setState({
                        loading: false
                    })
                }
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { validatorNumRange_score_work, validatorNumRange_score_activity, validatorNumRange_score_discipline, loading, reportColor, rate, title, student, businessName, score_work, score_activity, score_discipline, remark, project_name, timeStart, timeEnd, onScore } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
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
                                                <Input value={timeStart} type="date" onChange={this.handleInput} id="timeStart" name="timeStart"></Input>
                                            </Col>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Ngày kết thúc:</h6>
                                            </Col>
                                            <Col xs="12" md="4">
                                                <Input value={timeEnd} type="date" onChange={this.handleInput} id="timeEnd" name="timeEnd"></Input>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Tên dự án</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={project_name} type="text" onKeyPress={this.handleKeyPress} onChange={this.handleInput} id="project_name" name="project_name"></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Tên dự án', project_name, 'required|max:50|alpha_num_space')}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm hiệu quả công việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={score_work} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="score_work" name="score_work" min="0" max="10"></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Điểm hiệu quả công việc', score_work, 'required|numeric')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorNumRange_score_work}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm thái độ làm việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={score_activity} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="score_activity" name="score_activity" min="0" max="10"></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Điểm thái độ làm việc', score_activity, 'required|numeric')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorNumRange_score_activity}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Điểm kỷ luật:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={score_discipline} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="score_discipline" name="score_discipline" min="0" max="10"></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Điểm kỷ luật', score_discipline, 'required|numeric')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorNumRange_score_discipline}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Xếp loại:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label style={{ fontWeight: 'bold', color: reportColor[onScore] }}>{rate[onScore]}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Nhận xét:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={remark} type="textarea" rows="9" placeholder="Nhập nhận xét..." onChange={this.handleInput} id="remark" name="remark" />
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
                        <div style={{ paddingLeft: '40%' }}>
                            <Button style={{ width: '100px' }} outline color="primary" onClick={() => this.handleDirect('/Report/Report')}>
                                Trở về
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleSubmit()}>
                                Tạo
                            </Button>
                        </div>
                    </div>
                )
        );
    }
}

export default Create_Report;
