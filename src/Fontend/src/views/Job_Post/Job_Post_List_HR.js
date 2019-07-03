import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import { Button } from 'reactstrap';
import ApiServices from '../../service/api-service';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';


class Job_Post_List_HR extends Component {

    constructor(props) {
        super(props);
        this.state = {
            job_posts: null,
        }
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleUpdateStatus = async (id, status) => {
        const result = await ApiServices.Put(`/job_post/status?id=${id}&status=${status}`);
        const job_posts = await ApiServices.Get('/job_post');
        if (job_posts != null) {
            this.setState({
                job_posts,
            });
        }

        if (result) {
            Toastify.actionSuccess("Cập nhật trạng thái thành công!");
        } else {
            Toastify.actionFail("Cập nhật trạng thái thất bại!");
        }
    }

    async componentDidMount() {
        const job_posts_business = await ApiServices.Get('/business/getAllJobPostABusiness');
        if (job_posts_business != null) {
            this.setState({
                job_posts: job_posts_business.job_postList
            });
        }
    }
    

    render() {
        const { job_posts } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="15">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Danh sách bài đăng tuyển dụng
                            </CardHeader>
                            <CardBody>
                                <Button color="primary" onClick={() => this.handleDirect('/job_post_list_hr/add_job_post')}>Tạo bài đăng mới</Button>
                                <br />
                                <br />
                                <br />
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>STT</th>
                                            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Mô tả công việc</th>
                                            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Quy trình tuyển</th>
                                            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Thời gian đăng</th>
                                            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Phúc lợi</th>
                                            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Thông tin liên hệ</th>
                                            <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            job_posts && job_posts.map((job_post, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                job_post.description.length > 30 ? (job_post.description.replace(job_post.description.substr(31, job_post.description.length), " ...")) : (job_post.description)
                                                            }
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                job_post.interview_process.length > 30 ? (job_post.interview_process.replace(job_post.interview_process.substr(31, job_post.interview_process.length), " ...")) : (job_post.interview_process)
                                                            }
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>{job_post.timePost}</td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                job_post.interest.length > 30 ? (job_post.interest.replace(job_post.interest.substr(31, job_post.interest.length), " ...")) : (job_post.interest)
                                                            }
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            {
                                                                job_post.contact.length > 30 ? (job_post.contact.replace(job_post.contact.substr(31, job_post.contact.length), " ...")) : (job_post.contact)
                                                            }
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <Button type="submit" onClick={() => this.handleDirect(`/job-post/${job_post.id}`)} color="success">Chi tiết</Button>
                                                            {/* <Button type="submit" style={{ marginRight: "1.5px" }} color="primary" onClick={() => this.handleDirect(`/product/update/${job_post.id}`)}>Update</Button> */}
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

export default Job_Post_List_HR;