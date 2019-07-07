import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
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
            suggestedStudents: null,
            business_name: '',
            searchValue: '',
            searchSuggestedValue: '',
            isAction: '',
            activeTab: new Array(1).fill('1'),
        }
        this.toggle = this.toggle.bind(this);
    }




    async componentDidMount() {
        const students = await ApiServices.Get('/student/getListStudentNotYetInvited');
        const suggestedStudents = await ApiServices.Get('/business/studentsSuggest');

        const business = await ApiServices.Get('/business/getBusiness');
        if (students != null && suggestedStudents != null) {
            this.setState({
                students,
                suggestedStudents,
                business_name: business.business_name
            });
        }


        // since I can connect from multiple devices or browser tabs, we store each connection instance separately
        // any time that connectionsRef's value is null (i.e. has no children) I am offline
        var myConnectionsRef = firebase.database().ref('users/joe/connections');

        // stores the timestamp of my last disconnect (the last time I was seen online)
        var lastOnlineRef = firebase.database().ref('users/joe/lastOnline');

        var connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', function (snap) {
            if (snap.val() === true) {
                // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
                var con = myConnectionsRef.push();

                // When I disconnect, remove this device
                con.onDisconnect().remove();

                // Add this device to my connections list
                // this value could contain info about the device or a timestamp too
                con.set(true);

                // When I disconnect, update the last time I was seen online
                lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            }
        });
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

    tabPane() {
        const { students, suggestedStudents, business_name, searchValue, searchSuggestedValue } = this.state;

        let filteredListStudents, filteredSuggestedListStudents;

        if (students != null) {
            filteredListStudents = students.filter(
                (student) => {
                    if (student.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return student;
                    }
                }
            );
        }


        if (suggestedStudents != null) {
            filteredSuggestedListStudents = suggestedStudents.filter(
                (suggestedStudent) => {
                    if (suggestedStudent.name.toLowerCase().indexOf(searchSuggestedValue.toLowerCase()) !== -1) {
                        return suggestedStudent;
                    }
                }
            );
        }
        return (
            <>
                <TabPane tabId="1">
                    {
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
                                                            student.transcriptLink && student.transcriptLink ? (
                                                                <a href={student.transcriptLink} download>Tải</a>
                                                            ) :
                                                                (<label>N/A</label>)
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <Button onClick={() => this.handleSubmit(student)} type="submit" style={{ marginRight: "1.5px" }} color="success" id={"btnSendInvitation" + index}>Gửi lời mời</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    }
                </TabPane>
                <TabPane tabId="2">
                    {
                        <div>
                            <nav className="navbar navbar-light bg-light justify-content-between">
                                <form className="form-inline">
                                    <input onChange={this.handleInput} name="searchSuggestedValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
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
                                        filteredSuggestedListStudents && filteredSuggestedListStudents.map((suggestedStudent, index) => {
                                            const skills = suggestedStudent.skills;

                                            return (
                                                <tr key={index}>
                                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                    <td style={{ textAlign: "center" }}>{suggestedStudent.code}</td>
                                                    <td style={{ textAlign: "center" }}>{suggestedStudent.name}</td>
                                                    <td style={{ textAlign: "center" }}>{suggestedStudent.specialized.name}</td>
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
                                                    <td style={{ textAlign: "center" }}>{suggestedStudent.gpa}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {
                                                            suggestedStudent.transcriptLink && suggestedStudent.transcriptLink ? (
                                                                <a href={suggestedStudent.transcriptLink} download>Tải</a>
                                                            ) :
                                                                (<label>N/A</label>)
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <Button onClick={() => this.handleSubmit(suggestedStudent)} type="submit" style={{ marginRight: "1.5px" }} color="success" id={"btnSendInvitation" + index}>Gửi lời mời</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    }
                </TabPane>
            </>
        );
    }


    handleSubmit = async (student) => {
        const { business_name } = this.state;
        const studentName = student.name;
        const email = student.email;
        const deviceToken = student.token;

        const invitation = {
            description: `Xin chào ${studentName}! Chúng tôi có lời mời bạn tham gia phỏng vấn tại công ty ${business_name}!`,
            state: 0,
            timeCreated: "2019-09-09",
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
            to: `${deviceToken}`
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

        const students2nd = await ApiServices.Get('/student/getListStudentNotYetInvited');
        const business = await ApiServices.Get('/business/getBusiness');
        if (students2nd != null) {
            this.setState({
                students: students2nd,
                business_name: business.business_name
            });
        }
    }

    toggle(tabPane, tab) {
        const newArray = this.state.activeTab.slice()
        newArray[tabPane] = tab
        this.setState({
            activeTab: newArray,
        });
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách sinh viên thực tập
                            </CardHeader>
                            <CardBody>
                                <Nav tabs style={{ fontWeight: "bold" }}>
                                    <NavItem>
                                        <NavLink
                                            active={this.state.activeTab[0] === '1'}
                                            onClick={() => { this.toggle(0, '1'); }}
                                        >
                                            Tổng
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            active={this.state.activeTab[0] === '2'}
                                            onClick={() => { this.toggle(0, '2'); }}
                                        >
                                            Danh sách sinh viên gợi ý
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab[0]}>
                                    {this.tabPane()}
                                </TabContent>
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
