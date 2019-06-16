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
            students: null,
            business_name: '',
        }
    }


    async componentDidMount() {
        const students = await ApiServices.Get('/student/getListStudentByInvitationId');
        const business = await ApiServices.Get('/business/getBusiness');
        if (students != null) {
            this.setState({
                students,
                business_name: business.business_name
            });
        }
        console.log("STATE", this.state);
    }

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
        const { students, business_name } = this.state;
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
                                            <th style={{ textAlign: "center" }}>Kỹ năng</th>
                                            <th style={{ textAlign: "center" }}>GPA</th>
                                            <th style={{ textAlign: "center" }}>Trạng thái lời mời</th>
                                            <th style={{ textAlign: "center" }}>Nguyện vọng của sinh viên</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            students && students.map((student, index) => {

                                                const invitations = student.invitations;
                                                const skills = student.skills;

                                                let tmp = 'none';
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
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                skills && skills.map((skill, index) => {
                                                                    return (
                                                                        <div>
                                                                            <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                            <br />
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>{student.gpa}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                invitations[0].state.toString() == 'true' ? (
                                                                    <Badge color="success">Accepted</Badge>
                                                                ) : (
                                                                        <Badge color="danger">Pending</Badge>
                                                                    )
                                                            }
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <strong>
                                                                {tmp}
                                                            </strong>
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
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Invitation;
