import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
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

class Create_InformMessage extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            open: false,
            isSelect: null,
            preIsSelect: null,
            colorTextSelect: ['Black', 'White'],
            colorBackSelect: ['White', 'DeepSkyBlue'],
            informFromEmail: '',
            students: null,
            listStudentEmail: [],
            preListStudentEmail: [],
            informTo: '',

            description: '',
            title: '',
        };
        this.openPopupRegist = this.openPopupRegist.bind(this);
        this.closePopupRegist = this.closePopupRegist.bind(this);
        this.closePopupWithConfirm = this.closePopupWithConfirm.bind(this);
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let students = [];
        let isSelect = [];
        let preIsSelect = [];
        if (token != null) {
            const decoded = decode(token);
            if (decoded.role == "ROLE_ADMIN") {
                students = await ApiServices.Get(`/admin/students`);
            }
            if (decoded.role == "ROLE_HR") {
                students = await ApiServices.Get(`/business/getStudentsByBusiness`);
            }
        }
        let informFromEmail = '';
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        if (token != null) {
            const decoded = decode(token);
            informFromEmail = decoded.email;
        }
        for (let index = 0; index < students.length; index++) {
            isSelect.push(0);
            preIsSelect.push(0);
        }
        this.setState({
            loading: false,
            informFromEmail: informFromEmail,
            students: students,
            time_created: today,
            isSelect: isSelect,
            preIsSelect: preIsSelect,
        });
    }

    openPopupRegist() {
        let preIsSelect = [];
        let isSelect = this.state.isSelect;
        let preListStudentEmail = [];
        let listStudentEmail = this.state.listStudentEmail;
        for (let index = 0; index < isSelect.length; index++) {
            preIsSelect.push(isSelect[index]);
        }
        for (let index = 0; index < listStudentEmail.length; index++) {
            preListStudentEmail.push(listStudentEmail[index]);
        }
        this.setState({
            open: true,
            preListStudentEmail: preListStudentEmail,
            preIsSelect: preIsSelect,
        })
    }

    closePopupRegist() {
        let informTo = '';
        let listStudentEmail = this.state.listStudentEmail;
        for (let index = 0; index < listStudentEmail.length; index++) {
            informTo += listStudentEmail[index] + "; ";
            if (informTo.length > 75) {
                informTo += "...";
                break;
            }
        }
        this.setState({
            open: false,
            informTo: informTo,
            preListStudentEmail: listStudentEmail,
            preIsSelect: this.state.isSelect,
        })
        console.log("preIsSelect: " + this.state.preIsSelect);
        console.log("isSelect: " + this.state.isSelect);
    }

    closePopupWithConfirm() {
        let preIsSelect = this.state.preIsSelect;
        let isSelect = [];
        let preListStudentEmail = this.state.preListStudentEmail;
        let listStudentEmail = [];
        let informTo = this.state.informTo;
        for (let index = 0; index < preIsSelect.length; index++) {
            isSelect.push(preIsSelect[index]);
        }
        for (let index = 0; index < preListStudentEmail.length; index++) {
            listStudentEmail.push(preListStudentEmail[index]);
        }
        this.setState({
            open: false,
            isSelect: isSelect,
            listStudentEmail: listStudentEmail,
            informTo: informTo,
        })
        console.log(this.state.isSelect);
        console.log(this.state.listStudentEmail);
        console.log(this.state.informTo);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleSelect = (selectEmail) => {
        let preListStudentEmail = this.state.preListStudentEmail;
        let preIsSelect = this.state.preIsSelect;
        let students = this.state.students;
        let informTo = '';
        if (preListStudentEmail.includes(selectEmail)) {
            for (let index = 0; index < preListStudentEmail.length; index++) {
                if (preListStudentEmail[index] == selectEmail) {
                    preListStudentEmail.splice(index, 1);
                }
            }
            for (let index = 0; index < students.length; index++) {
                if (students[index].email == selectEmail) {
                    preIsSelect[index] = 0;
                }
            }
        } else {
            preListStudentEmail.push(selectEmail);
            for (let i = 0; i < students.length; i++) {
                // for (let j = 0; j < preListStudentEmail.length; j++) {
                //     if (students[i] = preListStudentEmail[j]) {
                //         preIsSelect[i] = 1;
                //     }
                // }
                if (students[i].email == selectEmail) {
                    preIsSelect[i] = 1;
                }
            }
        }
        for (let index = 0; index < preListStudentEmail.length; index++) {
            informTo += preListStudentEmail[index] + "; ";
            if (informTo.length > 75) {
                informTo += "...";
                break;
            }
        }
        this.setState({
            preListStudentEmail: preListStudentEmail,
            preIsSelect: preIsSelect,
            informTo: informTo,
        })
        console.log("preIsSelect: " + this.state.preIsSelect);
        console.log("isSelect: " + this.state.isSelect);
        console.log(this.state.preListStudentEmail);
    }

    handleSelectAll = () => {
        let students = this.state.students;
        let preListStudentEmail = this.state.preListStudentEmail;
        let preIsSelect = this.state.preIsSelect;
        let informTo = '';
        let isSelected = false;
        for (let index = 0; index < students.length; index++) {
            preIsSelect[index] = 1;
            for (let index1 = 0; index1 < preListStudentEmail.length; index1++) {
                if (preListStudentEmail[index1] == students[index].email) {
                    isSelected = true;
                }
            }
            if (isSelected == false) {
                preListStudentEmail.push(students[index].email);
            }
            isSelected = false;
        }
        // console.log(preListStudentEmail);
        for (let index = 0; index < preListStudentEmail.length; index++) {
            informTo += preListStudentEmail[index] + "; ";
            if (informTo.length > 100) {
                informTo += "...";
                break;
            }
        }
        this.setState({
            preListStudentEmail: preListStudentEmail,
            preIsSelect: preIsSelect,
            informTo: informTo,
        })
        console.log(this.state.preIsSelect);
        console.log(this.state.preListStudentEmail);
    }

    handleDeSelect = () => {
        let preIsSelect = this.state.preIsSelect;
        for (let index = 0; index < preIsSelect.length; index++) {
            preIsSelect[index] = 0;
        }
        this.setState({
            preListStudentEmail: [],
            informTo: '',
            preIsSelect: preIsSelect,
        })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleSubmit = async () => {
        // console.log(title);
        // console.log(description);
        let descriptionNeedFix = this.state.description;
        descriptionNeedFix = descriptionNeedFix.replace('<p>', '');
        descriptionNeedFix = descriptionNeedFix.replace('</p>', '');
        // if (descriptionNeedFix == "") {
        //     descriptionNeedFix = "(No content)";
        // }
        let titleNeedFix = this.state.title;
        // if (titleNeedFix == "") {
        //     titleNeedFix = "(No Title)";
        // }
        const description = descriptionNeedFix;
        const title = titleNeedFix;
        if (this.validator.allValid()) {
            this.setState({
                loading: true
            })
            const event = {
                description,
                title,
            }
            const listStudentEmail = this.state.listStudentEmail;
            const result = await ApiServices.Post(`/admin/event?listStudentEmail=${listStudentEmail}`, event);
            // console.log(result);
            // console.log(listStudentEmail);
            // console.log(event);
            if (result.status == 201) {
                Toastify.actionSuccess("Tạo thông báo thành công!");
                this.props.history.push("/InformMessage/InformMessage");
            } else {
                Toastify.actionFail("Tạo thông báo thất bại!");
                this.setState({
                    loading: false
                })
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loading, informFromEmail, students, informTo, title, description, colorTextSelect, colorBackSelect, preIsSelect } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
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
                                                <Input type="text" value={informTo} id="informTo" name="informTo" readOnly style={{ backgroundColor: "white" }}></Input>
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Email nhận', informTo, 'required')}
                                                </span>
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
                                                <Input type="text" value={title} onChange={this.handleInput} id="title" name="title" />
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Chủ đề', title, 'required')}
                                                </span>
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
                                                <span className="form-error is-visible text-danger">
                                                    {this.validator.message('Nội dung', description, 'required')}
                                                </span>
                                            </Col>
                                        </FormGroup>
                                        <ToastContainer />
                                        <Pagination>
                                            {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                        </Pagination>
                                    </CardBody>

                                    <CardFooter className="p-3">
                                        <Row style={{ marginLeft: "21%" }}>
                                            <Col xs="4" sm="4">
                                                <Button style={{ width: '100px' }} color="secondary" onClick={() => this.handleDirect('/InformMessage/InformMessage')}>
                                                    Trở về
                                                </Button>
                                            </Col>
                                            <Col xs="4" sm="4">
                                                <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleSubmit()}>
                                                    Tạo
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                        <Popup
                            open={this.state.open}
                            // closeOnDocumentClick
                            onClose={this.closePopupRegist}
                        >
                            <div className="TabContent">
                                <row>
                                    <Button color="primary" onClick={() => this.handleSelectAll()}>Chọn tất cả</Button>
                                    &nbsp;&nbsp;
                                    <Button color="primary" onClick={() => this.handleDeSelect()}>Huỷ chọn</Button>
                                </row>
                                <br />
                                <hr />
                                <ListGroup>
                                    <div style={{ height: '400px', overflowY: 'scroll' }}>
                                        {students && students.map((student, index) =>
                                            <ListGroupItem action onClick={() => this.handleSelect(student.email)} style={{ color: colorTextSelect[preIsSelect[index]], backgroundColor: colorBackSelect[preIsSelect[index]] }}>
                                                <ListGroupItemHeading style={{ fontWeight: 'bold' }}>{student.name}</ListGroupItemHeading>
                                                <ListGroupItemText>
                                                    {student.email}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                        )}
                                    </div>
                                </ListGroup>
                                <hr />
                                <div style={{ paddingLeft: '45%' }}>
                                    <Button color="primary" onClick={this.closePopupWithConfirm} >Xác nhận</Button>
                                </div>
                            </div>
                        </Popup>
                    </div>
                )
        );
    }
}

export default Create_InformMessage;
