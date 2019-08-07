import orderBy from "lodash/orderBy";
import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';


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
      modalDetail: false,
      modalTask: false,
      studentDetail: null,
      listStudentTask: null,
      months: null,
      isThisMonth: -1,
    }
  }


  async componentDidMount() {
    // await ApiServices.Put('/admin');
    const students = await ApiServices.Get('/business/getStudentsByBusiness');
    const supervisors = await ApiServices.Get('/business/getAllSupervisorABusiness');
    let supervisors_FirstBlank = await ApiServices.Get('/business/getAllSupervisorABusiness');

    const supervisors_FirstBlank_Obj = {
      email: '',
      name: ''
    }
    if (supervisors_FirstBlank.length > 1) {
      supervisors_FirstBlank.unshift(supervisors_FirstBlank_Obj);
    } else {
      supervisors_FirstBlank = [];
      supervisors_FirstBlank.push(supervisors_FirstBlank_Obj);
    }
    if (students !== null && supervisors !== null && supervisors_FirstBlank !== null) {
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

  handleSelectMonth = async (event, studentDetail) => {
    const { name, value } = event.target;
    const { months } = this.state;
    var date = months[value].split(" - ");
    // console.log(date[0]);
    // console.log(date[1]);
    var formatDateStart = date[0].split("/");
    let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
    // console.log(dateStart);
    var formatDateEnd = date[1].split("/");
    let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
    // console.log(dateEnd);
    const listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}&dateStart=${dateStart}&dateEnd=${dateEnd}`);
    await this.setState({
      listStudentTask: listStudentTask,
      isThisMonth: -1,
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

    if (listDataEdited.length === 0) {
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
      if (preListStudentEmail[index].email === studentEmail) {
        isSelected = index;
      }
    }
    if (isSelected !== -1) {
      preListStudentEmail.splice(isSelected, 1);
    }
    for (let index = 0; index < suggestedStudents.length; index++) {
      if (suggestedStudents[index].email === studentEmail) {
        if (isSelected !== -1) {
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
    if (this.state.modal === false) {
      this.setState({
        loading: true,
      })
      suggestedStudents = await ApiServices.Get(`/business/getStudentsByBusinessWithNoSupervisor`);

      // console.log(suggestedStudents);
      if (suggestedStudents !== null) {
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
    if (preListStudentEmail.length === 0 || this.state.preSupervisor === '') {
      this.setState({
        modal: !this.state.modal,
      })
    } else {
      for (let index = 0; index < suggestedStudents.length; index++) {
        listDataEdited.push(suggestedStudents[index]);
        for (let i = 0; i < preListStudentEmail.length; i++) {
          if (preListStudentEmail[i].email === listDataEdited[index].email) {
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

  toggleModalDetail = async (studentDetail) => {
    if (this.state.modalDetail === false) {
      this.setState({
        modalDetail: !this.state.modalDetail,
        studentDetail: studentDetail,
      });
    } else {
      this.setState({
        modalDetail: !this.state.modalDetail,
      })
    }
  }

  toggleModalTask = async (studentDetail) => {
    if (this.state.modalTask === false) {
      // const listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}`);

      this.setState({
        loading: true,
      })
      let months = [];
      var date = new Date();
      let isThisMonth = -1;

      const ojtEnrollment = await ApiServices.Get(`/enrollment/getSelectedStuEnrollment?email=${studentDetail.email}`);
      var dateEnroll = ojtEnrollment.timeEnroll;
      var splitDate = dateEnroll.split('-');
      let dd = parseInt(splitDate[2]);
      let mm = parseInt(splitDate[1]);
      // let mm31 = [1, 3, 5, 7, 8, 10, 12];
      let mm30 = [4, 6, 9, 11];
      let yyyy = parseInt(splitDate[0]);
      for (let index = 1; index < 5; index++) {
        let timeStartShow = "";
        if (mm + parseInt(index) > 13) {
          if ((mm + parseInt(index) - 12 - 1) === 2 && (yyyy + 1) % 4 === 0 && dd > 29) {
            timeStartShow = 29 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
          } else if ((mm + parseInt(index) - 12 - 1) === 2 && (yyyy + 1) % 4 !== 0 && dd > 28) {
            timeStartShow = 28 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
          } else if (mm30.includes((mm + parseInt(index) - 12 - 1)) && dd > 30) {
            timeStartShow = 30 + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
          } else {
            timeStartShow = dd + "/" + (mm + parseInt(index) - 12 - 1) + "/" + (yyyy + 1);
          }
        } else {
          if ((mm + parseInt(index) - 1) === 2 && yyyy % 4 === 0 && dd > 29) {
            timeStartShow = 29 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
          } else if ((mm + parseInt(index) - 1) === 2 && yyyy % 4 !== 0 && dd > 28) {
            timeStartShow = 28 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
          } else if (mm30.includes((mm + parseInt(index) - 1)) && dd > 30) {
            timeStartShow = 30 + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
          } else {
            timeStartShow = dd + "/" + (mm + parseInt(index) - 1) + "/" + yyyy;
          }
        }
        let formatTimeStartShow = timeStartShow.split('/');
        // console.log(formatTimeStartShow[1]);
        // console.log(formatTimeStartShow[0]);
        if (parseInt(formatTimeStartShow[1]) < 10) {
          formatTimeStartShow[1] = "0" + formatTimeStartShow[1];
        }
        if (parseInt(formatTimeStartShow[0]) < 10) {
          formatTimeStartShow[0] = "0" + formatTimeStartShow[0];
        }
        timeStartShow = formatTimeStartShow[0] + "/" + formatTimeStartShow[1] + "/" + formatTimeStartShow[2];
        // console.log(timeStartShow);
        let timeEndShow = "";
        if (mm + parseInt(index) > 12) {
          if ((mm + parseInt(index) - 12) === 2 && (yyyy + 1) % 4 === 0 && dd > 29) {
            timeEndShow = 29 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
          } else if ((mm + parseInt(index) - 12) === 2 && (yyyy + 1) % 4 !== 0 && dd > 28) {
            timeEndShow = 28 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
          } else if (mm30.includes((mm + parseInt(index) - 12)) && dd > 30) {
            timeEndShow = 30 + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
          } else {
            timeEndShow = dd + "/" + (mm + parseInt(index) - 12) + "/" + (yyyy + 1);
          }
        } else {
          if ((mm + parseInt(index)) === 2 && yyyy % 4 === 0 && dd > 29) {
            timeEndShow = 29 + "/" + (mm + parseInt(index)) + "/" + yyyy;
          } else if ((mm + parseInt(index)) === 2 && yyyy % 4 !== 0 && dd > 28) {
            timeEndShow = 28 + "/" + (mm + parseInt(index)) + "/" + yyyy;
          } else if (mm30.includes((mm + parseInt(index))) && dd > 30) {
            timeEndShow = 30 + "/" + (mm + parseInt(index)) + "/" + yyyy;
          } else {
            timeEndShow = dd + "/" + (mm + parseInt(index)) + "/" + yyyy;
          }
        }
        let formatTimeEndShow = timeEndShow.split('/');
        if (parseInt(formatTimeEndShow[1]) < 10) {
          formatTimeEndShow[1] = "0" + formatTimeEndShow[1];
        }
        if (parseInt(formatTimeEndShow[0]) < 10) {
          formatTimeEndShow[0] = "0" + formatTimeEndShow[0];
        }
        timeEndShow = formatTimeEndShow[0] + "/" + formatTimeEndShow[1] + "/" + formatTimeEndShow[2];
        // console.log(timeEndShow);
        var date1 = new Date();
        var date2 = new Date();
        date1.setFullYear(parseInt(formatTimeStartShow[2]), parseInt(formatTimeStartShow[1] - 1), parseInt(formatTimeStartShow[0]));
        // console.log(formatTimeStartShow[1]);
        date2.setFullYear(parseInt(formatTimeEndShow[2]), parseInt(formatTimeEndShow[1] - 1), parseInt(formatTimeEndShow[0]));
        if (date >= date1 && date <= date2) {
          isThisMonth = index - 1;
        }
        // console.log(date);
        // console.log(date1);
        // console.log(date2);
        // console.log(date >= date1);
        // console.log(date <= date2);
        months.push(`${timeStartShow} - ${timeEndShow}`);
      }
      // console.log(months);
      // console.log(isThisMonth);


      var date = months[isThisMonth].split(" - ");
      var formatDateStart = date[0].split("/");
      let dateStart = formatDateStart[2] + "-" + formatDateStart[1] + "-" + formatDateStart[0];
      var formatDateEnd = date[1].split("/");
      let dateEnd = formatDateEnd[2] + "-" + formatDateEnd[1] + "-" + formatDateEnd[0];
      const listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${studentDetail.email}&dateStart=${dateStart}&dateEnd=${dateEnd}`);


      this.setState({
        modalTask: !this.state.modalTask,
        studentDetail: studentDetail,
        listStudentTask: listStudentTask,
        months: months,
        loading: false,
        isThisMonth: isThisMonth,
      });
    } else {
      this.setState({
        modalTask: !this.state.modalTask,
      })
    }
  }

  showTaskLevel(taskLevel) {
    if (taskLevel === 'DIFFICULT') {
      return (
        <Badge color="danger">Khó</Badge>
      )
    } else if (taskLevel === 'EASY') {
      return (
        <Badge color="primary">Dễ</Badge>
      )
    } else if (taskLevel === 'NORMAL') {
      return (
        <Badge color="warning">Trung bình</Badge>
      )
    }
  }

  showTaskState(taskStatus) {
    // console.log(taskStatus);
    if (taskStatus === 'NOTSTART') {
      return (
        <Badge color="secondary">Chưa bắt đầu</Badge>
      )
    } else if (taskStatus === 'PENDING') {
      return (
        <Badge color="warning">Chưa xong</Badge>
      )
    } else if (taskStatus === 'DONE') {
      return (
        <Badge color="success">Hoàn Thành</Badge>
      )
    }
  }

  handleSubmit = async () => {
    this.setState({
      loading: true
    })

    const { listDataEdited } = this.state;
    const result = await ApiServices.Put('/business/assignSupervisor', listDataEdited);

    if (result.status === 200) {
      Toastify.actionSuccess(" thành công!");
      const students = await ApiServices.Get('/business/getStudentsByBusiness');
      const supervisors = await ApiServices.Get('/business/getAllSupervisorABusiness');
      const supervisors_FirstBlank = await ApiServices.Get('/business/getAllSupervisorABusiness');

      const supervisors_FirstBlank_Obj = {
        email: '',
        name: ''
      }
      supervisors_FirstBlank.unshift(supervisors_FirstBlank_Obj);
      this.setState({
        students: students,
        supervisors: supervisors,
        supervisors_FirstBlank: supervisors_FirstBlank,
        loading: false
      });
    } else {
      Toastify.actionFail(" thất bại!");
      this.setState({
        loading: false
      })
    }
  }

  formatDate(inputDate, flag) {
    var date = inputDate.split('-');
    let formattedDate = date[2] + "/" + date[1] + "/" + date[0];
    if (flag === true) {
      return (
        <Badge color="primary">{formattedDate}</Badge>
      )
    } else if (flag === false) {
      return (
        <Badge color="danger">{formattedDate}</Badge>
      )
    }
  }

  render() {
    const { isThisMonth, months, studentDetail, students, supervisors, supervisors_FirstBlank, searchValue, columnToSort, sortDirection, loading, suggestedStudents, isSelect, colorBackSelect, colorTextSelect } = this.state;
    let filteredListStudents = orderBy(students, columnToSort, sortDirection);
    if (students !== null) {
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
                      <FormGroup row style={{ paddingLeft: '90%' }}>
                        <Button color="primary" outline onClick={() => this.toggleModal()}>Phân nhóm</Button>
                      </FormGroup>
                    }
                    <nav className="navbar navbar-light bg-light justify-content-between">
                      <form className="form-inline">
                        <input onChange={this.handleInputSearch} name="searchValue" className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                      </form>
                      {/* <div style={{ marginRight: "70px" }}>
                        <b>Sắp xếp theo: </b>
                        &nbsp;&nbsp;&nbsp;
                        <select>
                          <option value="olala">olala</option>
                          <option value="olala">olala 2</option>
                          <option value="olala">olala 3</option>
                        </select>
                      </div> */}
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
                          <th style={{ textAlign: "center" }}></th>
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
                                    student.supervisor === null ? (

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
                                  {/* <Button style={{ width: '100px', marginRight: '2px' }} color="primary" onClick={() => this.handleDirect(`/student-detail/${student.email}`)}><i className="fa cui-magnifying-glass"></i></Button> */}
                                  <Button color="primary" onClick={() => this.toggleModalDetail(student)}><i className="fa cui-magnifying-glass"></i></Button>
                                  &nbsp;&nbsp;
                                  {/* <Button style={{ width: '100px' }} color="success" onClick={() => this.handleDirect(`/details_task/${student.email}`)}><i className="fa cui-task"></i></Button> */}
                                  <Button color="success" onClick={() => this.toggleModalTask(student)}><i className="fa cui-task"></i></Button>
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
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
            {studentDetail !== null ?
              <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail}
                className={'modal-primary ' + this.props.className}>
                <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                <ModalBody>
                  <FormGroup row>
                    <Col md="4">
                      <h6>Ảnh đại diện</h6>
                    </Col>
                    <Col xs="12" md="8">
                      {studentDetail.avatarLink === null ?
                        <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" style={{ width: "100px", height: "100px" }} alt="usericon" /> :
                        <img src={studentDetail.avatarLink} className="img-avatar" style={{ width: "100px", height: "100px" }} />
                      }
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <h6>Họ và Tên</h6>
                    </Col>
                    <Col xs="12" md="8">
                      <label>{studentDetail.name}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <h6>Mã số sinh viên</h6>
                    </Col>
                    <Col xs="12" md="8">
                      <label>{studentDetail.code}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <h6>Chuyên ngành</h6>
                    </Col>
                    <Col xs="12" md="8">
                      <label>{studentDetail.specialized.name}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <h6>Giới thiệu bản thân</h6>
                    </Col>
                    <Col xs="12" md="8">
                      <label>{studentDetail.objective}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <h6>Bảng điểm</h6>
                    </Col>
                    <Col xs="12" md="8">
                      {
                        studentDetail.transcriptLink && studentDetail.transcriptLink ? (
                          <a href={studentDetail.transcriptLink} download>Tải về</a>
                        ) :
                          (<label>N/A</label>)
                      }
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <h6>Kỹ năng</h6>
                    </Col>
                    <Col xs="12" md="8">
                      {
                        studentDetail.skills && studentDetail.skills.map((skill, index) => {
                          return (
                            <div>
                              {
                                <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                              }
                            </div>
                          )
                        })
                      }
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="4">
                      <h6>GPA</h6>
                    </Col>
                    <Col xs="12" md="8">
                      <label>{studentDetail.gpa}</label>
                    </Col>
                  </FormGroup>
                </ModalBody>
                {/* <ModalFooter>
                </ModalFooter> */}
              </Modal> :
              <></>
            }
            {studentDetail !== null ?
              <Modal isOpen={this.state.modalTask} toggle={this.toggleModalTask}
                className={'modal-lg ' + this.props.className}>
                <ModalHeader style={{ backgroundColor: "#4DBD74", color: "white" }} toggle={this.toggleModalTask}>Nhiệm vụ của sinh viên</ModalHeader>
                <ModalBody>
                  <FormGroup row>
                    <Col md="3">
                      <h6>Người hướng dẫn</h6>
                    </Col>
                    <Col xs="12" md="9">
                      <Label>{studentDetail.supervisor === null ? <></> : (studentDetail.supervisor.name)}</Label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <h6>Sinh viên</h6>
                    </Col>
                    <Col xs="12" md="9">
                      <label>{studentDetail.name}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row style={{ paddingLeft: '38%' }}>
                    <Input onChange={e => { this.handleSelectMonth(e, studentDetail) }} type="select" name="months" style={{ width: '250px' }}>
                      {months && months.map((month, i) => {
                        return (
                          <option value={i} selected={i === isThisMonth}>{month}</option>
                        )
                      })}
                    </Input>
                  </FormGroup>
                  <div style={{ maxHeight: '492px', overflowY: 'auto' }}>
                    <Table responsive striped>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center" }}>STT</th>
                          <th style={{ textAlign: "center" }}>Nhiệm vụ</th>
                          <th style={{ textAlign: "center" }}>Người giao</th>
                          <th style={{ textAlign: "center" }}>Ưu tiên</th>
                          <th style={{ textAlign: "center" }}>Độ khó</th>
                          <th style={{ textAlign: "center" }}>Ngày tạo</th>
                          <th style={{ textAlign: "center" }}>Hạn cuối</th>
                          <th style={{ textAlign: "center" }}>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.listStudentTask && this.state.listStudentTask.map((task, index) => {
                            return (
                              <tr>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td style={{ textAlign: "center" }}>{task.title}</td>
                                <td style={{ textAlign: "center" }}>{task.supervisor.name}</td>
                                <td style={{ textAlign: "center" }}>{task.priority}</td>
                                <td style={{ textAlign: "center" }}>
                                  {
                                    this.showTaskLevel(task.level_task)
                                  }
                                </td>
                                <td style={{ textAlign: "center" }}>{this.formatDate(task.time_created, true)}</td>
                                <td style={{ textAlign: "center" }}>{this.formatDate(task.time_end, false)}</td>
                                <td style={{ textAlign: "center" }}>
                                  {
                                    this.showTaskState(task.status)
                                  }
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>

                  </div>
                </ModalBody>
                {/* <ModalFooter>
                </ModalFooter> */}
              </Modal> :
              <></>
            }
          </div>
        )
    );
  }
}

export default Official_List;
