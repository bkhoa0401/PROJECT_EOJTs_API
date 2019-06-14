import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';


class Ojt_Registration extends Component {

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
                                <i className="fa fa-align-justify"></i> Danh sách sinh viên đăng kí thực tập tại công ty
                            </CardHeader>
                            <CardBody>
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
                                            <th style={{ textAlign: "center" }}>GPA</th>
                                            <th style={{ textAlign: "center" }}>Bảng điểm</th>
                                            <th style={{ textAlign: "center" }}>Nguyện vọng</th>
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
                                            <td style={{ textAlign: "center" }}><a href="">Tải</a></td>
                                            <td style={{ textAlign: "center" }}></td>
                                            <td style={{ textAlign: "center" }}>
                                                <Button type="submit" style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleDirect("ojt_registration/cv")}>Xem CV</Button>
                                                {/* <Button type="submit" style={{ marginRight: "1.5px" }} color="primary">Duyệt</Button>
                                                <Button type="submit" style={{ marginRight: "1.5px" }} color="danger">Từ chối</Button> */}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <ToastContainer />
                                <Pagination>
                                    {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                </Pagination>
                            </CardBody>
                            {/* <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/invitation")} type="submit" color="primary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter> */}
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Ojt_Registration;
