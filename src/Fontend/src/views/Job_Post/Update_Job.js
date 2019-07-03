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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { resetWarningCache } from 'prop-types';


class Update_Job extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startupArraySkill: ['Java', 'C#', 'QC'],
            startupArrayQuantity: ['30', '20', '1'],
            arraySkill: ['Java', 'C#', 'QC'],
            arrayQuantity: ['30', '20', '1'],
            isModify: false,
            isError: false,
        };
        this.addRow = this.addRow.bind(this);
        this.submit = this.submit.bind(this);
        this.reset = this.reset.bind(this);
    }

    reset() {
        this.setState({
            arraySkill: this.state.startupArraySkill,
            arrayQuantity: this.state.startupArrayQuantity,
            isModify: false,
            isError: false,
        })
    }

    submit() {
        for (let index = 0; index < this.state.arraySkill.length; index++) {
            if (this.state.arraySkill[index] === "" && this.state.arrayQuantity === "") {
                this.state.arraySkill.splice(index, 1);
                this.state.arrayQuantity.splice(index, 1);
            }
        }
        for (let index = 0; index < this.state.arraySkill.length; index++) {
            if (this.state.arraySkill[index] === "" || this.state.arrayQuantity === "") {
                this.state.isError = true;
            }
        }
        if (this.state.isError === true) {
            alert("Vui lòng nhập đủ thông tin ngành và số lượng tuyển!");
            this.setState(this.state);
        } else {
            this.setState(this.state);
            //truyen arraySkill xuong backend de luu
            alert('Bạn đã lưu');
        }
    }

    addRow() {
        this.setState({
            arraySkill: [...this.state.arraySkill, ""],
            arrayQuantity: [...this.state.arrayQuantity, ""],
            isModify: true,
        })
    }

    deleteSkill = (deleteIndex) => {
        this.state.arraySkill.splice(deleteIndex, 1);
                this.setState({
                    arraySkill: this.state.arraySkill,
                    isModify: true,
                })
    }

    confirm = (key) => {
        switch (key) {
            case "Reset":
                if (this.state.isModify === true) {
                    confirmAlert({
                        title: 'Xác nhận lại',
                        message: 'Đặt lại sẽ làm mất hết những tuỳ chỉnh của bạn. Bạn vẫn muốn đặt lại?',
                        buttons: [
                            {
                                label: 'Có',
                                onClick: () => this.reset()
                            },
                            {
                                label: 'Không',
                                onClick: () => alert('Bạn đã huỷ việc đặt lại')
                            }
                        ]
                    });
                }
                break;
            case "Submit":
                confirmAlert({
                    title: 'Xác nhận lại',
                    message: 'Xác nhận lưu thông tin đã tuỳ chỉnh?',
                    buttons: [
                        {
                            label: 'Có',
                            onClick: () => this.submit()
                        },
                        {
                            label: 'Không',
                            onClick: () => alert('Bạn đã huỷ việc lưu')
                        }
                    ]
                });
                break;
            default:
                break;
        }
    }

    handleDirect = (uri) => {

    }

    render() {
        const { arraySkill, arrayQuantity } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên chuyên ngành:</h6>
                                        </Col>
                                        <Col xs="12" md="4">
                                            {/* truyen ten vao */}
                                            <Label id="" name="">KTPM</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Quy trinh tuyển</h6>
                                        </Col>
                                        <Col xs="12" md="4">
                                            {/* truyen ten vao */}
                                            <Label id="" name="">blablalba</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Mô tả công việc</h6>
                                        </Col>
                                        <Col xs="12" md="4">
                                            {/* truyen ten vao */}
                                            <Label id="" name="">blablalba</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Thông tin liên hệ</h6>
                                        </Col>
                                        <Col xs="12" md="4">
                                            {/* truyen ten vao */}
                                            <Label id="" name="">blablalba</Label>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Vị trí - Số lượng:</h6>
                                            <Button
                                                style={{ fontWeight: "bold", borderColor: '#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
                                                onClick={this.addRow}
                                            >
                                                Thêm
                                            </Button>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="4">
                                            <table>
                                                <tbody>
                                                    {arraySkill.map((skill, index) =>
                                                        <>
                                                            <tr style={{ height: '50px' }}>
                                                                <td>{index + 1}. </td>
                                                                <td style={{ width: "100px" }}>{skill !== "" ? <input style={{ width: "90px" }} defaultValue={skill}></input> : <input style={{ width: "90px" }}></input>}:</td>
                                                                <td><input style={{ width: "40px" }} defaultValue={arrayQuantity[index]}></input></td>
                                                                <td><Button style={{ fontWeight: "bold", height: "36px" }} color="danger" onClick={() => this.deleteSkill(index)}>Xoá</Button></td>
                                                            </tr>
                                                        </>
                                                    )
                                                    }
                                                </tbody>
                                            </table>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
                                <Pagination>
                                    {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                </Pagination>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <div className="position-relative row form-group" style={{ paddingLeft: '40%' }}>
                    <Button
                        style={{ fontWeight: "bold", borderColor: '#20a8d8', color: '#20a8d8', backgroundColor: 'white', width:'80px'}}
                        //tro ve trang thong tin tuyen dung
                        onClick={() => this.handleDirect()}
                    >
                        Trở về
                    </Button>
                    &nbsp;&nbsp;
                    <Button style={{ fontWeight: "bold", width:'80px', backgroundColor:'white'}} block outline color="warning" onClick={() => this.confirm("Reset")}>Đặt lại</Button>
                    &nbsp;&nbsp;
                    <Button style={{ fontWeight: "bold" , width:'80px'}} color="primary" onClick={() => this.confirm("Submit")}>Lưu</Button>
                </div>
            </div>
        );
    }
}

export default Update_Job;
