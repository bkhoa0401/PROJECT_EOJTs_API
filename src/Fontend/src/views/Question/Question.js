import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardHeader, Col, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import Toastify from '../Toastify/Toastify';


class Question extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: null,
            loading: true,
            open: false,
            questionDetail: null,
            modalDetail: false,
        }
    }

    toggleModalDetail = async (question) => {
        if (this.state.modalDetail === false) {
            this.setState({
                questionDetail: question,
                modalDetail: !this.state.modalDetail,
            });
        } else {
            this.setState({
                modalDetail: !this.state.modalDetail,
            });
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (question, status) => {
        const result = await ApiServices.Put(`/admin/question?id=${question.id}&status=${status}`);
        const questions = await ApiServices.Get('/admin/questions');
        if (questions !== null) {
            this.setState({
                questions,
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const questions = await ApiServices.Get('/admin/questions');
        if (questions !== null) {
            this.setState({
                questions: questions,
                loading: false
            });
        }
    }

    handleConfirm = (question, status) => {

        let contentRemoveTagP = question.content;
        contentRemoveTagP = contentRemoveTagP.replace('<p>', '');
        contentRemoveTagP = contentRemoveTagP.replace('</p>', '');

        var messageStatus = '';
        if (status) {
            messageStatus = 'KÍCH HOẠT';
        } else {
            messageStatus = 'VÔ HIỆU';
        }

        confirmAlert({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn '${messageStatus}' câu hỏi '${contentRemoveTagP}' ?`,
            buttons: [
                {
                    label: 'Đồng ý',
                    onClick: () => this.handleUpdateStatus(question, status)
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };

    render() {
        const { questions, loading, questionDetail } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" lg="15">
                                <Card>
                                    <CardHeader>
                                        <i className="fa fa-align-justify"></i> Danh sách câu hỏi khảo sát
                                    </CardHeader>
                                    <CardBody>
                                        <Button color="primary" onClick={() => this.handleDirect('/question/new')}>Tạo câu hỏi mới</Button>
                                        <br />
                                        <br />
                                        <br />
                                        <Table responsive striped>
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Nội dung</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Trạng thái</th>
                                                    <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    questions && questions.map((question, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                                <td style={{ textAlign: "left" }}>
                                                                    {
                                                                        <Label dangerouslySetInnerHTML={{ __html: question.content.length > 70 ? (question.content.replace(question.content.substr(71, question.content.length), " ...")) : (question.content) }} />
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    {
                                                                        question.active.toString() === 'true' ? (
                                                                            <Badge color="success" style={{ fontSize: '12px' }}>KÍCH HOẠT</Badge>
                                                                        ) : (
                                                                                <Badge color="danger" style={{ fontSize: '12px' }}>VÔ HIỆU</Badge>
                                                                            )
                                                                    }
                                                                </td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <Button type="submit" style={{ marginRight: "1.5px" }} onClick={() => this.toggleModalDetail(question)} color="secondary">Chi tiết</Button>
                                                                    <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleDirect(`/question/update/${question.id}`)}>Chỉnh sửa</Button>
                                                                    {question.active.toString() === 'true' ? (
                                                                        <Button style={{ marginRight: "1.5px" }} color="danger" onClick={() => this.handleConfirm(question, false)} type="submit">Vô hiệu</Button>
                                                                    ) : (
                                                                            <Button style={{ marginRight: "1.5px" }} color="success" onClick={() => this.handleConfirm(question, true)} type="submit">Kích hoạt</Button>
                                                                        )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        {
                                            questionDetail !== null ? (
                                                <Modal isOpen={this.state.modalDetail} toggle={this.toggleModalDetail} className={'modal-primary ' + this.props.className}>
                                                    <ModalHeader toggle={this.toggleModalDetail}>Chi tiết câu hỏi</ModalHeader>
                                                    <ModalBody>
                                                        <FormGroup row>
                                                            <Col md="4">
                                                                <h6>Trạng thái:</h6>
                                                            </Col>
                                                            <Col xs="12" md="8">
                                                                {
                                                                    questionDetail.active.toString() === 'true' ? (
                                                                        <Badge color="success" style={{ fontSize: '12px' }}>KÍCH HOẠT</Badge>
                                                                    ) : (
                                                                            <Badge color="danger" style={{ fontSize: '12px' }}>VÔ HIỆU</Badge>
                                                                        )
                                                                }
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Col md="4">
                                                                <h6>Nội dung</h6>
                                                            </Col>
                                                            <Col xs="12" md="8">
                                                                <Label dangerouslySetInnerHTML={{ __html: questionDetail.content }} />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Col md="4">
                                                                <h6>Các câu trả lời:</h6>
                                                            </Col>
                                                            <Col xs="12" md="8">
                                                                {
                                                                    questionDetail.answers && questionDetail.answers.map((answer, index) => {
                                                                        return (
                                                                            answer.other.toString() === 'false' ? (
                                                                                <div>
                                                                                    <Label>{'- ' + answer.content}</Label>
                                                                                    <br />
                                                                                </div>
                                                                            ) : (
                                                                                    <></>
                                                                                )
                                                                        )
                                                                    })
                                                                }
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Col md="4">
                                                                <h6>Được trả lời ý kiến ngoài:</h6>
                                                            </Col>
                                                            <Col xs="12" md="8">
                                                                {
                                                                    questionDetail.has_others.toString() === 'true' ? (
                                                                        <Badge color="success" style={{ fontSize: '12px' }}>ĐƯỢC PHÉP</Badge>
                                                                    ) : (
                                                                            <Badge color="danger" style={{ fontSize: '12px' }}>KHÔNG ĐƯỢC PHÉP</Badge>
                                                                        )
                                                                }
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Col md="4">
                                                                <h6>Lựa chọn nhiều đáp án:</h6>
                                                            </Col>
                                                            <Col xs="12" md="8">
                                                                {
                                                                    questionDetail.manyOption.toString() === 'true' ? (
                                                                        <Badge color="success" style={{ fontSize: '12px' }}>ĐƯỢC PHÉP</Badge>
                                                                    ) : (
                                                                            <Badge color="danger" style={{ fontSize: '12px' }}>KHÔNG ĐƯỢC PHÉP</Badge>
                                                                        )
                                                                }
                                                            </Col>
                                                        </FormGroup>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button style={{ marginRight: "42%", width: "100px" }} color="primary" onClick={this.toggleModalDetail}>Xác nhận</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            ) : (
                                                    <></>
                                                )
                                        }
                                        <ToastContainer />

                                        {/* <Pagination>
                                        <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                    </Pagination> */}

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
        );
    }
}

export default Question;
