import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
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
      searchValue: '',
      columnToSort: '',
      sortDirection: 'desc'
    }
  }


  async componentDidMount() {
    await ApiServices.Put('/admin');
    const students = await ApiServices.Get('/business/getStudentsByBusiness');
    if (students != null) {
      this.setState({
        students
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

  render() {
    const { students, searchValue, columnToSort, sortDirection } = this.state;
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
                    <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
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
                      <th style={{ textAlign: "center" }}>GPA</th>
                      <th style={{ textAlign: "center" }}>Bảng điểm</th>
                      <th style={{ textAlign: "center" }}>Supervisor</th>
                      <th style={{ textAlign: "center" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filteredListStudents && filteredListStudents.map((student, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td style={{ textAlign: "center" }}>{student.code}</td>
                            <td style={{ textAlign: "center" }}>{student.name}</td>
                            <td style={{ textAlign: "center" }}>{student.specialized.name}</td>
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
                              <select>
                                <option> supervisor 1 </option>
                                <option> supervisor 2 </option>
                                <option> supervisor 3 </option>
                              </select>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <Button style={{ width: '100px' }} color="primary" type="submit" id="btnSave">Nhiệm vụ</Button>
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
        <div style={rowSave}><Button style={{ width: '100px' }} color="primary" type="submit" id="btnSave">Lưu</Button></div>
      </div>
    );
  }
}

export default Official_List;
