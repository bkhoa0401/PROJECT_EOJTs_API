import React, { Component } from 'react';
import { ButtonGroup, Input, Badge, Card, CardBody, CardHeader, CardFooter, Col, Pagination, Row, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ApiServices from '../../service/api-service';
import { ToastContainer } from 'react-toastify';
import decode from 'jwt-decode';
import Toastify from '../Toastify/Toastify';
import { getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber } from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';


class InformMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            informs: null,
            searchValue: '',
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let informs = null;
        if (token != null) {
            const decoded = decode(token);
            if (decoded.role == "ROLE_ADMIN") {
                informs = await ApiServices.Get('/admin/events');
            }
            if (decoded.role == "ROLE_HR") {
                informs = await ApiServices.Get('/business/events');
            }
        }
        if (informs != null) {
            this.setState({
                loading: false,
                informs,
            });
        }
        console.log(informs);
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
        const { loading, searchValue, informs } = this.state;
        let filteredListInforms;
        if (informs != null) {
            filteredListInforms = informs.filter(
                (inform) => {
                    if (inform.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                        return inform;
                    }
                }
            );
        }
        return (
            loading.toString() === 'true' ? (
                SpinnerLoading.showHashLoader(loading)
            ) : (
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
                                                {filteredListInforms && filteredListInforms.map((inform, index) => {
                                                    return (
                                                        <ListGroupItem tag="a" action onClick={() => this.handleDirect(`/InformMessage/InformMessage_Detail/${inform.id}`)}>
                                                            <ListGroupItemHeading style={{ fontWeight: 'bold' }}>{inform.title}</ListGroupItemHeading>
                                                            <ListGroupItemText>
                                                                {inform.description}
                                                            </ListGroupItemText>
                                                        </ListGroupItem>
                                                    )
                                                })}
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
                )
        );
    }
}

export default InformMessage;
