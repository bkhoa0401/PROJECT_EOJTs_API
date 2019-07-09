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
import Toastify from '../../views/Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';

class Hr_Task extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
        }
    }


    async componentDidMount() {
        const tasks = await ApiServices.Get('/supervisor/tasks');

        if (tasks != null) {
            this.setState({
                tasks: tasks
            });
        }
        console.log(tasks);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleDelete = async (deletedId) => {
        const result = await ApiServices.Delete(`/supervisor/task?id=${deletedId}`);

        if (result.status == 200) {
            const tasks = await ApiServices.Get('/supervisor/tasks');
            if (tasks != null) {
                this.setState({
                    tasks: tasks
                });
            }
            Toastify.actionSuccess("Xóa nhiệm vụ thành công!");
        } else {
            Toastify.actionFail("Xóa nhiệm vụ thất bại!");
        }

    }

    render() {
        const { tasks } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách nhiệm vụ
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.handleDirect('/hr-task/create')}>Tạo nhiệm vụ mới</Button>
                                <br />
                                <br />
                                <br />
                                <ToastContainer />
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>STT</th>
                                            <th style={{ textAlign: "center" }}>Nhiệm vụ</th>
                                            {/* <th style={{ textAlign: "center" }}>Độ ưu tiên</th> */}
                                            {/* <th style={{ textAlign: "center" }}>Hạn cuối</th>
                                            <th style={{ textAlign: "center" }}>Mức độ</th> */}
                                            <th style={{ textAlign: "center" }}>Người giao</th>
                                            <th style={{ textAlign: "center" }}>Sinh viên</th>
                                            <th style={{ textAlign: "center" }}>Trạng thái</th>
                                            <th style={{ textAlign: "center" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            tasks && tasks.map((task, index) => {
                                                return (
                                                    <tr>
                                                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                        <td style={{ textAlign: "center" }}>{task.title}</td>
                                                        {/* <td style={{ textAlign: "center" }}>{task.priority}</td> */}
                                                        {/* <td style={{ textAlign: "center" }}>{task.time_end}</td>
                                                        <td style={{ textAlign: "center" }}>{task.level_task}</td> */}
                                                        <td style={{ textAlign: "center" }}>{task.supervisor.name}</td>
                                                        <td style={{ textAlign: "center" }}>{task.ojt_enrollment.student.name}</td>
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
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/hr-task/details/${task.id}`)}>Chi tiết</Button>
                                                            <Button style={{ marginRight: "1.5px" }} type="submit" color="danger" onClick={() => this.handleDelete(`${task.id}`)}>Xóa</Button>
                                                        </td>
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
                            {/* <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/hr-student-list")} type="submit" color="primary" block>Trở về</Button>
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

export default Hr_Task;
