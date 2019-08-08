import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, Input, CardHeader, Col, Form, FormGroup, Label, Modal, ModalBody, ModalHeader, Pagination, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import PaginationComponent from '../Paginations/pagination';

class business_list extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: null,
            searchValue: '',
            loading: true,
            pageNumber: 1,
            currentPage: 0,
            businessPagination: null,
            rowsPerPage: 1,
            modalDetail: false,
            business: null,
            role: '',
        };
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/business/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                loading: false
            });
        }
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/business/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handlePagePrevious = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/business/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handlePageNext = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/business/pagination?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    toggleModalDetail = async (businessEmail) => {
        let business = null;
        if (this.state.modalDetail === false) {
            business = await ApiServices.Get(`/business/business?email=${businessEmail}`);
            this.setState({
                business: business,
                modalDetail: !this.state.modalDetail,
            });
        } else {
            this.setState({
                modalDetail: !this.state.modalDetail,
            });
        }
    }

    handleInput = async (event) => {
        // const { name, value } = event.target;
        // await this.setState({
        //     [name]: value.substr(0, 20),
        // })

        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/business/pagination?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage: 0,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { businesses, business, searchValue, loading } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="12">
                                <Card>
                                    <CardHeader style={{ fontWeight: "bold" }}>
                                        <i className="fa fa-align-justify"></i>Danh sách doanh nghiệp
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                            </nav>
                                            <Table responsive striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: "center" }}>STT</th>
                                                        <th style={{ textAlign: "center" }}>Tên doanh nghiệp</th>
                                                        {/* <th style={{ textAlign: "center" }}>Tên tiếng Anh</th> */}
                                                        <th style={{ textAlign: "center" }}>Địa chỉ</th>
                                                        {/* <th style={{ textAlign: "center" }}>Website</th> */}
                                                        <th style={{ textAlign: "center" }}>Liên hệ</th>
                                                        <th style={{ textAlign: "center" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {businesses && businesses.map((business, index) => {
                                                        return (
                                                            <tr>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{business.business_name}<br />({business.business_eng_name})</td>
                                                                {/* <td style={{ textAlign: "center" }}>{business.business_eng_name}</td> */}
                                                                <td style={{ textAlign: "center" }}>{business.business_address}</td>
                                                                {/* <td style={{ textAlign: "center" }}>{business.business_website}</td> */}
                                                                <td style={{ textAlign: "center" }}>
                                                                    <span>Email: {business.email}<br /></span>
                                                                    SĐT: {business.business_phone}
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <Button color="primary" onClick={() => this.toggleModalDetail(business.email)}><i className="fa cui-magnifying-glass"></i></Button>
                                                                    {/* <Button
                                                                        style={{ fontWeight: "bold", borderWidth: 0 }}
                                                                        color="primary"
                                                                        onClick={() => this.handleDirect(`/list_management/business_list/Business_Detail/${business.email}`)}
                                                                    >
                                                                        Chi tiết
                                                                    </Button> */}
                                                                    {/* &nbsp;&nbsp;
                                                        <Button style={{ fontWeight: "bold", borderWidth: 0 }} color="danger">Xoá</Button> */}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                        <ToastContainer />
                                        <Pagination style={{ marginTop: "3%" }}>
                                            <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                            <h6 style={{ marginLeft: "5%", width: "15%", marginTop: "7px" }}>Số dòng trên trang: </h6>
                                            <Input onChange={this.handleInput} type="select" name="rowsPerPage" style={{ width: "7%" }}>
                                                <option value={1} selected={rowsPerPage === 1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={100}>100</option>
                                            </Input>
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
                        <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail} className={'modal-primary ' + this.props.className}>
                            <ModalHeader toggle={this.toggleModalDetail}>Chi tiết sinh viên</ModalHeader>
                            <ModalBody>
                                <div style={{ maxHeight: "563px", overflowY: 'auto', overflowX: 'hidden' }}>
                                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Logo</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {business === null ?
                                                    <></> :
                                                    (business.logo === null ?
                                                        <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" style={{ width: "100px", height: "100px" }} alt="usericon" /> :
                                                        <img src={business.logo} className="img-avatar" style={{ width: "100px", height: "100px" }} />
                                                    )
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Email</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {business === null ?
                                                    <></> :
                                                    <Label>{business.email}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Tên doanh nghiệp</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {business === null ?
                                                    <></> :
                                                    <Label>{business.business_name}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Tên tiếng Anh</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {business === null ?
                                                    <></> :
                                                    <Label>{business.business_eng_name}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>SĐT</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {business === null ?
                                                    <></> :
                                                    <Label>{business.business_phone}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Website</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {business === null ?
                                                    <></> :
                                                    <Label>{business.business_website}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Địa chỉ</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {business === null ?
                                                    <></> :
                                                    <Label>{business.business_address}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">
                                                <h6>Giới thiệu</h6>
                                            </Col>
                                            <Col xs="12" md="8">
                                                {business === null ?
                                                    <></> :
                                                    <Label>{business.business_overview}</Label>
                                                }
                                            </Col>
                                        </FormGroup>
                                        {/* <FormGroup row>
                                        <Col md="4">
                                            <h6>Image</h6>
                                        </Col>
                                        <Col xs="12" md="8">
                                            <Input value="Đây là 1 gallery" onChange={this.handleInput} type="text" id="timeStartOJT" name="timeStartOJT" />
                                            <span className="form-error is-visible text-danger">
                                                {this.validator.message('timeStartOJT', this.state.timeStartOJT, 'required')}
                                            </span>
                                        </Col>
                                    </FormGroup> */}
                                    </Form>
                                </div>
                            </ModalBody>
                            {/* <ModalFooter>
                            </ModalFooter> */}
                        </Modal>
                    </div>
                )
        );
    }
}

export default business_list;
