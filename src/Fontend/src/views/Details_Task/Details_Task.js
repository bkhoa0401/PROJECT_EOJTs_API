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
const divInforStudent = {
  paddingLeft: '30px',
  marginBottom: '20px'
};
const btnBack = {
  color: 'white',
  backgroundColor: '#00BFFF',
  borderRadius: '5px',
  marginRight: '50%',
  width: '80px',
  height: '40px'
};

const rowBack = {
  paddingLeft: '47%'
}

const selectWeek = {
  marginLeft: '45%'
}

const tdTableTask = {
  textAlign: 'center',
  padding: '15px'
}

const tdMissionTableTask = {
  textAlign: 'center',
  paddingLeft: '75px',
  paddingRight:'75px'
}


class Details_Task extends Component {


  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> <b>Chi tiết nhiệm vụ được giao</b>
              </CardHeader>
              <CardBody>

                <table>
                  <tbody>
                  <div style={divInforStudent}>
                    <tr>
                      <th style={{textAlign: "center"}}>Sinh viên:  </th>
                      <td>Nguyễn Văn A</td>
                    </tr>
                  </div>
                  <div style={divInforStudent}>
                    <tr>
                      <th style={{textAlign: "center"}}>MSSV: </th>
                      <td> SE62519</td>
                    </tr>
                  </div>
                  <div style={divInforStudent}>
                    <tr>
                      <th style={{textAlign: "center"}}>Người phụ trách: </th>
                      <td> Taskman1</td>
                    </tr>
                  </div>
                  <div style={divInforStudent}>
                    <tr>
                      <th style={{textAlign: "center"}}>Chuyên ngành: </th>
                      <td> JS</td>
                    </tr>
                  </div>
                  </tbody>
                </table>
                <div style={selectWeek}>
                  <select>
                    <option>
                      1/1/1997-2/1/1997
                    </option>
                    <option>
                      1/1/1997-2/1/1997
                    </option>
                    <option>
                      1/1/1997-2/1/1997
                    </option>
                  </select>
                </div>
                <br/><br/>
                <table border={'1px'} align={'center'}>
                  <tr>
                    <th style={{textAlign: "center"}}>STT</th>
                    <th style={{textAlign: "center"}}>Nhiệm Vụ</th>
                    <th style={{textAlign: "center"}}>Mức độ</th>
                    <th style={{textAlign: "center"}}>Kết quả</th>
                  </tr>
                  <tr>
                    <td style={tdTableTask}>1</td>
                    <td style={tdMissionTableTask}>Đánh liên minh</td>
                    <td style={tdTableTask}>Khó</td>
                    <td style={tdTableTask}>Hoàn thành</td>
                  </tr>
                  <tr>
                    <td style={tdTableTask}>2</td>
                    <td style={tdMissionTableTask}>Chơi gái</td>
                    <td style={tdTableTask}>Khó</td>
                    <td style={tdTableTask}>Hoàn thành</td>
                  </tr>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div style={rowBack}><input type={"button"} name={"btnBack"} style={btnBack} value={"Trở lại"}/></div>
      </div>
    );
  }
}

export default Details_Task;
