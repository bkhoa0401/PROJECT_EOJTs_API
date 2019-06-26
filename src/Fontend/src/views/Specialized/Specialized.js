import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';


class Specialized extends Component {

    constructor(props) {
        super(props);
        this.state = {
            specializeds: null,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (id, status) => {
        const result = await ApiServices.Put(`/specialized/status?id=${id}&status=${status}`);
        const specializeds = await ApiServices.Get('/specialized');
        if (specializeds != null) {
            this.setState({
                specializeds,
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const specializeds = await ApiServices.Get('/specialized');
        if (specializeds != null) {
            this.setState({
                specializeds,
            });
        }
    }

    render() {
        const { specializeds } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="15">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách chuyên ngành
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.handleDirect('/specialized/create')}>Tạo chuyên ngành mới</Button>
                                <br />
                                <br />
                                <br />
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>STT</th>
                                            <th style={{ textAlign: "center" }}>Tên Ngành</th>
                                            <th style={{ textAlign: "center" }}>Trạng thái</th>
                                            <th style={{ textAlign: "center" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            specializeds && specializeds.map((specialized, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                        <td style={{ textAlign: "center" }}>{specialized.name}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {specialized.status.toString() == 'true' ? (
                                                                <Badge color="success">TRUE</Badge>
                                                            ) : (
                                                                    <Badge color="danger">FALSE</Badge>
                                                                )}
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {specialized.status.toString() == 'true' ? (
                                                                <Button style={{ marginRight: "1.5px" }} color="warning" onClick={() => this.handleUpdateStatus(specialized.id, false)} type="submit">Disabled</Button>
                                                            ) : (
                                                                    <Button style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleUpdateStatus(specialized.id, true)} type="submit">Active</Button>
                                                                )}
                                                            <Button style={{ marginRight: "1.5px" }} type="submit" color="success" onClick={() => this.handleDirect(`/specialized/update/${specialized.id}`)}>Update</Button>

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

export default Specialized;
