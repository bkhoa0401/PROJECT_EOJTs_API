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
            students: null,
            business_name: '',
        }
    }


    async componentDidMount() {
        const students = await ApiServices.Get('/student/getListStudentByOption');
        const business = await ApiServices.Get('/business/getBusiness');
        if (students != null) {
            this.setState({
                students,
                business_name: business.business_name
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { students, business_name } = this.state;
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
                                            <th style={{ textAlign: "center" }}>Bảng điểm</th>
                                            <th style={{ textAlign: "center" }}>Nguyện vọng</th>
                                            <th style={{ textAlign: "center" }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            students && students.map((student, index) => {

                                                const invitations = student.invitations;
                                                const skills = student.skills;

                                                let tmp = 'Pending';
                                                if (invitations[0].state != 'false') {
                                                    if (student.option1 == business_name) {
                                                        tmp = 1;
                                                    }
                                                    if (student.option2 == business_name) {
                                                        tmp = 2;
                                                    }
                                                }

                                                return (
                                                    <tr key={index}>
                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                        <td style={{ textAlign: "center" }}>{student.code}</td>
                                                        <td style={{ textAlign: "center" }}>{student.name}</td>
                                                        <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                        <td style={{ textAlign: "center" }}><a href="">Tải</a></td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <strong>
                                                                {tmp}
                                                            </strong>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button type="submit" style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleDirect(`ojt_registration/cv/${student.email}`)}>Xem CV</Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
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
