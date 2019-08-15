import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table, Input, Pagination } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

class ManageAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supervisors: null,
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (email, status) => {
        const result = await ApiServices.Put(`/business/updateStatus?email=${email}&isActive=${status}`);
        const { currentPage, rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                pageNumber: supervisors.pageNumber,
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
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                pageNumber: supervisors.pageNumber,
                loading: false
            });
        }
    }

    handleConfirm = (supervisorEmail, status) => {

        var messageStatus = '';
        if (status) {
            messageStatus = 'kích hoạt';
        } else {
            messageStatus = 'vô hiệu';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${messageStatus} tài khoản '${supervisorEmail}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(supervisorEmail, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                currentPage,
                pageNumber: supervisors.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                currentPage,
                pageNumber: supervisors.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                currentPage,
                pageNumber: supervisors.pageNumber
            })
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const supervisors = await ApiServices.Get(`/business/getAllSupervisorABusiness/?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (supervisors !== null) {
            this.setState({
                supervisors: supervisors.listData,
                currentPage: 0,
                pageNumber: supervisors.pageNumber
            })
        }
    }

    render() {
        const { supervisors, loading, pageNumber, currentPage, rowsPerPage } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="15">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách tài khoản Supervisor
                            </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/account/create')}>Tạo tài khoản mới</Button>
                                        <br />
                                        <br />
                                        <br />
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Email</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Họ Tên</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>SĐT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Địa chỉ</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    supervisors && supervisors.map((supervisor, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{supervisor.email}</td>
                                                                <td style={{ textAlign: "center" }}>{supervisor.name}</td>
                                                                <td style={{ textAlign: "center" }}>{supervisor.phone}</td>
                                                                <td style={{ textAlign: "center" }}>{supervisor.address}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {supervisor.active.toString() === 'true' ? (
                                                                        <Badge color="success">KÍCH HOẠT</Badge>
                                                                    ) : (
                                                                            <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                        )}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {supervisor.active.toString() === 'true' ? (
                                                                        <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(supervisor.email, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                    ) : (
                                                                            <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(supervisor.email, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                        )}
                                                                    {/* <Button style={{ marginRight: "1.5px" }} type="submit" color="success" onClick={() => this.handleDirect(`/supervisor/update/${supervisor.id}`)}>Update</Button> */}
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

export default ManageAccount;
