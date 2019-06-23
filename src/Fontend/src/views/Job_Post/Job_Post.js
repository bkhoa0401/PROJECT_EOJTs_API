import React, { Component } from 'react';
import { Input, Button, Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
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
      arrayJobPost: ['Kỹ thuật phần mềm', 'Kinh tế'],
      arraySkill: [
        ['Java', 'C#'],
        ['QTKD', 'KDQT', 'QTNS'],
      ],
      arrayQuantity: [
        ['30', '20'],
        ['10', '10', '1'],
      ],
      tmpArraySkill:[],
      tmpArrayQuantity:[],
      selectedSpecialized:''
    }
    this.chooseNewSpecialized = this.chooseNewSpecialized.bind(this);
    this.setNewSpecialized = this.setNewSpecialized.bind(this);
    this.addRow = this.addRow.bind(this);
  }

  addRow = (sIndex) => {
    let tmpArraySkill = this.state.arraySkill[sIndex].push('');
    let tmpArrayQuantity = this.state.arrayQuantity[sIndex].push('');
    this.setState({
      tmpArraySkill: [...this.state.tmpArraySkill,''],
      tmpArrayQuantity: [...this.state.tmpArrayQuantity,''],
      arraySkill: this.state.arraySkill,
      arrayQuantity: this.state.arrayQuantity,
    })
  }

  chooseNewSpecialized(event) {
    this.setState({
      selectedSpecialized: event.target.value,
    })
  }

  setNewSpecialized(){
    this.setState({
      arrayJobPost: [...this.state.arrayJobPost, this.state.selectedSpecialized],
      arraySkill: [...this.state.arraySkill, []],
      arrayQuantity: [...this.state.arrayQuantity, []]
    })
  }

  confirm = () => {
    confirmAlert({
      title: 'Xác nhận lại',
      message: 'Bạn có chắc muốn xoá thông tin tuyển dụng ngành này?',
      buttons: [
        {
          label: 'Có',
          onClick: () => alert('Có')
        },
        {
          label: 'Không',
          onClick: () => alert('Không')
        }
      ]
    });
  }

  render() {
    const { arrayJob, arrayJobPost, arraySkill, arrayQuantity } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader style={{ fontWeight: "bold" }}>
                <i className="fa fa-align-justify"></i>Thông tin tuyển dụng
              </CardHeader>
              <CardBody>
                <div className="position-relative row form-group" style={{ paddingLeft:'400px'}}>
                  <Input type="select" name="specialized" id="specialized" style={{width:'400px'}} onChange={event => this.chooseNewSpecialized(event)}>
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
                          {arraySkill[index1].map((skill, index2) =>
                            <>
                              <tr>
                                <td>{index2 + 1}. {skill !== '' ? skill : <input style={{width: '40px'}}></input>}: 
                                    &nbsp;{arrayQuantity[index1][index2] !== '' ? arrayQuantity[index1][index2] : <input></input> }
                                </td>
                              </tr>
                            </>
                          )
                          }
                          <tr style={{ textAlign: "center", height: "40px" }}>
                            <Button style={{ fontWeight: "bold" }} color="danger" 
                              onClick={this.confirm}
                            >
                              Xoá
                            </Button>
                            <Button
                              style={{ fontWeight: "bold", borderColor: '#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
                              onClick={() => this.addRow(index1)}
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
