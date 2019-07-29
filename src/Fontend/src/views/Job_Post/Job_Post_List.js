import React, { Component } from 'react';
import { Collapse, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import { taggedTemplateExpression } from '@babel/types';


class Job_Post_List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            businesses: null,
            searchValue: '',
            accordion: [],
            // countJobPostList: [],
            // countJobPostSkillList: [],
            // businessList:[],
            // jobPostList:[],
            // skillList:[],
        };
    }

    async componentDidMount() {
        const businesses = await ApiServices.Get('/admin/jobPostsBusinesses');
        let accordion = [];
        // const businessList = businesses.business;
        // const jobPostList = businesses.job_postList;
        // const skillList = jobPostList.job_post_skills;
        // let countJobPostList = [];
        // let countJobPostSkillList = [];
        if (businesses != null) {  
            for (let i = 0; i < businesses.length; i++) {
                // countJobPostList.push(businesses[i].job_postList.length);
                // for (let j = 0; j < businesses[i].job_postList.length; j++) {
                //     countJobPostSkillList.push(businesses[i].job_postList[j].job_post_skills.length);
                // }
                accordion.push(false);
            }
            this.setState({
                businesses: businesses,
                accordion: accordion,
                // jobPostList: jobPostList,
                // skillList: skillList,
                // countJobPostList: countJobPostList,
                // countJobPostSkillList: countJobPostSkillList,
                // businessList: businessList,
                // jobPostList: jobPostList,
            });
            console.log(this.state.countJobPostList);
            console.log(this.state.countJobPostSkillList);
        }
    }

    toggleAccordion(tab) {

        const prevState = this.state.accordion;
        const state = prevState.map((x, index) => tab === index ? !x : false);
    
        this.setState({
          accordion: state,
        });
      }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    render() {
        const { businesses, searchValue } = this.state;
        let filteredListBusinesses;
        if (businesses != null) {
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
                                                        <Button style={{ color: "white", backgroundColor: "DeepSkyBlue", border:"0", textAlign:"center" }} block onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls={business.business.business_eng_name}>
                                                            <h5 style={{fontWeight:'bold'}}>{business.business.business_name}</h5>
                                                        </Button>
                                                    </CardHeader>
                                                    <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id={business.business.business_eng_name} aria-labelledby={business.business.business_name}>
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
                                                <br/>
                                                <br/>
                                            </div>
                                            // <Table responsive bordered>
                                            //     <thead style={{ color: "white", backgroundColor: "DeepSkyBlue" }}>
                                            //         <tr>
                                            //             <th style={{ textAlign: "center" }}>{business.business.business_name}</th>
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
                                <ToastContainer />
                                <Pagination>
                                    {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
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