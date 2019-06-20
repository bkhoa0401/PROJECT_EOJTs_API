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


class Update_Job extends Component {

    constructor(props) {
        super(props);
        this.state = {
          arraySkill: ['Java', 'C#'],
          arrayQuantity: ['30', '20']
        };
        this.addRow = this.addRow.bind(this);
    }

    addRow() {
        this.setState({
            arraySkill:[...this.state.arraySkill,<input style={{width:"90px"}}></input>],
            arrayQuantity:[...this.state.arrayQuantity, ""],
        })
    }

    handleDirect = (uri) => {
    }

    render() {
        const{arraySkill, arrayQuantity} = this.state;
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
                                            <h6>Vị trí - Số lượng:</h6>
                                            <Button 
                                                style={{ fontWeight: "bold", borderColor:'#20a8d8', color: '#20a8d8', backgroundColor: 'white' }}
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
                                                <tr> 
                                                    <td style={{width:"110px"}}>{index +1}. {skill}:</td>
                                                    <td><input style={{width:"40px"}} placeholder={arrayQuantity[index]}></input></td>
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
                                <Row style={{textAlign:"center"}}>
                                    <Col xs="3" sm="3">
                                        <Button 
                                        style={{ fontWeight: "bold", borderColor:'#20a8d8', color: '#20a8d8', backgroundColor: 'white' }} 
                                        >
                                            Trở về
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button style={{ fontWeight: "bold"}} color="primary">Lưu</Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Update_Job;
