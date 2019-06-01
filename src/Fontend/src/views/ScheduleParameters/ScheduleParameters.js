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
import SimpleReactValidator from 'simple-react-validator';


class ScheduleParameters extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            timeCloseListCompanies: '',
            timeRegister: '',
            timeSendListStudents: '',
            timeSendInvitations: '',
            timeInterview: '',
            timeChooseAspirations: '',
            timeStudentBusiness: '',
            timeStudentsFailAll: '',
            timeStartOJT: '',
            timeEndOJT: '',
        }
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

    handleReset = async () => {
        this.setState({
            timeCloseListCompanies: '',
            timeRegister: '',
            timeSendListStudents: '',
            timeSendInvitations: '',
            timeInterview: '',
            timeChooseAspirations: '',
            timeStudentBusiness: '',
            timeStudentsFailAll: '',
            timeStartOJT: '',
            timeEndOJT: '',
        })
    }

    handleSubmit = async () => {
        const { timeCloseListCompanies, timeRegister, timeSendListStudents, timeSendInvitations, timeInterview,
            timeChooseAspirations, timeStudentBusiness, timeStudentsFailAll, timeStartOJT, timeEndOJT } = this.state;

        if (this.validator.allValid()) {
            const ScheduleParameters = {
                timeCloseListCompanies,
                timeRegister,
                timeSendListStudents,
                timeSendInvitations,
                timeInterview,
                timeChooseAspirations,
                timeStudentBusiness,
                timeStudentsFailAll,
                timeStartOJT,
                timeEndOJT,
            }

            console.log("ScheduleParameters", ScheduleParameters);

            const result = await ApiServices.Post('/scheduleparameters/', ScheduleParameters);
            if (result != null) {
                Toastify.actionSuccess('Tạo các tham số thành công');
            } else {
                Toastify.actionFail('Tạo các tham số thất bại');
            }

        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            this.forceUpdate();
        }
    }

    render() {
        return (
            <div className="animated fadeIn">
                <ToastContainer />
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <h4>Tạo các tham số cho quá trình đăng kí OJT</h4>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian chốt danh sách công ty</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeCloseListCompanies} onChange={this.handleInput} type="date" id="timeCloseListCompanies" name="timeCloseListCompanies" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeCloseListCompanies', this.state.timeCloseListCompanies, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian chốt đăng kí nguyện vọng</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeRegister} onChange={this.handleInput} type="date" id="timeRegister" name="timeRegister" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('Day of Birth', this.state.timeRegister, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian gửi danh sách cho công ty</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeSendListStudents} onChange={this.handleInput} type="date" id="timeSendListStudents" name="timeSendListStudents" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeSendListStudents', this.state.timeSendListStudents, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian gửi lời mời cho sinh viên</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeSendInvitations} onChange={this.handleInput} type="date" id="timeSendInvitations" name="timeSendInvitations" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeSendInvitations', this.state.timeSendInvitations, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian hoàn tất việc phỏng vấn</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeInterview} onChange={this.handleInput} type="date" id="timeInterview" name="timeInterview" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeInterview', this.state.timeInterview, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Thời gian sinh viên lựa chọn nguyện vọng</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeChooseAspirations} onChange={this.handleInput} type="date" id="timeChooseAspirations" name="timeChooseAspirations" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeChooseAspirations', this.state.timeChooseAspirations, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian chốt sinh viên - công ty</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeStudentBusiness} onChange={this.handleInput} type="date" id="timeStudentBusiness" name="timeStudentBusiness" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStudentBusiness', this.state.timeStudentBusiness, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="5">
                                            <h6>Thời gian giải quyết các sinh viên rớt 2 nguyện vọng</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeStudentsFailAll} onChange={this.handleInput} type="date" id="timeStudentsFailAll" name="timeStudentsFailAll" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStudentsFailAll', this.state.timeStudentsFailAll, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian bắt đầu kì OJT</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeStartOJT} onChange={this.handleInput} type="date" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian kết thúc kì OJT</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeEndOJT} onChange={this.handleInput} type="date" id="timeEndOJT" name="timeEndOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeEndOJT', this.state.timeEndOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Xác nhận</Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                    </Col>
                                    {/* <Col xs="3" sm="3">
                                        <Button color="success" block onClick={() => this.handleDirect('/staff')}>Cancel</Button>
                                    </Col> */}
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
