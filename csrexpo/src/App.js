import React, { Component } from 'react';
import {Jumbotron, UncontrolledCarousel, Container, Row, Col} from 'reactstrap';

class Welcome extends Component{
  constructor(props) {
    super(props);
    this.state = { 
      participant: null,
      count: 0,
    };
  
    setInterval(()=>{
      var request = new XMLHttpRequest();
      request.responseType = 'json';
      request.onreadystatechange=(e)=>{
        if(request.readyState !==4) return;
        if(request.status === 200){
          this.setState({participant:request.response.participant,
          count: request.response.count});
        }
        else{
          console.log('error');
        }
      }
      request.open('GET', 'http://192.168.43.115:3000/' + this.props.requestparam);
      request.send();
    }, 1000)
  }
  
  render(){
    return(
      <Jumbotron style={{backgroundImage:'url(' + require('../src/back.jpg') + ')',
      backgroundSize:'cover',paddingBottom:0}}>
        <h1 className="display-3" style={{fontFamily: 'bebas',color:'#2c3e50'}}>Welcome {this.state.participant==null?'Everyone':this.state.participant.firstName}!</h1>
        <h2 className="display-3" style={{fontFamily:'bebas kai', fontSize:42,color:'#34495e'}}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          to <b>PUP Computer Science Research Expo 2018</b></h2>
        <hr className="my-2" />
        <p style={{fontFamily:'bebas kai', fontSize:'38', textAlign:'right'}}>Visitors: <b style={{fontSize:48}}>{this.state.count}</b> and counting...</p>
      </Jumbotron>
    );
  }
}

export class WelcomePUP extends Component{
  render() {
    return (
      <Container fluid style={{backgroundColor: 'white', padding:20}}>
        <Row>
          <Col>
            <Welcome requestparam={'pup'}/>
          </Col>
        </Row>
        <Row>
          <Col style={{marginLeft:50}}>
            <UncontrolledCarousel items={items} />
          </Col>
        </Row>
      </Container> 
    )
  }
}

export class WelcomeNonPUP extends Component{
  render() {
    return (
      <Container fluid style={{backgroundColor: 'white', padding:20}}>
        <Row>
          <Col>
            <Welcome requestparam='nonpup'/>
          </Col>
        </Row>
        <Row>
          <Col style={{marginLeft:50}}>
            <UncontrolledCarousel items={items} />
          </Col>
        </Row>
      </Container> 
    )
  }
}

export class Raffle extends Component{

    constructor(props){
      super(props);
      this.state = {
        name: 'SHUFFLE',
        index:0,
        ctr:0,
        rnd:200,
        winner: false
      }

    }

    clickHandler = ()=>{
      var request = new XMLHttpRequest();
      request.responseType = 'json';
      request.onreadystatechange=(e)=>{
        if(request.readyState !==4) return;
        if(request.status === 200){
          this.setState({ctr:0,
          index:Math.floor(Math.random()*request.response.length),
          ctr:0,winner:false,
        rnd:Math.floor(Math.random()*request.response.length)});
          var timer = setInterval(()=>{
            console.log(this.state.rnd + ' ' + this.state.ctr);
            if(this.state.index == request.response.length){
              this.setState({index:0});
            }
            else if(this.state.ctr == this.state.rnd){
              clearInterval(timer);
              this.setState({winner:true})
            }
            else{
              this.setState(prevState=>{
                return({
                  name: request.response[this.state.index].firstName + ' ' + request.response[this.state.index].lastName,
                  index: prevState.index + 1,
                  ctr: prevState.ctr+1
                })
              })
            }
          }, 20)
        }
        else{
          console.log('error');
        }
      }
      request.open('GET', 'http://192.168.43.115:3000/entered');
      request.send();
    }

    render(){
      return(
        <Container fluid style={{textAlign:'center', height:764, padding:330,
        backgroundImage:'url(' + require('../src/back2.jpg') +')', backgroundSize:'cover'}}>
          <h1 onClick={this.clickHandler} style={{fontFamily:'bebas', fontSize:50}}>{this.state.name}</h1>
          {this.state.winner?<h1>Winner!</h1>:''}
        </Container>
      );
    }
}

class App extends Component {
  render() {
    return (
      <Container></Container>   
    );
 }
}

const items = [
  {
    src: require('../src/1.png')
  },
  {
    src: require('../src/2.png'),
  }
];

export default App;
