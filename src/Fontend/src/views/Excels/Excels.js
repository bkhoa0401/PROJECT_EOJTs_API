import React, { Component } from 'react';
import ApiServices from '../../service/api-service';
import {
    Button, Card, CardBody, CardFooter,
    CardHeader, Col, Form, FormGroup, Input, Label, Row, Pagination
} from 'reactstrap';
import { ExcelRenderer } from 'react-excel-renderer';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';

class Excels extends Component {

    constructor(props) {
        super(props);

        this.state = {
            files_Students: null,
            cols_Students: [],
            rows_Students: [],
            files_Businesses: null,
            cols_Businesses: [],
            rows_Businesses: [],
            pageNumber: 1,
            currentPage: 0,
            studentsPagination: null,
            pageNumberBus: 1,
            currentPageBus: 0,
            businessesPagination: null,
        }
    }


    handlePageNumber = (currentPage) => {
        const { rows_Students } = this.state;
        if (rows_Students != null) {
            const studentsPagination = rows_Students.slice(getPaginationCurrentPageNumber(currentPage), getPaginationNextPageNumber(currentPage));
            this.setState({
                studentsPagination,
                currentPage,
            })
        }
    }

    handlePagePrevious = (currentPage) => {
        const { rows_Students } = this.state;
        if (rows_Students != null) {
            const studentsPagination = rows_Students.slice(getPaginationCurrentPageNumber(currentPage), getPaginationNextPageNumber(currentPage));
            this.setState({
                studentsPagination,
                currentPage,
            })
        }
    }

    handlePageNext = (currentPage) => {
        const { rows_Students } = this.state;
        if (rows_Students != null) {
            const studentsPagination = rows_Students.slice(getPaginationCurrentPageNumber(currentPage), getPaginationNextPageNumber(currentPage));
            this.setState({
                studentsPagination,
                currentPage,
            })
        }
    }

    handlePageNumberBus = (currentPageBus) => {
        const { rows_Businesses } = this.state;
        if (rows_Businesses != null) {
            const businessesPagination = rows_Businesses.slice(getPaginationCurrentPageNumber(currentPageBus), getPaginationNextPageNumber(currentPageBus));
            this.setState({
                businessesPagination,
                currentPageBus,
            })
        }
    }

    handlePagePreviousBus = (currentPageBus) => {
        const { rows_Businesses } = this.state;
        if (rows_Businesses != null) {
            const businessesPagination = rows_Businesses.slice(getPaginationCurrentPageNumber(currentPageBus), getPaginationNextPageNumber(currentPageBus));
            this.setState({
                businessesPagination,
                currentPageBus,
            })
        }
    }

    handlePageNextBus = (currentPageBus) => {
        const { rows_Businesses } = this.state;
        if (rows_Businesses != null) {
            const businessesPagination = rows_Businesses.slice(getPaginationCurrentPageNumber(currentPageBus), getPaginationNextPageNumber(currentPageBus));
            this.setState({
                businessesPagination,
                currentPageBus,
            })
        }
    }


    handleSubmit = async (buttonName) => {
        const { rows_Students, rows_Businesses } = this.state;
        const listStudents = [];
        const listBusinesses = [];
        const role_student = [
            {
                id: 2
            }
        ];

        if (rows_Students.length != 0) {
            if (buttonName === 'Students') {

                rows_Students && rows_Students.map((student, index) => {
                    var student = {
                        studentCode: student[1],
                        password: 'default',
                        roles: role_student,
                        name: student[2],
                        email: student[3],
                        // specialized: student[4],
                        semester: student[5],
                        state: student[6],
                    };
                    listStudents.push(student);
                })

                console.log("LIST STUDENTS", listStudents);

                const result = await ApiServices.Post('/account', listStudents);
                if (result != null) {
                    // do something
                    Toastify.actionSuccess("Create Successfully!");
                } else {
                    Toastify.actionFail("Create Fail!");
                }
            }
        } else if (buttonName === 'Students') {
            Toastify.actionFail("No file choosen!");
        }

        if (rows_Businesses.length != 0) {
            if (buttonName === 'Businesses') {
                rows_Businesses && rows_Businesses.map((business, index) => {
                    let data = business[6];
                    let skillsAndNumber = [];
                    let skills_number = [];
                    const result = [];

                    skillsAndNumber = data.split("+");
                    skillsAndNumber && skillsAndNumber.map((element, index) => {
                        if (index > 0) {
                            skills_number = element.split(":");
                            const obj = {
                                skillName: skills_number[0].trim(),
                                number: skills_number[1].trim()
                            }
                            result.push(obj);
                        }
                    })

                    console.log("result", result);

                    var business = {
                        name: business[1],
                        englishName: business[2],
                        address: business[3],
                        website: business[4],
                        intershipAddress: business[5],
                        skills_number: result,
                        process: business[7],
                        contact: business[8],
                        businessOverview: business[9],
                        interest: business[10]
                    };
                    listBusinesses.push(business);
                })

                console.log("LIST BUSINESSES", listBusinesses);

                // const result = await ApiServices.Post('/User/testFontend', listBusinesses);
                // if (result) {
                //     Toastify.actionSuccess("Create Success!");

                // } else {
                //     Toastify.actionFail("Create Fail!");
                // }
            }
        } else if (buttonName === 'Businesses') {
            Toastify.actionFail("No file choosen!");
        }

    }

    removeFileStudents = (event) => {
        event.preventDefault();

        this.setState({
            files_Students: null,
            cols_Students: [],
            rows_Students: [],
        });
        document.getElementById("file_excel_students").value = ""
    }

    removeFileBusinesses = (event) => {
        event.preventDefault();

        this.setState({
            files_Businesses: null,
            cols_Businesses: [],
            rows_Businesses: [],
        });
        document.getElementById("file_excel_businesses").value = ""
    }

    fileStudentHandler = (event) => {
        let fileObj = event.target.files[0];
        if (fileObj != null) {
            var fileType = fileObj.type.toString();
        }

        let flag = true;
        var titles = ["No", "MSSV", "Họ Tên", "Email", "Specialized", "Semester", "State"];

        if (fileType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {

            ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let titlesExcel = resp.rows[0];

                    if (titlesExcel.length != 7) {
                        flag = false;
                    } else {
                        for (let i = 0; i < titles.length; i++) {
                            var areEqual = titles[i].toUpperCase() === titlesExcel[i].toUpperCase();
                            if (!areEqual) {
                                flag = false;
                                break;
                            }
                        }
                    }

                    if (!flag) {
                        document.getElementById("file_excel_students").value = "";
                        Toastify.actionWarning("Invalid file structure!");
                    } else {
                        const { currentPage } = this.state;
                        const pageNumber = getPaginationPageNumber(resp.rows.length - 1);
                        resp.rows.splice(0, 1);
                        const studentsPagination = resp.rows.slice(getPaginationCurrentPageNumber(currentPage), getPaginationNextPageNumber(currentPage));
                        this.setState({
                            files_Students: fileObj,
                            cols_Students: resp.cols,
                            rows_Students: resp.rows,
                            pageNumber,
                            studentsPagination,
                        });
                    }
                }
            });

        } else {
            Toastify.actionWarning("Please import the excel file!");
            document.getElementById("file_excel_students").value = "";
        }
    }

    fileBusinessHandler = (event) => {
        let fileObj = event.target.files[0];
        if (fileObj != null) {
            var fileType = fileObj.type.toString();
        }

        let flag = true;
        var titles = ["STT", "Doanh Nghiệp", "Tên Tiếng Anh", "Địa chỉ Công ty", "Website", "Địa chỉ nơi SV sẽ thực tập", "Vị trí - Số lượng",
            "Quy trình tuyển", "Liên hệ", "Giới thiệu công ty", "Chính sách ưu đãi"];

        if (fileType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {

            ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let titlesExcel = resp.rows[0];

                    if (titlesExcel.length != 11) {
                        flag = false;
                    } else {
                        for (let i = 0; i < titles.length; i++) {
                            var areEqual = titles[i].toUpperCase() === titlesExcel[i].toUpperCase();
                            if (!areEqual) {
                                flag = false;
                                break;
                            }
                        }
                    }

                    if (!flag) {
                        document.getElementById("file_excel_businesses").value = "";
                        Toastify.actionWarning("Invalid file structure!");
                    } else {
                        const { currentPageBus } = this.state;
                        const pageNumberBus = getPaginationPageNumber(resp.rows.length - 1);
                        resp.rows.splice(0, 1);
                        const businessesPagination = resp.rows.slice(getPaginationCurrentPageNumber(currentPageBus), getPaginationNextPageNumber(currentPageBus));
                        this.setState({
                            files_Businesses: fileObj,
                            cols_Businesses: resp.cols,
                            rows_Businesses: resp.rows,
                            pageNumberBus,
                            businessesPagination,
                        });
                    }
                }
            });

        } else {
            Toastify.actionWarning("Please import the excel file!");
            document.getElementById("file_excel_businesses").value = "";
        }
    }

    rowStudentEdited = async (event) => {
        let rowId = event.target.id;
        let tmp = event.target.id.split("-");
        let dataChanged = await document.getElementById(rowId).innerHTML;
        let rowNumber = tmp[1];
        let colNumber = tmp[2];

        var { rows_Students } = this.state;

        rows_Students[rowNumber][colNumber] = dataChanged;
    }

    rowBusinessEdited = async (event) => {
        let rowId = event.target.id;
        let tmp = event.target.id.split("-");
        let dataChanged = await document.getElementById(rowId).innerHTML;
        let rowNumber = tmp[1];
        let colNumber = tmp[2];

        var { rows_Businesses } = this.state;

        rows_Businesses[rowNumber][colNumber] = dataChanged;

    }

    render() {
        const { files_Students, rows_Students, files_Businesses, rows_Businesses } = this.state;
        const { studentsPagination, pageNumber, currentPage } = this.state;
        const { businessesPagination, pageNumberBus, currentPageBus } = this.state;

        return (

            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Import List Students</strong>
                                <a style={{ marginLeft: "680px" }} href="https://docs.google.com/spreadsheets/d/1IhCjD28uZRiPl5fhJk2RomAej9JkqKLqm3wZok6rgoM/export?format=xlsx" download>Download template list students</a>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col xs="10" md="10">
                                            <form encType="multipart/form-data" method="post" action="">
                                                <input type="file" multiple id="file_excel_students" name="fileName" onChange={this.fileStudentHandler.bind(this)}></input>
                                                {files_Students && (
                                                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                                        <button onClick={this.removeFileStudents}>Remove File</button>
                                                        <br />
                                                    </div>
                                                )}
                                            </form>
                                        </Col>
                                        {files_Students && (

                                            <table class="table table-bordered table-hover" style={{ textAlign: "center" }}>
                                                <thead>
                                                    <th>No</th>
                                                    <th>MSSV</th>
                                                    <th>Họ Tên</th>
                                                    <th>Email</th>
                                                    <th>Specialized</th>
                                                    <th>Semester</th>
                                                    <th>State</th>
                                                </thead>
                                                <tbody>
                                                    {
                                                        studentsPagination && studentsPagination.map((student, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{student[0]}</td>
                                                                    <td id={"s-" + index + "-1"} onKeyUp={this.rowStudentEdited}>{student[1]}</td>
                                                                    <td id={"s-" + index + "-2"} onKeyUp={this.rowStudentEdited}>{student[2]}</td>
                                                                    <td id={"s-" + index + "-3"} onKeyUp={this.rowStudentEdited}>{student[3]}</td>
                                                                    <td id={"s-" + index + "-4"} onKeyUp={this.rowStudentEdited}>{student[4]}</td>
                                                                    <td id={"s-" + index + "-5"} onKeyUp={this.rowStudentEdited}>{student[5]}</td>
                                                                    <td id={"s-" + index + "-6"} onKeyUp={this.rowStudentEdited}>{student[6]}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        )}
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
                                <Pagination>
                                    <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} />
                                </Pagination>
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitStudents" onClick={() => this.handleSubmit('Students')} type="submit" color="primary" block>Submit</Button>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Import List Bussiness</strong>
                                <a style={{ marginLeft: "680px" }} href="https://docs.google.com/spreadsheets/d/1qZMlxWND3qVvLzO1muLyeFP0xwJbIE-6xVKgObIbGTE/export?format=xlsx" download>Download template list businesses</a>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col xs="10" md="10">
                                            <form encType="multipart/form-data" method="post" action="">
                                                <input type="file" multiple id="file_excel_businesses" name="fileName" onChange={this.fileBusinessHandler.bind(this)}></input>
                                                {files_Businesses && (
                                                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                                        <button onClick={this.removeFileBusinesses}>Remove File</button>
                                                    </div>
                                                )}
                                            </form>
                                        </Col>

                                        {files_Businesses && (
                                            <div style={{ overflowX: "auto" }}>
                                                <table class="table table-bordered table-hover" style={{ textAlign: "center" }}>
                                                    <thead>
                                                        <th style={{whiteSpace: "nowrap"}}>STT</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Doanh nghiệp</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Tên tiếng Anh</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Địa chỉ công ty</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Website</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Địa chỉ SV sẽ thực tập</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Vị trí - Số lượng</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Quy trình tuyển</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Liên hệ</th>
                                                        <th style={{whiteSpace: "nowrap"}}>Giới thiệu công ty</th>
                                                        <th style={{whiteSpace: "nowrap"}}  >Chính sách ưu đãi</th>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            businessesPagination && businessesPagination.map((business, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td style={{whiteSpace: "nowrap"}}>{business[0]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-1"} onKeyUp={this.rowBusinessEdited}>{business[1]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-2"} onKeyUp={this.rowBusinessEdited}>{business[2]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-3"} onKeyUp={this.rowBusinessEdited}>{business[3]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-4"} onKeyUp={this.rowBusinessEdited}>{business[4]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-5"} onKeyUp={this.rowBusinessEdited}>{business[5]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-6"} onKeyUp={this.rowBusinessEdited}>{business[6]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-7"} onKeyUp={this.rowBusinessEdited}>{business[7]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-8"} onKeyUp={this.rowBusinessEdited}>{business[8]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-9"} onKeyUp={this.rowBusinessEdited}>{business[9]}</td>
                                                                        <td style={{whiteSpace: "nowrap"}} id={"b-" + index + "-10"} onKeyUp={this.rowBusinessEdited}>{business[10]}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </FormGroup>
                                </Form>
                                <Pagination>
                                    <PaginationComponent pageNumber={pageNumberBus} handlePageNumber={this.handlePageNumberBus} handlePageNext={this.handlePageNextBus} handlePagePrevious={this.handlePagePreviousBus} currentPage={currentPageBus} />
                                </Pagination>
                            </CardBody>
                            <CardFooter className="p-4">
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button id="submitBusinesses" onClick={() => this.handleSubmit('Businesses')} type="submit" color="primary" block>Submit</Button>
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

export default Excels;
