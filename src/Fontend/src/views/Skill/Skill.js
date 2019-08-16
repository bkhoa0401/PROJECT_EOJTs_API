import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table, Input, Pagination } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';


class Skill extends Component {

    constructor(props) {
        super(props);
        this.state = {
            skills: null,
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirm = (skill, status) => {

        var messageStatus = '';
        if (status) {
            messageStatus = 'kích hoạt';
        } else {
            messageStatus = 'vô hiệu';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn '${messageStatus}' kỹ năng '${skill.name}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(skill.id, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleUpdateStatus = async (id, status) => {
        const result = await ApiServices.Put(`/skill/status?id=${id}&status=${status}`);
        const { currentPage, rowsPerPage } = this.state;
        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
            const skills = await ApiServices.Get(`/skill?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
            if (skills !== null) {
                await this.setState({
                    skills: skills.listData,
                    currentPage,
                    pageNumber: skills.pageNumber
                })
                console.log(this.state.skils);
            }
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const skills = await ApiServices.Get(`/skill?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (skills !== null) {
            this.setState({
                skills: skills.listData,
                pageNumber: skills.pageNumber,
                loading: false
            });
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const skills = await ApiServices.Get(`/skill?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (skills !== null) {
            this.setState({
                skills: skills.listData,
                currentPage,
                pageNumber: skills.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const skills = await ApiServices.Get(`/skill?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (skills !== null) {
            this.setState({
                skills: skills.listData,
                currentPage,
                pageNumber: skills.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const skills = await ApiServices.Get(`/skill?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (skills !== null) {
            this.setState({
                skills: skills.listData,
                currentPage,
                pageNumber: skills.pageNumber
            })
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const skills = await ApiServices.Get(`/skill?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (skills !== null) {
            this.setState({
                skills: skills.listData,
                currentPage: 0,
                pageNumber: skills.pageNumber
            })
        }
    }

    render() {
        const { skills, loading } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;

        if (skills != null) {
            console.log(skills);
        }

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
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
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Tên kỹ năng</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Ngành</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}></th>
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
                                                                    {skill.status.toString() === 'true' ? (
                                                                        <Badge color="success">KÍCH HOẠT</Badge>
                                                                    ) : (
                                                                            <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                        )}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {skill.status.toString() === 'true' ? (
                                                                        <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(skill, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                    ) : (
                                                                            <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(skill, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                        )}
                                                                    <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/skill/update/${skill.id}`)}><i className="fa cui-note"></i></Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        <ToastContainer />
                                        <Pagination style={{ marginTop: "3%" }}>
                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                            <h6 style={{ marginLeft: "5%", width: "15%", marginTop: "7px" }}>Số dòng trên trang: </h6>
                                            <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{ width: "7%" }}>
                                                <option value={10} selected={rowsPerPage === 10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </Input>
                                        </Pagination>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Skill;
