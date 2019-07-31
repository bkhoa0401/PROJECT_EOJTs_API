import React, { Component } from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
import SimpleReactValidator from '../../validator/simple-react-validator';


class ScheduleParameters extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            finish_choose_option_time: '',
            finish_interview_time: '',
            finish_choose_business_time: '',
            end_date: '',
            start_date: '',
            start_choose_option_time: '',
            virgin: false,
            name: '',
        }
    }

    async componentDidMount() {
        var month = new Date().getMonth() + 1; //Current Month.
        var year = new Date(). getFullYear(); //Current Year.
        // console.log(month);
        let semesterName = "";
        if ( parseInt(month) == 1 || parseInt(month) == 2 || parseInt(month) == 3 || parseInt(month) == 4 ) {
            semesterName = "SPRING" + year;
        } else if ( parseInt(month) == 5 || parseInt(month) == 6 || parseInt(month) == 7 || parseInt(month) == 8 ) {
            semesterName = "SUMMER" + year;
        } else if ( parseInt(month) == 9 || parseInt(month) == 10 || parseInt(month) == 11 || parseInt(month) == 12 ) {
            semesterName = "FALL" + year;
        }
        const isExisted = await ApiServices.Get(`/admin/checkSemester?semesterName=${semesterName}`);
        if (isExisted == false ) {
            this.setState({
                virgin: true,
                name: semesterName,
            })
        } else {
            const semester = await ApiServices.Get(`/admin/getSemesterByName?semesterName=${semesterName}`);
            console.log(semester);
            this.setState({
                start_choose_option_time: semester.start_choose_option_time,
                finish_choose_option_time: semester.finish_choose_option_time,
                finish_interview_time: semester.finish_interview_time,
                finish_choose_business_time: semester.finish_choose_business_time,
                start_date: semester.start_date,
                end_date: semester.end_date,
                name: semesterName,
            })
        }
        // console.log(this.state.start_choose_option_time);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        let virgin = this.state.virgin;
        if ( name == 'start_choose_option_time' && virgin == true ) {
            await this.setState({
                [name]: value,
                virgin: !virgin,
            })
        } else if (virgin == true) {
            await this.setState({
                [name]: value,
                virgin: !virgin,
            })
        } else {
            await this.setState({
                [name]: value,
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleReset = async () => {
        this.setState({
            finish_choose_option_time: '',
            finish_interview_time: '',
            finish_choose_business_time: '',
            end_date: '',
            start_date: '',
            start_choose_option_time: '',
        })
    }

    handleSubmit = async () => {
        const { name, finish_choose_option_time, finish_interview_time, finish_choose_business_time, end_date, start_date, start_choose_option_time } = this.state;

        if (this.validator.allValid()) {
            const ScheduleParameters = {
                finish_choose_option_time,
                finish_interview_time,
                finish_choose_business_time,
                end_date,
                start_date,
                start_choose_option_time,
                name
            }

            console.log("ScheduleParameters", ScheduleParameters);

            const result = await ApiServices.Post('/admin/saveSemester', ScheduleParameters);
            if (result.status == 200) {
                Toastify.actionSuccess('Tạo các tham số thành công');
            } else {
                Toastify.actionFail('Tạo các tham số thất bại');
            }

        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { name, finish_choose_option_time, finish_interview_time, finish_choose_business_time, end_date, start_date, start_choose_option_time } = this.state;
        return (
            <div className="animated fadeIn">
                <ToastContainer />
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <h4>Lập lịch cho quá trình OJT</h4>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="1">
                                            <h4>Học kỳ:</h4>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Label style={{ fontWeight: "bold", fontSize:'21px' }}>{name}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian bắt đầu đăng ký nguyện vọng</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input value={start_choose_option_time} onChange={this.handleInput} type="date" date-daid="start_choose_option_time" name="start_choose_option_time" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Thời gian bắt đầu đăng ký nguyện vọng', start_choose_option_time, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Hạn cuối đăng ký nguyện vọng</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input value={finish_choose_option_time} onChange={this.handleInput} type="date" date-daid="finish_choose_option_time" name="finish_choose_option_time" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Hạn cuối đăng ký nguyện vọng', finish_choose_option_time, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Hạn cuối hoàn tất kết quả phỏng vấn</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input value={finish_interview_time} onChange={this.handleInput} type="date" id="finish_interview_time" name="finish_interview_time" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Hạn cuối hoàn tất kết quả phỏng vấn', finish_interview_time, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Hạn cuối thời gian hoàn tất lựa chọn công ty</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input value={finish_choose_business_time} onChange={this.handleInput} type="date" id="finish_choose_business_time" name="finish_choose_business_time" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Hạn cuối thời gian hoàn tất lựa chọn công ty', finish_choose_business_time, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian bắt đầu OJT</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input value={start_date} onChange={this.handleInput} type="date" id="start_date" name="start_date" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Thời gian bắt đầu OJT', start_date, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian kết thúc kỳ OJT</h6>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input value={end_date} onChange={this.handleInput} type="date" id="end_date" name="end_date" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Thời gian kết thúc kỳ OJT', end_date, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row style={{paddingLeft: "23%"}}>
                                    <Col xs="4" sm="4">
                                        <Button color="warning" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                    </Col>
                                    <Col xs="4" sm="4">
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Xác nhận</Button>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ScheduleParameters;
