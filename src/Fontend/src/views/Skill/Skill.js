import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';


class Skill extends Component {

    constructor(props) {
        super(props);
        this.state = {
            skills: null,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (id, status) => {
        const result = await ApiServices.Put(`/skill/status?id=${id}&status=${status}`);
        const skills = await ApiServices.Get('/skill');
        if (skills != null) {
            this.setState({
                skills,
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const skills = await ApiServices.Get('/skill');
        if (skills != null) {
            this.setState({
                skills,
            });
        }
    }

    render() {
        const { skills } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="15">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách kỹ năng
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.handleDirect('/skill/create')}>Tạo kỹ năng mới</Button>
                                <br />
                                <br />
                                <br />
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>STT</th>
                                            <th style={{ textAlign: "center" }}>Tên kỹ năng</th>
                                            <th style={{ textAlign: "center" }}>Ngành</th>
                                            <th style={{ textAlign: "center" }}>Trạng thái</th>
                                            <th style={{ textAlign: "center" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            skills && skills.map((skill, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                        <td style={{ textAlign: "center" }}>{skill.name}</td>
                                                        <td style={{ textAlign: "center" }}>{skill.specialized.name}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {skill.status.toString() == 'true' ? (
                                                                <Badge color="success">TRUE</Badge>
                                                            ) : (
                                                                    <Badge color="danger">FALSE</Badge>
                                                                )}
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {skill.status.toString() == 'true' ? (
                                                                <Button style={{ marginRight: "1.5px" }} color="warning" onClick={() => this.handleUpdateStatus(skill.id, false)} type="submit">Disabled</Button>
                                                            ) : (
                                                                    <Button style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleUpdateStatus(skill.id, true)} type="submit">Active</Button>
                                                                )}
                                                            <Button style={{ marginRight: "1.5px" }} type="submit" color="success" onClick={() => this.handleDirect(`/skill/update/${skill.id}`)}>Update</Button>

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <ToastContainer />
                                {/* <Pagination>
                                        <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                    </Pagination> */}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Skill;