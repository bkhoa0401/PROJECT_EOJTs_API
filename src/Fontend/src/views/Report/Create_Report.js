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
            onScore: 4,
            title: '',
            timeStart: '',
            timeEnd: '',
            remark: '',
            score_discipline: '0',
            score_work: '0',
            score_activity: '0',
            project_name: '',
            workDays: 0,
            titleHeader: '',
            titleReport: '',

            emailStudent: '',

            student: null,
            businessName: '',

            timeStartShow: '',
            timeEndShow: '',

            validatorNumRange_score_work: '',
            validatorNumRange_score_activity: '',
            validatorNumRange_score_discipline: '',
            maxWorkDays: 0,
            validatorMaxWorkDays: '',
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
        let titleHeader = '';
        let titleReport = '';
        let emailStudent = '';
        title = "EVALUATION" + needParam[0];
        titleHeader = "Đánh giá tháng #" + needParam[0];
        titleReport = "Bảng đánh giá thực tập tháng " + needParam[0];
        emailStudent = needParam[1];
        const student = await ApiServices.Get(`/student/student/${needParam[1]}`);
        const numOfEvaluations = await ApiServices.Get(`/supervisor/getNumOfEvaluationsOfStudent?stuEmail=${needParam[1]}`);
        if (needParam[0] > (numOfEvaluations + 1)) {
            this.props.history.push("/Report/Report");
        }
        const ojtEnrollment = await ApiServices.Get(`/enrollment/getSelectedStuEnrollment?email=${needParam[1]}`);
        var dateEnroll = ojtEnrollment.timeEnroll;
        var splitDate = dateEnroll.split('-');
        let dd = parseInt(splitDate[2]);
        let mm = parseInt(splitDate[1]);
        let mm31 = [1, 3, 5, 7, 8, 10, 12];
        let mm30 = [4, 6, 9, 11];
        let yyyy = parseInt(splitDate[0]);
        let timeStartShow = "";
        if (mm + parseInt(needParam[0]) > 13) {
            if ((mm + parseInt(needParam[0]) - 12 - 1) == 2 && (yyyy + 1) % 4 == 0 && dd > 29) {
                timeStartShow = 29 + "/" + (mm + parseInt(needParam[0]) - 12 - 1) + "/" + (yyyy + 1);
            } else if ((mm + parseInt(needParam[0]) - 12 - 1) == 2 && (yyyy + 1) % 4 != 0 && dd > 28) {
                timeStartShow = 28 + "/" + (mm + parseInt(needParam[0]) - 12 - 1) + "/" + (yyyy + 1);
            } else if (mm30.includes((mm + parseInt(needParam[0]) - 12 - 1)) && dd > 30) {
                timeStartShow = 30 + "/" + (mm + parseInt(needParam[0]) - 12 - 1) + "/" + (yyyy + 1);
            } else {
                timeStartShow = dd + "/" + (mm + parseInt(needParam[0]) - 12 - 1) + "/" + (yyyy + 1);
            }
        } else {
            if ((mm + parseInt(needParam[0]) - 1) == 2 && yyyy % 4 == 0 && dd > 29) {
                timeStartShow = 29 + "/" + (mm + parseInt(needParam[0]) - 1) + "/" + yyyy;
            } else if ((mm + parseInt(needParam[0]) - 1) == 2 && yyyy % 4 != 0 && dd > 28) {
                timeStartShow = 28 + "/" + (mm + parseInt(needParam[0]) - 1) + "/" + yyyy;
            } else if (mm30.includes((mm + parseInt(needParam[0]) - 1)) && dd > 30) {
                timeStartShow = 30 + "/" + (mm + parseInt(needParam[0]) - 1) + "/" + yyyy;
            } else {
                timeStartShow = dd + "/" + (mm + parseInt(needParam[0]) - 1) + "/" + yyyy;
            }
        }
        let formatTimeStartShow = timeStartShow.split('/');
        // console.log(formatTimeStartShow[1]);
        // console.log(formatTimeStartShow[0]);
        if (parseInt(formatTimeStartShow[1]) < 10) {
            formatTimeStartShow[1] = "0" + formatTimeStartShow[1];
        }
        if (parseInt(formatTimeStartShow[0]) < 10) {
            formatTimeStartShow[0] = "0" + formatTimeStartShow[1];
        }
        timeStartShow = formatTimeStartShow[0] + "/" + formatTimeStartShow[1] + "/" + formatTimeStartShow[2];
        let timeEndShow = "";
        if (mm + parseInt(needParam) > 12) {
            if ((mm + parseInt(needParam[0]) - 12) == 2 && (yyyy + 1) % 4 == 0 && dd > 29) {
                timeEndShow = 29 + "/" + (mm + parseInt(needParam[0]) - 12) + "/" + (yyyy + 1);
            } else if ((mm + parseInt(needParam[0]) - 12) == 2 && (yyyy + 1) % 4 != 0 && dd > 28) {
                timeEndShow = 28 + "/" + (mm + parseInt(needParam[0]) - 12) + "/" + (yyyy + 1);
            } else if (mm30.includes((mm + parseInt(needParam[0]) - 12)) && dd > 30) {
                timeEndShow = 30 + "/" + (mm + parseInt(needParam[0]) - 12) + "/" + (yyyy + 1);
            } else {
                timeEndShow = dd + "/" + (mm + parseInt(needParam[0]) - 12) + "/" + (yyyy + 1);
            }
        } else {
            if ((mm + parseInt(needParam[0])) == 2 && yyyy % 4 == 0 && dd > 29) {
                timeEndShow = 29 + "/" + (mm + parseInt(needParam[0])) + "/" + yyyy;
            } else if ((mm + parseInt(needParam[0])) == 2 && yyyy % 4 != 0 && dd > 28) {
                timeEndShow = 28 + "/" + (mm + parseInt(needParam[0])) + "/" + yyyy;
            } else if (mm30.includes((mm + parseInt(needParam[0]))) && dd > 30) {
                timeEndShow = 30 + "/" + (mm + parseInt(needParam[0])) + "/" + yyyy;
            } else {
                timeEndShow = dd + "/" + (mm + parseInt(needParam[0])) + "/" + yyyy;
            }
        }
        let formatTimeEndShow = timeEndShow.split('/');
        if (parseInt(formatTimeEndShow[1]) < 10) {
            formatTimeEndShow[1] = "0" + formatTimeEndShow[1];
        }
        if (parseInt(formatTimeEndShow[0]) < 10) {
            formatTimeEndShow[0] = "0" + formatTimeEndShow[1];
        }
        timeEndShow = formatTimeEndShow[0] + "/" + formatTimeEndShow[1] + "/" + formatTimeEndShow[2];
        let maxWorkDays = 0;
        if (mm30.includes(parseInt(formatTimeStartShow[1]))) {
            maxWorkDays = 30 - parseInt(formatTimeStartShow[0]) + parseInt(formatTimeEndShow[0]);
        } else if (mm31.includes(parseInt(formatTimeStartShow[1]))) {
            maxWorkDays = 31 - parseInt(formatTimeStartShow[0]) + parseInt(formatTimeEndShow[0]);
        } else if (parseInt(formatTimeStartShow[1]) == 2) {
            if (parseInt(formatTimeStartShow[2]) % 4 == 0) {
                maxWorkDays = 29 - parseInt(formatTimeStartShow[0]) + parseInt(formatTimeEndShow[0]);
            } else {
                maxWorkDays = 28 - parseInt(formatTimeStartShow[0]) + parseInt(formatTimeEndShow[0]);
            }
        }
        // console.log(maxWorkDays);
        this.setState({
            loading: false,
            title: title,
            emailStudent: emailStudent,
            student: student,
            businessName: businessName,
            //dd-MM-yyyy
            timeStartShow: timeStartShow,
            //dd-MM-yyyy
            timeEndShow: timeEndShow,
            maxWorkDays: maxWorkDays,
            titleHeader: titleHeader,
            titleReport: titleReport,
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
        let validatorMaxWorkDays = '';
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
            let tmpScore = parseFloat((parseFloat(score_discipline) * 0.4 + parseFloat(score_work) * 0.5 + parseFloat(score_activity) * 0.1));
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
            validatorMaxWorkDays: validatorMaxWorkDays,
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
        const { title, remark, score_discipline, score_work, score_activity, project_name, workDays, maxWorkDays } = this.state;

        let timeStart = "";
        let timeStartShow = this.state.timeStartShow;
        var formatTimeStart = timeStartShow.split('/');
        //yyyy-MM-dd
        timeStart = formatTimeStart[2] + "-" + formatTimeStart[1] + "-" + formatTimeStart[0];

        let timeEnd = "";
        let timeEndShow = this.state.timeEndShow;
        var formatTimeEnd = timeEndShow.split('/');
        //yyyy-MM-dd
        timeEnd = formatTimeEnd[2] + "-" + formatTimeEnd[1] + "-" + formatTimeEnd[0];
        let validatorNumRange_score_work = '';
        let validatorNumRange_score_activity = '';
        let validatorNumRange_score_discipline = '';
        let validatorMaxWorkDays = '';
        if (this.validator.allValid()) {
            if ((parseFloat(score_work) < 0 || parseFloat(score_work) > 10) ||
                (parseFloat(score_activity) < 0 || parseFloat(score_activity) > 10) ||
                (parseFloat(score_discipline) < 0 || parseFloat(score_discipline) > 10) ||
                workDays > maxWorkDays) {
                if (parseFloat(score_work) < 0 || parseFloat(score_work) > 10) {
                    validatorNumRange_score_work = 'Điểm hiệu quả công việc không hợp lệ.( >= 0 & <=10 )';
                }
                if (parseFloat(score_activity) < 0 || parseFloat(score_activity) > 10) {
                    validatorNumRange_score_activity = 'Điểm thái độ làm việc không hợp lệ.( >= 0 & <=10 )';
                }
                if (parseFloat(score_discipline) < 0 || parseFloat(score_discipline) > 10) {
                    validatorNumRange_score_discipline = 'Điểm kỷ luật không hợp lệ. ( >= 0 & <=10 )';
                }

                if (workDays > maxWorkDays) {
                    validatorMaxWorkDays = 'Số ngày làm việc không thể vượt qua số ngày thực tế trong tháng.';
                }

                this.setState({
                    validatorNumRange_score_work: validatorNumRange_score_work,
                    validatorNumRange_score_activity: validatorNumRange_score_activity,
                    validatorNumRange_score_discipline: validatorNumRange_score_discipline,
                    validatorMaxWorkDays: validatorMaxWorkDays,
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
                    workDays,
                }
                const result = await ApiServices.Post(`/supervisor/evaluation?emailStudent=${emailStudent}`, evaluation);
                console.log(result);
                console.log(emailStudent);
                console.log(evaluation);
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
        const { titleReport, titleHeader, maxWorkDays, validatorMaxWorkDays, validatorNumRange_score_work, validatorNumRange_score_activity, validatorNumRange_score_discipline, loading, reportColor, rate, title, student, businessName, score_work, score_activity, score_discipline, workDays, remark, project_name, onScore, timeStartShow, timeEndShow } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>{titleHeader}
                                    </CardHeader>
                                    <CardBody>
                                        <div style={{ paddingLeft: "3%", paddingRight: "3%", textAlign: "center" }}>
                                            <img src="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410" />
                                            <br /><br /><br />
                                            <h2 style={{ fontWeight: "bold" }}>{titleReport}</h2>
                                        </div>
                                        <hr/>
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
                                                <Badge className="mr-1" color="primary" pill style={{ fontSize: "16px" }}>{timeStartShow === null ? "" : timeStartShow}</Badge>
                                            </Col>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Ngày kết thúc:</h6>
                                            </Col>
                                            <Col xs="12" md="4">
                                                <Badge className="mr-1" color="danger" pill style={{ fontSize: "16px" }}>{timeEndShow === null ? "" : timeEndShow}</Badge>
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
                                                <h6 style={{ fontWeight: "bold" }}>Xếp loại:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label style={{ fontWeight: 'bold', color: reportColor[onScore] }}>{rate[onScore]}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6 style={{ fontWeight: "bold" }}>Số ngày làm việc:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Input value={workDays} type='number' style={{ width: '70px' }} onChange={this.handleInputScore} id="workDays" name="workDays" min="0" max={maxWorkDays}></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Số ngày làm việc', workDays, 'required|integer')}
                                                </span>
                                                <span className="form-error is-visible text-danger">
                                                    {validatorMaxWorkDays}
                                                </span>
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
                                    <CardFooter>
                                        <Row style={{ marginLeft: "21%" }}>
                                            <Col xs="4" sm="4">
                                                <Button block color="danger" onClick={() => this.handleDirect('/Report/Report')}>
                                                    Huỷ bỏ
                                                </Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button block color="primary" onClick={() => this.handleSubmit()}>
                                                    Tạo
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Create_Report;
