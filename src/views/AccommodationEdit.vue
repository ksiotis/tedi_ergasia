<template>
    <form>
        <div class="d-flex justify-content-between container">
            
            <div class="contentLeft d-flex flex-column justify-content-start">
                <!-- τίτλος  -->
                <div class="d-flex flex-row align-items-center">
                    <input required class="form-control form-control-lg title" type="text" placeholder="Εισάγεται τίτλο..." v-model="content.title" style="width: 690px; height: 60px; color: #194A50">
                </div>
                <!-- εικόνες -->
                <div class="element">
                    <b-carousel
                        id="carousel-1"
                        v-model="slide"
                        :interval="3000"
                        controls
                        indicators
                        background="#ccc"
                        img-width="500"
                        img-height="250"
                        style="text-shadow: 1px 1px 2px #000;"
                        @sliding-start="onSlideStart"
                        @sliding-end="onSlideEnd"
                    >
                        <b-carousel-slide
                            style="height: 335px; width: 690px;" 
                            v-for="(p, index) in content.images"
                            v-bind:key="index"
                            :img-src="require(`@/assets/accommodation_pics/${p}`)"/>
                    </b-carousel>
                </div>
                <div class="d-flex flex-row align-items-center">
                    <div class="form-group">
                        <b-form-file id="file-input" multiple @input="loadFile" v-model="images" accept="image/jpeg, image/png" placeholder="Επιλογή Εικόνας..."></b-form-file>
                    </div>
                </div>

                <!-- περιγραφή -->
                <h3 class="subtitle element">Περιγραφή</h3>
                <div class="form-group">
                    <textarea required class="form-control" id="exampleFormControlTextarea1" rows="20" v-model="content.description" placeholder="Εισάγεται περιγραφή..." style="width: 690px; height: 180px; color: #194A50"></textarea>
                </div>
                
                <!-- χαρακτηρηστικά -->
                <div class="d-flex flex-row justify-content-between">
                    <!-- στήλη 1 -->
                    <div>
                        
                        <h3 class="subtitle element">Χαρακτηρηστικά</h3>
                        <div class="d-flex flex-row align-items-baseline">
                            <input type="number" v-model="content.area" min="0" class="area form-control" style="width: 80px;"/>
                            <p>/τ.μ.</p>
                        </div>

                        <div class="characteristicsContainer">
                            <h3 class="subtitle">Παροχές</h3>
                            <form 
                                class="d-flex flex-column"
                                v-for="(characteristic, index) in content.characteristics"
                                v-bind:key="index">
                                    <div class="d-flex flex-row align-items-center justify-content-start characterisitc">
                                        <input type="checkbox" v-model="characteristic.status" class="form-check-input"/>
                                        <span class="checktext">{{ characteristic.name }}</span>
                                        <i aria-hidden="true" class="iconify mr-2 ml-auto" v-bind:data-icon="characteristic.icon" />
                                    </div>
                            </form>
                        </div>
                    </div>
                    <!-- στήλη 2 -->
                    <div>

                        <h3 class="subtitle element">Ελάχιστη τιμή</h3>
                        <div class="d-flex flex-row align-items-baseline">
                            <input type="number" v-model="content.price" min="0" class="area form-control" style="width: 80px;"/>
                            <p class="area">€</p>
                            <p>/διανυκτέρευση</p>
                        </div>

                        <h3 class="subtitle">Επιπλέον κόστος</h3>
                        <div class="d-flex flex-row align-items-baseline">
                            <input type="number" v-model="content.extraCost" min="0" class="area form-control" style="width: 80px;"/>
                            <p class="area">€</p>
                            <p>/ανά άτομο</p>
                        </div>

                        <!-- αριθμητικά -->
                        
                        <div class="d-flex flex-row justify-content-between arithmetic">
                            <p>Ελάχιστες μέρες:</p>
                            <input type="number" v-model="content.minDays" min="0" class="form-control"/>             
                        </div>
                        <div class="d-flex flex-row justify-content-between arithmetic">
                            <p>Αριθμός ατόμων:</p>
                            <input type="number" v-model="content.maxPersons" min="0" class="form-control"/>             
                        </div>
                        <div class="d-flex flex-row justify-content-between arithmetic">
                            <p>Αριθμός μπάνιων:</p>
                            <input type="number" v-model="content.numBaths" min="0" class="form-control"/>             
                        </div>
                        <div class="d-flex flex-row justify-content-between arithmetic">
                            <p>Αριθμός κρεβατιών:</p>
                            <input type="number" v-model="content.numBeds" min="0" class="form-control"/>             
                        </div>
                        <div class="d-flex flex-row justify-content-between arithmetic">
                            <p>Αριθμός υπνοδωματίων:</p>
                            <input type="number" v-model="content.numBedrooms" min="0" class="form-control"/>             
                        </div>
                        <div class="d-flex flex-row justify-content-between arithmetic">
                            <p>Τύπος χώρου:</p>
                            <select class="form-control" id="exampleFormControlSelect1" style="height: 35px; width: 100px;"  v-model="content.type">
                                <option>Οικεία</option>
                                <option>Δωμάτιο</option>
                            </select>             
                        </div>
                    </div>
                </div>
                
                <!-- κανόνες -->
                <h3 class="subtitle element">Κανόνες</h3>
                <div class="form-group">
                    <textarea required class="form-control" id="exampleFormControlTextarea1" rows="20" v-model="content.rules" placeholder="Εισάγεται κανόνες..." style="width: 690px; height: 180px; color: #194A50"></textarea>
                </div>
                <!-- Διαθεσιμότητα -->
                <h3 class="subtitle element">Διαθεσιμότητα</h3>
                <p>Όλες οι κρατήσεις σας.</p>
                <div class="calendarContainer">
                    <HotelDatePicker 
                        class="dateinputbox" 
                        ref="datePicker" 
                        :alwaysVisible="true" 
                        :closeDatepickerOnClickOutside="false"
                        :disabledDates="reservedDates"
                        format="DD/MM/YYYY"
                        v-on:check-in-changed="date1 = $event;"
                        v-on:check-out-changed="date2 = $event;"/>
                </div>
                <b-link class = "messagebutton d-flex align-items-center ml-auto" style="margin-bottom: 40px; margin-top: 40px;" @click="add_disabled_dates()"> 
                        Αποκλείστε επιλεγμένες ημέρες
                        <span class="iconify startspace" data-icon="ion-calendar"></span>
                </b-link>

                <!-- τοποθεσία -->
                <h3 class="subtitle element">Τοποθεσία</h3>
                <div class="form-group">
                    <textarea required class="form-control" id="exampleFormControlTextarea1" rows="20" v-model="content.location" placeholder="Εισάγεται οδηγίες πρόσβασης..." style="width: 690px; height: 180px; color: #194A50"></textarea>
                </div>

                <div class="d-flex flex-row align-items-baseline">
                    <span class="iconify addressIcon startspace" data-icon="ion-location"></span>
                    <input required type="text" v-model="content.address" class="form-control area" style="width: 400px; height: 30px;" placeholder="Εισάγεται διεύθυνση..."/>             
                    <p>/διεύθυνση</p>
                </div>
                
                <div style="height: 400px;">
                    <!-- <div class="info" style="height: 15%">
                        <span>Center: {{ center }}</span>
                        <span>Zoom: {{ zoom }}</span>
                        <span>Bounds: {{ bounds }}</span>
                    </div> -->
                    <l-map
                        style="height: 100%; width: 100%"
                        :zoom="zoom"
                        :center="center"
                        @update:zoom="zoomUpdated"
                        @update:center="centerUpdated"
                        @update:bounds="boundsUpdated"
                        >
                        <l-marker :lat-lng="content.markerLatLng" ></l-marker>
                        <l-tile-layer :url="url"></l-tile-layer>
                    </l-map>
                </div>
                <div class="d-flex flex-row justify-content-around">
                    <div class="d-flex flex-row">
                        <p style="
                        font-style: normal;
                        font-size: 18px;
                        line-height: 21px;
                        color: #4E7378;">
                            Γεωγραφικό πλάτος:</p>
                        <input required type="number" v-model="content.markerLatLng[0]" class="form-control" style="width: 80px;"/>
                    </div>
                    <div class="d-flex flex-row">
                        <p style="
                        font-style: normal;
                        font-size: 18px;
                        line-height: 21px;
                        color: #4E7378;">
                            Γεωγραφικό μήκος:</p>
                        <input required type="number" v-model="content.markerLatLng[1]" class="form-control" style="width: 80px;"/>
                    </div>             
                </div>
                <button type="submit" class = "messagebutton d-flex align-items-center ml-auto" style="margin-bottom: 40px; margin-top: 40px;" @click.prevent="submit_edit()"> 
                        <div v-if="content.id==null">
                            Δημιουργία χώρου
                        </div>
                        <div v-if="content.id!=null">
                            Αποθήκευση αλλαγών
                        </div>
                        <span class="iconify startspace" data-icon="ion-home"></span>
                </button>    
            </div>

            
            <!-- scrolling form -->
            <form class="d-flex flex-column justify-content-start  reservationForm">
                <span class="reservationHeader">
                    <h3 class="subtitle" style="color: white;" > Οι χώροι μου </h3>
                </span>
                <div 
                class="d-flex flex-row allign-content-baseline justify-content-between space"
                v-for="(s, index) in spaces"
                v-bind:key="index"
                @click="fetch(s.idAccomodation)">
                    <p style="margin-bottom: 0px;">{{s.Name}}</p>
                    <p class="iconify" data-icon="ion-home" style="height: 24px; width: 24px;"></p>
                </div>
            </form>
        </div>
    </form>
</template>



<script>
import HotelDatePicker from 'vue-hotel-datepicker2';
import StarRating from 'vue-star-rating';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

 export default {
    components: {
        HotelDatePicker,
        StarRating,
        LMap, 
        LTileLayer, 
        LMarker,
        Icon
    },

    data() {
        return {
            newImage: null,
            reservedDates: [],

            date1: "",
            date2: "",

            images:[],
            content:{
                id: null,
                title: "",
                description: "",
                area: 0,
                price: 0,
                extraCost: 0,
                minDays: 0,
                maxPersons: 0,
                numBaths: 0,
                numBeds: 0,
                numBedrooms: 0,
                type: "",
                
                characteristics: [
                    {
                        name: 'Wifi',
                        icon: 'ion-wifi',
                        status: true,
                    },
                    {
                        name: 'Ψύξη',
                        icon: 'ion-snow',
                        status: true,
                    },
                    {
                        name: 'Θέρμανση',
                        icon: 'ion-thermometer',
                        status: true,
                    },
                    {
                        name: 'Κουζίνα',
                        icon: 'ion-fast-food',
                        status: true,
                    },
                    {
                        name: 'Τηλεόραση',
                        icon: 'ion-tv',
                        status: true,
                    },
                    {
                        name: 'Χώρος στάθμευσης',
                        icon: 'ion-car',
                        status: true,
                    },
                    {
                        name: 'Ανελκυστήρας',
                        icon: 'ion-arrow-up',
                        status: true,
                    },
                    {
                        name: 'Καθιστικό',
                        icon: 'ion-happy-outline',
                        status: true,
                    },
                ],
                rules: "",

                location: "",
                address: "",
                markerLatLng: [37.9838, 23.7275],

                newReservedDates:[],
            },

            //img carousel
            slide: 0,
            sliding: null,
            
            //map
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 3,
            center: [47.413220, -1.219482],
            bounds: null,

            spaces: [],
        }
    },
    methods: {
        loadFile() {
            // this.content.images.push(URL.createObjectURL(this.newImage));
            // console.log(image);
        },

        onSlideStart() {
            this.sliding = true
        },
        onSlideEnd() {
            this.sliding = false
        },

        zoomUpdated (zoom) {
            this.zoom = zoom;
        },
        centerUpdated (center) {
            this.center = center;
        },
        boundsUpdated (bounds) {
            this.bounds = bounds;
        },

        getDates(startDate, endDate){
            // console.log(startDate + " " + endDate);
            let dates = [];
            //to avoid modifying the original date
            const theDate = new Date(startDate);
            while (theDate <= endDate) {
                console.log(theDate);
                theDate.setDate(theDate.getDate() + 1);
                dates = [...dates, new Date(theDate)];
            }
            // console.log(dates);
            return dates;
        },

        disable_dates(reservations){
            // console.log(reservations);
            let final = [];
            var i;
            for(i=0 ; i < reservations.length ; i++){
                let from = new Date(reservations[i].From);
                let to = new Date(reservations[i].To);

                // from = from.toISOString().split('T')[0];
                // to = to.toISOString().split('T')[0]

                final = final.concat(this.getDates(from, to));

            }
            for(let i = 0 ; i < final.length ; i++){
                final[i] = final[i].toISOString().split('T')[0];
            }
            // console.log(final);
            return final;
        },

        add_disabled_dates(){
            if(this.date1 != "" && this.date2 != ""){

                let final = [];
                let from = new Date(this.date1);
                let to = new Date(this.date2);



                let temp = {
                    From: from.toISOString().split('T')[0],
                    To: to.toISOString().split('T')[0],
                }
                this.content.newReservedDates.push(temp);

                final = this.getDates(from, to);
                console.log(final);

                for(let i = 0 ; i < final.length ; i++){
                    final[i] = final[i].toISOString().split('T')[0];
                }

                this.reservedDates = this.reservedDates.concat(final);
            }
        },

        async get_spaces() {
            if (this.user) {
                let query = "?host=" + this.$store.state.user.idUsers;
                let response = await this.$axios.get('/accommodations' + query);
                this.spaces = response.data;
            }
        },

        async fetch(id) {
            // if (this.user) {
            //     console.log("FETCHING" + id);
            //     let response = await this.$axios.post('/fetch', {
            //         id: id,
            //     });
            //     console.log(response);
            //     this.content = response.data;
            //     this.reservedDates = this.disable_dates(response.data.disabledDates);
            // }
        },

        async submit_edit() {
            // if (this.user) {
            //     console.log("SUBMIT EDIT");
            //     let formData = new FormData();
            //     formData.append('content', JSON.stringify(this.content));
            //     formData.append('idHost', this.$store.state.user.idUsers);
            //     for (var i = 0; i < this.images.length; i++) {
            //         var file = this.images[i];
            //         formData.append('images', file);
            //     }

            //     let response = await this.$axios.post('/submit_edit',
            //         formData, 
            //         {
            //             headers: {
            //                 crossdomain: true,
            //                 'Content-Type': 'undefined'
            //             }
            //         }
            //     );
            // }
            // location.reload();
        },
    },
    computed: {
        user() {
            if (this.$store.state.user)
                return this.$store.state.user;
            else if (this.$store.state.token) {
                this.$store.commit('updateUser', this.$jwt.decode(this.$store.state.token).user);
                return this.$store.state.user;
            }
            else
                return '';
        },
    },

    mounted() {
        this.$refs.datePicker.showDatepicker();
        // this.$nextTick(() => {
        //     this.$refs.myMap.mapObject.test();
        // });
    },

    updated() {
        this.$refs.datePicker.showDatepicker();
    },

    beforeUpdate(){
        this.$refs.datePicker.showDatepicker();
    },
    created() {
        this.get_spaces();
    }
  }
</script>

<style scoped>
.container{
    padding: 0 30px;
    margin-top: 50px;
}

.element{
    margin-top: 25px;
    margin-bottom: 10px;
}

.title{
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 36px;
    line-height: 42px;

    color: #194A50;

}

.titleIcon:hover{
    cursor: pointer;
}



.subtitle{
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;

    color: #194A50;
}

.area{
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 28px;
    text-align: justify;

    color: #484A4A;
}

.characterisitc{
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;

    width: 300px;

    color: #4E7378;
}

.arithmetic{
    font-family: Roboto;
    font-style: normal;
    font-size: 18px;
    line-height: 21px;
    
    width: 275px;

    margin-bottom: -10px;

    color: #4E7378;
}

.characteristicsContainer{
    margin-top: 30px;
}

.calendarContainer{
    /* padding: 10 10px;
    background-color: #194A50;
    width:700px;
    height:450px; */
    margin-bottom: 400px;
}

.dateinputbox{
    background:#194A50;
    height: 40px;
    width: 690px;
    border: none;
    outline: none;
    color: white;
}

.datepicker__inner{
    width: 660px
}

.endspace{
    margin-right: 5px;
}

.hosticon{
    color: #194A50;
    width: 24px;
    height: 24px;
}

.hostName{
    font-style: normal;
    font-weight: 500;
    font-size: 36px;
    line-height: 42px;

    color: #194A50;
}

.messagebutton{
    border-radius: 90px;

    margin-left: 30px;

    background: none;
	color: white;
    background-color: #D37556;
	cursor: pointer;

    border: none;
    outline: none;
    
    height: 40px;
    padding: 0 20px;
}


.messagebutton:hover{
    background-color: #9C533B;
    color: white;
    text-decoration: none;   
}

.startspace{
    margin-left: 5px;
}

.stars{
    margin-top: 0px;
    padding: 10 10px;

    font-weight: bold;
    font-size: 24px;
    color: #194A50;
}

.input-group{
    margin-bottom: 25px;
}

.reviewText {
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 21px;
    /* identical to box height */


    color: #FFFFFF;
}

.reviewContent{
    font-style: normal;
    font-weight: 250;
    font-size: 24px;
    line-height: 21px;
    /* identical to box height */

    margin-top: 15px;
    text-align: left;

    color: #FFFFFF;
}

.addressIcon{
    width: 24px;
    height: 24px;
    color: #194A50;
}

.reservationForm{
    width: 300px;
    height: 323px;
    border: 1px solid #4E7378;
    background-color: white;
    color: #8ac1c9;

    position: sticky;
    top: 50px;
    margin-top: 73px;

    /* filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); */
    border-radius: 10px;
}

.contentLeft{
    width: 690px;
    
}

.sumArea{
    font-style: normal;
    font-weight: bold;
    font-size:  18px;
    height: 18px;

    color: #484A4A;
}

.reservationHeader{
    background-color: #194A50;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    padding-left: 10px;
    padding-top: 10px;   
}

.reservationContent{
    margin-top: 10px;
    padding: 0 10px;  
}

.reservationButton{
    border-radius: 90px;
    width: 90%;

    margin-top: 113px;
    margin-bottom: 10px;

    background: none;
	color: white;
    background-color: #D37556;
	cursor: pointer;

    border: none;
    outline: none;
    
    height: 40px;
    padding: 0 90px;
}


.reservationButton:hover{
    background-color: #9C533B;
    color: white;
    text-decoration: none;   
}

.addImageText{
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    /* identical to box height */

    color: #194A50;
}

.addImageText:hover{
    text-decoration-line: underline;
    cursor: pointer;
}

.addImageIcon{
    color: #194A50;
    width: 24px;
    height: 24px;
}

.form-control{
    width: 60px;
    height: 24px;    
    border-radius: 3px;
    padding-right: 0px;
    padding-left: 6px;
    text-overflow: ellipsis;
    /* background-color: #759296; */
    color: black;
}

.form-check-input{
    position: relative;
    bottom:5px;
    left: 20px;
}

.checktext{
    position: relative;
    left: 30px;
}

.space{
    margin: 0 5px;
    margin-top: 5px;
    padding-top: 15px;
    padding-bottom: 15px;
    padding: 0 10px;

    color:white;
    background: #4E7378;
    border-radius: 3px;
}

.space:hover{
    cursor: pointer;
    background: #334D51;
}


</style>
