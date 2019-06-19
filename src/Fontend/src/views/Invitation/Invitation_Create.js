import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { askForPermissioToReceiveNotifications } from './push-notification';
import firebase from 'firebase';

class Invitation_Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: null,
            business_name: '',
            searchValue: '',
            isAction: ''
        }
    }


    async componentDidMount() {
        const students = await ApiServices.Get('/student/getListStudentNotYetInvited');
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


    handleSubmit = async (index) => {
        const { students, business_name } = this.state;
        const studentName = students[index].name;
        const email = students[index].email;
        const btnId = "btnSendInvitation" + index;

        document.getElementById(btnId).setAttribute("disabled", "disabled");


        const invitation = {
            description: `Xin chào ${studentName}! Chúng tôi có lời mời bạn tham gia phỏng vấn tại công ty ${business_name}!`,
            state: 0,
            time_created: "2019-09-09",
            title: `Lời mời thực tập từ công ty ${business_name}`
        }

        const result = await ApiServices.Post(`/business/createInvitation?emailStudent=${email}`, invitation);


        // const messaging = firebase.messaging();
        // await messaging.requestPermission();
        // const tokenUser = await messaging.getToken();
        // console.log(tokenUser);

        const notificationDTO = {
            notification: {
                title: `Lời mời thực tập từ công ty ${business_name}`,
                body: `Xin chào ${studentName}! Chúng tôi có lời mời bạn tham gia phỏng vấn tại công ty ${business_name}!`,
                click_action: "http://localhost:3000/#/invitation/new",
                icon: "http://url-to-an-icon/icon.png"
            },
            to: 'dl4cdeeiWys:APA91bHsJJ-MGHBbOyjghit3M7GZID_asQUH8_IyB9kXlWFSROHA3LPrLo5JUzAfYlZbg22nbzulqQApYMD7ItaoB_j3mcivQ-mU2w_qpyBiaFbRPGpy4U8b_y1U5Ns_yKQxvBAPq3I1'
        }

        const isSend = await ApiServices.PostNotifications('https://fcm.googleapis.com/fcm/send', notificationDTO);

        if (result.status == 201) {
            Toastify.actionSuccess('Gửi lời mời thành công');
            if (isSend == null || isSend.status != 200) {
                Toastify.actionWarning('Gửi thông báo thất bại');
            }
        } else {
            Toastify.actionFail('Gửi lời mời thất bại');
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
                                <i className="fa fa-align-justify"></i> Danh sách sinh viên thực tập
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
                                            <th style={{ textAlign: "center" }}>Kỹ năng</th>
                                            <th style={{ textAlign: "center" }}>GPA</th>
                                            <th style={{ textAlign: "center" }}>Bảng điểm</th>
                                            <th style={{ textAlign: "center" }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredListStudents && filteredListStudents.map((student, index) => {
                                                const skills = student.skills;
                                                const linkDownload = `http://localhost:8000/api/file/downloadFile?emailStudent=${student.email}`;

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
                                                        <td style={{ textAlign: "center" }}><a href={linkDownload} download>Tải</a></td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button onClick={() => this.handleSubmit(index)} type="submit" style={{ marginRight: "1.5px" }} color="success" id={"btnSendInvitation" + index}>Gửi lời mời</Button>
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
