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
    Pagination
} from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';


class CV extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    //   async componentDidMount() {
    //     const products = await ApiService.Get('/product');
    //     if (products != null) {
    //       this.setState({

    //       });
    //     }
    //   }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    // handleDelete = async (deletedId) => {
    //   const result = await ApiService.Delete(`/product/${deletedId}`, "");

    //   if (result) {
    //     // do something
    //   } else {

    //   }

    // }

    //   handleUpdateDiscontinued = async (id, discontinued) => {
    //     const result = await ApiService.Put(`/product/discontinued/${id}/${discontinued}`, "");
    //     const products = await ApiService.Get('/product');
    //     if (products != null) {
    //       const { currentPage } = this.state;
    //       const pageNumber = getPaginationPageNumber(products.length);
    //       const productsPagination = products.slice(getPaginationCurrentPageNumber(currentPage), getPaginationNextPageNumber(currentPage));
    //       this.setState({
    //         products,
    //         pageNumber,
    //         productsPagination,
    //       });
    //     }

    //     if (result) {
    //       // do something
    //       Toastify.querySuccess("Update Status Successfully!");
    //     } else {
    //       Toastify.queryFail("Update Status Fail!");
    //     }

    //   }


    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Chi tiết CV
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Họ và Tên</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">DucNH</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>MSSV</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">SE62389</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Email</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">ducnhse62389@gmail.com</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>SĐT</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">0335554120</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Chuyên ngành</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">SE</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Học kỳ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">9</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Điều kiện thực tập</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">PERFECT</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Mục tiêu</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">ABC</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>GPA</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">7.0</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Kỹ năng</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">ReactJS, Spring Boot</Label>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
                                <Pagination>
                                    {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                </Pagination>
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleDirect("/ojt_registration")} type="submit" color="primary" block>Trở về</Button>
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

export default CV;
