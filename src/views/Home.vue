<template>
    <div>
        <div class="background d-flex justify-content-center">
            <div class="searchbar d-flex justify-content-center">
                
<!--                 
                <b-input-group class="inputbox">
                    <b-form-input v-model="search" placeholder="Enter your name"></b-form-input>
                    <b-input-group-prepend>
                        <span class="iconify " data-icon="ion-globe-outline"></span>
                    </b-input-group-prepend>
                </b-input-group> -->
                
                <input class="inputbox searchelement" v-model="search" placeholder="Εισάγεται τοποθεσία...">
                <input class="inputbox searchelement" v-model="search" placeholder="Εισάγεται ημερομηνίες...">
                <select class="inputbox searchelement" v-model="selected">
                    <option value="undefined" disabled>Άτομα..</option>
                    <option class = "selecttext">1</option>
                    <option class = "selecttext">2</option>
                    <option class = "selecttext">3</option>
                    <option class = "selecttext">4</option>
                    <option class = "selecttext">5</option>
                    <option class = "selecttext">6</option>
                </select>
                <button class = "searchbutton searchelement">
                    <i>Αναζήτηση</i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>


export default {
    

    data() {
		return {
		
		};
	},
	methods: {

    },
};

</script>

<style>
.background{
    background-color: gray;
    height: 900px;
    width: 100%;
    z-index: -100;
}

.searchbar{
    height: 90px;
    width: 66%;
    z-index: 100;
    background-color: #194A50;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 90px;

    margin-top: 75px;
}

.inputbox{
    background: rgba(239, 239, 239, 0.25);
    border-radius: 3px;
    
    border: none;
    outline: none;

    height: 40px;
    margin-top: 25px;

    color:white;
}

.selecttext{
    background: rgba(239, 239, 239, 0.25);
    border-radius: 3px;
    color: black;
    font-style: normal;
    font-weight: normal;
}

.searchbutton{
    border-bottom-right-radius: 90px;
    border-top-right-radius: 90px;
    margin-top: 15px;
}


button {
	background: none;
	color: white;
    background-color: #D37556;
	cursor: pointer;

    border: none;
    outline: none;
    
    height: 70%;
}

button:focus {
    border: none;
    outline: none;

}
button:hover {
	background-color: #9C533B;
    border: none;
    outline: none;
}

button:active {
	background-color: #9C533B;
    border: none;
    outline: none;
}

button.current {
	background-color: #ffffff;
	color: #194A50;
	font-weight: normal;
    border: none;
    outline: none;
}



.searchelement{
    margin-left: 7px;
    margin-right: 7px;
    padding: 0 20px;
}
</style>
