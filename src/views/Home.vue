<template>
    <div>
        <div class="background d-flex justify-content-center">
            <form class="searchbar d-flex justify-content-center">
                
                <!-- <input 
                    name="txtName" 
                    id="txtName" 
                    class="inputbox searchelement" 
                    placeholder="Εισάγεται τοποθεσία..."
                    v-model="searchForm.location"
                >
                <span class="iconify inputicon" data-icon="ion-locate"></span> -->
                <geoInput class="inputbox searchelement geo" v-model="searchForm.location"/>

                <HotelDatePicker
                    id = "datepicker" 
                    class="dateinputbox"
                    format="DD/MM/YYYY"
                    v-on:check-in-changed="searchForm.date1 = $event"
                    v-on:check-out-changed="searchForm.date2 = $event"
                >
                </HotelDatePicker>
                <!-- <input name="txtName" id="txtName" class="inputbox searchelement" placeholder="Εισάγεται ημερομηνίες...">
                <span class="iconify inputicon" data-icon="ion-calendar"></span> -->
             
                <select 
                    class="inputbox searchelement" 
                    v-model="searchForm.persons"
                >
                    <option value="" disabled>Άτομα..</option>
                    <option class = "selecttext" value="1">1</option>
                    <option class = "selecttext" value="2">2</option>
                    <option class = "selecttext" value="3">3</option>
                    <option class = "selecttext" value="4">4</option>
                    <option class = "selecttext" value="5">5</option>
                    <option class = "selecttext" value="6">6</option>
                </select>
                
                <b-link 
                    class = "searchbutton searchelement d-flex align-items-center"
                    @click="submit"
                >
                    Αναζήτηση
                    <span class="iconify searchicons" data-icon="ion-search"></span>
                </b-link>
            </form>
        </div>
    </div>
</template>

<script>
import HotelDatePicker from 'vue-hotel-datepicker'
import geoInput from '../components/geoInput'

export default {


    components: {
        HotelDatePicker,
        geoInput,
    },
    data() {
		return {
            searchForm: {
				location: '',
                date1: '',
                date2: '',
				persons: '',
			},
		};
	},
	methods: {
        submit(){
            let query = { location: this.searchForm.location, date1: this.searchForm.date1, date2: this.searchForm.date2, persons: this.searchForm.persons };
            
            query.date1 = query.date1.toISOString();
            query.date2 = query.date2.toISOString();

            this.$router.push({ path: '/results', query: query}).catch(() => {});
        }
        
    },

};

</script>

<style scoped>
.background{

    background-color: #4E7378;
    height: 800px;
    width: 100%;
    z-index: -100;

    background-image: url('../assets/home-bg.png');
    background-size: 100% 100%;
     background-repeat: no-repeat; 
}

.searchbar{
    height: 90px;
    width: 70%;
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

.geo{
    width: 250px;
}

</style>
