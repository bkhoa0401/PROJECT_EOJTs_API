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
import { async } from 'q';


class Add_Job extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startupArraySkill: [],
            startupArrayQuantity: [],
            arraySkill: [],
            arrayQuantity: [],
            isModify: false,
            isError: false,


            description: '',
            views: 0,
            contact: '',
            interview_process: '',
            interest: '',
            job_post_skills: [
                // {
                //     skill: {
                //         id: 3
                //     },
                //     number: 3333
                // }
            ],


            specializeds: [],
            specializedItem: {},
            skills: [],
            skillItem: {},


            skillsForSave: [],
            numbersForSave: [],

            isChangeSkill: false,
            isChangeSpecialized: false,

            specializedId: 1
        };
        this.addRow = this.addRow.bind(this);
        this.submit = this.submit.bind(this);
    }


    async componentDidMount() {
        const specializeds = await ApiServices.Get('/specialized');
        let firstSpecialized = specializeds[0].id;
        const skills = await ApiServices.Get(`/skill/bySpecializedId?specializedId=${firstSpecialized}`);
        if (specializeds != null) {
            this.setState({
                specializeds,
                specializedItem: specializeds[0],
                skills,
                skillItem: skills[0]
            });
        }
    }

    handleReset = async () => {
        this.setState({
            description: '',
            contact: '',
            interview_process: '',
            interest: '',
            arraySkill: [],
            specializedItem: this.state.specializeds[0],
            skillsForSave: [],
            numbersForSave: [],
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

    addRow = async () => {
        this.setState({
            arraySkill: [...this.state.arraySkill, ""],
            arrayQuantity: [...this.state.arrayQuantity, ""],
            isModify: true,
        })

        const { specializedId } = this.state;
        const skills = await ApiServices.Get(`/skill/bySpecializedId?specializedId=${specializedId}`);
        if (skills != null) {
            await this.setState({
                isChangeSpecialized: true,
                skills: skills,
                skillItem: skills[0],
            })
        }
    }

    deleteSkill = (deleteIndex) => {
        const { skillsForSave, numbersForSave } = this.state;

        console.log(deleteIndex);
        console.log(this.state.arraySkill);


        for (let index = 0; index < this.state.arraySkill.length; index++) {
            if (index === deleteIndex) {
                this.state.arraySkill.splice(index, 1);
                this.setState({
                    arraySkill: this.state.arraySkill,
                    isModify: true,
                })
                break;
            }
        }

        for (let index = 0; index < skillsForSave.length; index++) {
            if (index === deleteIndex) {
                skillsForSave.splice(index, 1);
                this.setState({
                    skillsForSave
                })
                break;
            }
        }

        for (let index = 0; index < numbersForSave.length; index++) {
            if (index === deleteIndex) {
                numbersForSave.splice(index, 1);
                this.setState({
                    numbersForSave
                })
                break;
            }
        }

        console.log(skillsForSave);
        console.log(numbersForSave);
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        const { specializeds, skills, isChangeSkill, isChangeSpecialized } = this.state;

        if (name.includes('specialized')) {
            let specializedId = specializeds[value].id;


            await this.setState({
                isChangeSpecialized: true,
                specializedId,
            })


        } else if (name.includes('skill')) {
            await this.setState({
                isChangeSkill: true,
                skillItem: skills[value],
            })
        } else if (name.includes('number')) {
            await this.setState({
                number: value
            })
        } else {
            await this.setState({
                [name]: value,
            })
        }
    }

    handleOnBlur = async (event, index) => {
        const { name, value } = event.target;
        const { skillsForSave, numbersForSave, skills } = this.state;
        let tmpSkill = skillsForSave[index];
        let tmpNumber = numbersForSave[index];

        if (name.includes('skill')) {
            if (tmpSkill == null && tmpNumber != null) {
                skillsForSave.push(skills[value]);
            } else if (tmpSkill == null && tmpNumber == null) {
                numbersForSave.push("");
                skillsForSave.push(skills[value]);
            } else {
                skillsForSave[index] = skills[value];
            }
        } else if (name.includes('number')) {
            if (tmpNumber == null && tmpSkill != null) {
                numbersForSave.push(value);
            } else if (tmpNumber == null && tmpSkill == null) {
                skillsForSave.push(skills[0]);
                numbersForSave.push(value);
            } else {
                numbersForSave[index] = value;
            }
        }
    }

    handleSubmit = async () => {

        const { skillsForSave, numbersForSave, description, views,
            contact, interview_process, interest } = this.state;

        let job_post_skills = [];


        for (let i = 0; i < skillsForSave.length; i++) {
            let job_post_skills_item = {
                skill: {
                    id: skillsForSave[i].id
                },
                number: numbersForSave[i]
            }
            job_post_skills.push(job_post_skills_item);
        }

        const job_post = {
            description,
            views,
            contact,
            interview_process,
            interest,
            job_post_skills
        }

        console.log(job_post);
        const result = await ApiServices.Post('/business/createJobPost', job_post);
        if (result.status == 201) {
            Toastify.actionSuccess("Tạo bài đăng thành công!");
            setTimeout(
                function () {
                    this.props.history.push('/job_post_list_hr');
                }
                    .bind(this),
                2000
            );
        } else {
            Toastify.actionFail("Tạo bài đăng thất bại!");
        }
    }

    render() {
        const { arraySkill, arrayQuantity, description, contact, interview_process, interest, specializeds, specializedItem, skills } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Mô tả công việc</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={description} onChange={this.handleInput} type="text" id="description" name="description" placeholder="Mô tả công việc" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Quy trình tuyển</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={interview_process} onChange={this.handleInput} type="text" id="interview_process" name="interview_process" placeholder="Quy trình tuyển" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Phúc lợi:</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={interest} onChange={this.handleInput} type="text" id="interest" name="interest" placeholder="Phúc lợi" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Thông tin liên hệ</h6>
                                        </Col>
                                        <Col xs="12" md="10">
                                            <Input value={contact} onChange={this.handleInput} type="text" id="contact" name="contact" placeholder="Thông tin liên hệ" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Tên ngành tuyển</h6>
                                        </Col>
                                        <Col xs="12" md="4">
                                            <Input onChange={this.handleInput} type="select" name="specialized">
                                                {specializeds && specializeds.map((specialized, i) => {
                                                    return (
                                                        <option selected={specializedItem.id == i + 1} value={i}>{specialized.name}</option>
                                                    )
                                                })}
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="2">
                                            <h6>Kỹ năng - Số lượng:</h6></Col>
                                        <Col xs="12" md="10">
                                            <Button
                                                style={{ fontWeight: "bold", borderColor: '#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
                                                onClick={this.addRow}>Thêm</Button>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="11">
                                            {
                                                arraySkill && arraySkill.map((element, index) =>
                                                    <>
                                                        <tr style={{ height: '50px' }}>
                                                            <td>{index + 1}.</td>
                                                            <td style={{ width: "320px", padding: '5px' }}>
                                                                {
                                                                    <Input onChange={this.handleInput} type="select" name="skill" onBlur={e => { this.handleOnBlur(e, index) }}>
                                                                        {skills && skills.map((skill, i) => {
                                                                            return (
                                                                                <option value={i}>{skill.name}</option>
                                                                            )
                                                                        })}
                                                                    </Input>
                                                                }
                                                            </td>
                                                            <label>:</label>
                                                            <td style={{ padding: '5px' }}><Input onBlur={e => { this.handleOnBlur(e, index) }} onChange={this.handleInput} type="number" name="number" style={{ width: "170px" }}></Input></td>
                                                            <td><Button color="danger" onClick={() => this.deleteSkill(index)}>Xoá</Button></td>
                                                        </tr>
                                                    </>
                                                )
                                            }
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
                                        <Button onClick={() => this.handleSubmit()} type="submit" color="primary" block>Tạo bài đăng</Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="danger" block onClick={() => this.handleReset()} type="reset">Reset</Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="success" block onClick={() => this.handleDirect('/job_post_list_hr')}>Trở về</Button>
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

export default Add_Job;
