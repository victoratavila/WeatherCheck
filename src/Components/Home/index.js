import React, { useEffect, useState } from 'react';
import { City, Degree, CurrentWheaterIcon, NextDaysWeather, DayOfWeek, DayOfMonth, MinAndMax } from './styles';
import RainIcon from '../../assets/rain.svg';
import SunIcon from '../../assets/sun.svg';
import CloudyDayIcon from '../../assets/cloudyDay.svg';
import CloudyNightIcon from '../../assets/cloudyNight.svg'
import DayLabel from '../../Components/Labels/DayLabel';
import RainLabel from '../../Components/Labels/RainLabel';
import NightLabel from '../../Components/Labels/NightLabel';
import CloudyLabel from '../../Components/Labels/CloudyLabel';
import {Container, Row, Col, Form, Modal, Button} from 'react-bootstrap';
import api from '../../config/api';
import axios from 'axios';
import slugify from 'react-slugify';

const Home = () => {

    const [ weatherFound, setWeather ] = useState(null);
    const [ states, setStates ] = useState(null);
    const [ modalShow, setModalShow ] = React.useState(false);

    const key = process.env.REACT_APP_API_KEY;


    const getWeather = async (city) => {

        const storage = localStorage.getItem('weatherResults');
        const now = new Date();
        const data = JSON.parse(storage);

        if(storage === null || now.getTime() > data.expiration ){

            // If the item is expired, delete the item from storage
            localStorage.removeItem('weatherResults');

            await api.get(`https://api.hgbrasil.com/weather?format=json-cors&key=${key}&city_name=${city}`).then(data => {
                setWeather(data.data.results);
    
                const storeResults = {
                    value: data.data.results,
                    expiration: now.getTime() + 900000,
                    userCity: city
                }
    
                localStorage.setItem('weatherResults', JSON.stringify(storeResults));
    
            }).catch(err => {
                console.log(err);
            })
        } else {
            // If there is valid on localstorage, add it to the state
           setWeather(data.value);
        }

      
    }

    const getStatesList = async () => {
        await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(list => {
            setStates(list.data);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {


        const getUserLocalization = async () => {
            await axios.get('https://geolocation-db.com/json/.').then(data => {
                const userCity = slugify(data.data.city);
                getWeather(userCity);
            }).catch(err => {
                console.log(err);
            })
        }
       
        getUserLocalization();

    }, [])

    const setTodaysWeatherIcon = (weatherFound) => {

        
        if(weatherFound.currently === 'dia'){
            document.body.style.backgroundImage = 'linear-gradient(to right, #2B8DF0, #074C90)';
        } else {
            document.body.style.backgroundImage = 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(2,2,50,1) 19%, rgba(0,212,255,1) 100%)';
        }

        if(weatherFound.condition_slug === 'rain'){
            return RainIcon;
        }

        if(weatherFound.condition_slug === 'clear_day'){
            return SunIcon;
        }

        if(weatherFound.condition_slug === 'cloud' || weatherFound.condition_slug === 'cloudly_day'){
            return CloudyDayIcon;
        }

        if(weatherFound.condition_slug === 'cloudly_night'){
            return CloudyNightIcon;
        }
        
    }

    const setFutureWeatherIcon = (futureWeather) => {

        if(futureWeather.condition === 'rain'){
            return RainIcon;
        }

        if(futureWeather.condition === 'cloudly_day' || futureWeather.condition === 'cloud'){
            return CloudyDayIcon;
        }

        if(futureWeather.condition === 'clear_day'){
            return SunIcon;
        }
        
        
    }

    const handleChanges = (ev) => {
        console.log(ev.target.value);
    }

    const searchCity = async (ev) => {
        ev.preventDefault();
        const selectedCity = ev.target.cityNameInput.value;
        const selectedState = (ev.target.stateSelected.value);
        
        if(selectedCity && selectedState !== null && selectedCity && selectedState !== undefined){

            // If the item is expired, delete the item from storage
            localStorage.removeItem('weatherResults');
            const now = new Date();

            await api.get(`https://api.hgbrasil.com/weather?format=json-cors&key=${key}&city_name=${selectedCity},${selectedState}`).then(data => {
            setModalShow(false);
            setWeather(data.data.results);
    
                const storeResults = {
                    value: data.data.results,
                    expiration: now.getTime() + 900000,
                    userCity: selectedCity
                }
    
                localStorage.setItem('weatherResults', JSON.stringify(storeResults));
    
            }).catch(err => {
                console.log(err);
            })
        } 

        
    }

    function MyVerticallyCenteredModal(props) {

        return (
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Buscar pela cidade
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit = {searchCity}>
                {states && (
                <Form.Select id="stateSelected" required = {true} aria-label="Default select example" onChange = {handleChanges}>
                <option>Selecione o estado</option>

                {states.map(list => {
                    return <option key = {list.id} value={list.sigla}> {list.sigla} </option>
                })}
                </Form.Select>  

            )} <br/>

        
                <Form.Group required = {true} className="test" controlId="cityNameInput">
                    <Form.Control type="text" placeholder="Digite o nome da cidade" />
                </Form.Group> <br/>

                <Button variant="primary" type="submit">
                    Buscar
                </Button>

            </Form>
            </Modal.Body>
        
          </Modal>
        );
      }
      
  
    
    return (

       

        <div className = "container"> <br/> <br/> 

       

            {weatherFound ? (

                <div>
                     <City> {weatherFound.city} </City> 

<div>
  <Degree> {weatherFound.temp}°C  <CurrentWheaterIcon alt = "weather" src = {setTodaysWeatherIcon(weatherFound)} height='50px' /> <br/> <br/></Degree> 
    
    <div>
        {weatherFound.currently === 'dia' ? <DayLabel/> : <NightLabel/> }
        {weatherFound.condition_slug === 'rain' ? <RainLabel/> : ''}
        {weatherFound.condition_slug === 'cloud' || weatherFound.condition_slug === 'cloudly_day' || weatherFound.condition_slug === 'cloudly_night' ? <CloudyLabel/> : ''}
    </div>

    

 



<div style = {{textAlign: 'center'}}> <br/> <br/>

    <Container>
    <Row>

        <Col>
            <NextDaysWeather> <br/>
                <DayOfWeek> {weatherFound.forecast[1].weekday} </DayOfWeek> 
                <DayOfMonth> {weatherFound.forecast[1].date} </DayOfMonth> <br/>
                <img alt = "weather" src = {setFutureWeatherIcon(weatherFound.forecast[1])} height = '50px' /> 
                <MinAndMax> Max: {weatherFound.forecast[1].max}°C | Min {weatherFound.forecast[1].min}°C </MinAndMax>
            </NextDaysWeather>
        </Col>

        <Col>
        <NextDaysWeather> <br/>
                <DayOfWeek> {weatherFound.forecast[2].weekday} </DayOfWeek> 
                <DayOfMonth> {weatherFound.forecast[2].date} </DayOfMonth> <br/>
                <img alt = "weather" src = {setFutureWeatherIcon(weatherFound.forecast[2])} height = '50px' />
                <MinAndMax> Max: {weatherFound.forecast[2].max}°C | Min {weatherFound.forecast[2].min}°C </MinAndMax>
            </NextDaysWeather>
        </Col>

        <Col>
        <NextDaysWeather> <br/>
                <DayOfWeek> {weatherFound.forecast[3].weekday} </DayOfWeek> 
                <DayOfMonth> {weatherFound.forecast[3].date} </DayOfMonth> <br/>
                <img alt = "weather" src = {setFutureWeatherIcon(weatherFound.forecast[3])} height = '50px' />
                <MinAndMax> Max: {weatherFound.forecast[3].max}°C | Min {weatherFound.forecast[3].min}°C </MinAndMax>
            </NextDaysWeather>
        </Col>

        <Col>
        <NextDaysWeather> <br/>
                <DayOfWeek> {weatherFound.forecast[4].weekday} </DayOfWeek> 
                <DayOfMonth> {weatherFound.forecast[4].date} </DayOfMonth> <br/>
                <img alt = "weather" src = {setFutureWeatherIcon(weatherFound.forecast[4])} height = '50px' />
                <MinAndMax> Max: {weatherFound.forecast[4].max}°C | Min {weatherFound.forecast[4].min}°C </MinAndMax>
            </NextDaysWeather>
        </Col>

        <Col>
        <NextDaysWeather> <br/>
                <DayOfWeek> {weatherFound.forecast[5].weekday} </DayOfWeek> 
                <DayOfMonth> {weatherFound.forecast[5].date} </DayOfMonth> <br/>
                <img alt = "weather" src = {setFutureWeatherIcon(weatherFound.forecast[5])} height = '50px' />
                <MinAndMax> Max: {weatherFound.forecast[5].max}°C | Min {weatherFound.forecast[5].min}°C </MinAndMax>
            </NextDaysWeather>
        </Col>

    </Row>
    </Container>
  </div>
</div>
                </div>
                
            ) : (
                <h1>Loading</h1>
            )}

<br/>
     <Button variant="primary" onClick={()=>{ setModalShow(true); getStatesList()}} >
        Buscar pela cidade
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
           
        </div>
    )
}

export default Home;