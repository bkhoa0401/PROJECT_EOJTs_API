import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import orderBy from "lodash/orderBy";
import Toastify from '../../views/Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';

const invertDirection = {
    asc: 'desc',
    desc: 'asc'
};
class Invitation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: null,
            business_name: '',
            searchValue: '',
            columnToSort: '',
            sortDirection: 'desc'
        }
    }


    async componentDidMount() {
        const students = await ApiServices.Get('/student/getListStudentIsInvited');
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

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }


    // handleSort = (columnName) => {
    //     this.setState({
    //         columnToSort: columnName,
    //         sortDirection: state.columnToSort === columnName ? invertDirection[state.sortDirection] : "asc"
    //     })
    //     console.log(this.state);
    // }

    render() {
        const { students, business_name, searchValue, columnToSort, sortDirection } = this.state;
        let filteredListStudents = orderBy(students, columnToSort, sortDirection);

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
                                <i className="fa fa-align-justify"></i> Danh sách các lời mời đã gửi hiện tại
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.handleDirect('/invitation/new')}>Gửi lời mời cho sinh viên</Button>
                                <br />
                                <br />
                                <br />
                                <nav className="navbar navbar-light bg-light justify-content-between">
                                    <form className="form-inline">
                                        <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                                    </form>

                                </nav>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>STT</th>
                                            <th style={{ textAlign: "center" }}>MSSV</th>
                                            <th style={{ textAlign: "center" }}>Họ và Tên</th>
                                            <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                                            {/* <th style={{ textAlign: "center" }}><div onClick={() => this.handleSort('Chuyên ngành')}>Chuyên ngành</div></th> */}
                                            <th style={{ textAlign: "center" }}>Kỹ năng</th>
                                            <th style={{ textAlign: "center" }}>GPA</th>
                                            <th style={{ textAlign: "center" }}>Trạng thái lời mời</th>
                                            <th style={{ textAlign: "center" }}>Nguyện vọng của sinh viên</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredListStudents && filteredListStudents.map((student, index) => {

                                                const invitations = student.invitations;
                                                var invitationDetail = null;

                                                invitations && invitations.map((invitation, index) => {
                                                    const business_name_invitation = student.invitations[index].business.business_name;
                                                    if (business_name === business_name_invitation) {
                                                        invitationDetail = student.invitations[index];
                                                    }
                                                })




                                                const skills = student.skills;

                                                let tmp = 'N/A';
                                                if (invitationDetail != null && invitationDetail.state != 'false') {
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
                                                                            {
                                                                                <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>{student.gpa}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                invitationDetail && (
                                                                    invitationDetail.state.toString() == 'true' ? (
                                                                        <Badge color="success">Accepted</Badge>
                                                                    ) : (
                                                                            <Badge color="danger">Pending</Badge>
                                                                        )
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
