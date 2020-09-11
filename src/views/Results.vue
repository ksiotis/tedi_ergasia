<template>
	<div class="d-flex justify-content-start background">
        <form class="filterform d-flex justify-content-start flex-column" @input="resultFlag = false;">
            <!-- row with location input -->
            <!-- <div class="forminputbox">
                <input  class="forminput" placeholder="Εισάγετε τοποθεσία..." v-model="searchForm.location">
                <i class="iconify formicon" data-icon="ion-locate"></i>
            </div> -->
            <geoInput class="forminputbox" style="width: 310px;" v-model="searchForm.geo_package"/>
            
            <!-- row with date input -->
            <HotelDatePicker
                @input="resultFlag = false;" 
                id = "datepicker"
                class="dateinputbox"
                format="DD/MM/YYYY"
                :startingDateValue = "searchForm.date1"
                :endingDateValue = "searchForm.date2"
                v-on:check-in-changed="searchForm.date1 = $event"
                v-on:check-out-changed="searchForm.date2 = $event"/>
            <!-- row with persons and sort as option -->
            <div class="d-flex justify-content-between">               
                <select 
                    @input="resultFlag = false;"
                    class="forminputbox" 
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
                <div class="d-flex">
                    <p style="color: white;">Προβολή:</p>
                    <div>
                        <b-form-select 
                            v-model="selected2"
                            :options="options"
                            class="mb-3 forminputbox"
                            value-field="item"
                            text-field="name"
                        ></b-form-select>
                    </div>
                </div>
            </div>
            <!-- filters row -->
            <p style="color: white;">Φίλτρα:</p>
            <!-- checkboxes -->
            <div class="form-check" >
                <input type="checkbox" v-model="searchForm.wifi" class="form-check-input" @input="resultFlag = false;">
                <label class="form-check-label" for="exampleCheck1">Wifi</label>
            </div>
            <div class="form-check">
                <input type="checkbox" v-model="searchForm.freezer" class="form-check-input" @input="resultFlag = false;">
                <label class="form-check-label" for="exampleCheck1">Ψύξη</label>
            </div>
            <div class="form-check">
                <input type="checkbox" v-model="searchForm.heating" class="form-check-input" @input="resultFlag = false;">
                <label class="form-check-label" for="exampleCheck1">Θέρμανση</label>
            </div>
            <div class="form-check">
                <input type="checkbox" v-model="searchForm.kitchen" class="form-check-input" @input="resultFlag = false;">
                <label class="form-check-label" for="exampleCheck1">Κουζίνα</label>
            </div>
            <div class="form-check">
                <input type="checkbox" v-model="searchForm.tv" class="form-check-input" @input="resultFlag = false;">
                <label class="form-check-label" for="exampleCheck1">Τηλεόραση</label>
            </div>
            <div class="form-check">
                <input type="checkbox" v-model="searchForm.parking" class="form-check-input" @input="resultFlag = false;">
                <label class="form-check-label" for="exampleCheck1">Parking</label>
            </div>
            <div class="form-check">
                <input type="checkbox" v-model="searchForm.lift" class="form-check-input" @input="resultFlag = false;">
                <label class="form-check-label" for="exampleCheck1">Ανελκυστήρας</label>
            </div>
            <div class="form-check">
                <input type="checkbox" v-model="searchForm.livingRoom" class="form-check-input" @input="resultFlag = false;">
                <label class="form-check-label" for="exampleCheck1">Καθιστικό</label>
            </div>
            <!-- search button -->
            <div class="d-flex justify-content-center">
                <b-link class = "searchbutton d-flex align-items-center" @click="search">
                    Αναζήτηση
                    <span class="iconify searchicons" data-icon="ion-search"></span>
                </b-link>
            </div>
        </form>

        <div class="container">
            <div class="row ">
                <div 
                    v-for="(result, index) in results"
                    v-bind:key="index"
                    class="col col-6">
                        <div class="panel" v-if="resultFlag == true">
                            <ResultTile
                                :date1="searchForm.date1"
                                :date2="searchForm.date2"
                                :searchPersons="Number(searchForm.persons)" 
                                :preview_package="result"/>
                        </div>
                </div> 
            </div>
        </div>

    </div>
</template>

<script>
import HotelDatePicker from 'vue-hotel-datepicker'
import ResultTile from '../components/ResultTile'
import geoInput from '../components/geoInput'

export default {
    components: {
        HotelDatePicker,
        ResultTile,
        geoInput,
    },

    data() {
      return {
        resultFlag: true,

        results: [],

        searchForm: {
            geo_package:{
                message: '',
                bounds: [
                ],
            },
            date1: '',
            date2: '',
            persons: '',

            wifi: false,
            freezer: false,
            heating: false,
            kitchen: false,
            tv: false,
            parking: false,
            lift: false,
            livingRoom: false,
        },

        selected2: 'A',
        options: [
          { item: 'A', name: 'Φθίνουσα τιμή' },
          { item: 'B', name: 'Αύξουσα τιμή' },
        ],
      }
    },
    methods:{
        review_average(reviews){
            let sum = 0;
            var i;
            if(reviews.length != 0){
                for (i=0 ; i < reviews.length ; i++){
                    // console.log(reviews[i].Rating);
                    sum += reviews[i].Rating;
                }
                return (sum/reviews.length).toFixed(1);
            }
            return sum;
        },

        assign_characteristics(characteristics){
            let final = [
                {
                    name: 'Wifi',
                    status: false,
                },
                {
                    name: 'Ψύξη',
                    status: false,
                },
                {
                    name: 'Θέρμανση',
                    status: false,
                },
                {
                    name: 'Κουζίνα',
                    status: false,
                },
                {
                    name: 'Τηλεόραση',
                    status: false,
                },
                {
                    name: 'Χώρος στάθμευσης',
                    status: false,
                },
                {
                    name: 'Ανελκυστήρας',
                    status: false,
                },
                {
                    name: 'Καθιστικό',
                    status: false,
                },
            ];
            var i;
            for(i=0 ; i < characteristics.length ; i++){
                if(characteristics[i].Characteristics_idCharacteristics == 0){
                    final[0].status = true;
                }
                else if(characteristics[i].Characteristics_idCharacteristics == 1){
                    final[1].status = true;
                }
                else if(characteristics[i].Characteristics_idCharacteristics == 2){
                    final[2].status = true;
                }
                else if(characteristics[i].Characteristics_idCharacteristics == 3){
                    final[3].status = true;
                }
                else if(characteristics[i].Characteristics_idCharacteristics == 4){
                    final[4].status = true;
                }
                else if(characteristics[i].Characteristics_idCharacteristics == 5){
                    final[5].status = true;
                }
                else if(characteristics[i].Characteristics_idCharacteristics == 6){
                    final[6].status = true;
                }
                else if(characteristics[i].Characteristics_idCharacteristics == 7){
                    final[7].status = true;
                }
            }
            return final;
        },

        async search() {
            this.resultFlag = true;
            
            this.results = [];
            let query = "?north=" + this.searchForm.geo_package.bounds[1][0].toString() +
                        "&west=" + this.searchForm.geo_package.bounds[0][1].toString() +
                        "&south=" + this.searchForm.geo_package.bounds[0][0].toString() +
                        "&east=" + this.searchForm.geo_package.bounds[1][1].toString() +
                        "&date1=" + this.searchForm.date1.toISOString() +
                        "&date2=" + this.searchForm.date2.toISOString() +
                        "&persons=" + this.searchForm.persons.toString() +
                        "&wifi=" + this.searchForm.wifi.toString() +
                        "&freezer=" + this.searchForm.freezer.toString() +
                        "&heating=" + this.searchForm.heating.toString() +
                        "&kitchen=" + this.searchForm.kitchen.toString() +
                        "&tv=" + this.searchForm.tv.toString() +
                        "&parking=" + this.searchForm.parking.toString() +
                        "&lift=" + this.searchForm.lift.toString() +
                        "&livingRoom=" + this.searchForm.livingRoom.toString();


            let response = await this.$axios.get('/accommodations' + query);
            console.log("Valid IDs");
            console.log(response.data);
            let ids = response.data;    

            for(let i = 0; i<ids.length ; i++){
                let response = await this.$axios.get('/accommodations/' + ids[i]);
                console.log(response.data);
            }
           
        },
    },
    created() {
        if(this.$route.query.location!=null){
            this.searchForm.geo_package.message = this.$route.query.location;
            this.searchForm.geo_package.bounds = JSON.parse(this.$route.query.bounds);
        }
        
        this.searchForm.date1 = new Date(this.$route.query.date1)
        this.searchForm.date2 = new Date(this.$route.query.date2)

        this.searchForm.persons = this.$route.query.persons;

        this.search();
    },
}
</script>

<style scoped>

.background{
    background-color: #FCF5EE;
    /* height: 800px; */
    /* width: 100%; */
    z-index: -100;
/* 
    background-image: url('../assets/results-bg.png');
    background-size:cover;
    background-repeat: no-repeat; */
}

.filterform{
    background-color: #194A50;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width: 350px;
    height: 565px;
    padding: 0 20px;

    position: sticky;
    top: 50px;
    margin-top: 25px;
    margin-left: 25px;
    margin-bottom: 25px;
}

.forminputbox{
    background: rgba(239, 239, 239, 0.25);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    
    border: none;
    outline: none;

    height: 40px;

    color:white;
    margin-top: 25px;

}

.dateinputbox{
    background: rgba(239, 239, 239, 0.25);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    
    height: 40px;
    border: none;
    outline: none;

    color:white;
    margin-top: 25px;
}

.forminput{
    background:none;
    border:none;
    outline: none;

    color: white;
    margin-top: 6px;
    margin-left: 8px;
}

.formicon{
    font-size: 24px;
    color: white;

    float: right; 
    position: relative;
    margin-top: 8px;
    margin-right: 8px;
}

p{
    margin-top: 31px;
    margin-right: 10px;
}

.selecttext{
    color: #194A50;
}

.form-check-label{
    color: white;
}

.searchbutton{
    border-radius: 90px;
    margin-top: 30px;

    background: none;
	color: white;
    background-color: #D37556;
	cursor: pointer;

    border: none;
    outline: none;
    
    height: 70%;
    padding: 0 60px;
}

.searchbutton:hover{
    background-color: #9C533B;
    color: white;
    text-decoration: none;   
}

.container{
    margin-left: 150px;
    width: 50%;
    margin-bottom: 50px;
}

/* 
.no-gutters {
  margin-right: 0;
  margin-left: 0;  
}

.col{
    padding-right: 0;
    padding-left: 0;
} */

.col{
    width: 330px;
}

.panel{
    cursor: pointer;
}

.panel:hover{
    filter: drop-shadow(0px 8px 20px rgba(0, 0, 0, 0.5));
}
</style>
