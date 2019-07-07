import React, { Component } from 'react';
import Popup from "reactjs-popup";
import { Label, FormGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class Report_Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reportColor:['lime', 'DeepSkyBlue', 'gold', 'red', 'black'],
            rate:['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu'],
            reportId: -1,
        };
    }

    async componentDidMount() {
        this.state.reportId = window.location.href.split("/").pop();
        // const data = await ApiServices.Get(`/informmessage/getInformMessage?id=${informMessageID}`);
        // if (data != null) {
          this.setState({
              reportId: this.state.reportId,
          });
        // }
        console.log(this.state.reportId);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { searchValue, reportColor, rate, reportId } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Chi tiết báo cáo #{reportId}
                            </CardHeader>
                            <CardBody>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Doanh nghiệp:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>Công ty ABC</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Sinh viên:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>Nguyễn Văn A</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Nhà trường:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>FPT University</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>MSSV:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>SE60001</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm hiệu quả công việc:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>9</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm thái độ làm việc:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>9</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Điểm kỷ luật:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>9</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Xếp loại:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label style={{fontWeight:'bold', color:reportColor[0]}}>{rate[0]}</Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="2">
                                        <h6>Nhận xét:</h6>
                                    </Col>
                                    <Col xs="12" md="10">
                                        <Label>Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</Label>
                                    </Col>
                                </FormGroup>
                                <ToastContainer />
                                <Pagination>
                                    {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                </Pagination>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <div style={{paddingLeft:'45%'}}>
                    <Button style={{ width: '100px' }} color="primary" onClick={() => this.handleDirect('/Report/Report')}>
                        Trở về
                    </Button>
                </div>
            </div>
        );
    }
}

export default Report_Detail;
