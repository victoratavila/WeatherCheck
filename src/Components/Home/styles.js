import styled from 'styled-components';

export const City = styled.h1`
    font-family: 'Roboto', sans-serif;
    font-size: 50px;
    color: white;
    display: inline
`

export const State = styled.p`
    font-family: 'Roboto', sans-serif;
    font-size: 50px;
    color: white;
    display: inline;
    opacity: 70%
`

export const Degree = styled.h1`
    font-family: 'Roboto', sans-serif;
    font-size: 65px;
    color: white;
    margin-top: 15px;
`

export const CurrentWheaterIcon = styled.img`
    height: ${props => props.height};
    width: ${props => props.width};
    margin-left: 10px
`
export const NextDaysWeather = styled.div`
    height: 250px;
    background-color: red;
    background-color: rgba(255, 255, 255, .15);  
    backdrop-filter: blur(5px);
    transition: box-shadow .3s;

    &:hover {
        box-shadow: 0 0 11px rgba(33,33,33,.2); 
    }
`
export const DayOfWeek = styled.h1`
    font-size: 30px;
    color: white;
`

export const DayOfMonth = styled.h3`
    font-size: 20px;
    color: white;
    font-weight: 400;
`

export const MinAndMax = styled.h5`
    font-size: 13px;
    color: #000000;
    font-weight: 400;
    margin-top: 40px;
`

export const Input = styled.input`
    color: white;
    background: none;
    border-color: white;
`;