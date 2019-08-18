import React, { Component } from 'react';
import { Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup, ListGroupItem, DropdownItem, FormGroup, Col, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { AppSwitch } from '@coreui/react';
import decode from 'jwt-decode';
import ApiServices from '../../service/api-service';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultAside extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      logo: null,
      role: '',
      linkProfile: '',
      informs: null,
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
      if (role === "ROLE_ADMIN" || role === "ROLE_STARTUP" || role === "ROLE_HEADTRAINING" || role === "ROLE_HEADMASTER") {
        if (role === "ROLE_ADMIN") {
          informs = await ApiServices.Get(`/admin/eventsReceivedNotRead`);
        }
        actor = await ApiServices.Get(`/admin/getCurrentUser`);
        if (actor !== null) {
          username = actor.name;
          logo = actor.logo;
          linkProfile = `/account_detail`;
        }
      } else if (role === "ROLE_HR") {
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
    const { informs } = this.state;
    // console.log(informs);
    return (
      <React.Fragment>
        <ListGroup className="list-group-accent" tag={'div'}>
          <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Thông báo đến</ListGroupItem>
          <ListGroupItem action tag="a" href={`/#/InformMessage`} className="list-group-item-accent-secondary text-center font-weight-bold list-group-item-divider" style={{fontSize:'12px', color:'DeepSkyBlue', textDecoration:'underline'}}>Đến trang thông báo</ListGroupItem>
          {informs && informs.map((inform, index) => {
            return(
            <ListGroupItem action tag="a" href={`/#/InformMessage/InformMessage_Detail/${inform.event.id}`} className="list-group-item-accent-danger list-group-item-divider">
              {inform.studentList && inform.studentList.map((student, index) => {
                return (
                  student.avatarLink === null ?
                    <>
                      <div className="avatar float-right">
                        <img src={'../../assets/img/avatars/usericon.png'} className="img-avatar" alt="usericon" style={{ width: '30px', height: '30px' }} />
                      </div>
                      <div><strong>{student.name}</strong><br/> {this.handleShowString(inform.event.description)} </div></> :
                    <>
                      <div className="avatar float-right">
                        <img src={student.avatarLink} className="img-avatar" alt={student.avatarLink} style={{ width: '30px', height: '30px' }} />
                      </div>
                      <div><strong>{student.name}</strong><br/> {this.handleShowString(inform.event.description)} </div>
                    </>
                )
              })}
            </ListGroupItem>
            )
          })}
        </ListGroup>
      </React.Fragment>
    );
  }
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default DefaultAside;
