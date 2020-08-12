<template>
    <div>
        <div class="background d-flex justify-content-center">
            <div class="searchbar d-flex justify-content-center">
                
                <input name="txtName" id="txtName" class="inputbox searchelement" placeholder="Εισάγεται τοποθεσία...">
                <span class="iconify inputicon" data-icon="ion-locate"></span>

                <HotelDatePicker
                    id = "datepicker" 
                    class="dateinputbox"
                    format="DD/MM/YYYY"
                >
                </HotelDatePicker>
                <!-- <input name="txtName" id="txtName" class="inputbox searchelement" placeholder="Εισάγεται ημερομηνίες...">
                <span class="iconify inputicon" data-icon="ion-calendar"></span> -->


             
                <select class="inputbox searchelement" v-model="selected">
                    <option value="undefined" disabled>Άτομα..</option>
                    <option class = "selecttext">1</option>
                    <option class = "selecttext">2</option>
                    <option class = "selecttext">3</option>
                    <option class = "selecttext">4</option>
                    <option class = "selecttext">5</option>
                    <option class = "selecttext">6</option>
                </select>
                
                <b-link class = "searchbutton searchelement d-flex align-items-center" to="/results">
                    Αναζήτηση
                    <span class="iconify searchicons" data-icon="ion-search"></span>
                </b-link>
            </div>
        </div>
    </div>
</template>

<script>
import HotelDatePicker from 'vue-hotel-datepicker'

export default {
    components: {
        HotelDatePicker,
    },
    data() {
		return {
		
		};
	},
	methods: {

    },
};

</script>

<style scoped>
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
    padding: 0 30px;
    margin-top: 75px;
}

.inputbox{
    background: rgba(239, 239, 239, 0.25);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    
    border: none;
    outline: none;

    height: 40px;

    color:white;
    margin-top: 25px;
}

.inputicon{
    background: rgba(239, 239, 239, 0.25);
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;

    font-size: 40px;
    color: white;
    margin-top: 25px;

    float: right;
    position: relative;

    padding-top: 8px;
    padding-bottom: 8px;
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

    background: none;
	color: white;
    background-color: #D37556;
	cursor: pointer;

    border: none;
    outline: none;
    
    height: 70%;
}

.searchbutton:hover{
    background-color: #9C533B;
    color: white;
    text-decoration: none;   
}

.searchicons{
    margin-left: 20px;
    font-size: 24px;
}

.searchelement{
    margin-left: 14px;
    padding: 0 20px;
}

.dateinputbox{
    background: rgba(239, 239, 239, 0.25);
    height: 40px;
    border: none;
    outline: none;

    color:white;
    margin-top: 25px;
    margin-left: 14px;
}
</style>
