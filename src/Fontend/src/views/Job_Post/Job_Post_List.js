import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Pagination, Row, Input } from 'reactstrap';
import ApiServices from '../../service/api-service';
import PaginationComponent from '../Paginations/pagination';


class Job_Post_List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: null,
            searchValue: '',
            accordion: [],
            isShowAll: true,
            pageNumber: 1,
            currentPage: 0,
            rowsPerPage: 10
        };
    }

    async componentDidMount() {
        const { currentPage, rowsPerPage } = this.state;

        const businesses = await ApiServices.Get(`/admin/jobPostsBusinesses?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);
        let accordion = [];
        if (businesses !== null) {
            for (let i = 0; i < businesses.length; i++) {
                accordion.push(true);
            }
            this.setState({
                businesses: businesses.listData,
                accordion: accordion,
                isShowAll: true,
                pageNumber: businesses.pageNumber
            });
        }
    }

    toggleAccordion(indexTab) {
        const businesses = this.state.businesses;
        const accordion = this.state.accordion;
        const prevState = [];
        let isShowAll = this.state.isShowAll;
        for (let index = 0; index < businesses.length; index++) {
            if (indexTab === index) {
                prevState.push(!accordion[index]);
                if (accordion[index] === true) {
                    isShowAll = false;
                }
            } else {
                prevState.push(accordion[index]);
            }
        }
        this.setState({
            accordion: prevState,
            isShowAll: isShowAll,
        });
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleHideAll = () => {
        const businesses = this.state.businesses;
        const prevState = this.state.accordion;
        let accordion = [];
        let isShowAll = this.state.isShowAll;
        for (let index = 0; index < prevState.length; index++) {
            if (prevState[index] == false) {
                isShowAll = false;
                break;
            }
        }
        if (isShowAll === true) {
            for (let index = 0; index < businesses.length; index++) {
                accordion.push(false);
                isShowAll = false;
            }
        } else {
            for (let index = 0; index < businesses.length; index++) {
                accordion.push(true);
                isShowAll = true;
            }
        }
        this.setState({
            accordion: accordion,
            isShowAll: isShowAll,
        });
    }

    handlePageNumber = async (currentPage) => {
        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/admin/jobPostsBusinesses?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

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
        const businesses = await ApiServices.Get(`/admin/jobPostsBusinesses?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

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
        const businesses = await ApiServices.Get(`/admin/jobPostsBusinesses?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage,
                pageNumber: businesses.pageNumber
            })
        }
    }

    handleInputPaging = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value
        })

        const { rowsPerPage } = this.state;
        const businesses = await ApiServices.Get(`/admin/jobPostsBusinesses?currentPage=0&rowsPerPage=${rowsPerPage}`);

        if (businesses !== null) {
            this.setState({
                businesses: businesses.listData,
                currentPage: 0,
                pageNumber: businesses.pageNumber
            })
        }
    }

    render() {
        const { businesses, searchValue, isShowAll } = this.state;
        const { pageNumber, currentPage, rowsPerPage } = this.state;

        let filteredListBusinesses;
        if (businesses !== null) {
            filteredListBusinesses = businesses.filter(
                (business) => {
                    if (business.business.business_name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        // filteredJobPostList.push(business.job_postList);
                        // filteredSkillList.push(business.job_postList.job_post_skills);
                        return business;
                    }
                }
            );
        }
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Thông tin tuyển dụng
                            </CardHeader>
                            <CardBody>
                                <div>
                                    <nav className="navbar navbar-light bg-light justify-content-between">
                                        <form className="form-inline">
                                            <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                        </form>
                                    </nav>
                                    <br />
                                    <Row style={{ paddingLeft: "48%" }}>
                                        <Button onClick={this.handleHideAll} type="submit" color="secondary">
                                            {isShowAll === true ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                                        </Button>
                                    </Row>
                                    <br />
                                    <div id="accordionParrent" data-children=".accordion">
                                        {filteredListBusinesses && filteredListBusinesses.map((business, index) => {
                                            // let tmpJobPost;
                                            // tmpJobPost = business.job_postList;
                                            // for (let index = 0; index < business.job_postList.length; index++) {
                                            //     tmpJobPost.push(business.job_postList[index]);
                                            // }
                                            return (
                                                <div id="accordion">
                                                    <Card className="mb-0">
                                                        <CardHeader id={business.business.business_name} style={{ color: "white", backgroundColor: "DeepSkyBlue" }}>
                                                            <Button style={{ color: "white", backgroundColor: "DeepSkyBlue", border: "0", textAlign: "center" }} block onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls={business.business.business_eng_name}>
                                                                <h5 style={{ fontWeight: 'bold' }}>{business.business.business_name}</h5>
                                                            </Button>
                                                        </CardHeader>
                                                        <Collapse isOpen={this.state.accordion[index]} data-parent="#accordionParrent" id={business.business.business_eng_name} aria-labelledby={business.business.business_name}>
                                                            <CardBody>
                                                                {business.job_postList.map((job_post, index1) => {
                                                                    {/* {tmpJobPost && tmpJobPost.map((job_post, index1) => {
                                                                    let tmpSkill;
                                                                    tmpSkill = job_post.job_post_skills; */}
                                                                    // for (let index = 0; index < job_post.job_post_skills.length; index++) {
                                                                    //     tmpSkill.push(job_post.job_post_skills[index]);
                                                                    // }
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                <p> - Quy trình tuyển: {job_post.interview_process}</p>
                                                                                <p> - Chính sách công ty: {job_post.interest}</p>
                                                                                <p> - Liên hệ: {job_post.contact}</p>
                                                                                <p> - Vị trí - Số lượng:</p>
                                                                                {job_post.job_post_skills.map((skill, index2) => {
                                                                                    return (<p>&nbsp;&nbsp;&nbsp;&nbsp;+ {skill.skill.name} ({skill.skill.specialized.name}): {skill.number}</p>)
                                                                                })}
                                                                                <p> - Mô tả công việc: {job_post.description}</p>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                    // }
                                                                    // )}
                                                                }
                                                                )}
                                                            </CardBody>
                                                        </Collapse>
                                                    </Card>
                                                    <br />
                                                    <br />
                                                </div>
                                                // <Table responsive bordered>
                                                //     <thead style={{ color: "white", backgroundColor: "DeepSkyBlue" }}>
                                                //         <tr>
                                                //             <th style={{ textAlign: "center", whiteSpace: "nowrap" }}>{business.business.business_name}</th>
                                                //         </tr>
                                                //     </thead>
                                                //     <tbody>
                                                //         {business.job_postList.map((job_post, index1) => {
                                                //             {/* {tmpJobPost && tmpJobPost.map((job_post, index1) => {
                                                //             let tmpSkill;
                                                //             tmpSkill = job_post.job_post_skills; */}
                                                //             // for (let index = 0; index < job_post.job_post_skills.length; index++) {
                                                //             //     tmpSkill.push(job_post.job_post_skills[index]);
                                                //             // }
                                                //             return (
                                                //                 <tr>
                                                //                     <td>
                                                //                         <p> - Quy trình tuyển: {job_post.interview_process}</p>
                                                //                         <p> - Chính sách công ty: {job_post.interest}</p>
                                                //                         <p> - Liên hệ: {job_post.contact}</p>
                                                //                         <p> - Vị trí - Số lượng:</p>
                                                //                         {job_post.job_post_skills.map((skill, index2) => {
                                                //                             return (<p>&nbsp;&nbsp;&nbsp;&nbsp;+ {skill.skill.name} ({skill.skill.specialized.name}): {skill.number}</p>)
                                                //                         })}
                                                //                         <p> - Mô tả công việc: {job_post.description}</p>
                                                //                     </td>
                                                //                 </tr>
                                                //             )
                                                //             // }
                                                //             // )}
                                                //         }
                                                //         )}
                                                //         <tr></tr>
                                                //     </tbody>
                                                // </Table>
                                            )
                                        })}

                                    </div>
                                </div>
                                <ToastContainer />
                                <Pagination style={{ marginTop: "3%" }}>
                                    <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                    <h6 style={{ marginLeft: "5%", width: "15%", marginTop: "7px" }}>Số dòng trên trang: </h6>
                                    <Input onChange={this.handleInputPaging} type="select" name="rowsPerPage" style={{ width: "7%" }}>
                                        <option value={10} selected={rowsPerPage === 10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
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
            </div>
        );
    }
}

export default Job_Post_List;