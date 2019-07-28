import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Col, FormGroup, Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import decode from 'jwt-decode';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
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
      role:'',
      linkProfile:'',
    }
  }

  async componentDidMount() {
    const token = localStorage.getItem('id_token');
    if (token != null) {
      const decoded = decode(token);
      const email = decoded.email;
      const role = decoded.role;
      let actor = null;
      let username = '';
      let logo = null;
      let linkProfile = '';
      if (role == "ROLE_ADMIN" || role == "ROLE_STARTUP" || role == "ROLE_HEADTRAINING" || role == "ROLE_HEADMASTER") {
        actor = await ApiServices.Get(`/admin/getCurrentUser`);
        if (actor != null) {
          username = actor.name;
          logo = actor.logo;
          linkProfile = `/account_detail`;
        }
      } else if (role == "ROLE_HR") {
        actor = await ApiServices.Get(`/business/getBusiness`);
        if (actor != null) {
          username = actor.business_eng_name;
          logo = actor.logo;
          linkProfile = `/Business_Detail/${actor.email}`;
        }
      } else if (role == "ROLE_SUPERVISOR") {
        let tmpActor = await ApiServices.Get(`/supervisor`);
        actor = tmpActor.supervisor;
        if (actor != null) {
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
      });
    }
  }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const { username, logo, linkProfile } = this.state;

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
            <h6 className="nav-link" style={{ color: "Gray", fontWeight:'bold'}}>Xin chào, {username}!&nbsp;&nbsp;</h6>
          </NavItem>
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem> */}
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              {logo === null ? 
                <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" alt="usericon" /> :
                <img src={logo} className="img-avatar" alt={logo} />
              }
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              {/* <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem> */}
              {/* <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem> */}
              <DropdownItem>
                <FormGroup row>
                  <Col md="2" style={{ height: "7px" }}>
                    <i className="fa cui-user"></i>
                  </Col>
                  <Col md="9.5" style={{ height: "7px" }}>
                    <NavItem>
                      <NavLink to={linkProfile} className="nav-link" style={{ color: "Gray" }}>&nbsp;&nbsp;Tài khoản</NavLink>
                    </NavItem>
                  </Col>
                </FormGroup>
              </DropdownItem>
              <DropdownItem>
                <FormGroup row>
                  <Col md="2" style={{ height: "7px" }}>
                    <i className="fa cui-pencil"></i>
                  </Col>
                  <Col md="9.5" style={{ height: "7px" }}>
                    <NavItem>
                      <NavLink to="account/changepassword" className="nav-link" style={{ color: "Gray" }}>&nbsp;&nbsp;Đổi mật khẩu</NavLink>
                    </NavItem>
                  </Col>
                </FormGroup>
              </DropdownItem>
              {/* <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem> */}
              {/* <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
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
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
