<template>
    <div class="d-flex justify-content-between container">
        
        <div class="contentLeft d-flex flex-column justify-content-start">
            <!-- τίτλος  -->
            <div class="d-flex flex-row align-items-center">
                <h2 id="title" class="title" :contentEditable="titleEdit">{{content.title}}</h2>
                <div class="d-flex justify-content-center">
                    <b-link class = "messagebutton d-flex align-items-center " 
                        @click="titleFocus()"
                        @change.prevent="titleEdit=false">
                        <div v-if="titleEdit==false">
                            Επεξεργασία
                        </div>
                        <div v-if="titleEdit==true">
                            Αποθήκευση
                        </div>
                        <span class="iconify startspace" data-icon="ion-build"></span>
                    </b-link>
                </div>

                
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
                <a class="addImageText">Προσθήκη εικόνας</a>
                <span class="iconify startspace addImageIcon" data-icon="ion-camera"></span>
            </div>

            <!-- περιγραφή -->
            <h3 class="subtitle element">Περιγραφή</h3>
            <p id="description" :contentEditable="descriptionEdit"> {{content.description}} </p>
            <div class="d-flex justify-content-center element">
                <b-link class = "messagebutton d-flex align-items-center ml-auto" 
                        @click="descriptionFocus()"
                        @change.prevent="descriptionEdit=false">
                        <div v-if="descriptionEdit==false">
                            Επεξεργασία
                        </div>
                        <div v-if="descriptionEdit==true">
                            Αποθήκευση
                        </div>
                        <span class="iconify startspace" data-icon="ion-build"></span>
                    </b-link>
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
                </div>
            </div>
            
            <!-- κανόνες -->
            <h3 class="subtitle element">Κανόνες</h3>
            <p id="rules" :contentEditable="rulesEdit" > {{content.rules}} </p>
            <div class="d-flex justify-content-center element">
                 <b-link class = "messagebutton d-flex align-items-center ml-auto" 
                        @click="rulesFocus()"
                        @change.prevent="rulesEdit=false">
                        <div v-if="rulesEdit==false">
                            Επεξεργασία
                        </div>
                        <div v-if="rulesEdit==true">
                            Αποθήκευση
                        </div>
                        <span class="iconify startspace" data-icon="ion-build"></span>
                    </b-link>
            </div>

            <!-- Διαθεσιμότητα -->
            <h3 class="subtitle element">Διαθεσιμότητα</h3>
            <p>Όλες οι κρατήσεις σας.</p>
            <div class="calendarContainer">
                <HotelDatePicker 
                    class="dateinputbox" 
                    ref="datePicker" 
                    :closeDatepickerOnClickOutside="false"
                    format="DD/MM/YYYY"
                    v-on:check-in-changed="date1 = $event;"
                    v-on:check-out-changed="date2 = $event;"/>
            </div>

            <!-- τοποθεσία -->
            <h3 class="subtitle element">Τοποθεσία</h3>
            <p id="location" :contentEditable="locationEdit"> {{content.location}} </p>
            <div class="d-flex justify-content-center element">
                <b-link class = "messagebutton d-flex align-items-center ml-auto" 
                    @click="locationFocus()"
                    @change.prevent="locationEdit=false">
                    <div v-if="locationEdit==false">
                        Επεξεργασία
                    </div>
                    <div v-if="locationEdit==true">
                        Αποθήκευση
                    </div>
                    <span class="iconify startspace" data-icon="ion-build"></span>
                </b-link>
            </div>

            <div class="d-flex flex-row align-items-baseline">
                <span class="iconify addressIcon startspace" data-icon="ion-location"></span>
                <input type="text" v-model="content.address" class="form-control area" style="width: 400px; height: 30px;"/>             
                <p>/διεύθυνση</p>
            </div>
            <div class="d-flex flex-row justify-content-between">
                <div class="d-flex flex-row">
                    <p style="
                    font-style: normal;
                    font-size: 18px;
                    line-height: 21px;
                    color: #4E7378;">
                        Γεωγραφικό πλάτος:</p>
                    <input type="number" v-model="content.markerLatLng[0]" min="0" class="form-control" style="width: 80px;"/>
                </div>
                <div class="d-flex flex-row">
                    <p style="
                    font-style: normal;
                    font-size: 18px;
                    line-height: 21px;
                    color: #4E7378;">
                        Γεωγραφικό μήκος:</p>
                    <input type="number" v-model="content.markerLatLng[1]" min="0" class="form-control" style="width: 80px;"/>
                </div>             
            </div>
            
            <div style="height: 500px;">
                <!-- <div class="info" style="height: 15%">
                    <span>Center: {{ center }}</span>
                    <span>Zoom: {{ zoom }}</span>
                    <span>Bounds: {{ bounds }}</span>
                </div> -->
                <l-map
                    style="height: 80%; width: 100%"
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
        </div>

        
        <!-- scrolling form -->
        <form class="d-flex flex-column justify-content-start reservationForm">
            <span class="reservationHeader">
                <h3 class="subtitle" style="color: white;" > Σύνοψη κράτησης </h3>
            </span>               
        </form>
    </div>
</template>



<script>
import HotelDatePicker from 'vue-hotel-datepicker'
import StarRating from 'vue-star-rating'
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
            content:{
                title: "Εισάγετε τίτλο χώρου",
                description: "Εισάγετε περιγραφή χώρου",
                images:[],
                area: 0,
                price: 0,
                extraCost: 0,
                minDays: 0,
                maxPersons: 0,
                numBaths: 0,
                numBeds: 0,
                numBedrooms: 0,
                reservationPrice: 0,
                
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
                rules: "Εισάγετε κανόνες χώρου",

                location: "Εισάγετε οδηγίες μεταφοράς σε χώρο",
                address: "Εισάγετε διεύθυνση χώρου",
                markerLatLng: [37.9838, 23.7275],

            },
            titleEdit: false,
            descriptionEdit: false,
            rulesEdit: false,
            locationEdit: false,


            //img carousel
            slide: 0,
            sliding: null,            
            
            //map
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 3,
            center: [47.413220, -1.219482],
            bounds: null,


        }
    },
    methods: {
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

        titleFocus(){
            if(this.titleEdit == false){
                this.titleEdit = true;
                document.getElementById("title").style.border = "1px solid #4E7378";
            }
            else{
                if(this.content.title != ""){
                    this.titleEdit = false;
                    document.getElementById("title").style.border = "0px solid #4E7378";
                }
            }
        },

        descriptionFocus(){
            if(this.descriptionEdit == false){
                this.descriptionEdit = true;
                document.getElementById("description").style.border = "1px solid #4E7378";
            }
            else{
                if(this.content.description != ""){
                    this.descriptionEdit = false;
                    document.getElementById("description").style.border = "0px solid #4E7378";
                }
            }
        },

        rulesFocus(){
            if(this.rulesEdit == false){
                this.rulesEdit = true;
                document.getElementById("rules").style.border = "1px solid #4E7378";
            }
            else{
                if(this.content.rules != ""){
                    this.rulesEdit = false;
                    document.getElementById("rules").style.border = "0px solid #4E7378";
                }
            }
        },

        locationFocus(){
            if(this.locationEdit == false){
                this.locationEdit = true;
                document.getElementById("location").style.border = "1px solid #4E7378";
            }
            else{
                if(this.content.location != ""){
                    this.locationEdit = false;
                    document.getElementById("location").style.border = "0px solid #4E7378";
                }
            }
        },

        
    },
    computed: {
       
    },

    mounted() {
        this.$refs.datePicker.showDatepicker();
        this.$nextTick(() => {
            this.$refs.myMap.mapObject.test();
        });
    },

    updated() {
        this.$refs.datePicker.showDatepicker();
    },

    beforeUpdate(){
        this.$refs.datePicker.showDatepicker();
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
    color: #194A50;

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


</style>
