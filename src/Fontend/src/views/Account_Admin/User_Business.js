import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table, Pagination, Input } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

class User_Business extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: null,
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10
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
        const { currentPage, rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                pageNumber: businesses.pageNumber,
                loading: false
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                pageNumber: businesses.pageNumber,
                loading: false
            });
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/user/getUsersByType?type=3&currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage: 0,
                pageNumber: businesses.pageNumber
            })
        }
    }

    render() {
        const { businesses, loading, pageNumber, currentPage, rowsPerPage } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
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
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Email</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Vai trò</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
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
                                                                    {student.active.toString() === 'true' ? (
                                                                        <Badge color="success">KÍCH HOẠT</Badge>
                                                                    ) : (
                                                                            <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                        )}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {student.active.toString() === 'true' ? (
                                                                        <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(student.email, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                    ) : (
                                                                            <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(student.email, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
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
                                        <Pagination style={{ marginTop: "3%" }}>
                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                            <h6 style={{ marginLeft: "5%", width: "15%", marginTop: "7px" }}>Số dòng trên trang: </h6>
                                            <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{ width: "7%" }}>
                                                <option value={10} selected={rowsPerPage === 10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </Input>
                                        </Pagination>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default User_Business;
