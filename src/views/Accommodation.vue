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
                    :alwaysVisible="true" 
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
                    <b-link class = "messagebutton d-flex align-items-center " @click="pushmessage">
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
        <form class="d-flex flex-column reservationForm">
            <span class="reservationHeader d-flex justify-content-center" >
                <p class style="color: white; font-size: 24px; margin-bottom: 0px;" > Σύνοψη κράτησης </p>
            </span>
            <div class="reservationContent d-flex flex-column justify-content-start">
                <div class="d-flex flex-row">
                    <p style="font-size: 24px; color: #194A50;  margin-bottom: 5px;">{{title}}</p>
                </div>
                <div class="d-flex flex-row align-items-baseline" >
                    <p class="reservationText">{{address}}</p>
                    <span class="iconify startspace"  style="font-size: 18px; color: #194A50;" data-icon="ion-location"></span>
                </div>
                <div class="d-flex flex-row align-items-baseline" >
                    <p class="reservationText">{{hostName}}</p>
                    <span class="iconify startspace"  style="font-size: 18px; color: #194A50;" data-icon="ion-briefcase"></span>
                </div>

                <hr style="border: 1px solid #ACBEC0; width: 99%;">

                <div class="d-flex flex-row">
                    <p style="font-size: 24px; color: #194A50;  margin-bottom: 5px;">Στοιχεία κράτησης</p>
                </div>

                <div class="d-flex flex-row align-items-baseline justify-content-between" >
                    <p class="reservationText">Tελική τιμή</p>
                    <div class="d-flex flex-row">
                        <p class="sumArea">{{total.toFixed(2)}}</p>
                        <p class="sumArea">€</p>
                    </div>
                </div>
                <div class="d-flex flex-row align-items-baseline justify-content-start" >
                    <p class="sumArea">{{searchPersons}}</p>
                    <p class="reservationText startspace">άτομα</p>
                    <span class="iconify startspace"  style="font-size: 18px; color: #194A50;" data-icon="ion-person"></span>
                </div>
                <div class="d-flex flex-row align-items-baseline justify-content-between" >
                    <p v-if="date1 != ''" class="sumArea startspace">{{date1.toISOString().split('T')[0]}}</p>
                    <span class="iconify"  style="font-size: 18px; color: #194A50;" data-icon="ion-arrow-forward"></span>
                    <p v-if="date2 != ''" class="sumArea startspace">{{date2.toISOString().split('T')[0]}}</p>
                </div>
                <div class="d-flex flex-row align-items-baseline justify-content-start" >
                    <p class="sumArea">{{nights}}</p>
                    <p class="reservationText startspace">διανυκτέρευσεις</p>
                    <span class="iconify startspace"  style="font-size: 18px; color: #194A50;" data-icon="ion-cloudy-night"></span>
                </div>


                <div class="d-flex justify-content-center">
                    <b-link class = "reservationButton d-flex align-items-center " @click="submit()">
                        Κράτηση
                        <span class="iconify startspace" data-icon="ion-card"></span>
                    </b-link>
                </div>
            </div>

        </form>
    </div>
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
            id: null,
            searchPersons: 0,
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

            hostUsername: "",
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

        pushmessage(){
            let targetUsername = this.hostUsername;
            let query = { to: targetUsername };
            this.$router.push({ path: `/newmessage`, query: query}).catch(() => {});
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
            for(let i = 0 ; i < final.length ; i++){
                final[i] = final[i].toISOString().split('T')[0];
            }
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
            if(this.newReview != "" && this.newReview != null){
                let response = await this.$axios.post('/accommodations/'+ this.id +'/reviews', {
                    UserId: this.$store.state.user.idUsers,
                    Rating: this.newRating,
                    Text: this.newReview
                });
                this.canReview = false;
                location.reload();
            }
        },

        async view() {
            // evt.preventDefault();
            try {

                //accommodation assignments
                let response = await this.$axios.get('/accommodations/' + this.id);
                let data = response.data;
                console.log(data);

                let dates = data.reservations.concat(data.availabilitydates);
                for(let i = 0 ; i<dates.length ; i++) dates[i] = { From: dates[i].From, To: dates[i].To };

                this.title = data.accomodations[0].Name;
                this.path = data.accomodationphotos;
                this.desc = data.accomodations[0].Description;
                this.area = data.accomodations[0].Area;
                this.price = data.accomodations[0].PricePerNight;
                this.extraCost = data.accomodations[0].ExtraCostPerPerson;
                this.minDays = data.accomodations[0].MinimumDays;
                this.numPersons = data.accomodations[0].Persons;
                this.numBeds = data.accomodations[0].Beds;
                this.numBaths = data.accomodations[0].Bathrooms;
                this.numBedrooms = data.accomodations[0].Bedrooms;
                this.markerLatLng = [data.accomodations[0].Latitude, data.accomodations[0].Longtitude];
                this.characteristics = this.assign_characteristics(data.accomodations_has_characteristics);
                this.rulesText =  data.accomodations[0].Rules;
                this.reservedDates = this.disable_dates(dates);
                this.locationText = data.accomodations[0].Location;
                this.address = data.accomodations[0].Address;

                //host assignments
                let query1 = "?id=" +  data.accomodations[0].idHost.toString();
                let hostResponse = await this.$axios.get('/users' + query1);
                console.log(hostResponse);
                let hostData = hostResponse.data;

                this.hostUsername = hostData[0].Username;
                this.hostName = hostData[0].Name + " " + hostData[0].Surname;
                
                if(hostData[0].ProfilePicPath != null){
                    this.hostImagePath = hostData[0].ProfilePicPath;
                }

                //reveiw assignments
                this.reviewScore = this.review_average(data.accomodationreview);

                let reviewers = [];
                for(let i=0 ; i<data.accomodationreview.length ; i++) {
                    let query2 = "?id=" +  data.accomodationreview[i].Users_idUsers;
                    let reviewerResponse = await this.$axios.get('/users' + query2);
                    reviewers.push(reviewerResponse.data);
                }
                this.userReviews = this.assign_reviews(data.accomodationreview, reviewers);

            } catch(error) {
                alert(this.errormessage)
                console.log(error);
            }
        },
        submit(){
            let query = {   accId : this.id, title : this.title, address : this.address, host: this.hostName, total: this.total.toFixed(2) , 
                            persons: this.searchPersons, date1 : this.date1.toISOString().split('T')[0] , date2: this.date2.toISOString().split('T')[0], 
                            nights: this.nights };

            this.$router.push({ path: '/payment', query: query}).catch(() => {});
            
        }
    },
     computed: {
         
        nights() {
             var timeDiff = Math.abs(this.date2.getTime() - this.date1.getTime());
            var numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

            return numberOfNights;
        },

        total() {
            console.log(Number(this.price) + (this.searchPersons-1)*Number(this.extraCost));
            return (Number(this.price) + (this.searchPersons-1)*Number(this.extraCost)) * this.nights;
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
            if(this.$route.query.searchPersons <= this.numPersons){
                this.searchPersons = Number(this.$route.query.searchPersons);
                console.log(this.$route.query.date1);
                this.date1 =  new Date(this.$route.query.date1);
                this.date2 =  new Date(this.$route.query.date2);
            }
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
    background-color: white;
    color: #194A50;

    position: sticky;
    top: 50px;
    /* bottom: 250px; */
    margin-top: 73px;
    margin-bottom: 150px;


    /* filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); */
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

    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;   
}

.reservationContent{
    border: 3px solid #ACBEC0;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
}

.reservationButton{
    border-radius: 90px;
    width: 90%;

    margin-top: 10px;
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

.reservationText{
    font-size: 18px; 
    color: black; 
    /* width: 200px; */
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    margin-bottom: 5px;
    margin-right: 5px;
}

</style>
