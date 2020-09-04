<template>
    <div class="d-flex justify-content-between container">
        
        <div class="contentLeft d-flex flex-column justify-content-start">
            <!-- τίτλος  -->
            <div class="d-flex flex-row align-items-center">
                <h2 id="title" class="title" :contentEditable="titleEdit">{{title}}</h2>
                <div class="d-flex justify-content-center">
                <b-link class = "messagebutton d-flex align-items-center " 
                    @click="focus('title')"
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
                    <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=52"/>
                    <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=53"/>
                    <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54"/>
                    <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=55"/>
            
                </b-carousel>
            </div>
            <div class="d-flex flex-row align-items-center">
                <a class="addImageText">Προσθήκη εικόνας</a>
                <span class="iconify startspace addImageIcon" data-icon="ion-camera"></span>
            </div>

            <!-- περιγραφή -->
            <h3 class="subtitle element">Περιγραφή</h3>
            <p> {{placeholderText}} </p>
            <div class="d-flex justify-content-center element">
                <b-link class = "messagebutton d-flex align-items-center ml-auto" to="">
                    Επεξεργασία
                    <span class="iconify startspace" data-icon="ion-build"></span>
                </b-link>
            </div>
            
            <!-- χαρακτηρηστικά -->
            <div class="d-flex flex-row justify-content-between">
                <!-- στήλη 1 -->
                <div>
                    
                    <h3 class="subtitle element">Χαρακτηρηστικά</h3>
                    <div class="d-flex flex-row align-items-baseline">
                        <p class="area">{{area}}</p>
                        <p>/τ.μ.</p>
                        <span class="iconify startspace addImageIcon" data-icon="ion-build"></span>
                    </div>

                    <div class="characteristicsContainer">
                        <h3 class="subtitle">Παροχές</h3>
                        <form 
                            class="d-flex flex-column"
                            v-for="(characteristic, index) in characteristics"
                            v-bind:key="index">
                                <div 
                                    class="d-flex flex-row align-items-center justify-content-start characterisitc"
                                    v-if="characteristic.status"
                                    >
                                        <input type="checkbox" class="form-check-input"/>
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
                        <p class="area">{{price}}</p>
                        <p class="area">€</p>
                        <p>/διανυκτέρευση</p>
                        <span class="iconify startspace addImageIcon" data-icon="ion-build"></span>
                    </div>

                    <h3 class="subtitle">Επιπλέον κόστος</h3>
                    <div class="d-flex flex-row align-items-baseline">
                        <p class="area">{{extraCost}}</p>
                        <p class="area">€</p>
                        <p>/ανά άτομο</p>
                        <span class="iconify startspace addImageIcon" data-icon="ion-build"></span>
                    </div>

                    <!-- αριθμητικά -->
                    
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Ελάχιστες μέρες:</p>
                        <input type="number" class="form-control"/>             
                    </div>
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Αριθμός ατόμων:</p>
                        <input type="number" class="form-control"/>             
                    </div>
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Αριθμός μπάνιων:</p>
                        <input type="number" class="form-control"/>             
                    </div>
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Αριθμός κρεβατιών:</p>
                        <input type="number" class="form-control"/>             
                    </div>
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Αριθμός υπνοδωματίων:</p>
                        <input type="number" class="form-control"/>             
                    </div>
                </div>
            </div>
            
            <!-- κανόνες -->
            <h3 class="subtitle element">Κανόνες</h3>
            <p> {{placeholderText}} </p>
            <div class="d-flex justify-content-center element">
                <b-link class = "messagebutton d-flex align-items-center ml-auto" to="">
                    Επεξεργασία
                    <span class="iconify startspace" data-icon="ion-build"></span>
                </b-link>
            </div>

            <!-- Διαθεσιμότητα -->
            <h3 class="subtitle element">Διαθεσιμότητα</h3>
            <p>Προσθέστε τις ημερομηνίες του ταξιδιού σας, για να δείτε συγκεκριμένη τιμή.</p>
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
            <p> {{placeholderText}} </p>
            <div class="d-flex justify-content-center element">
                <b-link class = "messagebutton d-flex align-items-center ml-auto" to="">
                    Επεξεργασία
                    <span class="iconify startspace" data-icon="ion-build"></span>
                </b-link>
            </div>

            <div class="d-flex flex-row align-items-baseline">
                <span class="iconify addressIcon startspace" data-icon="ion-location"></span>
                <p class="area">{{address}}</p>
                <p>/διεύθυνση</p>
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
                    <l-marker :lat-lng="markerLatLng" ></l-marker>
                    <l-tile-layer :url="url"></l-tile-layer>
                </l-map>
            </div>    
        </div>

        
        <!-- scrolling form -->
        <form class="d-flex flex-column justify-content-start reservationForm">
            <span class="reservationHeader">
                <h3 class="subtitle" style="color: white;" > Σύνοψη κράτησης </h3>
            </span>
            <div class="reservationContent d-flex flex-column justify-content-start">
                <div class="d-flex flex-row justify-content-between">
                    <h5 class="endspace" style="color: black; font-weight: normal;" >Τελική τιμή:</h5>
                    <div class="d-flex flex-row">
                        <p class="sumArea">{{total.toFixed(2)}}</p>
                        <p class="sumArea">€</p>
                    </div>
                </div>
                <div class="d-flex flex-row justify-content-between">
                    <h5 class="endspace" style="color: black; font-weight: normal;" >Ημέρες:</h5>
                    <p class="sumArea">{{nights}}</p>
                </div>
                <div class="d-flex flex-row justify-content-between">
                    <h5 class="endspace" style="color: black; font-weight: normal;" >Άτομα:</h5>
                    <p class="sumArea">1</p>
                </div>
            </div>

            <div class="d-flex justify-content-center">
                <b-link class = "reservationButton d-flex align-items-center " to="/results">
                    Κράτηση
                    <span class="iconify startspace" data-icon="ion-card"></span>
                </b-link>
            </div>
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
            titleEdit: false,
            title: "Title",

            slide: 0,
            sliding: null,
            
            placeholderText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quam sapien, rutrum viverra nunc et, tincidunt sagittis libero. Curabitur dictum tellus sit amet arcu ultrices, in accumsan ipsum ultricies. Donec blandit ac felis id varius. Vestibulum quam tortor, ullamcorper ut euismod et, feugiat et nisl.',
            
            area: "46",
            price: 68,
            extraCost: 55,
            
            minDays: "5",
            numPersons: "3",
            numBeds: "3",
            numBaths: "4",
            numBedrooms: "1",
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

            date1: "",
            date2: "",
            reservationPrice: 0,

            hostName: "Νίκος Νιωτς",
            hostImagePath: require("../assets/profile_pics/quirkygirl85.jpg"),
            reviewScore: 2.6,
            reviewNum: 68,
            userReviews: [
                {
                    text: 'Sed sodales, nulla sed interdum accumsan, est nulla convallis orci, quis rhoncus nisi diam vitae libero. Nulla nec porttitor purus. Nullam tincidunt interdum interdum. Ut suscipit tellus eget orci efficitur, sit amet feugiat ante posuere. Mauris malesuada, dolor imperdiet vulputate sagittis, ante magna accumsan arcu, sed mollis lectus massa a ante. Sed tincidunt consequat erat ut imperdiet. Nulla ornare magna at nisi porta, sed tempus augue pellentesque.',
                    score: 3.5,
                    user: 'Kostkuber',
                    profilepicpath: require("../assets/profile_pics/quirkygirl85.jpg"),
                },
                {
                    text: 'Sed sodales, nulla sed interdum accumsan, est nulla convallis orci, quis rhoncus nisi diam vitae libero. Nulla nec porttitor purus. Nullam tincidunt interdum interdum. Ut suscipit tellus eget orci efficitur, sit amet feugiat ante posuere. Mauris malesuada, dolor imperdiet vulputate sagittis, ante magna accumsan arcu, sed mollis lectus massa a ante. Sed tincidunt consequat erat ut imperdiet. Nulla ornare magna at nisi porta, sed tempus augue pellentesque.',
                    score: 3,
                    user: 'Kostkuber',
                    profilepicpath: require("../assets/profile_pics/quirkygirl85.jpg"),
                },
            ],
            userRating: 0,
            newReview: "",
            reviewBG: require("../assets/review background.png"),
            
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 3,
            center: [47.413220, -1.219482],
            bounds: null,
            address: "Παπαντωνίου 10, Αθήνα",
            markerLatLng: [37.9838, 23.7275],


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

        focus(id){
            if(this.titleEdit == false){
                this.titleEdit = true;
                document.getElementById(id).style.border = "1px solid #4E7378";
            }
            else{
                if(this.title != ""){
                    this.titleEdit = false;
                    document.getElementById(id).style.border = "0px solid #4E7378";
                }
            }
        }
    },
     computed: {
        total() {
            let s = 0;
            // let days = 1;
			if(this.date1 != '' && this.date2 != ''){
                console.log(this.date2);
                console.log(this.date2);
                let time = this.date2.getTime() - this.date1.getTime();
                let days = time / (1000 * 3600 * 24) -1;
                console.log(days);
                s = this.price + days * this.extraCost;
            }
			return s;
        },
        
        average_score() {
            let counter = 0;
            let totalScore = 0;
            var r;
            for(r of this.userReviews){
                // console.log(r.score);
                totalScore = totalScore + r.score;
                counter = counter + 1;
            }
            if(totalScore == 0){
                return 0;
            }
            else{
                return totalScore/counter;
            }
        },

        nights() {
            let d = 0;
            // let days = 1;
			if(this.date1 != '' && this.date2 != ''){
                let time = this.date2.getTime() - this.date1.getTime();
                d = time / (1000 * 3600 * 24) -1;
            }
			return d;
        },

        total_reviews(){
            return this.userReviews.length;
        }
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

    /* background-color: #759296; */
    color: white;
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
