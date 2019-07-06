import React, { Component } from 'react';
import { ButtonGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';

class InformMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleDirect = (uri) => {
        this.props.history.push(uri);
    }

    render() {
        // const { searchValue } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card>
                            <CardHeader style={{ fontWeight: "bold" }}>
                                <i className="fa fa-align-justify"></i>Thông báo
                            </CardHeader>
                            <CardBody>
                                <Row style={{ paddingLeft: '90%' }}><Button color="primary" onClick={() => this.handleDirect('/InformMessage/Create_InformMessage')}>Soạn thông báo</Button></Row>
                                <br />
                                <div>
                                    <nav className="navbar navbar-light bg-light justify-content-between">
                                        <form className="form-inline">
                                            <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                        </form>
                                    </nav>
                                    <ListGroup>
                                        <ListGroupItem action onClick={() => this.handleDirect(`/InformMessage/InformMessage_Detail/${1}`)}>
                                            <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                                            <ListGroupItemText>
                                                Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                                        </ListGroupItemText>
                                        </ListGroupItem>
                                        <ListGroupItem action>
                                            <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                                            <ListGroupItemText>
                                                Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                                        </ListGroupItemText>
                                        </ListGroupItem>
                                        <ListGroupItem action>
                                            <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                                            <ListGroupItemText>
                                                Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                                        </ListGroupItemText>
                                        </ListGroupItem>
                                    </ListGroup>
                                </div>
                                <ToastContainer />
                                <Pagination>
                                    {/* <PaginationComponent pageNumber={pageNumber} handlePageNumber={this.handlePageNumber} handlePageNext={this.handlePageNext} handlePagePrevious={this.handlePagePrevious} currentPage={currentPage} /> */}
                                </Pagination>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default InformMessage;
