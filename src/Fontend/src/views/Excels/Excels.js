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
import { async } from 'q';
import firebase from 'firebase';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Excels extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
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

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    handleConfirm = (listIndexNotFound) => {
        var skill = '';

        for (let i = 0; i < listIndexNotFound.length; i++) {
            if (i  + 1 != listIndexNotFound.length) {
                skill = skill + ' ' + listIndexNotFound[i] + ', ';
            } else {
                skill = skill + ' ' + listIndexNotFound[i];
            }
        }

        confirmAlert({
            title: 'Lưu ý',
            message: `Những kỹ năng: ${skill} chưa tồn tại trong hệ thống!
            Vui lòng thêm mới những kỹ năng này và thử lại sau!`,
            buttons: [
                {
                    label: 'Tạo mới kỹ năng',
                    onClick: () => this.handleDirect('/skill/create')
                },
                {
                    label: 'Hủy bỏ',
                }
            ]
        });
    };


    handleSubmit = async (buttonName) => {
        const { rows_Students, rows_Businesses } = this.state;
        const listStudents = [];
        const listBusinesses = [];
        const listNameSkill = [], listIndexNotFound = [];

        if (rows_Students.length != 0) {
            this.setState({
                loading: true
            })
            if (buttonName === 'Students') {

                rows_Students && rows_Students.map((student, index) => {
                    var tmp = student[4];
                    let gender;
                    if (tmp.toLowerCase() === 'nam') {
                        gender = 1
                    } else if (tmp.toLowerCase() === 'nữ') {
                        gender = 0
                    }
                    var student = {
                        code: student[1],
                        name: student[2],
                        dob: student[3],
                        gender: gender,
                        phone: student[5],
                        email: student[6],
                        address: student[7],
                        specialized: {
                            name: student[8]
                        },
                        semester: student[9],
                        gpa: student[10]
                    };
                    listStudents.push(student);
                })

                console.log("LIST STUDENTS", listStudents);

                const resultStudents = await ApiServices.Post('/student', listStudents);
                if (resultStudents.status == 201) {
                    this.setState({
                        loading: false
                    })
                    Toastify.actionSuccess("Thêm tệp thành công!");
                } else {
                    this.setState({
                        loading: false
                    })
                    Toastify.actionFail("Thêm tệp thất bại!");
                }

                var currentTime = new Date();

                var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
                var date = month + '-' + currentTime.getDate() + '-' + currentTime.getFullYear();
                var time = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();

                var database = firebase.database();
                var ref = database.ref('Users');

                for (let i = 0; i < listStudents.length; i++) {
                    var usersRef = ref.child(`${listStudents[i].code}`);
                    usersRef.set({
                        userState: {
                            date: date,
                            time: time,
                            type: 'offline'
                        }
                    });
                }
            }
        } else if (buttonName === 'Students') {
            Toastify.actionFail("Không tệp nào được chọn!");
        }

        if (rows_Businesses.length != 0) {
            if (buttonName === 'Businesses') {
                rows_Businesses && rows_Businesses.map((business, index) => {
                    let data = business[8];
                    let skillsAndNumber = [];
                    let skills_number = [];
                    const result = [];
                    var obj = {};

                    skillsAndNumber = data.split("+");
                    skillsAndNumber && skillsAndNumber.map(async (element, index) => {
                        if (index > 0) {
                            skills_number = element.split(":");
                            var name = skills_number[0].trim();
                            var number = skills_number[1].trim();

                            if (listNameSkill.indexOf(name) == -1) {
                                listNameSkill.push(name);
                            }
                            // const id = await ApiServices.Get(`/student/skill?nameSkill=${name}`);
                            // console.log(id);
                            obj = {
                                skill: {
                                    id: 0,
                                },
                                name: name,
                                number: number
                            }
                            result.push(obj);
                        }
                    })

                    var business = {
                        email: business[3],
                        business_address: business[5],
                        business_overview: business[12],
                        business_eng_name: business[2],
                        business_name: business[1],
                        business_website: business[6],
                        business_phone: business[4],
                        logo: business[14],
                        contact: business[10],
                        description: business[11],
                        interest: business[13],
                        interview_process: business[9],
                        time_post: '',
                        views: 0,
                        nameSemester: business[15],
                        skillDTOList: result
                    };
                    listBusinesses.push(business);

                })

                console.log('listNameSkill', listNameSkill);
                const skillsNotExisted = await ApiServices.Post('/skill/isExisted', listNameSkill);
                if (skillsNotExisted.status == 200) {
                    const data = await skillsNotExisted.json();
                    for (let k = 0; k < data.length; k++) {
                        if (data[k].name !== '') {
                            listIndexNotFound.push(data[k].name);
                        }
                    }
                }

                console.log("listIndexNotFound", listIndexNotFound);

                if (listIndexNotFound.length != 0) {
                    this.setState({
                        loading: false
                    })
                    this.handleConfirm(listIndexNotFound);
                } else {
                    this.setState({
                        loading: true
                    })
                    console.log("LIST BUSINESSES", listBusinesses);

                    // const result = await ApiServices.Post('/business', listBusinesses);
                    // if (result.status == 201) {
                    //     this.setState({
                    //         loading: false
                    //     })
                    //     Toastify.actionSuccess("Thêm tệp thành công!");

                    // } else {
                    //     this.setState({
                    //         loading: false
                    //     })
                    //     Toastify.actionFail("Thêm tệp thất bại!");
                    // }
                }

                // setTimeout(
                //     function () {
                //         this.setState({
                //             loading: false
                //         })
                //         Toastify.actionSuccess("Thêm tệp thành công!");
                //     }
                //         .bind(this),
                //     5000
                // );
            }
        } else if (buttonName === 'Businesses') {
            Toastify.actionFail("Không tệp nào được chọn!");
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
        var titles = ["STT", "MSSV", "Họ Tên", "Ngày sinh", "Giới tính", "SĐT", "Email", "Địa chỉ", "Ngành học", "Kì", "GPA"];

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
                        document.getElementById("file_excel_students").value = "";
                        Toastify.actionWarning("Cấu trúc file không hợp lệ!");
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
            Toastify.actionWarning("Xin hãy nhập file excel!");
            document.getElementById("file_excel_students").value = "";
        }
    }

    fileBusinessHandler = (event) => {
        let fileObj = event.target.files[0];
        if (fileObj != null) {
            var fileType = fileObj.type.toString();
        }

        let flag = true;
        var titles = ["STT", "Doanh Nghiệp", "Tên Tiếng Anh", "Email", "SĐT", "Địa chỉ Công ty", "Website", "Địa chỉ nơi SV sẽ thực tập", "Vị trí - Số lượng",
            "Quy trình tuyển", "Liên hệ", "Mô tả", "Giới thiệu công ty", "Chính sách ưu đãi", "Logo", "Kì"];

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
                        Toastify.actionWarning("Cấu trúc file không hợp lệ!");
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
            Toastify.actionWarning("Xin hãy nhập file excel");
            document.getElementById("file_excel_businesses").value = "";
        }
    }

    // rowStudentEdited = async (event) => {
    //     let rowId = event.target.id;
    //     let tmp = event.target.id.split("-");
    //     let dataChanged = await document.getElementById(rowId).innerHTML;
    //     let rowNumber = tmp[1];
    //     let colNumber = tmp[2];

    //     var { rows_Students } = this.state;

    //     rows_Students[rowNumber][colNumber] = dataChanged;
    // }

    // rowBusinessEdited = async (event) => {
    //     let rowId = event.target.id;
    //     let tmp = event.target.id.split("-");
    //     let dataChanged = await document.getElementById(rowId).innerHTML;
    //     let rowNumber = tmp[1];
    //     let colNumber = tmp[2];

    //     var { rows_Businesses } = this.state;

    //     rows_Businesses[rowNumber][colNumber] = dataChanged;

    // }

    render() {
        const { files_Students, rows_Students, files_Businesses, rows_Businesses, loading } = this.state;
        const { studentsPagination, pageNumber, currentPage } = this.state;
        const { businessesPagination, pageNumberBus, currentPageBus } = this.state;

        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
                    // return (
                    <div className="animated fadeIn">
                        <Row>
                            <Col xs="12" sm="12">
                                <Card>
                                    <CardHeader>
                                        <strong>Thêm danh sách sinh viên</strong>
                                        <a style={{ marginLeft: "650px" }} href="https://docs.google.com/spreadsheets/d/1KHfCbg-Rr6Qii8gtJSLNWwBR3VWGN6OY/export?format=xlsx" download>Tải bản mẫu danh sách sinh viên</a>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col xs="10" md="10">
                                                    <form encType="multipart/form-data" method="post" action="">
                                                        <input type="file" multiple id="file_excel_students" name="fileName" onChange={this.fileStudentHandler.bind(this)}></input>
                                                        {files_Students && (
                                                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                                                <button onClick={this.removeFileStudents}>Xóa file</button>
                                                                <br />
                                                            </div>
                                                        )}
                                                    </form>
                                                </Col>
                                                {files_Students && (

                                                    <table class="table table-bordered table-hover" style={{ textAlign: "center" }}>
                                                        <thead>
                                                            <th>STT</th>
                                                            <th>MSSV</th>
                                                            <th>Họ Tên</th>
                                                            <th>Ngày sinh</th>
                                                            <th>Giới tính</th>
                                                            <th>SĐT</th>
                                                            <th>Email</th>
                                                            <th>Địa chỉ</th>
                                                            <th>Ngành học</th>
                                                            <th>Kì</th>
                                                            <th>GPA</th>
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
                                                                            <td id={"s-" + index + "-7"} onKeyUp={this.rowStudentEdited}>{student[7]}</td>
                                                                            <td id={"s-" + index + "-8"} onKeyUp={this.rowStudentEdited}>{student[8]}</td>
                                                                            <td id={"s-" + index + "-9"} onKeyUp={this.rowStudentEdited}>{student[9]}</td>
                                                                            <td id={"s-" + index + "-10"} onKeyUp={this.rowStudentEdited}>{student[10]}</td>
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
                                                <Button id="submitStudents" onClick={() => this.handleSubmit('Students')} type="submit" color="primary" block>Xác nhận</Button>
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
                                        <strong>Thêm danh sách doanh nghiệp</strong>
                                        <a style={{ marginLeft: "590px" }} href="https://docs.google.com/spreadsheets/d/174pKjfX-eboXL_78sGueXhOyYYjkN5oH/export?format=xlsx" download>Tải bản mẫu danh sách doanh nghiệp</a>
                                    </CardHeader>
                                    <CardBody>
                                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                            <FormGroup row>
                                                <Col xs="10" md="10">
                                                    <form encType="multipart/form-data" method="post" action="">
                                                        <input type="file" multiple id="file_excel_businesses" name="fileName" onChange={this.fileBusinessHandler.bind(this)}></input>
                                                        {files_Businesses && (
                                                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                                                <button onClick={this.removeFileBusinesses}>Xóa file</button>
                                                            </div>
                                                        )}
                                                    </form>
                                                </Col>

                                                {files_Businesses && (
                                                    <div style={{ overflowX: "auto" }}>
                                                        <table class="table table-bordered table-hover" style={{ textAlign: "center" }}>
                                                            <thead>
                                                                <th style={{ whiteSpace: "nowrap" }}>STT</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Doanh nghiệp</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Tên tiếng Anh</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Email</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>SĐT</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Địa chỉ công ty</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Website</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Địa chỉ SV sẽ thực tập</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Vị trí - Số lượng</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Quy trình tuyển</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Liên hệ</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Mô tả</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Giới thiệu công ty</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Chính sách ưu đãi</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Logo</th>
                                                                <th style={{ whiteSpace: "nowrap" }}>Kì</th>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    businessesPagination && businessesPagination.map((business, index) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td style={{ whiteSpace: "nowrap" }}>{business[0]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-1"} onKeyUp={this.rowBusinessEdited}>{business[1]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-2"} onKeyUp={this.rowBusinessEdited}>{business[2]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-3"} onKeyUp={this.rowBusinessEdited}>{business[3]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-4"} onKeyUp={this.rowBusinessEdited}>{business[4]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-5"} onKeyUp={this.rowBusinessEdited}>{business[5]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-6"} onKeyUp={this.rowBusinessEdited}>{business[6]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-7"} onKeyUp={this.rowBusinessEdited}>{business[7]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-8"} onKeyUp={this.rowBusinessEdited}>{business[8]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-9"} onKeyUp={this.rowBusinessEdited}>{business[9]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-10"} onKeyUp={this.rowBusinessEdited}>{business[10]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-11"} onKeyUp={this.rowBusinessEdited}>{business[11]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-12"} onKeyUp={this.rowBusinessEdited}>{business[12]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-13"} onKeyUp={this.rowBusinessEdited}>{business[13]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-14"} onKeyUp={this.rowBusinessEdited}>{business[14]}</td>
                                                                                <td style={{ whiteSpace: "nowrap" }} id={"b-" + index + "-15"} onKeyUp={this.rowBusinessEdited}>{business[15]}</td>
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
                                                <Button id="submitBusinesses" onClick={() => this.handleSubmit('Businesses')} type="submit" color="primary" block>Xác nhận</Button>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
            // )
        )
    }
}

export default Excels;
