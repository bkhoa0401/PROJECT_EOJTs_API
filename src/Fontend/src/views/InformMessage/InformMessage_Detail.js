import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Label, FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class InformMessage_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title:'',
            description:'',
        };
    }

    async componentDidMount() {
        const informMessageID = window.location.href.split("/").pop();
        const data = await ApiServices.Get(`/business/event?id=${informMessageID}`);
        if (data != null) {
            this.setState({
                title: data.title,
                description: data.description,
            });
        }
        console.log(informMessageID);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { title, description } = this.state;
        return (
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
                                        <Label>Công ty ABC</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Đến:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>Nhà trường</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Chủ đề:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label style={{fontWeight:'bold'}}>{title}</Label>
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
                <div style={{paddingLeft:'45%'}}>
                    <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleDirect('/InformMessage/InformMessage')}>
                        Trở về
                    </Button>
                </div>
            </div>
        );
    }
}

export default InformMessage_Detail;
