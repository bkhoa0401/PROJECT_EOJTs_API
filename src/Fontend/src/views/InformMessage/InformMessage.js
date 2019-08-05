import decode from 'jwt-decode';
import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, FormGroup, Pagination, Row, TabContent, TabPane } from 'reactstrap';
import ApiServices from '../../service/api-service';
import SpinnerLoading from '../../spinnerLoading/SpinnerLoading';
import { async } from 'q';


class InformMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            informs: null,
            searchValue: '',
            activeTab: 0,
            role: '',
            viewSent: true,
        };
    }

    async componentDidMount() {
        const token = localStorage.getItem('id_token');
        let informs = null;
        let role = "";
        if (token !== null) {
            const decoded = decode(token);
            role = decoded.role;
            if (role === "ROLE_ADMIN") {
                informs = await ApiServices.Get('/admin/events');
            }
            if (role === "ROLE_HR") {
                informs = await ApiServices.Get('/business/events');
            }
        }
        if (informs !== null) {
            this.setState({
                loading: false,
                informs,
                role: role,
            });
        }
        // console.log(informs);
    }

    toggle = async (tab) => {
        const role = this.state.role;
        let informs = null;
        let viewSent = this.state.viewSent;
        if (this.state.activeTab !== tab) {
            if (tab === 0) {
                if (role === "ROLE_ADMIN") {
                    informs = await ApiServices.Get('/admin/events');
                    viewSent = true;
                }
                if (role === "ROLE_HR") {
                    informs = await ApiServices.Get('/business/events');
                    viewSent = true;
                }
            }
            if (tab === 1) {
                if (role === "ROLE_ADMIN") {
                    informs = await ApiServices.Get('/admin/eventsReceived');
                    viewSent = false;
                }
                if (role === "ROLE_HR") {
                    informs = await ApiServices.Get('/business/eventsReceived');
                    viewSent = false;
                }
            }
            this.setState({
                activeTab: tab,
                informs: informs,
            });
        }
    }

    handleInput = async (event) => {
        const { name, value } = event.target;
        await this.setState({
            [name]: value.substr(0, 20),
        })
    }

    handleDirect = async (uri, inform) => {
        let viewSent = this.state.viewSent;
        if (viewSent === false) {
            if (inform.read === false) {
                const result = await ApiServices.Put(`/event/setStateEvent?eventId=${inform.id}`);
                this.props.history.push(uri);
            }
        } else {
            this.props.history.push(uri);
        }
    }

    render() {
        const { loading, searchValue, informs, activeTab, viewSent } = this.state;
        let filteredListInforms;
        if (informs !== null) {
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
                                        <Row style={{ paddingLeft: '97%' }}><Button color="primary" onClick={() => this.handleDirect('/InformMessage/Create_InformMessage')}><i className="fa cui-pencil"></i></Button></Row>
                                        <FormGroup row>
                                            <Col style={{ textAlign: 'right', paddingRight: "0px" }}>
                                                {activeTab === 0 ?
                                                    <Button onClick={() => this.toggle(0)} color="primary" style={{ width: "250px", height: "40px", fontSize: "16px", fontWeight: 'bold' }}>Thông báo đã gửi</Button> :
                                                    <Button onClick={() => this.toggle(0)} outline color="primary" style={{ width: "250px", height: "40px", fontSize: "16px" }}>Thông báo đã gửi</Button>
                                                }
                                            </Col>
                                            <Col style={{ textAlign: 'left', paddingLeft: "0px" }}>
                                                {activeTab === 1 ?
                                                    <Button onClick={() => this.toggle(1)} color="primary" style={{ width: "250px", height: "40px", fontSize: "16px", fontWeight: 'bold' }}>Thông báo đã nhận</Button> :
                                                    <Button onClick={() => this.toggle(1)} outline color="primary" style={{ width: "250px", height: "40px", fontSize: "16px" }}>Thông báo đã nhận</Button>
                                                }
                                            </Col>
                                        </FormGroup>
                                        <div>
                                            <nav className="navbar navbar-light bg-light justify-content-between">
                                                <form className="form-inline">
                                                    <input onChange={this.handleInput} name="searchValue" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                                </form>
                                            </nav>
                                            <TabContent activeTab={this.state.activeTab} style={{ height: '400px', overflowY: 'scroll' }}>
                                                <TabPane tabId={0}>
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
                                                </TabPane>
                                                <TabPane tabId={1}>
                                                    <ListGroup>
                                                        {filteredListInforms && filteredListInforms.map((inform, index) => {
                                                            return (
                                                                inform.read === false ?
                                                                    <ListGroupItem tag="a" action onClick={() => this.handleDirect(`/InformMessage/InformMessage_Detail/${inform.id}`, inform)}>
                                                                        <ListGroupItemHeading style={{ fontWeight: 'bold' }}>{inform.title}</ListGroupItemHeading>
                                                                        <ListGroupItemText>
                                                                            {inform.description}
                                                                        </ListGroupItemText>
                                                                    </ListGroupItem> :
                                                                    <ListGroupItem tag="a" action style={{backgroundColor:'gainsboro'}} onClick={() => this.handleDirect(`/InformMessage/InformMessage_Detail/${inform.id}`, inform)}>
                                                                        <ListGroupItemHeading style={{ fontWeight: 'bold' }}>{inform.title}</ListGroupItemHeading>
                                                                        <ListGroupItemText>
                                                                            {inform.description}
                                                                        </ListGroupItemText>
                                                                    </ListGroupItem>
                                                            )
                                                        })}
                                                    </ListGroup>
                                                </TabPane>
                                            </TabContent>
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
