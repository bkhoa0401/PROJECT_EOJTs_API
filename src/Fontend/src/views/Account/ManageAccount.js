import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';


class ManageAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supervisors: null,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (email, status) => {
        const result = await ApiServices.Put(`/business/updateStatus?email=${email}&isActive=${status}`);
        const supervisors = await ApiServices.Get('/business/getAllSupervisorABusiness');
        if (supervisors != null) {
            this.setState({
                supervisors,
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const supervisors = await ApiServices.Get('/business/getAllSupervisorABusiness');
        if (supervisors != null) {
            this.setState({
                supervisors,
            });
        }
    }

    render() {
        const { supervisors } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="15">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách tài khoản HR
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.handleDirect('/account/create')}>Tạo tài khoản mới</Button>
                                <br />
                                <br />
                                <br />
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>STT</th>
                                            <th style={{ textAlign: "center" }}>Email</th>
                                            <th style={{ textAlign: "center" }}>Họ Tên</th>
                                            <th style={{ textAlign: "center" }}>SĐT</th>
                                            <th style={{ textAlign: "center" }}>Địa chỉ</th>
                                            <th style={{ textAlign: "center" }}>Trạng thái</th>
                                            <th style={{ textAlign: "center" }}>Thao tác</th>
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
                                                            {supervisor.active.toString() == 'true' ? (
                                                                <Badge color="success">TRUE</Badge>
                                                            ) : (
                                                                    <Badge color="danger">FALSE</Badge>
                                                                )}
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {supervisor.active.toString() == 'true' ? (
                                                                <Button style={{ marginRight: "1.5px" }} color="warning" onClick={() => this.handleUpdateStatus(supervisor.email, false)} type="submit">Disabled</Button>
                                                            ) : (
                                                                    <Button style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleUpdateStatus(supervisor.email, true)} type="submit">Active</Button>
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

export default ManageAccount;
