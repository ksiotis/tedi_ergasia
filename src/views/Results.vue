<template>
	<div class="d-flex justify-content-start">
        <div class="filterform d-flex justify-content-start flex-column">
            <!-- row with location input -->
            <div class="forminputbox">
                <input  class="forminput" placeholder="Εισάγετε τοποθεσία...">
                <i class="iconify formicon" data-icon="ion-locate"></i>
            </div>
            <!-- row with date input -->

            <HotelDatePicker 
                class="dateinputbox"
                format="DD/MM/YYYY"
                >
            </HotelDatePicker>
<!--             
            <div class="forminputbox">
                <input  class="forminput" placeholder="Εισάγετε ημερομηνίες...">
                <i class="iconify formicon" data-icon="ion-calendar"></i>
            </div>
             -->
            <!-- row with persons and sort as option -->
            <div class="d-flex justify-content-between">               
                <select class="forminputbox" v-model="selected1">
                    <option value="undefined" disabled>Άτομα..</option>
                    <option class = "selecttext">1</option>
                    <option class = "selecttext">2</option>
                    <option class = "selecttext">3</option>
                    <option class = "selecttext">4</option>
                    <option class = "selecttext">5</option>
                    <option class = "selecttext">6</option>
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
        selected2: 'A',
        options: [
          { item: 'A', name: 'Φθίνουσα τιμή' },
          { item: 'B', name: 'Αύξουσα τιμή' },
        ]
      }
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

.datepicker__input{
    color:white;
    border: none;
    outline: none;
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
