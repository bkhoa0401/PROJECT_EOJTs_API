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
        };
    }

    async componentDidMount() {
        const informMessageID = window.location.href.split("/").pop();
        const token = localStorage.getItem('id_token');
        const data = await ApiServices.Get(`/event/getEvent?id=${informMessageID}`);
        let business = null;
        let informFromName = '';
        let informFromEmail = '';
        if (token != null) {
            const decoded = decode(token);
            if (decoded.role == "ROLE_ADMIN") {
                informFromName = "FPT University";
                informFromEmail = decoded.email;
            }
            if (decoded.role == "ROLE_HR") {
                business = await ApiServices.Get('/business/getBusiness');
                informFromName = business.business_name;
                informFromEmail = business.email;
            }
        }
        if (data != null) {
            this.setState({
                loading: false,
                title: data.title,
                description: data.description,
                students: data.students,
                business: business,
                informFromName: informFromName,
                informFromEmail: informFromEmail,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { loading, title, description, students, informFromName, informFromEmail } = this.state;
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
                                                <Label>{<>{informFromName}<br />({informFromEmail})</>}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="2">
                                                <h6>Đến:</h6>
                                            </Col>
                                            <Col xs="12" md="10">
                                                <Label>
                                                    {students && students.map((student, index) =>
                                                        <>
                                                            {student.name} ({student.email})<br />
                                                        </>
                                                    )}
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
                                </Card>
                            </Col>
                        </Row>
                        <div style={{ paddingLeft: '45%' }}>
                            <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleDirect('/InformMessage/InformMessage')}>
                                Trở về
                            </Button>
                        </div>
                    </div>
                )
        );
    }
}

export default InformMessage_Detail;
