import React, { Component } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Pagination,
  Table
} from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import firebase from 'firebase/app';
import Toastify from '../../views/Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import 'firebase/storage';


const storage = firebase.storage();

class Details_Task extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listStudentTask: [],
    }
  }


  async componentDidMount() {
    const email = window.location.href.split("/").pop();
    const listStudentTask = await ApiServices.Get(`/supervisor/taskByStudentEmail?emailStudent=${email}`);

    if (listStudentTask != null) {
      this.setState({
        listStudentTask: listStudentTask
      });
    }
  }

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
                <i className="fa fa-align-justify"></i> Danh sách nhiệm vụ
              </CardHeader>
              <CardBody>
                <ToastContainer />
                <br />
                <div style={{ marginLeft: "42%" }}>
                  <strong style={{ fontSize: "20px" }}>Danh sách nhiệm vụ</strong>
                </div>
                <br />
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>STT</th>
                      <th style={{ textAlign: "center" }}>Nhiệm vụ</th>
                      <th style={{ textAlign: "center" }}>Trạng thái</th>
                      <th style={{ textAlign: "center" }}>Giao bởi</th>
                      <th style={{ textAlign: "center" }}>Ngày tạo</th>
                      <th style={{ textAlign: "center" }}>Hạn cuối</th>
                      <th style={{ textAlign: "center" }}>Mức độ</th>
                      <th style={{ textAlign: "center" }}>Độ ưu tiên</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.listStudentTask && this.state.listStudentTask.map((task, index) => {
                        return (
                          <tr>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td style={{ textAlign: "center" }}>{task.title}</td>
                            <td style={{ textAlign: "center" }}>
                              {
                                task.state.toString() === 'true' ?
                                  (
                                    <Badge color="success">Hoàn Thành</Badge>
                                  ) :
                                  (
                                    <Badge color="danger">Chưa hoàn thành</Badge>
                                  )
                              }
                            </td>
                            <td style={{ textAlign: "center" }}>{task.supervisor.name}</td>
                            <td style={{ textAlign: "center" }}>{task.time_created}</td>
                            <td style={{ textAlign: "center" }}>{task.time_end}</td>
                            <td style={{ textAlign: "center" }}>{task.level_task}</td>
                            <td style={{ textAlign: "center" }}>{task.priority}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
                <Pagination>
                  {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                </Pagination>
              </CardBody>
              <CardFooter className="p-4">
                <Row>
                  <Col xs="3" sm="3">
                    <Button id="submitBusinesses" onClick={() => this.handleDirect("/official_list")} type="submit" color="primary" block>Trở về</Button>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Details_Task;
