import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { async } from 'q';


class Ojt_Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: null,
            business_name: '',
            searchValue: '',
        }
    }


    async componentDidMount() {
        const students = await ApiServices.Get('/student/getListStudentByOptionAndStatusOption');
        const business = await ApiServices.Get('/business/getBusiness');
        if (students != null) {
            this.setState({
                students,
                business_name: business.business_eng_name
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleIsAcceptedOption = async (email, numberOfOption, statusOfOption, btnApprove, btnReject) => {

        // document.getElementById(btnApprove).setAttribute("disabled", "disabled");
        // document.getElementById(btnReject).setAttribute("disabled", "disabled");

        const result = await ApiServices.Put(`/business/updateStatusOfStudent?numberOfOption=${numberOfOption}&statusOfOption=${statusOfOption}&emailOfStudent=${email}`);

        if (result.status == 200) {
            Toastify.actionSuccess('Thao tác thành công!');
        } else {
            Toastify.actionFail('Thao tác thất bại!');
        }

        const students = await ApiServices.Get('/student/getListStudentByOptionAndStatusOption');
        const business = await ApiServices.Get('/business/getBusiness');
        if (students != null) {
            this.setState({
                students,
                business_name: business.business_eng_name
            });
        }
    }

    render() {
        const { students, business_name, searchValue } = this.state;

        let filteredListStudents;

        if (students != null) {
            filteredListStudents = students.filter(
                (student) => {
                    if (student.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return student;
                    }
                }
            );
        }

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
                                        <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                    </form>

                                </nav>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>STT</th>
                                            <th style={{ textAlign: "center" }}>MSSV</th>
                                            <th style={{ textAlign: "center" }}>Họ và Tên</th>
                                            <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                                            <th style={{ textAlign: "center" }}>Nguyện vọng</th>
                                            <th style={{ textAlign: "center" }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredListStudents && filteredListStudents.map((student, index) => {

                                                let email = student.email;
                                                let numberOfOption = 'N/A';

                                                if (student.option1 == business_name) {
                                                    numberOfOption = 1;
                                                }
                                                if (student.option2 == business_name) {
                                                    numberOfOption = 2;
                                                }


                                                return (
                                                    <tr key={index}>
                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                        <td style={{ textAlign: "center" }}>{student.code}</td>
                                                        <td style={{ textAlign: "center" }}>{student.name}</td>
                                                        <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <strong>{numberOfOption}</strong>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button type="submit" style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleDirect(`/student/${student.email}`)}>Chi tiết</Button>
                                                            <Button id={'a' + index} type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleIsAcceptedOption(email, numberOfOption, true, 'a' + index, 'r' + index)}>Duyệt</Button>
                                                            <Button id={'r' + index} type="submit" style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleIsAcceptedOption(email, numberOfOption, false, 'a' + index, 'r' + index)}>Từ chối</Button>
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
