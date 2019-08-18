import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, Input, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../../views/Toastify/Toastify';
import PaginationComponent from '../Paginations/pagination';

class Specialized extends Component {

    constructor(props) {
        super(props);
        this.state = {
            specializeds: null,
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirm = (specialized, status) => {

        var messageStatus = '';
        if (status) {
            messageStatus = 'kích hoạt';
        } else {
            messageStatus = 'vô hiệu';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${messageStatus} chuyên ngành '${specialized.name}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(specialized.id, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    handleUpdateStatus = async (id, status) => {
        const result = await ApiServices.Put(`/specialized/status?id=${id}&status=${status}`);
        // const specializeds = await ApiServices.Get('/specialized');
        // if (specializeds !== null) {
        //     this.setState({
        //         specializeds,
        //     });
        // }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }

        const { currentPage, rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (specializeds !== null) {
            this.setState({
                specializeds: specializeds.listData,
                currentPage,
                pageNumber: specializeds.pageNumber
            })
        }
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (specializeds !== null) {
            this.setState({
                specializeds: specializeds.listData,
                pageNumber: specializeds.pageNumber,
                loading: false
            });
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        // const { specializeds, rowsPerPage } = this.state;
        if (specializeds !== null) {
            // const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
            // const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
            this.setState({
                //specializedsPagination,
                specializeds: specializeds.listData,
                currentPage,
                pageNumber: specializeds.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        // const { specializeds, rowsPerPage } = this.state;
        if (specializeds !== null) {
            // const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
            // const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
            this.setState({
                //specializedsPagination,
                specializeds: specializeds.listData,
                currentPage,
                pageNumber: specializeds.pageNumber
            })
        }
        // console.log('currentPage', currentPage);

        // const { specializeds, rowsPerPage } = this.state;
        // if (specializeds !== null) {
        //     const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
        //     const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
        //     this.setState({
        //         specializedsPagination,
        //         currentPage,
        //         pageNumber
        //     })
        // }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        // const { specializeds, rowsPerPage } = this.state;
        if (specializeds !== null) {
            // const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
            // const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
            this.setState({
                //specializedsPagination,
                specializeds: specializeds.listData,
                currentPage,
                pageNumber: specializeds.pageNumber
            })
        }
        // console.log('currentPage', currentPage);

        // const { specializeds, rowsPerPage } = this.state;
        // if (specializeds !== null) {
        //     const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
        //     const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
        //     this.setState({
        //         specializedsPagination,
        //         currentPage,
        //         pageNumber
        //     })
        // }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const specializeds = await ApiServices.Get(`/specialized/pagination?currentPage=0&rowsPerPage=${rowsPerPage}`);

        // const { specializeds, rowsPerPage } = this.state;
        if (specializeds !== null) {
            // const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
            // const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(currentPage, rowsPerPage), getPaginationNextPageNumber(currentPage, rowsPerPage));
            this.setState({
                //specializedsPagination,
                specializeds: specializeds.listData,
                currentPage: 0,
                pageNumber: specializeds.pageNumber
            })
        }

        // const { specializeds, rowsPerPage } = this.state;
        // if (specializeds !== null) {
        //     const pageNumber = getPaginationPageNumber(specializeds.length, rowsPerPage);
        //     const specializedsPagination = specializeds.slice(getPaginationCurrentPageNumber(0, rowsPerPage), getPaginationNextPageNumber(0, rowsPerPage));
        //     this.setState({
        //         specializedsPagination,
        //         currentPage: 0,
        //         pageNumber
        //     })
        // }

        // console.log(this.state.rowsPerPage);
    }

    render() {
        const { specializeds, loading } = this.state;
        // const { specializedsPagination, pageNumber, currentPage, rowsPerPage } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="15">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách chuyên ngành
                                    </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/specialized/create')}>Tạo chuyên ngành mới</Button>
                                        <br />
                                        <br />
                                        <br />
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Tên Ngành</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap", paddingBottom: "20px" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    specializeds && specializeds.map((specialized, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{specialized.name}</td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {specialized.status.toString() === 'true' ? (
                                                                        <Badge color="success">KÍCH HOẠT</Badge>
                                                                    ) : (
                                                                            <Badge color="danger">VÔ HIỆU HOÁ</Badge>
                                                                        )}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {specialized.status.toString() === 'true' ? (
                                                                        <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(specialized, false)} type="submit"><i className="fa cui-ban"></i></Button>
                                                                    ) : (
                                                                            <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(specialized, true)} type="submit"><i className="fa cui-circle-check"></i></Button>
                                                                        )}
                                                                    <Button style={{ marginRight: "1.5px" }} type="submit" color="primary" onClick={() => this.handleDirect(`/specialized/update/${specialized.id}`)}><i className="fa cui-note"></i></Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        <ToastContainer />
                                        <Pagination style={{marginTop: "3%"}}>
                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                            <h6 style={{marginLeft: "5%", width: "15%", marginTop: "7px"}}>Số dòng trên trang: </h6>
                                            <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{width: "7%"}}>
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

export default Specialized;
