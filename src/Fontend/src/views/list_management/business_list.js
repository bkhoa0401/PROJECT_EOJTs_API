import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';


class business_list extends Component {

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    render() {

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Danh sách công ty
                            </CardHeader>
                            <CardBody>
                                <div>
                                    <nav className="navbar navbar-light bg-light justify-content-between">
                                        <form className="form-inline">
                                            <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                        </form>
                                    </nav>
                                    <Table responsive striped>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: "center" }}>STT</th>
                                                <th style={{ textAlign: "center" }}>MSSV</th>
                                                <th style={{ textAlign: "center" }}>Họ và Tên</th>
                                                <th style={{ textAlign: "center" }}>Email</th>
                                                <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                                                <th style={{ textAlign: "center" }}>Bảng điểm</th>
                                                <th style={{ textAlign: "center" }}>Học kỳ</th>
                                                <th style={{ textAlign: "center" }}>Điều kiện thực tập</th>
                                                <th style={{ textAlign: "center" }}>GPA</th>
                                                <th style={{ textAlign: "center" }}>Bảng điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>1</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
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

export default business_list;
