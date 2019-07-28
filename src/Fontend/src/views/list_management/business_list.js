import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';

class business_list extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: null,
            searchValue: '',
            loading: true
        };
    }

    async componentDidMount() {
        const businesses = await ApiServices.Get('/business/getAllBusiness');
        if (businesses != null) {
            this.setState({
                businesses,
                loading: false
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { businesses, searchValue, loading } = this.state;
        let filteredListBusinesses;
        if (businesses != null) {
            filteredListBusinesses = businesses.filter(
                (business) => {
                    if (business.business_name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return business;
                    }
                }
            );
        }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Danh sách doanh nghiệp
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
                                                        <th style={{ textAlign: "center" }}>Tên doanh nghiệp</th>
                                                        <th style={{ textAlign: "center" }}>Tên Tiếng Anh</th>
                                                        <th style={{ textAlign: "center" }}>Địa chỉ</th>
                                                        <th style={{ textAlign: "center" }}>Website</th>
                                                        <th style={{ textAlign: "center" }}>Liên hệ</th>
                                                        <th style={{ textAlign: "center" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredListBusinesses && filteredListBusinesses.map((business, index) => {
                                                        return (
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{business.business_name}</td>
                                                                <td style={{ textAlign: "center" }}>{business.business_eng_name}</td>
                                                                <td style={{ textAlign: "center" }}>{business.business_address}</td>
                                                                <td style={{ textAlign: "center" }}>{business.business_website}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    Email: {business.email}<br />
                                                                    SĐT: {business.business_phone}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <Button
                                                                        style={{ fontWeight: "bold", borderWidth: 0 }}
                                                                        color="primary"
                                                                        onClick={() => this.handleDirect(`/list_management/business_list/Business_Detail/${business.email}`)}
                                                                    >
                                                                        Chi tiết
                                                                    </Button>
                                                                    {/* &nbsp;&nbsp;
                                                        <Button style={{ fontWeight: "bold", borderWidth: 0 }} color="danger">Xoá</Button> */}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
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
                )
        );
    }
}

export default business_list;
