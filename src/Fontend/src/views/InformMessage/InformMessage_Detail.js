import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Label, Pagination, Row } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class InformMessage_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            title: '',
            description: '',
            students: null,
            business: null,
            informFromName: '',
            informFromEmail: '',
            isStudentSent: false,
        };
    }

    async componentDidMount() {
        const informMessageID = window.location.href.split("/").pop();
        const token = localStorage.getItem('id_token');
        const data = await ApiServices.Get(`/event/getEvent?id=${informMessageID}`);
        if (data != null) {
            const read = await ApiServices.Put(`/event/setStateEvent?eventId=${data.event.id}`)
        }
        let isStudentSent = false;
        if (data.studentSent === true) {
            isStudentSent = data.studentSent;
        }
        let business = null;
        let informFromName = '';
        let informFromEmail = '';
        if (token !== null) {
            const decoded = decode(token);
            if (decoded.role === "ROLE_ADMIN") {
                informFromName = "FPT University";
                informFromEmail = decoded.email;
            }
            if (decoded.role === "ROLE_HR") {
                business = await ApiServices.Get('/business/getBusiness');
                informFromName = business.business_name;
                informFromEmail = business.email;
            }
        }
        if (data !== null) {
            this.setState({
                loading: false,
                title: data.event.title,
                description: data.event.description,
                students: data.studentList,
                business: business,
                informFromName: informFromName,
                informFromEmail: informFromEmail,
                isStudentSent: isStudentSent,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { loading, title, description, students, informFromName, informFromEmail, isStudentSent } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Chi tiết thông báo
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Từ:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                {isStudentSent === false ?
                                                    <Label>{<>{informFromName}<br />({informFromEmail})</>}</Label> :
                                                    <div>
                                                        {students && students.map((student, index) => {
                                                            return (
                                                                <>{student.name}<br />({student.email})<br /></>
                                                            )
                                                        })}
                                                    </div>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Đến:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>
                                                    {isStudentSent === false ?
                                                        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                            {students && students.map((student, index) => {
                                                                return (
                                                                    <>{student.name} ({student.email})<br /></>
                                                                )
                                                            })}
                                                        </div> :
                                                        <Label>{<>{informFromName}<br />({informFromEmail})</>}</Label>
                                                    }
                                                </Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Chủ đề:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label style={{ fontWeight: 'bold' }}>{title}</Label>
                                            </Col>
                                        </FormGroup>
                                        <hr />
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Nội dung:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>{description}</Label>
                                            </Col>
                                        </FormGroup>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>
                                    <CardFooter className="p-3">
                                        <Row>
                                            <Col xs="4" sm="4">
                                                <Button block color="secondary" onClick={() => this.handleDirect('/InformMessage/InformMessage')}>
                                                    Trở về
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

export default InformMessage_Detail;
