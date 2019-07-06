import React, { Component } from 'react';
import { FormGroup, ButtonGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import decode from 'jwt-decode';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';

class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reportColor: ['success', 'primary', 'warning', 'danger', 'dark'],
            rate: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu'],
            role:'',
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let role = '';
        if (token != null) {
            const decoded = decode(token);
            role = decoded.role;
        }
        this.setState({
            role: role
        });
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
        const { searchValue, reportColor, rate, role } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Báo cáo
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
                                                <th style={{ textAlign: "center" }}>Họ và tên</th>
                                                <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                                                <th style={{ textAlign: "center" }}>Báo cáo #1</th>
                                                <th style={{ textAlign: "center" }}>Báo cáo #2</th>
                                                <th style={{ textAlign: "center" }}>Báo cáo #3</th>
                                                <th style={{ textAlign: "center" }}>Báo cáo #4</th>
                                                <th style={{ textAlign: "center" }}>Kết quả OJT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ textAlign: "center" }}>1</td>
                                                <td style={{ textAlign: "center" }}>SE60001</td>
                                                <td style={{ textAlign: "center" }}>Nguyễn Văn A</td>
                                                <td style={{ textAlign: "center" }}>IS</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <Button outline color={reportColor[0]} onClick={() => this.handleDirect(`/Report/Report_Detail/${1}`)}>
                                                        {rate[0]}
                                                    </Button>
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                {
                                                    role && role === 'ROLE_SUPERVISOR' ?
                                                    <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/${1}`)}>
                                                        Tạo
                                                    </Button> :
                                                    <p>N/A</p>
                                                }
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                {
                                                    role && role === 'ROLE_SUPERVISOR' ?
                                                    <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/${1}`)}>
                                                        Tạo
                                                    </Button> :
                                                    <p>N/A</p>
                                                }
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                {
                                                    role && role === 'ROLE_SUPERVISOR' ?
                                                    <Button color='primary' onClick={() => this.handleDirect(`/Report/Create_Report/${1}`)}>
                                                        Tạo
                                                    </Button> :
                                                    <p>N/A</p>
                                                }
                                                </td>
                                                <td style={{ textAlign: "center" }}>N/A</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
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

export default Report;
