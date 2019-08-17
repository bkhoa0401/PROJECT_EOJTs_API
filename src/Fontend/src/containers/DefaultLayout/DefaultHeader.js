import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import decode from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Col, DropdownItem, Badge, DropdownMenu, DropdownToggle, FormGroup, Label, Nav, NavItem } from 'reactstrap';
import sygnet from '../../assets/img/brand/sygnet.svg';
import ApiServices from '../../service/api-service';


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      logo: null,
      role: '',
      linkProfile: '',
      informs: null,
      haveInform: false,
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('id_token');
    if (token !== null) {
      const decoded = decode(token);
      const email = decoded.email;
      const role = decoded.role;
      let actor = null;
      let username = '';
      let logo = null;
      let linkProfile = '';
      let informs = null;
      let haveInform = false;
      if (role === "ROLE_ADMIN" || role === "ROLE_STARTUP" || role === "ROLE_HEADTRAINING" || role === "ROLE_HEADMASTER") {
        if (role === "ROLE_ADMIN") {
          haveInform = true;
          informs = await ApiServices.Get(`/admin/eventsReceivedNotRead`);
        }
        actor = await ApiServices.Get(`/admin/getCurrentUser`);
        if (actor !== null) {
          username = actor.name;
          logo = actor.logo;
          linkProfile = `/account_detail`;
        }
      } else if (role === "ROLE_HR") {
        haveInform = true;
        informs = await ApiServices.Get(`/business/eventsReceivedNotRead`);
        actor = await ApiServices.Get(`/business/getBusiness`);
        if (actor !== null) {
          username = actor.business_eng_name;
          logo = actor.logo;
          linkProfile = `/Business_Detail/${actor.email}`;
        }
      } else if (role === "ROLE_SUPERVISOR") {
        let tmpActor = await ApiServices.Get(`/supervisor`);
        actor = tmpActor.supervisor;
        if (actor !== null) {
          username = actor.name;
          logo = actor.logo;
          linkProfile = `/account_detail`;
        }
      }
      this.setState({
        email: email,
        role: role,
        username: username,
        logo: logo,
        linkProfile: linkProfile,
        haveInform: haveInform,
        informs: informs,
      });
    }
  }

  handleShowString(stringFormat) {
    if (stringFormat.length > 18) {
      var finalString = stringFormat.substr(0, 18);
      finalString += "...";
      return finalString;
    } else {
      return stringFormat;
    }
  }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const { username, logo, linkProfile, haveInform, informs } = this.state;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: "https://firebasestorage.googleapis.com/v0/b/project-eojts.appspot.com/o/images%2FLOGO_FPT.png?alt=media&token=462172c4-bfb4-4ee6-a687-76bb1853f410", width: 155, height: 45, alt: 'EOJTs Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'EOJTs Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        {/* <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/users" className="nav-link">Users</Link>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link">Settings</NavLink>
          </NavItem>
        </Nav> */}
        <Nav className="ml-auto" navbar>
          <NavItem>
            <h6 className="nav-link" style={{ color: "Gray", fontWeight: 'bold' }}>Xin chào, {username}!&nbsp;&nbsp;</h6>
          </NavItem>
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          {/* <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              {logo === null ?
                <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" alt="usericon" /> :
                <img src={logo} className="img-avatar" alt={logo} />
              }
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem>
                <NavItem className="d-md-down-none">
                  <NavLink to={linkProfile} className="nav-link" style={{ color: "Gray" }}>
                    <FormGroup row>
                      <Col md="2" style={{ height: "7px" }}>
                        <i className="fa cui-user"></i>
                      </Col>
                      <Col md="9.5" style={{ height: "7px" }}>
                        &nbsp;&nbsp;Tài khoản
                      </Col>
                    </FormGroup>
                  </NavLink>
                </NavItem>
              </DropdownItem>
              <DropdownItem>
                <NavItem className="d-md-down-none">
                  <NavLink to="account/changepassword" className="nav-link" style={{ color: "Gray" }}>
                    <FormGroup row>
                      <Col md="2" style={{ height: "7px" }}>
                        <i className="fa cui-lock-locked"></i>
                      </Col>
                      <Col md="9.5" style={{ height: "7px" }}>
                        &nbsp;&nbsp;Đổi mật khẩu
                    </Col>
                    </FormGroup>
                  </NavLink>
                </NavItem>
              </DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <FormGroup row>
                  <Col md="2" style={{ height: "7px" }}>
                    <i className="fa cui-account-logout"></i>
                  </Col>
                  <Col md="9.5" style={{ height: "7px", color: "Gray" }}>
                    &nbsp;&nbsp;Đăng xuất
                  </Col>
                </FormGroup>
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
          {haveInform === true ?
            <AppHeaderDropdown direction="down">
              <DropdownToggle nav>
                <i className="icon-envelope-letter"></i><Badge pill color="primary">{informs === null ? "" : informs.length}</Badge>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header tag="div" className="text-center"><strong>Có {informs === null ? "" : informs.length} thông báo</strong></DropdownItem>
                <div style={{ width: "250px", maxHeight: "360px", overflowY: 'auto' }}>
                  {informs && informs.map((inform, index) => {
                    return (
                      <DropdownItem style={{ height: "90px" }}>
                        <NavItem className="d-md-down-none">
                          <NavLink to={`/InformMessage/InformMessage_Detail/${inform.event.id}`} className="nav-link">
                            <FormGroup row>
                              {inform.studentList && inform.studentList.map((student, index) => {
                                return (
                                  student.avatarLink === null ?
                                    <Col>&nbsp;&nbsp;<img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" alt="usericon" style={{ width: '30px', height: '30px' }} />&nbsp;&nbsp;{student.email}</Col> :
                                    <Col style={{ color: 'Gray', fontSize: '12px' }}>&nbsp;&nbsp;<img src={student.avatarLink} className="img-avatar" alt={student.avatarLink} style={{ width: '30px', height: '30px' }} />&nbsp;&nbsp;{student.email}</Col>
                                )
                              })}
                            </FormGroup>
                            <p style={{ fontWeight: 'bold', color: 'black', paddingTop: '0px', fontSize: '16px', textAlign: 'left' }}>{this.handleShowString(inform.event.description)}</p>
                          </NavLink>
                        </NavItem>
                      </DropdownItem>
                    )
                  })
                  }
                </div>
              </DropdownMenu>
            </AppHeaderDropdown> : <></>
          } */}
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
