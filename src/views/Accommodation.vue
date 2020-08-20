<template>
    <div class = "d-flex flex-column justify-content-center container"> 
        <div class="d-flex flex-column justify-content-start">
            <!-- τίτλος  -->
            <h2 class="title">Τίτλος χώρου</h2>
            <!-- εικόνες -->
            <div class="element">
                <b-carousel
                id="carousel-1"
                v-model="slide"
                :interval="3000"
                controls
                indicators
                background="#ccc"
                img-width="1024"
                img-height="480"
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
            <!-- περιγραφή -->
            <h3 class="subtitle element">Περιγραφή</h3>
            <p> {{placeholderText}} </p>
            
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
                        <p>Αριθμός κρεβατιών:</p>
                        <p>{{numBeds}}</p>
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
            <p> {{placeholderText}} </p>

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
            <div class="d-flex flex-row">
                <h3 class="subtitle endspace">Τελική τιμή:</h3>
                <p class="area">{{total.toFixed(2)}}</p>
                <p class="area">€</p>
            </div>
            <!-- χοστ -->
            <div class="d-flex flex-row align-items-start element">
                <i class="iconify endspace" data-icon="ion-home"></i>
                <h3 class="subtitle">Οικοδεσπότης:</h3>
            </div>
            <div class="d-flex flex-row align-items-start">
                <img :src="hostImagePath" width="40px" height="40px" class="rounded-circle endspace">
                <p class="hostName">{{hostName}}</p>
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
            reviews: [
                {
                    text: 'Sed sodales, nulla sed interdum accumsan, est nulla convallis orci, quis rhoncus nisi diam vitae libero. Nulla nec porttitor purus. Nullam tincidunt interdum interdum. Ut suscipit tellus eget orci efficitur, sit amet feugiat ante posuere. Mauris malesuada, dolor imperdiet vulputate sagittis, ante magna accumsan arcu, sed mollis lectus massa a ante. Sed tincidunt consequat erat ut imperdiet. Nulla ornare magna at nisi porta, sed tempus augue pellentesque.',
                    score: 3.5,
                    user: 'Kostkuber',
                },
            ],


        }
    },
    methods: {
        onSlideStart() {
            this.sliding = true
        },
        onSlideEnd() {
            this.sliding = false
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
                s = this.price + days * this.extraCost;
            }
			return s;
		},
    },

    mounted() {
        this.$refs.datePicker.showDatepicker();
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
    padding: 0 150px;
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

.iconify{
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

</style>
