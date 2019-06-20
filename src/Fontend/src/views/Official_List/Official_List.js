import React, {Component} from 'react';
import {Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table} from 'reactstrap';
import {Button} from 'reactstrap';
import ApiServices from '../../service/api-service';
import {ToastContainer} from 'react-toastify';
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
const btnMission = {
  color: 'white',
  backgroundColor: '#00BFFF',
  borderRadius: '25px',
};
const btnSave = {
  color: 'white',
  backgroundColor: '#00BFFF',
  borderRadius: '5px',
  marginRight: '200px',
  width:'80px',
  height:'40px'
};

const rowSave = {
  paddingLeft: '50%'
}

class Official_List extends Component {


  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> <b>Danh sách sinh viên thực tập tại doanh nghiệp</b>
              </CardHeader>
              <CardBody>
                <br/>
                <br/>
                <br/>
                <nav className="navbar navbar-light bg-light justify-content-between">
                  <form className="form-inline">
                    <input name="searchValue" className="form-control mr-sm-2" type="text" placeholder="Search"
                           aria-label="Search"/>
                  </form>
                  <div style={{marginRight: "70px"}}>
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
                    <th style={{textAlign: "center"}}>STT</th>
                    <th style={{textAlign: "center"}}>MSSV</th>
                    <th style={{textAlign: "center"}}>Họ và Tên</th>
                    <th style={{textAlign: "center"}}>Chuyên ngành</th>
                    {/* <th style={{ textAlign: "center" }}><div onClick={() => this.handleSort('Chuyên ngành')}>Chuyên ngành</div></th> */}
                    <th style={{textAlign: "center"}}>GPA</th>
                    <th style={{textAlign: "center"}}>Bảng điểm</th>
                    <th style={{textAlign: "center"}}>Supervisor</th>
                    <th style={{textAlign: "center"}}></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td style={{textAlign: "center"}}>
                      1
                    </td>
                    <td style={{textAlign: "center"}}>
                      SE62519
                    </td>
                    <td style={{textAlign: "center"}}>
                      Nguyễn Văn A
                    </td>
                    <td style={{textAlign: "center"}}>
                      JS
                    </td>
                    <td style={{textAlign: "center"}}>
                      9.8
                    </td>
                    <td style={{textAlign: "center"}}>
                      <a href={"#"}>Tải</a>
                    </td>
                    <td style={{textAlign: "center"}}>
                      <select>
                        <option>
                          supervisor 1
                        </option>
                        <option>
                          supervisor 2
                        </option>
                        <option>
                          supervisor 3
                        </option>
                      </select>
                    </td>
                    <td style={{textAlign: "center"}}>
                      <input type={"button"} name={"btnMission"} style={btnMission} value={"Nhiệm vụ"}/>
                    </td>
                  </tr>
                  </tbody>
                </Table>
                <ToastContainer/>

              </CardBody>
            </Card>
          </Col>
        </Row>
        <div style={rowSave}><input type={"button"} name={"btnSave"} style={btnSave} value={"Lưu"}/></div>
      </div>
    );
  }
}

export default Official_List;
