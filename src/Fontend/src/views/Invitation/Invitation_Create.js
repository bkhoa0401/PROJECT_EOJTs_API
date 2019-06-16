import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';


class Invitation_Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: null,
        }
    }


    async componentDidMount() {
        const students = await ApiServices.Get('/student/getAllStudent');
        if (students != null) {
            this.setState({
                students
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    //   handleUpdateDiscontinued = async (id, discontinued) => {
    //     const result = await ApiService.Put(`/product/discontinued/${id}/${discontinued}`, "");
    //     const students = await ApiService.Get('/product');
    //     if (students != null) {
    //       const { currentPage } = this.state;
    //       const pageNumber = getPaginationPageNumber(students.length);
    //       const studentsPagination = students.slice(getPaginationCurrentPageNumber(currentPage), getPaginationNextPageNumber(currentPage));
    //       this.setState({
    //         students,
    //         pageNumber,
    //         studentsPagination,
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
        const { students } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách sinh viên thực tập
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
                                            <th style={{ textAlign: "center" }}>Kỹ năng</th>
                                            <th style={{ textAlign: "center" }}>GPA</th>
                                            <th style={{ textAlign: "center" }}>Bảng điểm</th>
                                            <th style={{ textAlign: "center" }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            students && students.map((student, index) => {
                                                const skills = student.skills;

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
                                                        <td style={{ textAlign: "center" }}><a href="">Tải</a></td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button type="submit" style={{ marginRight: "1.5px" }} color="primary">Gửi lời mời</Button>
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
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/invitation")} type="submit" color="primary" block>Trở về</Button>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Invitation_Create;
