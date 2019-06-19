import React, {Component} from 'react';
import {Badge, Card, CardBody, CardHeader, Col, Pagination, Row, Table} from 'reactstrap';
import {Button} from 'reactstrap';
import ApiServices from '../../service/api-service';
import {ToastContainer} from 'react-toastify';
import orderBy from "lodash/orderBy";
import Toastify from '../../views/Toastify/Toastify';
import {
  getPaginationPageNumber,
  getPaginationNextPageNumber,
  getPaginationCurrentPageNumber
} from '../../service/common-service';
import PaginationComponent from '../Paginations/pagination';

const invertDirection = {
  asc: 'desc',
  desc: 'asc'
};
const btnMission = {
  color: 'white',
  backgroundColor: '#00BFFF',
  borderRadius: '25px',
};
const btnSave = {
  color: 'white',
  backgroundColor: '#00BFFF',
  borderRadius: '5px',
  marginRight: '200px',
  width: '80px',
  height: '40px'
};

const divSelcectSpecilized = {
  textAlign: 'center',
}

const selcectSpecilized = {
  width: '200px'
}

const btnChoose = {
  color: 'white',
  backgroundColor: '#00BFFF',
  width: '60px',
  border: '10px'
}
const rowSave = {
  paddingLeft: '50%'
}

const specializedThreadJobPost = {
  height: '200px',
  color: 'white',
  backgroundColor: '#00BFFF',
  textAlign: 'center',
  paddingLeft: '90px',
  paddingRight: '90px',
  paddingBottom: '10px',
  fontSize: '15px'
}


class Job_Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: ['java'], // get data trong db ,
      isVisible: false,
    };
  }

  addNewTable = () => {

    var specialized = document.getElementById('selectSpecialized').value;


    this.setState({
      array: [...this.state.array, specialized]
    })
  }

  addNewRowInTable = () => {
    this.setState({
      isVisible: true,
    })
  }


  render() {
    var {array, isVisible} = this.state;
    return (

      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> <b>Thông tin tuyển dụng</b>
              </CardHeader>
              <CardBody>
                <br/><br/><br/>
                <div style={divSelcectSpecilized}>
                  <select id={'selectSpecialized'} style={selcectSpecilized}>
                    <option value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</option>
                    <option value="Ngôn ngữ nhật">Ngôn ngữ nhật</option>
                    <option value="Ngôn ngữ anh">Ngôn ngữ anh</option>
                  </select>&nbsp;&nbsp;
                  <input name={"btnChoose"} value={"Chọn"} type={"button"} style={btnChoose}
                         onClick={this.addNewTable}/>
                </div>
                <table style={{border: '#00BFFF solid 1px'}}>
                  <thread style={specializedThreadJobPost}>
                    <tr>
                      <td>Kỹ thuật phần mềm</td>
                    </tr>
                  </thread>
                  <tbody>
                  <br/>
                  <tr>
                    <td><b>Java developer</b> : 20</td>
                  </tr>
                  </tbody>
                </table>
                {array.map((item, index) =>
                  <table style={{border: '#00BFFF solid 1px'}} key={index}>
                    <thread style={specializedThreadJobPost}>
                      <tr>
                        <td>{item}</td>
                      </tr>
                    </thread>
                    <tbody>
                    <br/>
                    <tr>
                      <input type={'button'} value={'Thêm'} onClick={this.addNewRowInTable}/>
                      {isVisible ?
                        <div>
                          <input type={'text'}/>
                          <input type={'text'}/>
                        </div> : ''
                      }
                    </tr>
                    </tbody>
                  </table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div style={rowSave}><input type={"button"} name={"btnSave"} style={btnSave} value={"Lưu"}/></div>

      </div>
    );
  }
}

export default Job_Post;
