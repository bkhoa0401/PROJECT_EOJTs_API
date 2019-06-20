import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
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
      arrayJob: ['Kỹ thuật phần mềm', 'Kinh tế', 'Đồ hoạ', 'Ngôn ngữ']
    };
  }

  handleDirect = (uri) => {
    this.props.history.push(uri);
  }

  render() {
    const { arrayJob } = this.state;
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
                  <Button 
                    style={{ fontWeight: "bold", borderWidth: 0 }} color="primary"
                    onClick={() => this.handleDirect(`Job_Post/Add_Job/`)}
                  >
                    Thêm ngành tuyển dụng
                  </Button>
                  </div>
                <Row>
                    {arrayJob.map((job, index) =>
                    <>
                      <table style={table}>
                        <thead 
                          style={{ backgroundColor: '#20a8d8', color: 'white', textAlign: "center", fontWeight:"bold", height:"40px", fontSize:"16px" }}
                          specialized={job}
                        >
                          {job}
                        </thead>
                        <tbody style={{textAlign: "center", fontSize:"14px"}}>
                          <tr>Java: 30</tr>
                          <tr style={{ textAlign: "center", height:"40px" }}>
                            <Button style={{ fontWeight: "bold"}} color="danger">Xoá</Button>
                            <Button 
                            style={{ fontWeight: "bold", borderColor:'#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
                            onClick={() => this.handleDirect(`Job_Post/Update_Job/`)}
                            >
                              Sửa
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
