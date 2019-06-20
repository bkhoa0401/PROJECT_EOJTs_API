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
            name: '',
            code: '',
            email: '',
            phone: '',
            address: '',
            specialized: '',
            objective: '',
            gpa: '',
            skills: []
        }
    }


    async componentDidMount() {
        const email = window.location.href.split("/").pop();
        const students = await ApiServices.Get(`/student/student/${email}`);
        this.setState({
            name: students.name,
            code: students.code,
            email: students.email,
            phone: students.phone,
            address: students.address,
            specialized: students.specialized.name,
            objective: students.objective,
            gpa: students.gpa,
            skills: students.skills
        });
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        const { name, code, email, phone, address, specialized, objective, gpa, skills } = this.state;
        const linkDownload = `http://localhost:8000/api/file/downloadFile?emailStudent=${email}`;
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
                                            <Label id="" name="">{name}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>MSSV</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{code}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Email</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{email}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>SĐT</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{phone}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Chuyên ngành</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{specialized}</Label>
                                        </Col>
                                    </FormGroup>
                                    {/* <FormGroup row>
                                        <Col md="2">
                                            <h6>Học kỳ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{}</Label>
                                        </Col>
                                    </FormGroup> */}
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Địa chỉ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{address}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Mục tiêu</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{objective}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>GPA</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Label id="" name="">{gpa}</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Kỹ năng</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            {
                                                skills && skills.map((skill, index) => {
                                                    return (
                                                        <div>
                                                            {
                                                                skill.name && skill.name ? (
                                                                    <label style={{ marginRight: "15px" }}>+ {skill.name}</label>
                                                                ) : (
                                                                        <label style={{ marginRight: "15px" }}>N/A</label>
                                                                    )
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>CV</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <a href={linkDownload} download>Tải</a>
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
