import React, { Component } from 'react';
import {
  Input, Button, Badge, Card, CardBody, CardHeader, Col, Form, CardFooter,
  FormGroup, Pagination, Row, Table, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle
} from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
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

const table = {
  textAlign: "left",
  height: "40px",
  border: "2px solid #20a8d8",
  width: "500px",
  margin: "50px auto",
}

class Job_Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayJob: ['Kỹ thuật phần mềm', 'Kinh tế', 'Đồ hoạ', 'Ngôn ngữ Anh', 'Ngôn ngữ Nhật'],
      arrayJobPost: [],
      arraySkill: [],
      arrayQuantity: [],
      tmpArraySkill: [],
      tmpArrayQuantity: [],
      selectedSpecialized: '',


      job_posts: null,
      description: '',
      views: 0,
      contact: '',
      interview_process: '',
      interest: '',
      job_post_skills: [],
      updatedId: ''
    }
    // this.chooseNewSpecialized = this.chooseNewSpecialized.bind(this);
    // this.setNewSpecialized = this.setNewSpecialized.bind(this);
    // this.addRow = this.addRow.bind(this);
  }

  // addRow = (sIndex) => {
  //   let tmpArraySkill = this.state.arraySkill[sIndex].push('');
  //   let tmpArrayQuantity = this.state.arrayQuantity[sIndex].push('');
  //   this.setState({
  //     tmpArraySkill: [...this.state.tmpArraySkill,''],
  //     tmpArrayQuantity: [...this.state.tmpArrayQuantity,''],
  //     arraySkill: this.state.arraySkill,
  //     arrayQuantity: this.state.arrayQuantity,
  //   })
  // }


  async componentDidMount() {
    const updatedId = window.location.href.split("/").pop();
    const data = await ApiServices.Get(`/business/getJobPost?id=${updatedId}`);
    if (data != null) {
      this.setState({
        updatedId,
        job_posts: data.job_post,
        description: data.job_post.description,
        views: data.job_post.views,
        contact: data.job_post.contact,
        interview_process: data.job_post.interview_process,
        interest: data.job_post.interest,
        job_post_skills: data.job_post.job_post_skills
      });
    }

    console.log(this.state);
  }

  // chooseNewSpecialized(event) {
  //   this.setState({
  //     selectedSpecialized: event.target.value,
  //   })
  // }

  // setNewSpecialized = () => {
  //   this.setState({
  //     arrayJobPost: [...this.state.arrayJobPost, this.state.selectedSpecialized],
  //     arraySkill: [...this.state.arraySkill, []],
  //     arrayQuantity: [...this.state.arrayQuantity, []]
  //   })
  // }

  // deleteSpecialized = (indexSelected) => {
  //   for (let index = 0; index < this.state.arrayJobPost.length; index++) {
  //     if (index === indexSelected) {
  //       this.state.arrayJobPost.splice(index, 1);
  //       this.setState({
  //         arrayJobPost: this.state.arrayJobPost,
  //       })
  //       break;
  //     }
  //   }
  // }

  // confirmDelete = (indexSelected) => {
  //   confirmAlert({
  //     title: 'Xác nhận lại',
  //     message: 'Bạn có chắc muốn xoá thông tin tuyển dụng ngành ' + this.state.arrayJobPost[indexSelected] + '?',
  //     buttons: [
  //       {
  //         label: 'Có',
  //         onClick: () => this.deleteSpecialized(indexSelected)
  //       },
  //       {
  //         label: 'Không',
  //         onClick: () => alert('Không')
  //       }
  //     ]
  //   });
  // }

  // confirmAdd = () => {
  //   confirmAlert({
  //     title: 'Xác nhận lại',
  //     message: 'Bạn có chắc muốn thêm ngành ' + this.state.selectedSpecialized + ' vào thông tin tuyển dụng?',
  //     buttons: [
  //       {
  //         label: 'Có',
  //         onClick: () => this.setNewSpecialized()
  //       },
  //       {
  //         label: 'Không',
  //         onClick: () => alert('Không')
  //       }
  //     ]
  //   });
  // }

  handleDirect = (uri) => {
    this.props.history.push(uri);
  }

  render() {
    const { arrayJobPost, arraySkill, arrayQuantity } = this.state;
    const { description, views,
      contact, interview_process, interest, job_post_skills, updatedId } = this.state;

    let tmpSkills = [];
    let tmpNumber = [];

    for (let i = 0; i < job_post_skills.length; i++) {
      let flag = true;
      let check = job_post_skills[i].skill.specialized.name;
      if (arrayJobPost.length != 0) {
        for (let j = 0; j < job_post_skills.length; j++) {
          if (arrayJobPost.indexOf(check, 0) == -1) {
            arrayJobPost.push(check);
            if (tmpSkills.length != 0) {
              arraySkill.push(tmpSkills);
              arrayQuantity.push(tmpNumber);
              tmpSkills = [];
              tmpNumber = [];
            }
            if (tmpSkills.indexOf(job_post_skills[i].skill.name, 0) == -1) {
              tmpSkills.push(job_post_skills[i].skill.name);
              tmpNumber.push(job_post_skills[i].number);

            }
          } else {
            if (i == job_post_skills.length - 1) {
              if (tmpSkills.length != 0) {
                if (tmpSkills.indexOf(job_post_skills[i].skill.name, 0) == -1) {
                  tmpSkills.push(job_post_skills[i].skill.name);
                  tmpNumber.push(job_post_skills[i].number);
                }
                arraySkill.push(tmpSkills);
                arrayQuantity.push(tmpNumber);
                tmpSkills = [];
                tmpNumber = [];
              }
            } else {
              if (tmpSkills.indexOf(job_post_skills[i].skill.name, 0) == -1) {
                tmpSkills.push(job_post_skills[i].skill.name);
                tmpNumber.push(job_post_skills[i].number);
                break;
              }
            }
          }
        }
      } else {
        arrayJobPost.push(check);
        tmpSkills.push(job_post_skills[i].skill.name);
        tmpNumber.push(job_post_skills[i].number);
      }

      console.log('jobpost', arrayJobPost);
      console.log('skill', arraySkill);
      console.log('number', arrayQuantity);
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader style={{ fontWeight: "bold" }}>
                <i className="fa fa-align-justify"></i>Thông tin tuyển dụng
                <Button style={{ marginLeft: "950px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/job_post/update_job/${updatedId}`)}>Chỉnh sửa</Button>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="2">
                      <h6>Mô tả công việc</h6>
                    </Col>
                    <Col xs="12" md="10">
                      <label type="text" id="description" name="description" placeholder="Mô tả công việc">{description}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <h6>Quy trình tuyển</h6>
                    </Col>
                    <Col xs="12" md="10">
                      <label type="text" id="interview_process" name="interview_process" placeholder="Quy trình tuyển">{interview_process}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <h6>Phúc lợi:</h6>
                    </Col>
                    <Col xs="12" md="10">
                      <label type="text" id="interest" name="interest" placeholder="Phúc lợi">{interest}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <h6>Thông tin liên hệ</h6>
                    </Col>
                    <Col xs="12" md="10">
                      <label type="text" id="contact" name="contact" placeholder="Thông tin liên hệ">{contact}</label>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="2">
                      <h6>Lượt xem</h6>
                    </Col>
                    <Col xs="12" md="10">
                      <label type="text" id="views" name="views" placeholder="Lượt xem">{views}</label>
                    </Col>
                  </FormGroup>
                </Form>

                {/* <br/><br/> */}

                {/* <div className="position-relative row form-group" style={{ paddingLeft: '400px' }}>
                  <Input type="select" name="specialized" id="specialized" style={{ width: '400px' }} onChange={event => this.chooseNewSpecialized(event)}>
                    <option value="0">Ngành tuyển dụng</option>
                    {arrayJob.map((specialized, index) =>
                      <option value={specialized}>{specialized}</option>
                    )}
                  </Input>
                  <Button
                    style={{ fontWeight: "bold", borderColor: '#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
                    onClick={this.confirmAdd}
                  >
                    Thêm
                  </Button>
                </div> */}
                <Row>
                  {arrayJobPost.map((job, index1) =>
                    <>
                      <table style={table}>
                        <thead
                          style={{ backgroundColor: '#20a8d8', color: 'white', textAlign: "center", fontWeight: "bold", height: "40px", fontSize: "16px" }}
                          specialized={job}
                        >
                          {job}
                        </thead>
                        <tbody style={{ textAlign: "center", fontSize: "14px" }}>
                          {
                            arraySkill[index1].map((skill, index2) =>
                              <>
                                <tr>
                                  <td>{index2 + 1}. {skill !== '' ? skill : <input style={{ width: '40px' }}></input>}:
                                    &nbsp;{arrayQuantity[index1][index2] !== '' ? arrayQuantity[index1][index2] : <input></input>}
                                  </td>
                                </tr>
                              </>
                            )
                          }
                          {/* <tr style={{ textAlign: "center", height: "40px" }}>
                            <Button style={{ fontWeight: "bold" }} color="danger"
                              onClick={() => this.confirmDelete(index1)}
                            >
                              Xoá
                            </Button>
                            <Button
                              style={{ fontWeight: "bold", borderColor: '#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
                              onClick={() => this.handleDirect(`/Job_Post/Update_Job`)}
                            >
                              Sửa
                            </Button>
                          </tr> */}
                          <tr></tr>
                        </tbody>
                      </table>
                    </>
                  )}
                </Row>
                <Pagination>
                  {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                </Pagination>
              </CardBody>
              <CardFooter className="p-4">
                <Row>
                  <Col xs="3" sm="3">
                    <Button id="submitBusinesses" onClick={() => this.handleDirect("/job_post_list_hr")} type="submit" color="success" block>Trở về</Button>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        {/* <div style={{ paddingLeft: "49%" }}><Button style={{ fontWeight: "bold" }} color="primary" onClick={{}}>Lưu</Button></div> */}
      </div>
    );
  }
}

export default Job_Post;
