import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table, Input, CardFooter } from 'reactstrap';
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
  marginLeft: '35%'
}

const tdTableTask = {
  textAlign: 'center',
  padding: '15px'
}

const tdMissionTableTask = {
  textAlign: 'center',
  paddingLeft: '75px',
  paddingRight: '75px'
}


class Details_Task extends Component {

  handleDirect = (uri) => {
    this.props.history.push(uri);
  }

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
                        <th style={{ textAlign: "center" }}>Sinh viên:&nbsp;</th>
                        <td>
                          <Input type="select" style={{ height: "40px", fontWeight: "bold" }}>
                            <option>
                              Nguyễn Văn A
                            </option>
                            <option>
                              Nguyễn Văn A
                            </option>
                            <option>
                              Nguyễn Văn A
                            </option>
                          </Input>
                        </td>
                      </tr>
                    </div>
                    <div style={divInforStudent}>
                      <tr>
                        <th style={{ textAlign: "center" }}>MSSV:&nbsp;</th>
                        <td>SE62519</td>
                      </tr>
                    </div>
                    <div style={divInforStudent}>
                      <tr>
                        <th style={{ textAlign: "center" }}>Chuyên ngành:&nbsp;</th>
                        <td>JS</td>
                      </tr>
                    </div>
                    <div style={divInforStudent}>
                      <tr>
                        <th style={{ textAlign: "center" }}>Người phụ trách:&nbsp;</th>
                        <td>Taskman1</td>
                      </tr>
                    </div>
                  </tbody>
                </table>
                <div style={selectWeek}>
                  <Input type="select" style={{ width: "350px" }}>
                    <option>
                      1/1/1997-2/1/1997
                    </option>
                    <option>
                      1/1/1997-2/1/1997
                    </option>
                    <option>
                      1/1/1997-2/1/1997
                    </option>
                  </Input>
                </div>
                <br /><br />
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>STT</th>
                      <th style={{ textAlign: "center" }}>Nhiệm vụ</th>
                      <th style={{ textAlign: "center" }}>Độ ưu tiên</th>
                      <th style={{ textAlign: "center" }}>Hạn cuối</th>
                      <th style={{ textAlign: "center" }}>Mức độ</th>
                      <th style={{ textAlign: "center" }}>Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" }}>1</td>
                      <td style={{ textAlign: "center" }}>Fix bug</td>
                      <td style={{ textAlign: "center" }}>Cao</td>
                      <td style={{ textAlign: "center" }}>01/01/0001</td>
                      <td style={{ textAlign: "center" }}>Khó</td>
                      <td style={{ textAlign: "center" }}>Hoàn thành</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col style={{paddingLeft:"45%"}}>
            <Button color="primary"  onClick={() => this.handleDirect('/official_list')}>Trở về</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Details_Task;
