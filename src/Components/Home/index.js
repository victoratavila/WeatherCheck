import React, { useEffect, useState } from 'react';
import { City, Degree, CurrentWheaterIcon, NextDaysWeather, DayOfWeek, DayOfMonth, MinAndMax } from './styles';
import RainIcon from '../../assets/rain.svg';
import SunIcon from '../../assets/sun.svg';
import CloudyDayIcon from '../../assets/cloudyDay.svg';
import DayLabel from '../../Components/Labels/DayLabel';
import RainLabel from '../../Components/Labels/RainLabel';
import NightLabel from '../../Components/Labels/NightLabel';
import CloudyLabel from '../../Components/Labels/CloudyLabel';
import {Container, Row, Col} from 'react-bootstrap';
import api from '../../config/api';
import axios from 'axios';
import slugify from 'react-slugify';

const Home = () => {

    const [ weatherFound, setWeather ] = useState(null);
    const key = process.env.REACT_APP_API_KEY;

    const getWeather = (city) => {
        api.get(`https://api.hgbrasil.com/weather?format=json-cors&key=${key}&city_name=${city}`).then(data => {
            setWeather(data.data.results);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        document.body.style.backgroundImage = 'linear-gradient(to right, #2B8DF0, #074C90)';

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

        if(weatherFound.condition_slug === 'rain'){
            return RainIcon;
        }

        if(weatherFound.condition_slug === 'clear_day'){
            return SunIcon;
        }

        if(weatherFound.condition_slug === 'cloud' || weatherFound.condition_slug === 'cloudly_day'){
            return CloudyDayIcon;
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
    
    return (


        <div className = "container"> <br/> <br/> <br/> <br/>

            {weatherFound ? (

                <div>
                     <City> {weatherFound.city} </City> 

<div>
  <Degree> {weatherFound.temp}°C  <CurrentWheaterIcon alt = "weather" src = {setTodaysWeatherIcon(weatherFound)} height='50px' /> <br/> <br/></Degree> 
    
    <div>
        {weatherFound.currently === 'dia' ? <DayLabel/> : <NightLabel/> }
        {weatherFound.condition_slug === 'rain' ? <RainLabel/> : ''}
        {weatherFound.condition_slug === 'cloud' || weatherFound.condition_slug === 'cloudly_day' ? <CloudyLabel/> : ''}
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
           
        </div>
    )
}

export default Home;