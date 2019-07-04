import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class Create_InformMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.openPopupRegist = this.openPopupRegist.bind(this);
        this.closePopupRegist = this.closePopupRegist.bind(this);
    }

    openPopupRegist() {
        this.setState({ open: true })
    }

    closePopupRegist() {
        this.setState({ open: false })
    }

    render() {
        // const { searchValue } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Soạn thông báo
                            </CardHeader>
                            <CardBody>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Từ:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Input type="text" disabled defaultValue="Công ty ABC" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Đến:</h6>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" />
                                    </Col>
                                    <Col xs="12" md="1">
                                        <Button block outline color="primary" onClick={this.openPopupRegist}>Thêm</Button>
                                    </Col>
                                </FormGroup>
                                <hr />
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Nội dung:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <CKEditor
                                            editor={ClassicEditor}
                                        />
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
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick
                    onClose={this.closePopupRegist}
                >
                    <div className="TabContent">
                        <ListGroup>
                            <ListGroupItem action>
                                <ListGroupItemHeading>Nhà trường</ListGroupItemHeading>
                                <ListGroupItemText>
                                    admin@gmail.com
                                </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem action>
                                <ListGroupItemHeading>Nguyễn Văn A</ListGroupItemHeading>
                                <ListGroupItemText>
                                    nguyenvana@gmail.com
                                </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem action>
                                <ListGroupItemHeading>Nguyễn Văn B</ListGroupItemHeading>
                                <ListGroupItemText>
                                    nguyenvanb@gmail.com
                                </ListGroupItemText>
                            </ListGroupItem>
                        </ListGroup>
                    </div>
                </Popup>
            </div>
        );
    }
}

export default Create_InformMessage;
