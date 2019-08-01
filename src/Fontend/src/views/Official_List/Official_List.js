import React, { Component } from 'react';
import { Badge, Card, CardBody, CardFooter, CardHeader, Col, Pagination, Row, Table, Input } from 'reactstrap';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';


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
      sortDirection: 'desc',
      loading: true,

      suggestedStudents: null,

      colorTextSelect: ['Black', 'White'],
      colorBackSelect: ['White', 'DeepSkyBlue'],
      listStudentEmail: [],
      preListStudentEmail: [],
      isSelect: [],
      preSupervisor: '',
      modal: false,
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
        supervisors_FirstBlank,
        loading: false
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

  handleSelectSupervisor = async (event) => {
    const { name, value } = event.target;
    let { supervisors_FirstBlank } = this.state;
    await this.setState({
      preSupervisor: supervisors_FirstBlank[value]
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

  handleConfirm = () => {
    const { listDataEdited } = this.state;

    if (listDataEdited.length == 0) {
      Toastify.actionWarning("Không có sự thay đổi!");
    } else {
      confirmAlert({
        title: 'Xác nhận',
        message: 'Bạn đã chắc chắn với những sự lựa chọn của mình?',
        buttons: [
          {
            label: 'Đồng ý',
            onClick: () => this.handleSubmit()
          },
          {
            label: 'Hủy bỏ',
          }
        ]
      });
    }
  };

  handleSelectAll = () => {
    let suggestedStudents = this.state.suggestedStudents;
    let preListStudentEmail = [];
    let isSelect = [];
    for (let index = 0; index < suggestedStudents.length; index++) {
      isSelect.push(1);
      preListStudentEmail.push(suggestedStudents[index]);
    }
    this.setState({
      preListStudentEmail: preListStudentEmail,
      isSelect: isSelect,
    })
  }

  handleDeSelect = () => {
    let suggestedStudents = this.state.suggestedStudents;
    let preListStudentEmail = [];
    let isSelect = [];
    for (let index = 0; index < suggestedStudents.length; index++) {
      isSelect.push(0);
    }
    this.setState({
      preListStudentEmail: preListStudentEmail,
      isSelect: isSelect,
    })
  }

  handleSelect = (studentEmail) => {
    let suggestedStudents = this.state.suggestedStudents;
    let isSelected = -1;
    let preListStudentEmail = this.state.preListStudentEmail;
    let isSelect = this.state.isSelect;
    for (let index = 0; index < preListStudentEmail.length; index++) {
      if (preListStudentEmail[index].email == studentEmail) {
        isSelected = index;
      }
    }
    if (isSelected != -1) {
      preListStudentEmail.splice(isSelected, 1);
    }
    for (let index = 0; index < suggestedStudents.length; index++) {
      if (suggestedStudents[index].email == studentEmail) {
        if (isSelected != -1) {
          isSelect[index] = 0;
        } else {
          isSelect[index] = 1;
          preListStudentEmail[index] = suggestedStudents[index];
        }
      }
    }
    this.setState({
      preListStudentEmail: preListStudentEmail,
      isSelect: isSelect,
    })
  }

  toggleModal = async () => {
    let suggestedStudents = null;
    let isSelect = [];
    if (this.state.modal == false) {
      this.setState({
        loading: true,
      })
      suggestedStudents = await ApiServices.Get(`/business/getStudentsByBusinessWithNoSupervisor`);

      // console.log(suggestedStudents);
      if (suggestedStudents != null) {
        for (let index = 0; index < suggestedStudents.length; index++) {
          isSelect.push(0);
        }
      }
      this.setState({
        modal: !this.state.modal,
        suggestedStudents: suggestedStudents,
        isSelect: isSelect,
        loading: false,
      });
    } else {
      this.setState({
        modal: !this.state.modal,
      })
    }
  }

  toggleModalWithConfirm = async () => {
    let { listDataEdited, preListStudentEmail, suggestedStudents } = this.state;
    if (preListStudentEmail.length == 0 || this.state.preSupervisor == '') {
      this.setState({
        modal: !this.state.modal,
      })
    } else {
      for (let index = 0; index < suggestedStudents.length; index++) {
        listDataEdited.push(suggestedStudents[index]);
        for (let i = 0; i < preListStudentEmail.length; i++) {
          if (preListStudentEmail[i].email == listDataEdited[index].email) {
            listDataEdited[index].supervisor = this.state.preSupervisor;
          }
        }
      }
      this.setState({
        listDataEdited: listDataEdited,
        modal: !this.state.modal,
      })
      // console.log(preListStudentEmail);
      // console.log(this.state.preSupervisor);
      // console.log(listDataEdited);
      confirmAlert({
        title: 'Xác nhận',
        message: 'Bạn đã chắc chắn với những sự lựa chọn của mình?',
        buttons: [
          {
            label: 'Đồng ý',
            onClick: () => this.handleSubmit()
          },
          {
            label: 'Hủy bỏ',
            onClick: () => this.setState({
              modal: !this.state.modal,
            })
          }
        ]
      });
    }
  }

  handleSubmit = async () => {
    this.setState({
      loading: true
    })

    const { listDataEdited } = this.state;
    const result = await ApiServices.Put('/business/assignSupervisor', listDataEdited);

    if (result.status == 200) {
      Toastify.actionSuccess("Thao tác thành công!");
      this.setState({
        loading: false,
      })

    } else {
      Toastify.actionFail("Thao tác thất bại!");
      this.setState({
        loading: false
      })
    }
  }

  render() {
    const { students, supervisors, supervisors_FirstBlank, searchValue, columnToSort, sortDirection, loading, suggestedStudents, isSelect, colorBackSelect, colorTextSelect } = this.state;
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
      loading.toString() === 'true' ? (
        SpinnerLoading.showHashLoader(loading)
      ) : (
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" lg="12">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> <b>Danh sách sinh viên thực tập tại doanh nghiệp</b>
                  </CardHeader>
                  <CardBody>
                    {filteredListStudents === null ?
                      <></> :
                      <FormGroup row style={{ paddingLeft: '45%' }}>
                        <Button color="primary" onClick={() => this.toggleModal()}>Phân nhóm</Button>
                      </FormGroup>
                    }
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
                          <th style={{ textAlign: "center" }}>Người hướng dẫn</th>
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
                                  <Button style={{ width: '100px', marginRight: '2px' }} color="primary" onClick={() => this.handleDirect(`/student-detail/${student.email}`)}>Chi tiết</Button>
                                  <Button style={{ width: '100px' }} color="success" onClick={() => this.handleDirect(`/details_task/${student.email}`)}>Nhiệm vụ</Button>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                    <ToastContainer />
                  </CardBody>
                  <CardFooter className="p-4">
                    <Row style={{ paddingLeft: '45%' }}>
                      <Col xs="4" sm="4">
                        <Button onClick={() => this.handleConfirm()} block color="primary" type="submit" id="btnSave">Lưu</Button>
                      </Col>
                    </Row>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
            <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={'modal-primary ' + this.props.className}>
              <ModalHeader toggle={this.toggleModal}>Phân nhóm</ModalHeader>
              <ModalBody>
                <FormGroup row>
                  <Col md='4'>
                    <Label>Người hướng dẫn</Label>
                  </Col>
                  <Col xs='12' md='8'>
                    <Input onChange={e => { this.handleSelectSupervisor(e) }} type="select" name="withBlank">
                      {supervisors_FirstBlank && supervisors_FirstBlank.map((supervisor, i) => {
                        return (
                          <option value={i}>{supervisor.name}</option>
                        )
                      })}
                    </Input>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12" md="6">
                    <Label>Sinh viên:</Label>
                  </Col>
                  <Col xs="12" md="6">
                    <Button color="primary" onClick={() => this.handleSelectAll()}>Chọn tất cả</Button>
                    &nbsp;&nbsp;
                    <Button color="primary" onClick={() => this.handleDeSelect()}>Huỷ chọn</Button>
                  </Col>
                </FormGroup>
                <hr />
                <ListGroup>
                  <div style={{ height: '400px', overflowY: 'scroll' }}>
                    {suggestedStudents && suggestedStudents.map((student, index) =>
                      <ListGroupItem action onClick={() => this.handleSelect(student.email)} style={{ color: colorTextSelect[isSelect[index]], backgroundColor: colorBackSelect[isSelect[index]] }}>
                        <ListGroupItemHeading style={{ fontWeight: 'bold' }}>{student.name}</ListGroupItemHeading>
                        <ListGroupItemText>
                          - Chuyên ngành: {student.specialized.name}
                          <br />- Kỹ năng:<br />
                          {student.skills.map((skill, index1) => {
                            return (
                              <>
                                &emsp;{index1 + 1}. {skill.name}<br />
                              </>
                            )
                          })}
                        </ListGroupItemText>
                      </ListGroupItem>
                    )}
                  </div>
                </ListGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggleModalWithConfirm}>Xác nhận</Button>
              </ModalFooter>
            </Modal>
          </div>
        )
    );
  }
}

export default Official_List;
