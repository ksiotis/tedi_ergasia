<template>
	<div class="d-flex justify-content-start">
        <form class="filterform d-flex justify-content-start flex-column">
            <!-- row with location input -->
            <div class="forminputbox">
                <input  class="forminput" placeholder="Εισάγετε τοποθεσία..." v-model="searchForm.location">
                <i class="iconify formicon" data-icon="ion-locate"></i>
            </div>
            <!-- row with date input -->
            <HotelDatePicker 
                id = "datepicker"
                class="dateinputbox"
                format="DD/MM/YYYY"
                v-bind="{startDate: this.searchForm.date1}"
            >
            </HotelDatePicker>
            <!-- row with persons and sort as option -->
            <div class="d-flex justify-content-between">               
                <select 
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
            <div class="form-check">
                <input type="checkbox" class="form-check-input">
                <label class="form-check-label" for="exampleCheck1">Wifi</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input">
                <label class="form-check-label" for="exampleCheck1">Ψύξη</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input">
                <label class="form-check-label" for="exampleCheck1">Θέρμανση</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input">
                <label class="form-check-label" for="exampleCheck1">Κουζίνα</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input">
                <label class="form-check-label" for="exampleCheck1">Τηλεόραση</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input">
                <label class="form-check-label" for="exampleCheck1">Parking</label>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input">
                <label class="form-check-label" for="exampleCheck1">Ανελκυστήρας</label>
            </div>
            <!-- search button -->
            <div class="d-flex justify-content-center">
                <b-link class = "searchbutton d-flex align-items-center" to="/results">
                    Αναζήτηση
                    <span class="iconify searchicons" data-icon="ion-search"></span>
                </b-link>
            </div>
        </form>
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
        searchForm: {
				location: '',
                date1: '',
                date2: '',
				persons: '',
		},

        selected2: 'A',
        options: [
          { item: 'A', name: 'Φθίνουσα τιμή' },
          { item: 'B', name: 'Αύξουσα τιμή' },
        ]

      }
    },

    created() {

        if(this.$route.query.location!=null){
            this.searchForm.location = this.$route.query.location;
        }
        
        this.searchForm.date1 = new Date(this.$route.query.date1)
        this.searchForm.date2 = new Date(this.$route.query.date2)

        this.searchForm.persons = this.$route.query.persons;
        
    }

    
}
</script>

<style scoped>
.filterform{
    background-color: #194A50;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width: 350px;
    height: 525px;
    padding: 0 20px;
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
</style>
