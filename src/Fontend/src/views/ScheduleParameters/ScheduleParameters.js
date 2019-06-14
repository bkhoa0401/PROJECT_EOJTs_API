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
            timeRegisterAspirations: '',
            timeCompleteInterview: '',
            timeCompanySelection: '',
            timeProcessRemainCase: '',
            timeStartOJT: ''
        }
    }

    // async componentDidMount() {
    //     const parameters = await ApiService.Get("/");

    //     this.setState({

    //     });    
    // }

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
            timeRegisterAspirations: '',
            timeCompleteInterview: '',
            timeCompanySelection: '',
            timeProcessRemainCase: '',
            timeStartOJT: ''
        })
    }

    handleSubmit = async () => {
        const { timeRegisterAspirations, timeCompleteInterview, timeCompanySelection, timeProcessRemainCase, timeStartOJT } = this.state;

        if (this.validator.allValid()) {
            const ScheduleParameters = {
                timeRegisterAspirations,
                timeCompleteInterview,
                timeCompanySelection,
                timeProcessRemainCase,
                timeStartOJT
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
                                            <h6>Hạn cuối đăng ký nguyện vọng</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeRegisterAspirations} onChange={this.handleInput} type="date" id="timeRegisterAspirations" name="timeRegisterAspirations" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeRegisterAspirations', this.state.timeRegisterAspirations, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Hạn cuối hoàn tất kết quả phỏng vấn</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeCompleteInterview} onChange={this.handleInput} type="date" id="timeCompleteInterview" name="timeCompleteInterview" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeCompleteInterview', this.state.timeCompleteInterview, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Hạn cuối thời gian hoàn tất lựa chọn công ty</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeCompanySelection} onChange={this.handleInput} type="date" id="timeCompanySelection" name="timeCompanySelection" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeCompanySelection', this.state.timeCompanySelection, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <h6>Hạn cuối thời gian xử lý trường hợp còn lại</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeProcessRemainCase} onChange={this.handleInput} type="date" id="timeProcessRemainCase" name="timeProcessRemainCase" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeProcessRemainCase', this.state.timeProcessRemainCase, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <h6>Thời gian bắt đầu OJT</h6>
                                        </Col>
                                        <Col xs="12" md="11">
                                            <Input value={this.state.timeStartOJT} onChange={this.handleInput} type="date" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
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
