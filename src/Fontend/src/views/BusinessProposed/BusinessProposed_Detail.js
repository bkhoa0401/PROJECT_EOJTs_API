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
import { async } from 'q';
import { initializeApp } from '../Invitation/push-notification';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Popup from "reactjs-popup";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SimpleReactValidator from '../../validator/simple-react-validator';
import decode from 'jwt-decode';

class BusinessProposed_Detail extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            loading: true,
            business: null,
            open: false,
            comment: '',
            id: '',
            status: '',
            role: '',
        }
    }

    async componentDidMount() {
        const id = window.location.href.split("/").pop();
        const business = await ApiServices.Get(`/heading/id?id=${id}`);

        const token = localStorage.getItem('id_token');
        let role = '';
        if (token != null) {
            const decoded = decode(token);
            role = decoded.role;
        }

        if (business != null) {
            this.setState({
                loading: false,
                open: false,
                business: business,
                id: business.id,
                role: role
            });
        }

        console.log(role);

        if (role === 'ROLE_STARTUP') {
            if (business.isAcceptedByHeadOfTraining !== 'PENDING') {
                document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                document.getElementById('btnReject').setAttribute("disabled", "disabled");
            } else if (business.isAcceptedByStartupRoom === 'ACCEPTED') {
                document.getElementById('btnApprove').setAttribute("disabled", "disabled");
            } else if (business.isAcceptedByStartupRoom === 'REJECTED') {
                document.getElementById('btnReject').setAttribute("disabled", "disabled");
            }
        } else if (role === 'ROLE_HEADTRAINING') {
            if (business.isAcceptedByHeadMaster !== 'PENDING') {
                document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                document.getElementById('btnReject').setAttribute("disabled", "disabled");
            } else if (business.isAcceptedByHeadOfTraining === 'ACCEPTED') {
                document.getElementById('btnApprove').setAttribute("disabled", "disabled");
            } else if (business.isAcceptedByHeadOfTraining === 'REJECTED') {
                document.getElementById('btnReject').setAttribute("disabled", "disabled");
            }
        }
        else if (role === 'ROLE_HEADMASTER') {
            if (business.isAcceptedByHeadMaster === 'ACCEPTED') {
                document.getElementById('btnApprove').setAttribute("disabled", "disabled");
            } else if (business.isAcceptedByHeadMaster === 'REJECTED') {
                document.getElementById('btnReject').setAttribute("disabled", "disabled");
            }
        }
    }

    openPopUp = (status) => {
        this.setState({
            open: true,
            status: status
        })
    }

    closePopup = () => {
        this.setState({ open: false })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    showStatus(status, role) {
        if (status === 'ACCEPTED' && role === 'Startup') {
            return (
                <div style={{ marginLeft: "43%" }}>
                    <Badge color="success">ĐƯỢC CHẤP NHẬN</Badge>
                </div>
            )
        } else if (status === 'REJECTED' && role === 'Startup') {
            return (
                <div style={{ marginLeft: "43%" }}>
                    <Badge color="danger" style={{ marginLeft: "8%" }}>BỊ TỪ CHỐI</Badge>
                </div>
            )
        } else if (status === 'PENDING' && role === 'Startup') {
            return (
                <div style={{ marginLeft: "40%" }}>
                    <Badge color="warning">ĐANG CHỜ PHÊ DUYỆT</Badge>
                </div>
            )
        } else if (status === 'ACCEPTED' && role === 'Training') {
            return (
                <div style={{ marginLeft: "48%" }}>
                    <Badge color="success">ĐƯỢC CHẤP NHẬN</Badge>
                </div>
            )
        } else if (status === 'REJECTED' && role === 'Training') {
            return (
                <div style={{ marginLeft: "48%" }}>
                    <Badge color="danger" style={{ marginLeft: "8%" }}>BỊ TỪ CHỐI</Badge>
                </div>
            )
        } else if (status === 'PENDING' && role === 'Training') {
            return (
                <div style={{ marginLeft: "45%" }}>
                    <Badge color="warning">ĐANG CHỜ PHÊ DUYỆT</Badge>
                </div>
            )
        } else if (status === 'ACCEPTED' && role === 'Master') {
            return (
                <div style={{ marginLeft: "59%" }}>
                    <Badge color="success">ĐƯỢC CHẤP NHẬN</Badge>
                </div>
            )
        } else if (status === 'REJECTED' && role === 'Master') {
            return (
                <div style={{ marginLeft: "61%" }}>
                    <Badge color="danger">BỊ TỪ CHỐI</Badge>
                </div>
            )
        } else if (status === 'PENDING' && role === 'Master') {
            return (
                <div style={{ marginLeft: "58%" }}>
                    <Badge color="warning">ĐANG CHỜ PHÊ DUYỆT</Badge>
                </div>
            )
        }
    }

    handleConfirm = () => {
        const { status, business } = this.state;
        let message = '';
        if (status) {
            message = `Bạn chắc chắn muốn "XÉT DUYỆT" yêu cầu thực tập tại doanh nghiệp "${business.business_name}" của sinh viên "${business.student_proposed.name}" ?`
        } else {
            message = `Bạn chắc chắn muốn "TỪ CHỐI" yêu cầu thực tập tại doanh nghiệp "${business.business_name}" của sinh viên "${business.student_proposed.name}" ?`
        }
        if (this.validator.allValid()) {
            this.closePopup();
            confirmAlert({
                title: 'Xác nhận',
                message: message,
                buttons: [
                    {
                        label: 'Đồng ý',
                        onClick: () => this.handleSubmit()
                    },
                    {
                        label: 'Hủy bỏ',
                    }
                ]
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    };

    handleConfirmMaster = (status) => {
        this.setState({
            status: status
        })
        const { business } = this.state;
        let message = '';
        if (status) {
            message = `Bạn chắc chắn muốn "XÉT DUYỆT" yêu cầu thực tập tại doanh nghiệp "${business.business_name}" của sinh viên "${business.student_proposed.name}" ?`
        } else {
            message = `Bạn chắc chắn muốn "TỪ CHỐI" yêu cầu thực tập tại doanh nghiệp "${business.business_name}" của sinh viên "${business.student_proposed.name}" ?`
        }

        this.closePopup();
        confirmAlert({
            title: 'Xác nhận',
            message: message,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleSubmit()
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value,
        })
    }

    handleSubmit = async () => {
        const { comment, id, status, role } = this.state;
        let result = {};

        let messageSucces = '', messageFail = '';
        if (status) {
            messageSucces = "Phê duyệt đề xuất thành công!";
            messageFail = "Phê duyệt đề xuất thất bại!";
        } else {
            messageSucces = "Từ chối đề xuất thành công!";
            messageFail = "Từ chối đề xuất thất bại!";
        }

        this.setState({
            loading: true
        })

        if (role === 'ROLE_STARTUP') {
            result = await ApiServices.Put(`/heading/startup?id=${id}&comment=${comment}&status=${status}`);
        } else if (role === 'ROLE_HEADTRAINING') {
            result = await ApiServices.Put(`/heading/headTraining?id=${id}&comment=${comment}&status=${status}`);
        } else if (role === 'ROLE_HEADMASTER') {
            result = await ApiServices.Put(`/heading/headMaster?id=${id}&comment=${comment}&status=${status}`);
        }
        if (result.status == 200) {
            Toastify.actionSuccess(messageSucces);
            this.setState({
                loading: false
            })

            const business = await ApiServices.Get(`/heading/id?id=${id}`);

            if (business != null) {
                this.setState({
                    loading: false,
                    open: false,
                    business: business,
                    id: business.id
                });
            }

            if (role === 'ROLE_STARTUP') {
                if (business.isAcceptedByStartupRoom === 'ACCEPTED') {
                    document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                } else if (business.isAcceptedByStartupRoom === 'REJECTED') {
                    document.getElementById('btnReject').setAttribute("disabled", "disabled");
                }
            } else if (role === 'ROLE_HEADTRAINING') {
                if (business.isAcceptedByHeadOfTraining === 'ACCEPTED') {
                    document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                } else if (business.isAcceptedByHeadOfTraining === 'REJECTED') {
                    document.getElementById('btnReject').setAttribute("disabled", "disabled");
                }
            }
            else if (role === 'ROLE_HEADMASTER') {
                if (business.isAcceptedByHeadMaster === 'ACCEPTED') {
                    document.getElementById('btnApprove').setAttribute("disabled", "disabled");
                } else if (business.isAcceptedByHeadMaster === 'REJECTED') {
                    document.getElementById('btnReject').setAttribute("disabled", "disabled");
                }
            }
        } else {
            Toastify.actionFail(messageFail);
            this.setState({
                loading: false
            })
        }
    }

    render() {
        const { business, loading, role } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <ToastContainer />
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        {/* <h3>Thông tin chi tiết yêu cầu thực tập tại doanh nghiệp ngoài</h3> */}
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <div style={{ paddingLeft: "3%", paddingRight: "3%", textAlign: "center" }}>
                                                <img src="https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410" />
                                                <br /><br /><br />
                                                <h2 style={{ fontWeight: "bold" }}>PHIẾU ĐĂNG KÍ THỰC TẬP CÔNG TY NGOÀI DANH SÁCH</h2>
                                            </div>
                                            <br />
                                            <hr />
                                            <div style={{ paddingLeft: "2%", paddingRight: "2%", paddingTop: "15px" }}>
                                                <FormGroup>
                                                    <h3 style={{ fontWeight: "bold" }}>Thông tin sinh viên đề xuất</h3>
                                                    <hr />
                                                    <br />
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Họ và tên:</h6>
                                                    </Col>
                                                    <Col xs="12" md="6">
                                                        <Label>{business.student_proposed.name}</Label>
                                                    </Col>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Mã số sinh viên:</h6>
                                                    </Col>
                                                    <Col xs="12" md="2">
                                                        <Label>{business.student_proposed.code}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Ngành:</h6>
                                                    </Col>
                                                    <Col xs="12" md="6">
                                                        <Label>{business.student_proposed.specialized.name}</Label>
                                                    </Col>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>GPA:</h6>
                                                    </Col>
                                                    <Col xs="12" md="2">
                                                        <Label>{business.student_proposed.gpa}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Email:</h6>
                                                    </Col>
                                                    <Col xs="12" md="6">
                                                        <Label>{business.student_proposed.email}</Label>
                                                    </Col>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Số điện thoại:</h6>
                                                    </Col>
                                                    <Col xs="12" md="2">
                                                        <Label>{business.student_proposed.phone}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <br />
                                                <hr />
                                                <FormGroup>
                                                    <h3 style={{ fontWeight: "bold" }}>Thông tin doanh nghiệp được đề xuất</h3>
                                                    <hr />
                                                    <br />
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Tên công ty thực tập:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_name}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Email:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.email}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Số điện thoại:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_phone}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Địa chỉ:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_address}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Mô tả doanh nghiệp:</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_overview}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Quy mô doanh nghiệp</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.scale}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Lĩnh vực hoạt động</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_field_of_activity}</Label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Col md="2">
                                                        <h6 style={{ fontWeight: "bold" }}>Quốc tịch công ty</h6>
                                                    </Col>
                                                    <Col xs="12" md="10">
                                                        <Label>{business.business_nationality}</Label>
                                                    </Col>
                                                </FormGroup>
                                            </div>
                                            <br />
                                            <hr />
                                            <FormGroup>
                                                <h3 style={{ fontWeight: "bold" }}>Ý kiến phê duyệt từ các cấp</h3>
                                                <hr />
                                                <br />
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="6">
                                                    <h5 style={{ fontWeight: "bold", marginLeft: "30%" }}>Ý kiến của phòng khởi nghiệp</h5>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <h5 style={{ fontWeight: "bold", marginLeft: "30%" }}>Ý kiến của phòng đào tạo</h5>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="6">
                                                    {
                                                        this.showStatus(business.isAcceptedByStartupRoom, "Startup")
                                                    }
                                                </Col>
                                                <Col xs="12" md="4">
                                                    {
                                                        this.showStatus(business.isAcceptedByHeadOfTraining, "Training")
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="6">
                                                    <div style={{ marginLeft: "8%", textAlign: "center" }}>
                                                        {
                                                            business.isAcceptedByStartupRoom !== 'PENDING' ? (
                                                                <label style={{ width: "300px" }}>{business.commentStartupRoom}</label>
                                                            ) : (
                                                                    <label style={{ width: "300px" }}></label>
                                                                )
                                                        }
                                                    </div>
                                                </Col>
                                                <Col md="4">
                                                    <div style={{ marginLeft: "20%", textAlign: "center" }}>
                                                        {
                                                            business.isAcceptedByHeadOfTraining !== 'PENDING' ? (
                                                                <label style={{ width: "300px" }}>{business.commentHeadOfTraining}</label>
                                                            ) : (
                                                                    <label style={{ width: "300px" }}></label>
                                                                )
                                                        }
                                                    </div>
                                                </Col>
                                            </FormGroup>
                                            <br /><br />
                                            <FormGroup row>
                                                <Col md="9">
                                                    <h5 style={{ fontWeight: "bold", marginLeft: "50%" }}>Phê duyệt của ban giám hiệu</h5>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="9">
                                                    {
                                                        this.showStatus(business.isAcceptedByHeadMaster, "Master")
                                                    }
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="9">
                                                    <div style={{ marginLeft: "31%", textAlign: "center" }}>
                                                        {
                                                            business.isAcceptedByHeadMaster !== 'PENDING' ? (
                                                                <label style={{ width: "300px" }}>{business.commentHeadOfMaster}</label>
                                                            ) : (
                                                                    <label style={{ width: "300px" }}></label>
                                                                )
                                                        }
                                                    </div>
                                                </Col>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                    <CardFooter className="p-5">
                                        <Row style={{ marginLeft: "20%" }}>
                                            <Col xs="3" sm="3">
                                                {/* {
                                                    role === 'ROLE_HEADMASTER' ? (
                                                        <Button id="btnApprove" onClick={() => this.handleConfirmMaster(true)} type="submit" color="primary" block>Phê duyệt</Button>
                                                    ) : (
                                                            <Button id="btnApprove" onClick={() => this.openPopUp(true)} type="submit" color="primary" block>Phê duyệt</Button>
                                                        )
                                                } */}
                                                <Button id="btnApprove" onClick={() => this.openPopUp(true)} type="submit" color="primary" block>Phê duyệt</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                {/* {
                                                    role === 'ROLE_HEADMASTER' ? (
                                                        <Button id="btnReject" color="danger" block onClick={() => this.handleConfirmMaster(false)}>Từ chối</Button>
                                                    ) : (
                                                            <Button id="btnReject" color="danger" block onClick={() => this.openPopUp(false)}>Từ chối</Button>
                                                        )
                                                } */}
                                                <Button id="btnReject" color="danger" block onClick={() => this.openPopUp(false)}>Từ chối</Button>
                                            </Col>
                                            <Col xs="3" sm="3">
                                                <Button color="success" block onClick={() => this.handleDirect("/business-proposed")}>Trở về</Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                            <Popup
                                open={this.state.open}
                                closeOnDocumentClick
                                onClose={this.closePopup}>
                                <div className="TabContent" style={{ width: "max" }}>
                                    <Button className="close" onClick={this.closePopup} >
                                        &times;
                                    </Button>
                                    <br /><br />
                                    <Card>
                                        <CardHeader>
                                            <h4 style={{ textAlign: "center", fontWeight: "bold" }}>Nhận xét - đánh giá về doanh nghiệp</h4>
                                        </CardHeader>
                                        <FormGroup row>
                                            <Col xs="12" md="12">
                                                <Input value={this.state.comment} type="textarea" rows="5" placeholder="Nhập nhận xét..." onChange={this.handleInput} id="comment" name="comment" />
                                            </Col>
                                            <span style={{ marginLeft: "3%" }} className="form-error is-visible text-danger">
                                                {this.validator.message('Nhận xét - đánh giá', this.state.comment, 'required|max:255')}
                                            </span>
                                        </FormGroup>
                                        <CardFooter>
                                            <Row style={{ marginLeft: "30%" }}>
                                                <Col xs="4" sm="4">
                                                    <Button onClick={() => this.handleConfirm()} type="submit" color="primary" block>Xác nhận</Button>
                                                </Col>
                                                <Col xs="4" sm="4">
                                                    <Button color="danger" block onClick={this.closePopup}>Hủy bỏ</Button>
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </Popup>
                        </Row>
                    </div >
                )
        );
    }
}

export default BusinessProposed_Detail;
