import React, { Component } from 'react';
import ApiServices from '../../service/api-service';
import {
    Button, Card, CardBody, CardFooter,
    CardHeader, Col, Form, FormGroup, Input, Label, Row
} from 'reactstrap';
import { ExcelRenderer } from 'react-excel-renderer';
import { ToastContainer } from 'react-toastify';
import Toastify from '../../views/Toastify/Toastify';

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
        }
    }


    handleSubmit = async (buttonName) => {
        const { rows_Students, rows_Businesses } = this.state;
        const listStudents = [];
        const listBusinesses = [];

        if (rows_Students.length != 0) {
            if (buttonName === 'Students') {
                rows_Students && rows_Students.map((student, index) => {

                    if (index > 0) {
                        var student = {
                            studentCode: student[1],
                            password: 'default',
                            role: 2,
                            name: student[2],
                            email: student[3],
                            specialized: student[4],
                            semester: student[5],
                            state: student[6],
                        };
                        listStudents.push(student);
                    }
                })

                console.log("LIST STUDENTS", listStudents);

                const result = await ApiServices.Post('/account', listStudents);
                console.log(result);
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
                    if (index > 0) {
                        var business = {
                            name: business[1],
                            englishName: business[2],
                            address: business[3],
                            website: business[4],
                            intershipAddress: business[5],
                            se: business[6],
                            is: business[7],
                            gd: business[8],
                            ba: business[9],
                            ib: business[10],
                            japanese: business[11],
                            english: business[12],
                            description: business[13],
                            process: business[14],
                            contact: business[15],
                        };
                        listBusinesses.push(business);
                    }
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
                        this.setState({
                            files_Students: fileObj,
                            cols_Students: resp.cols,
                            rows_Students: resp.rows,
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
        var titles = ["STT", "Doanh Nghiệp", "Tên Tiếng Anh", "Địa chỉ Công ty", "Website", "Địa chỉ nơi SV sẽ thực tập", "KTPM",
            "ATTT", "Thiết kế đồ hoạ", "Quản trị kinh doanh", "Kinh doanh quốc tế", "Ngôn ngữ Nhật", "Ngôn ngữ Anh", "Mô tả công việc",
            "Quy trình tuyển", "Liên hệ"];

        if (fileType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {

            ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let titlesExcel = resp.rows[0];

                    if (titlesExcel.length != 16) {
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
                        this.setState({
                            files_Businesses: fileObj,
                            cols_Businesses: resp.cols,
                            rows_Businesses: resp.rows,
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

    // download = () => {
    //     var element = document.createElement('form_students');
    //     element.style.display = 'none';
    //     element.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' + encodeURIComponent(this.state.files_Students));
    //     element.setAttribute('download', "Form_Student");
    //     document.body.appendChild(element);
    //     element.click();
    //     document.body.removeChild(element);
    // }

    render() {
        const { files_Students, rows_Students, files_Businesses, rows_Businesses } = this.state;

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
                                                <tbody>
                                                    {
                                                        rows_Students && rows_Students.map((student, index) => {
                                                            if (index == 0) {
                                                                return (
                                                                    <tr key={index}>
                                                                        <th>{student[0]}</th>
                                                                        <th>{student[1]}</th>
                                                                        <th>{student[2]}</th>
                                                                        <th>{student[3]}</th>
                                                                        <th>{student[4]}</th>
                                                                        <th>{student[5]}</th>
                                                                        <th>{student[6]}</th>
                                                                    </tr>
                                                                )
                                                            }
                                                            if (index > 0) {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{student[0]}</td>
                                                                        <td id={"s-" + index + "-1"} contentEditable="true" onKeyUp={this.rowStudentEdited}>{student[1]}</td>
                                                                        <td id={"s-" + index + "-2"} contentEditable="true" onKeyUp={this.rowStudentEdited}>{student[2]}</td>
                                                                        <td id={"s-" + index + "-3"} contentEditable="true" onKeyUp={this.rowStudentEdited}>{student[3]}</td>
                                                                        <td id={"s-" + index + "-4"} contentEditable="true" onKeyUp={this.rowStudentEdited}>{student[4]}</td>
                                                                        <td id={"s-" + index + "-5"} contentEditable="true" onKeyUp={this.rowStudentEdited}>{student[5]}</td>
                                                                        <td id={"s-" + index + "-6"} contentEditable="true" onKeyUp={this.rowStudentEdited}>{student[6]}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        )}
                                    </FormGroup>
                                </Form>
                                <ToastContainer />
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
                                                    <tbody>
                                                        {
                                                            rows_Businesses && rows_Businesses.map((business, index) => {
                                                                if (index == 0) {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <th>{business[0]}</th>
                                                                            <th>{business[1]}</th>
                                                                            <th>{business[2]}</th>
                                                                            <th>{business[3]}</th>
                                                                            <th>{business[4]}</th>
                                                                            <th>{business[5]}</th>
                                                                            <th>{business[6]}</th>
                                                                            <th>{business[7]}</th>
                                                                            <th>{business[8]}</th>
                                                                            <th>{business[9]}</th>
                                                                            <th>{business[10]}</th>
                                                                            <th>{business[11]}</th>
                                                                            <th>{business[12]}</th>
                                                                            <th>{business[13]}</th>
                                                                            <th>{business[14]}</th>
                                                                            <th>{business[15]}</th>
                                                                        </tr>
                                                                    )
                                                                }
                                                                if (index > 0) {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{business[0]}</td>
                                                                            <td id={"b-" + index + "-1"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[1]}</td>
                                                                            <td id={"b-" + index + "-2"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[2]}</td>
                                                                            <td id={"b-" + index + "-3"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[3]}</td>
                                                                            <td id={"b-" + index + "-4"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[4]}</td>
                                                                            <td id={"b-" + index + "-5"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[5]}</td>
                                                                            <td id={"b-" + index + "-6"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[6]}</td>
                                                                            <td id={"b-" + index + "-7"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[7]}</td>
                                                                            <td id={"b-" + index + "-8"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[8]}</td>
                                                                            <td id={"b-" + index + "-9"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[9]}</td>
                                                                            <td id={"b-" + index + "-10"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[10]}</td>
                                                                            <td id={"b-" + index + "-11"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[11]}</td>
                                                                            <td id={"b-" + index + "-12"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[12]}</td>
                                                                            <td id={"b-" + index + "-13"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[13]}</td>
                                                                            <td id={"b-" + index + "-14"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[14]}</td>
                                                                            <td id={"b-" + index + "-15"} contentEditable="true" onKeyUp={this.rowBusinessEdited}>{business[15]}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>

                                        )}
                                    </FormGroup>
                                </Form>
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
