import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';


class Invitation extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    //   async componentDidMount() {
    //     const products = await ApiService.Get('/product');
    //     if (products != null) {
    //       this.setState({

    //       });
    //     }
    //   }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    // handleDelete = async (deletedId) => {
    //   const result = await ApiService.Delete(`/product/${deletedId}`, "");

    //   if (result) {
    //     // do something
    //   } else {

    //   }

    // }

    //   handleUpdateDiscontinued = async (id, discontinued) => {
    //     const result = await ApiService.Put(`/product/discontinued/${id}/${discontinued}`, "");
    //     const products = await ApiService.Get('/product');
    //     if (products != null) {
    //       const { currentPage } = this.state;
    //       const pageNumber = getPaginationPageNumber(products.length);
    //       const productsPagination = products.slice(getPaginationCurrentPageNumber(currentPage), getPaginationNextPageNumber(currentPage));
    //       this.setState({
    //         products,
    //         pageNumber,
    //         productsPagination,
    //       });
    //     }

    //     if (result) {
    //       // do something
    //       Toastify.querySuccess("Update Status Successfully!");
    //     } else {
    //       Toastify.queryFail("Update Status Fail!");
    //     }

    //   }


    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách các lời mời đã gửi hiện tại
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.handleDirect('/invitation/new')}>Gửi lời mời cho sinh viên</Button>
                                <br />
                                <br />
                                <br />
                                <nav className="navbar navbar-light bg-light justify-content-between">
                                    <form className="form-inline">
                                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                    </form>
                                    
                                </nav>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>STT</th>
                                            <th style={{ textAlign: "center" }}>MSSV</th>
                                            <th style={{ textAlign: "center" }}>Họ và Tên</th>
                                            <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                                            <th style={{ textAlign: "center" }}>Kết quả</th>
                                            <th style={{ textAlign: "center" }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ textAlign: "center" }}></td>
                                            <td style={{ textAlign: "center" }}></td>
                                            <td style={{ textAlign: "center" }}></td>
                                            <td style={{ textAlign: "center" }}></td>
                                            <td style={{ textAlign: "center" }}></td>
                                            <td style={{ textAlign: "center" }}>
                                                <Button type="submit" style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleDirect("/invitation/detail")}>Chi tiết</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <ToastContainer />
                                <Pagination>
                                    {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                </Pagination>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Invitation;
