import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, Input, CardHeader, Col, Form, FormGroup, Label, Modal, ModalBody, ModalHeader, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import PaginationComponent from '../Paginations/pagination';
import Moment from 'react-moment';

class Log extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            searchValue: '',
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            businessPagination: null,
            rowsPerPage: 10,
            modalDetail: false,
            log: null,
            role: '',

            searchingList: [],
            isSearching: false,
            numOfLogs: 0,
        };
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const logs = await ApiServices.Get(`/admin/histories?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        // const numOfLogs = await ApiServices.Get(`/business/searchListBusiness?valueSearch=${""}`);
        if (logs !== null) {
            this.setState({
                logs: logs.listData,
                pageNumber: logs.pageNumber,
                loading: false,
                // numOfLogs: numOfLogs.length,
            });
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const logs = await ApiServices.Get(`/admin/histories?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (logs !== null) {
            this.setState({
                logs: logs.listData,
                currentPage,
                pageNumber: logs.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const logs = await ApiServices.Get(`/admin/histories?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (logs !== null) {
            this.setState({
                logs: logs.listData,
                currentPage,
                pageNumber: logs.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const logs = await ApiServices.Get(`/admin/histories?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (logs !== null) {
            this.setState({
                logs: logs.listData,
                currentPage,
                pageNumber: logs.pageNumber
            })
        }
    }

    toggleModalDetail = async (logId) => {
        let log = null;
        if (this.state.modalDetail === false) {
            log = await ApiServices.Get(`/admin/historiesId?id=${logId}`);
            this.setState({
                log: log,
                modalDetail: !this.state.modalDetail,
            });
        } else {
            this.setState({
                modalDetail: !this.state.modalDetail,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const logs = await ApiServices.Get(`/admin/histories?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (logs !== null) {
            this.setState({
                logs: logs.listData,
                currentPage: 0,
                pageNumber: logs.pageNumber
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleInputSearch = async (event) => {
        const { name, value } = event.target;
        if (value === "" || !value.trim()) {
            await this.setState({
                [name]: value.substr(0, 20),
                isSearching: false,
            })
        } else {
            const logs = await ApiServices.Get(`/business/searchListBusiness?valueSearch=${value.substr(0, 20)}`);
            if (logs !== null) {
                this.setState({
                    [name]: value.substr(0, 20),
                    searchingList: logs,
                    isSearching: true,
                })
            }
        }
    }

    render() {
        const { logs, log, searchValue, loading } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;
        const { numOfLogs, isSearching, searchingList } = this.state;
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Lịch sử log của hệ thống
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input onChange={this.handleInputSearch} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                            </nav>
                                            <Table responsive striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: "center" }}>STT</th>
                                                        <th style={{ textAlign: "center" }}>Email</th>
                                                        <th style={{ textAlign: "center" }}>Vai trò</th>
                                                        <th style={{ textAlign: "center" }}>Chức năng</th>
                                                        <th style={{ textAlign: "center" }}>Thời điểm</th>
                                                        <th style={{ textAlign: "center" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        isSearching === false ?
                                                            (logs && logs.map((log, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                        <td style={{ textAlign: "center" }}>{log.email}</td>
                                                                        <td style={{ textAlign: "center" }}>{log.role}</td>
                                                                        <td style={{ textAlign: "center" }}>{log.function_type}</td>
                                                                        <td style={{ textAlign: "center" }}><Moment>{log.actionTime}</Moment></td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            <Button color="primary" onClick={() => this.toggleModalDetail(log.id)}><i className="fa fa-eye"></i></Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })) : (searchingList && searchingList.map((log, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ textAlign: "center" }}>{currentPage * rowsPerPage + index + 1}</td>
                                                                        <td style={{ textAlign: "center" }}>{log.email}</td>
                                                                        <td style={{ textAlign: "center" }}>{log.role}</td>
                                                                        <td style={{ textAlign: "center" }}>{log.function_type}</td>
                                                                        <td style={{ textAlign: "center" }}><Moment>{log.actionTime}</Moment></td>
                                                                        <td style={{ textAlign: "center" }}>
                                                                            <Button color="primary" onClick={() => this.toggleModalDetail(log.id)}><i className="fa fa-eye"></i></Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }))
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                        <ToastContainer />
                                        {isSearching === false ?
                                            <Row>
                                                <Col>
                                                    <Row>
                                                        <Pagination>
                                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                                        </Pagination>
                                                        &emsp;
                                                        <h6 style={{ marginTop: "7px" }}>Số dòng trên trang: </h6>
                                                        &nbsp;&nbsp;
                                                        <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{ width: "70px" }}>
                                                            <option value={10} selected={rowsPerPage === 10}>10</option>
                                                            <option value={20}>20</option>
                                                            <option value={50}>50</option>
                                                        </Input>
                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <Row className="float-right">
                                                        <Label>Bạn đang xem kết quả từ {currentPage * rowsPerPage + 1} - {currentPage * rowsPerPage + logs.length} trên tổng số {numOfLogs} kết quả</Label>
                                                    </Row>
                                                </Col>
                                            </Row> : <></>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail} className={'modal-primary ' + this.props.className}>
                            <ModalHeader toggle={this.toggleModalDetail}>Chi tiết lịch sử log</ModalHeader>
                            <ModalBody>
                                <div>
                                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Email</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {log === null ?
                                                    <></> :
                                                    <Label>{log.email}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Vai trò</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {log === null ?
                                                    <></> :
                                                    <Label>{log.role}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Chức năng</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {log === null ?
                                                    <></> :
                                                    <Label>{log.function_type}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Controller</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {log === null ?
                                                    <></> :
                                                    <Label>{log.controller}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Tên chức năng</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {log === null ?
                                                    <></> :
                                                    <Label>{log.function_name}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Target email</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {log === null ?
                                                    <Label>N/A</Label> :
                                                    <Label>{log.targetEmail}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Thời điểm</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {log === null ?
                                                    <></> :
                                                    <Label><Moment>{log.actionTime}</Moment></Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        {
                                            log === null ? <></> :
                                                (
                                                    log.details.map((detail, index) => {
                                                        return (
                                                            <div>
                                                                <FormGroup row>
                                                                    <Col md="4">
                                                                        <h6>Tên bảng</h6>
                                                                    </Col>
                                                                    <Col xs="12" md="8">
                                                                        {
                                                                            <Label>{detail.tableName}</Label>
                                                                        }
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup row>
                                                                    <Col md="4">
                                                                        <h6>Tên cột</h6>
                                                                    </Col>
                                                                    <Col xs="12" md="8">
                                                                        {
                                                                            <Label>{detail.columnName}</Label>
                                                                        }
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup row>
                                                                    <Col md="4">
                                                                        <h6>Target Id</h6>
                                                                    </Col>
                                                                    <Col xs="12" md="8">
                                                                        {
                                                                            <Label>{detail.targetId}</Label>
                                                                        }
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup row>
                                                                    <Col md="4">
                                                                        <h6>Giá trị mới</h6>
                                                                    </Col>
                                                                    <Col xs="12" md="8">
                                                                        {
                                                                            <Label>{detail.newValue}</Label>
                                                                        }
                                                                    </Col>
                                                                </FormGroup>
                                                            </div>
                                                        )
                                                    })
                                                )
                                        }
                                    </Form>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                )
        );
    }
}

export default Log;
