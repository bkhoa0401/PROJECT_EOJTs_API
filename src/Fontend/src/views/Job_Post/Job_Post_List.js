import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';


class Job_Post_List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: null,
            searchValue: '',
        };
    }

    async componentDidMount() {
        const businesses = await ApiServices.Get('/business/getAllBusiness');
        if (businesses != null) {
            this.setState({
                businesses,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    render() {
        const { businesses, searchValue } = this.state;
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
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Thông tin tuyển dụng
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
                                                <th style={{ textAlign: "center" }}>Doanh nghiệp</th>
                                                <th style={{ textAlign: "center" }}>Ngành</th>
                                                <th style={{ textAlign: "center" }}>Vị trí - Số lượng</th>
                                                <th style={{ textAlign: "center" }}>Quy trình tuyển</th>
                                                <th style={{ textAlign: "center" }}>Chính sách</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {filteredListBusinesses && filteredListBusinesses.map((business, index) => {
                                                return( */}
                                                <tr>
                                                    <td style={{ textAlign: "center" }}>1</td>
                                                    <td style={{ textAlign: "center" }}>TP Bank</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        IS<br/>
                                                        JS<br/>
                                                        GD
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        Java: 30<br/>
                                                        C#:20<br/>
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        1. Phỏng vấn tại bàn nhận hồ sơ<br/>
                                                        2. Liên hệ phỏng vấn qua điện thoại, gửi thư mời tham gia phỏng vấn<br/>
                                                        3. Phỏng vấn và làm bài test tại công ty
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        Lương tháng 13<br/>
                                                        Không OT
                                                    </td>
                                                </tr>
                                                {/* )
                                            })} */}
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

export default Job_Post_List;