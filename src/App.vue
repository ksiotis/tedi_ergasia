<template>
    <div id="app">
        <Art />
        <Navbar />
        <router-view/>
        <Footer />
    </div>
</template>

<script>
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Art from './components/Art';
import HotelDatePicker from 'vue-hotel-datepicker'
import ResultTile from './components/ResultTile'


export default {
	components: {
		Art,
		Navbar,
        Footer,
        HotelDatePicker,
        ResultTile,
	},
};
</script>

<style>

/* @import url('https://unpkg.com/leaflet-geosearch@2.6.0/assets/css/leaflet.css'); */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
#app {
	font-family: 'Roboto', sans-serif;
}

* {
	scrollbar-width: thin;
	scrollbar-color: #194A50 #E1DAD2;
}

.b-btn {
	border-radius: 3px;
}
.btn-primary {
	background-color: #FFFFFF !important;
}

.noselect {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently
                        supported by Chrome, Opera and Firefox */
}

::-webkit-input-placeholder {
    color: white;
    font-style: normal;
    font-weight: normal;
}

:-moz-placeholder { /* Firefox 18- */
    color: white;
    font-style: normal;
    font-weight: normal;
}

::-moz-placeholder {  /* Firefox 19+ */
    color: white;
    font-style: normal;
    font-weight: normal;
}

:-ms-input-placeholder {  
    color: white;
    font-style: normal;
    font-weight: normal;
}

/* for the datepicker componenet */
.datepicker__input{
    color:white;
    /* border: none;
    outline: none; */
}

.datepicker__input:active{
    border: none;
    outline: none;
    height: 40px;
    position: relative;
}

.datepicker__dummy-wrapper{
    border: none;
    outline: none;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
}

.datepicker__input:hover{
    cursor: pointer;
    font-weight: bold;
}

option{
    color: #194A50;
}

.datepicker__month-day--selected{
    background-color: #8DACB0;
}
.datepicker__month-day--first-day-selected{
    background-color: #4E7378;
}

.datepicker__month-day--last-day-selected{
    background-color: #4E7378;
}

#datepicker svg{
    filter: brightness(100%) saturate(0%);
}

.datepicker__month-button{
    /* background-color: #194A50; */
    /* fill: #194A50; */
    color:  #194A50;
}
</style>
