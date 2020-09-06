<template>
    <div class="d-flex justify-content-between container">
        
        <div class="contentLeft d-flex flex-column justify-content-start">
            <!-- τίτλος  -->
            <h2 class="title">{{title}}</h2>
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
                        v-for="(p, index) in path"
                        v-bind:key="index"
                        :img-src="require(`@/assets/accommodation_pics/${p.Path}`)"/>
            
                </b-carousel>
            </div>
            <!-- περιγραφή -->
            <h3 class="subtitle element">Περιγραφή</h3>
            <p> {{desc}} </p>
            
            <!-- χαρακτηρηστικά -->
            <div class="d-flex flex-row justify-content-between">
                <!-- στήλη 1 -->
                <div>
                    <h3 class="subtitle element">Χαρακτηρηστικά</h3>
                    <div class="d-flex flex-row align-items-center">
                        <p class="area">{{area}}</p>
                        <p>/τ.μ.</p>
                    </div>

                    <div class="characteristicsContainer">
                        <h3 class="subtitle">Παροχές</h3>
                        <form 
                            class="d-flex flex-column"
                            v-for="(characteristic, index) in characteristics"
                            v-bind:key="index">
                                <div 
                                    class="d-flex flex-row align-items-center justify-content-between characterisitc"
                                    v-if="characteristic.status"
                                    >
                                        <span>{{ characteristic.name }}</span>
                                        <i aria-hidden="true" class="iconify mr-2" v-bind:data-icon="characteristic.icon" />
                                </div>
                        </form>
                    </div>
                </div>
                <!-- στήλη 2 -->
                <div>

                    <h3 class="subtitle element">Ελάχιστη τιμή</h3>
                    <div class="d-flex flex-row align-items-center">
                        <p class="area">{{price}}</p>
                        <p class="area">€</p>
                        <p>/διανυκτέρευση</p>
                    </div>

                    <h3 class="subtitle">Επιπλέον κόστος</h3>
                    <div class="d-flex flex-row align-items-center">
                        <p class="area">{{extraCost}}</p>
                        <p class="area">€</p>
                        <p>/ανά άτομο</p>
                    </div>

                    <!-- αριθμητικά -->
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Ελάχιστες μέρες:</p>
                        <p>{{minDays}}</p>
                    </div>
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Αριθμός ατόμων:</p>
                        <p>{{numPersons}}</p>
                    </div>
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Αριθμός μπάνιων:</p>
                        <p>{{numBaths}}</p>
                    </div>
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Αριθμός κρεβατιών:</p>
                        <p>{{numBedrooms}}</p>
                    </div>
                    <div class="d-flex flex-row justify-content-between arithmetic">
                        <p>Αριθμός υπνοδωματίων:</p>
                        <p>{{numBedrooms}}</p>
                    </div>
                </div>
            </div>
            
            <!-- κανόνες -->
            <h3 class="subtitle element">Κανόνες</h3>
            <p> {{rulesText}} </p>

            <!-- Διαθεσιμότητα -->
            <h3 class="subtitle element">Διαθεσιμότητα</h3>
            <p>Προσθέστε τις ημερομηνίες του ταξιδιού σας, για να δείτε συγκεκριμένη τιμή.</p>
            <div class="calendarContainer">
                <HotelDatePicker 
                    class="dateinputbox" 
                    ref="datePicker" 
                    :closeDatepickerOnClickOutside="false"
                    :disabledDates="reservedDates"
                    format="DD/MM/YYYY"
                    v-on:check-in-changed="date1 = $event;"
                    v-on:check-out-changed="date2 = $event;"/>
            </div>

            <!-- χοστ -->
            <div class="d-flex flex-row align-items-start element">
                <i class="iconify hosticon endspace" data-icon="ion-home"></i>
                <h3 class="subtitle">Οικοδεσπότης:</h3>
            </div>
            <div class="d-flex flex-row">
                <img :src="require(`@/assets/profile_pics/${hostImagePath}`)" width="40px" height="40px" class="rounded-circle endspace">
                <p class="hostName">{{hostName}}</p>
                <div class="d-flex justify-content-center">
                    <b-link class = "messagebutton d-flex align-items-center " to="/results">
                        Μύνημα
                        <span class="iconify startspace" data-icon="ion-mail"></span>
                    </b-link>
                </div>
            </div>
            <div class="d-flex flex-row align-items-start">
                <p class="subtitle">{{reviewScore}}</p>
                <i class="iconify hosticon startspace endspace" data-icon="ion-star"></i>
                <a class="subtitle startspace">{{total_reviews}} κριτικές</a>
            </div>
            <div v-if="user && canReview==true">
                <p>Επισκευθήκατε τον χώρο αυτό; Περιγράψτε μας την εμπειρία σας.</p>
                <star-rating v-model="newRating" class="element stars" :starSize="25"></star-rating>
                <div class="input-group">
                    <textarea class="form-control"  v-model="newReview"></textarea>
                </div>
                <div class="d-flex justify-content-center ml-auto">
                    <b-link class = "messagebutton d-flex align-items-center ml-auto" @click="submit_review()">
                        Υποβολή
                        <span class="iconify startspace" data-icon="ion-send"></span>
                    </b-link>
                </div>
            </div>
            <div class="element smallCarousel">
                <b-carousel
                    id="carousel-1"
                    v-model="slide"
                    :interval="3000"
                    controls
                    indicators
                    background="#ccc"
                    img-width="1024"
                    img-height="480"
                    style=""
                    @sliding-start="onSlideStart"
                    @sliding-end="onSlideEnd"   
                >
                    <b-carousel-slide
                        v-for="(review, index) in userReviews"
                        v-bind:key="index" 
                        :img-src="reviewBG"
                        style="height:275px;">
                        <div class="d-flex flex-column "> 
                            <div class="d-flex flex-row align-items-start">
                                <img :src="review.profilepicpath" width="60px" height="60px" class="rounded-circle endspace">
                                <h3 class="reviewText startspace endspace">{{review.user}}</h3>
                                <i class="iconify hosticon startspace endspace" data-icon="ion-star" style="color:white;"></i>
                                <h3 class="reviewText startspace endspace">{{review.score}}</h3>

                            </div>
                            <p class="reviewContent"> {{review.text}} </p>
                        </div>
                    </b-carousel-slide>
                </b-carousel>
            </div>

            <!-- τοποθεσία -->
            <h3 class="subtitle element">Τοποθεσία</h3>
            <p> {{locationText}} </p>

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
            id: null,
            slide: 0,
            sliding: null,
            
            placeholderText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quam sapien, rutrum viverra nunc et, tincidunt sagittis libero. Curabitur dictum tellus sit amet arcu ultrices, in accumsan ipsum ultricies. Donec blandit ac felis id varius. Vestibulum quam tortor, ullamcorper ut euismod et, feugiat et nisl.',
            
            title: "",
            path: [],
            desc: "",
            rulesText: "",

            area: "46",
            price: 68,
            extraCost: 55,
            
            minDays: "5",
            numPersons: "3",
            numBeds: "3",
            numBaths: "4",
            numBedrooms: "1",
            characteristics: [ ],

            date1: "",
            date2: "",
            reservationPrice: 0,
            reservedDates: [],

            hostName: "Νίκος Νιωτς",
            hostImagePath: "default.png",
            reviewScore: 2.6,
            reviewNum: 68,
            userReviews: [],
            reviewBG: require("../assets/review background.png"),
            
            canReview: true,
            newRating: null,
            newReview: "",
            
            locationText: "",
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 3,
            center: [47.413220, -1.219482],
            bounds: null,
            markerLatLng: [37.9838, 23.7275],
            address:"",


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

        assign_characteristics(characteristics){
            let final = [
                {
                    name: 'Wifi',
                    icon: 'ion-wifi',
                    status: false,
                },
                {
                    name: 'Ψύξη',
                    icon: 'ion-snow',
                    status: false,
                },
                {
                    name: 'Θέρμανση',
                    icon: 'ion-thermometer',
                    status: false,
                },
                {
                    name: 'Κουζίνα',
                    icon: 'ion-fast-food',
                    status: false,
                },
                {
                    name: 'Τηλεόραση',
                    icon: 'ion-tv',
                    status: false,
                },
                {
                    name: 'Χώρος στάθμευσης',
                    icon: 'ion-car',
                    status: false,
                },
                {
                    name: 'Ανελκυστήρας',
                    icon: 'ion-arrow-up',
                    status: false,
                },
                {
                    name: 'Καθιστικό',
                    icon: 'ion-happy-outline',
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
        getDates(startDate, endDate) {
            var dates = [],
                currentDate = startDate,
                addDays = function(days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                };
            while (currentDate <= endDate) {
                dates.push(currentDate);
                currentDate = addDays.call(currentDate, 1);
            }
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
            // for(let i = 0 ; i < final.length ; i++){
            //     final[i] = final[i].toISOString().split('T')[0];
            // }
            console.log(final);
            return final;
        },

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

        assign_reviews(reviews, reviewers){
            let userReviews = [];
            
            console.log(this.$store.state.user.idUsers);

            for( let i=0 ; i < reviews.length ; i++ ){
                var username;
                let path = "default.png";

                console.log(reviews[i].Users_idUsers);
                //decide wether curr user can review
                if(reviews[i].Users_idUsers == this.$store.state.user.idUsers) {
                    console.log("This user has already submitted a review");
                    this.canReview = false;
                }

                for(let  j=0 ; j < reviewers.length ; j++){
                    if(reviews[i].Users_idUsers == reviewers[j].idUsers){
                        username = reviewers[j].Username;
                        if(reviewers[j].ProfilePicPath != null){
                            path = reviewers[j].ProfilePicPath;
                        }
                        break;
                    }
                }
                let temp = {
                    text: reviews[i].Text,
                    score: reviews[i].Rating.toFixed(1),
                    user: username,
                    profilepicpath: require(`@/assets/profile_pics/${path}`),
                };
                userReviews.push(temp);
            }
            return userReviews;
        },

         async submit_review(){
            // console.log("CALLED");
            if(this.newReview != ""){
                console.log(this.$store.state.user);
                let response = await this.$axios.post('/review', {
                    AccId: this.id,
                    UserId: this.$store.state.user.idUsers,
                    Rating: this.newRating,
                    Text: this.newReview
                });
            }
        },

        async view() {
            // evt.preventDefault();
            try {
                let response = await this.$axios.post('/view', {
                    id: this.id,
                });
                console.log(response);

                this.title = response.data.Name;
                this.path = response.data.Path;
                this.desc = response.data.Description;
                this.area = response.data.Area;
                this.price = response.data.PricePerNight;
                this.extraCost = response.data.ExtraCostPerPerson;
                this.minDays = response.data.MinimumDays;
                this.numPersons = response.data.Persons;
                this.numBeds = response.data.Beds;
                this.numBaths = response.data.Bathrooms;
                this.numBedrooms = response.data.Bedrooms;
                this.markerLatLng = [response.data.Latitude, response.data.Longtitude];

                this.characteristics = this.assign_characteristics(response.data.Characteristics);
                this.rulesText = response.data.Rules;

                this.reservedDates = this.disable_dates(response.data.Reservations);
                
                this.hostName = response.data.Host.Name + " " + response.data.Host.Surname;
                if(response.data.Host.ProfilePicPath != null){
                    this.hostImagePath = response.data.Host.ProfilePicPath;
                }

                this.reviewScore = this.review_average(response.data.Reviews);
                this.userReviews = this.assign_reviews(response.data.Reviews, response.data.Reviewers);
                console.log(this.userReviews);

                this.locationText = response.data.Location;
                this.address = response.data.Address;


            } catch(error) {
                alert(this.errormessage)
                console.log(error);
            }
        },
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
                s = Number(this.price) + days * Number(this.extraCost);
            }
            // console.log(typeof s);
            // console.log(s);
			return s;
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
        },

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
    created(){
        if(this.$route.query.id!=null){
            this.id = this.$route.query.id;
            this.view();
        }
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

</style>
