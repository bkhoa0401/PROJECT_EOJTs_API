import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table, Input } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import orderBy from "lodash/orderBy";
import Toastify from '../../views/Toastify/Toastify';
import {
  getPaginationPageNumber,
  getPaginationNextPageNumber,
  getPaginationCurrentPageNumber
} from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { async } from 'q';

const invertDirection = {
  asc: 'desc',
  desc: 'asc'
};

const rowSave = {
  paddingLeft: '45%'
}

class Official_List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      students: null,
      supervisors: [],
      supervisors_FirstBlank: [],
      listDataEdited: [],
      supervisorItem: {},
      searchValue: '',
      columnToSort: '',
      sortDirection: 'desc'
    }
  }


  async componentDidMount() {
    await ApiServices.Put('/admin');
    const students = await ApiServices.Get('/business/getStudentsByBusiness');
    const supervisors = await ApiServices.Get('/business/getAllSupervisorABusiness');
    const supervisors_FirstBlank = await ApiServices.Get('/business/getAllSupervisorABusiness');

    const supervisors_FirstBlank_Obj = {
      email: '',
      name: ''
    }
    supervisors_FirstBlank.unshift(supervisors_FirstBlank_Obj);

    if (students != null && supervisors != null) {
      this.setState({
        students,
        supervisors,
        supervisors_FirstBlank
      });
    }
  }

  handleDirect = (uri) => {
    this.props.history.push(uri);
  }

  handleInputSearch = async (event) => {
    const { name, value } = event.target;
    await this.setState({
      [name]: value.substr(0, 20),
    })
  }

  handleInputSupervisor = async (event, student) => {
    const { name, value } = event.target;
    const { supervisors, supervisors_FirstBlank, listDataEdited } = this.state;

    if (name === 'supervisor') {
      await this.setState({
        supervisorItem: supervisors[value]
      })
    } else if (name === 'withBlank') {
      await this.setState({
        supervisorItem: supervisors_FirstBlank[value]
      })
    }
    student.supervisor = this.state.supervisorItem;

    if (listDataEdited.length > 0) {
      for (let i = 0; i < listDataEdited.length; i++) {
        if (listDataEdited[i].email === student.email) {
          listDataEdited.splice(i, 1);
        }
      }
      listDataEdited.push(student);
    } else {
      listDataEdited.push(student);
    }
  }

  handleSubmit = async () => {
    const { listDataEdited } = this.state;
    console.log(listDataEdited);
    if (listDataEdited.length == 0) {
      Toastify.actionWarning("Không có sự thay đổi!");
    } else {
      const result = await ApiServices.Put('/business/assignSupervisor', listDataEdited);
      if (result.status == 200) {
        Toastify.actionSuccess("Thao tác thành công!");

      } else {
        Toastify.actionFail("Thao tác thất bại!");
      }
    }
  }

  render() {
    const { students, supervisors, supervisors_FirstBlank, searchValue, columnToSort, sortDirection } = this.state;
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
                <i className="fa fa-align-justify"></i> <b>Danh sách sinh viên thực tập tại doanh nghiệp</b>
              </CardHeader>
              <CardBody>
                <nav className="navbar navbar-light bg-light justify-content-between">
                  <form className="form-inline">
                    <input onChange={this.handleInputSearch} name="searchValue" className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                  </form>
                  <div style={{ marginRight: "70px" }}>
                    <b>Sắp xếp theo: </b>
                    &nbsp;&nbsp;&nbsp;
                    <select>
                      <option value="olala">olala</option>
                      <option value="olala">olala 2</option>
                      <option value="olala">olala 3</option>
                    </select>
                  </div>
                </nav>

                <Table responsive striped>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>STT</th>
                      <th style={{ textAlign: "center" }}>MSSV</th>
                      <th style={{ textAlign: "center" }}>Họ và Tên</th>
                      <th style={{ textAlign: "center" }}>Chuyên ngành</th>
                      {/* <th style={{ textAlign: "center" }}><div onClick={() => this.handleSort('Chuyên ngành')}>Chuyên ngành</div></th> */}
                      {/* <th style={{ textAlign: "center" }}>GPA</th>
                      <th style={{ textAlign: "center" }}>CV</th>
                      <th style={{ textAlign: "center" }}>Bảng điểm</th> */}
                      <th style={{ textAlign: "center" }}>Supervisor</th>
                      <th style={{ textAlign: "center" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filteredListStudents && filteredListStudents.map((student, index) => {
                        const linkDownCV = `http://localhost:8000/api/file/downloadFile/${student.resumeLink}`;
                        return (
                          <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td style={{ textAlign: "center" }}>{student.code}</td>
                            <td style={{ textAlign: "center" }}>{student.name}</td>
                            <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
                            {/* <td style={{ textAlign: "center" }}>{student.gpa}</td>
                            <td style={{ textAlign: "center" }}>
                              {
                                student.resumeLink && student.resumeLink ? (
                                  <a href={linkDownCV} download>Tải</a>
                                ) :
                                  (<label>N/A</label>)
                              }
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {
                                student.transcriptLink && student.transcriptLink ? (
                                  <a href={student.transcriptLink} download>Tải</a>
                                ) :
                                  (<label>N/A</label>)
                              }
                            </td> */}
                            <td style={{ textAlign: "center" }}>
                              {
                                student.supervisor == null ? (

                                  <Input onChange={e => { this.handleInputSupervisor(e, student) }} type="select" name="withBlank">
                                    {supervisors_FirstBlank && supervisors_FirstBlank.map((supervisor, i) => {
                                      return (
                                        <option value={i}>{supervisor.name}</option>
                                      )
                                    })}
                                  </Input>
                                ) : (
                                    <Input onChange={e => { this.handleInputSupervisor(e, student) }} type="select" name="supervisor">
                                      {supervisors && supervisors.map((supervisor, i) => {
                                        return (
                                          <option value={i} selected={student.supervisor.email === supervisor.email}>{supervisor.name}</option>
                                        )
                                      })}
                                    </Input>
                                  )
                              }

                            </td>
                            <td style={{ textAlign: "center" }}>
                            <Button style={{ width: '100px', marginRight: '2px' }} color="success" onClick={() => this.handleDirect(`/student-detail/${student.email}`)}>Chi tiết</Button>
                              <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleDirect(`/details_task/${student.email}`)}>Nhiệm vụ</Button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
                <ToastContainer />

              </CardBody>
            </Card>
          </Col>
        </Row>
        <div style={rowSave}><Button onClick={() => this.handleSubmit()} style={{ width: '100px' }} color="primary" type="submit" id="btnSave">Lưu</Button></div>
      </div>
    );
  }
}

export default Official_List;
