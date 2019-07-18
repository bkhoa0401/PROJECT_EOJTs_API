import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import decode from 'jwt-decode';
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
            informFromEmail: '',
            students: null,
            studentReceived: null,
            informTo: '',
            
            description: '',
            time_created: '',
            title: '',
            admin_email: null,
            business_email: null,
        };
        this.openPopupRegist = this.openPopupRegist.bind(this);
        this.closePopupRegist = this.closePopupRegist.bind(this);
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        const students = await ApiServices.Get(`/business/getStudentsByBusiness`);
        let informFromEmail = '';
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        if (token != null) {
            const decoded = decode(token);
            informFromEmail = decoded.email;
        }
        this.setState({
            informFromEmail: informFromEmail,
            students: students,
            time_created: today,
        });
    }

    openPopupRegist() {
        this.setState({ open: true })
    }

    closePopupRegist() {
        this.setState({ open: false })
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

    render() {
        const { informFromEmail, students, informTo, title, description } = this.state;
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
                                        <Input type="text" disabled defaultValue={informFromEmail} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Đến:</h6>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" value={informTo} onChange={this.handleInput} id="informTo" name="informTo"></Input>
                                    </Col>
                                    <Col xs="12" md="1">
                                        <Button block outline color="primary" onClick={this.openPopupRegist}>Thêm</Button>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Chủ đề:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Input type="text" value={title} onChange={this.handleInput} id="title" name="title"/>
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
                                            data={description}
                                            onChange={(event, editor) => {
                                                this.setState({
                                                    description: editor.getData(),
                                                })
                                            }}
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
                    {students && students.map((student, index) =>
                        <div className="TabContent">
                            <ListGroup>
                                <ListGroupItem action>
                                    <ListGroupItemHeading style={{fontWeight:'bold'}}>{student.name}</ListGroupItemHeading>
                                    <ListGroupItemText>
                                        {student.email}
                                    </ListGroupItemText>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    )}
                </Popup>
                <div style={{ paddingLeft: '40%' }}>
                    <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleDirect('/InformMessage/InformMessage')}>
                        Trở về
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button style={{ width: '100px' }} color="success" disabled onClick={() => this.handleSubmit()}>
                        Tạo
                    </Button>
                </div>
            </div>
        );
    }
}

export default Create_InformMessage;
