import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class User_Business extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: null,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirm = (businessEmail, status) => {

        var messageStatus = '';
        if (status) {
            messageStatus = 'kích hoạt';
        } else {
            messageStatus = 'vô hiệu';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${messageStatus} tài khoản '${businessEmail}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(businessEmail, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleUpdateStatus = async (email, status) => {
        const result = await ApiServices.Put(`/user/updateStatus?email=${email}&isActive=${status}`);
        const businesses = await ApiServices.Get('/user/getUsersByType?type=3');
        if (businesses != null) {
            this.setState({
                businesses,
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const businesses = await ApiServices.Get('/user/getUsersByType?type=3');
        if (businesses != null) {
            this.setState({
                businesses,
            });
        }
    }

    render() {
        const { businesses } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="15">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách tài khoản doanh nghiệp
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.handleDirect('/admin_account/businessList/create')}>Tạo tài khoản mới</Button>
                                <br />
                                <br />
                                <br />
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>STT</th>
                                            <th style={{ textAlign: "center" }}>Email</th>
                                            <th style={{ textAlign: "center" }}>Vai trò</th>
                                            <th style={{ textAlign: "center" }}>Trạng thái</th>
                                            <th style={{ textAlign: "center" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            businesses && businesses.map((student, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                        <td style={{ textAlign: "center" }}>{student.email}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                        {
                                                            student.roles[0].description === 'ROLE_HR' ? ('HR') : ('')
                                                        }
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {student.active.toString() == 'true' ? (
                                                                <Badge color="success">TRUE</Badge>
                                                            ) : (
                                                                    <Badge color="danger">FALSE</Badge>
                                                                )}
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {student.active.toString() == 'true' ? (
                                                                <Button style={{ marginRight: "1.5px" }} color="warning" onClick={() => this.handleConfirm(student.email, false)} type="submit">Vô hiệu</Button>
                                                            ) : (
                                                                    <Button style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleConfirm(student.email, true)} type="submit">Kích hoạt</Button>
                                                                )}
                                                            {/* <Button style={{ marginRight: "1.5px" }} type="submit" color="success" onClick={() => this.handleDirect(`/student/update/${student.id}`)}>Update</Button> */}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <ToastContainer />
                                {/* <Pagination>
                                        <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                    </Pagination> */}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default User_Business;
