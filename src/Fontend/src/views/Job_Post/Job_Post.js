import React, { Component } from 'react';
import { Input, Button, Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
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
      arrayJobPost: ['Kỹ thuật phần mềm', 'Kinh tế'],
      arraySkillQuantity: [
        ['Java: 30', 'C#: 20'],
        ['QTKD: 10', 'KDQT: 10', 'QHQT: 1'],
      ],
      tmpArray:[],
      selectedSpecialized:''
    }
    this.chooseNewSpecialized = this.chooseNewSpecialized.bind(this);
    this.setNewSpecialized = this.setNewSpecialized.bind(this);
  }

  addRow = (sIndex) => {
    // let tmpArray = this.state.arraySkillQuantity[sIndex].push('');
    // this.setState({
    //   tmpArray: [...this.state.tmpArray,''],
    //   arraySkillQuantity: this.state.arraySkillQuantity,
    // })
  }

  chooseNewSpecialized(event) {
    this.setState({
      selectedSpecialized: event.target.value,
    })
  }

  setNewSpecialized(){
    this.setState({
      arrayJobPost: [...this.state.arrayJobPost, this.state.selectedSpecialized],
      arraySkillQuantity: [...this.state.arraySkillQuantity, []],
    })
  }

  render() {
    const { arrayJob, arrayJobPost, arraySkillQuantity, isOpened } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader style={{ fontWeight: "bold" }}>
                <i className="fa fa-align-justify"></i>Thông tin tuyển dụng
              </CardHeader>
              <CardBody>
                <div style={{ textAlign: "center" }}>
                  <Input type="select" name="specialized" id="specialized" style={{width:'500px', alignSelf:'center'}} onChange={event => this.chooseNewSpecialized(event)}>
                    <option value="0">Ngành tuyển dụng</option>
                    {arrayJob.map((specialized, index) =>
                      <option value={specialized}>{specialized}</option>
                    )}
                  </Input>
                  <Button
                    style={{ fontWeight: "bold", borderColor: '#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
                    onClick={this.setNewSpecialized}
                  >
                    Thêm
                  </Button>
                  </div>
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
                          {arraySkillQuantity[index1].map((skill, index2) =>
                            <>
                              <tr>
                                <td>{index2}. {skill !== '' ? skill : <input></input>}</td>
                              </tr>
                            </>
                          )
                          }
                          <tr style={{ textAlign: "center", height: "40px" }}>
                            <Button style={{ fontWeight: "bold" }} color="danger">Xoá</Button>
                            <Button
                              style={{ fontWeight: "bold", borderColor: '#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
                              onClick={this.addRow(index1)}
                            >
                              Thêm
                            </Button>
                          </tr>
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

export default Job_Post;
