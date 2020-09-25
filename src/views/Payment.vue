<template>
    <div id="basic-form" class="d-flex justify-content-center my-5 ">
        <b-form id="card" class="mx-5 p-2">
            <h2>Στοιχεία πληρωμής</h2>
            <div class="mb-3">Παρακαλώ εισάγετε τα στοιχεία της κάρτας σας.</div>

            <b-form-group>
                <div class="">
                    <span class="mr-2 title">Αριθμός Κάρτας</span>
                    <span class="iconify" data-icon="ion-card"/>
                </div>
                <b-input v-model="form.card" type="text"/>
            </b-form-group>

            <b-form-group>
                <div class="title">Όνομα Κατόχου Κάρτας</div>
                <b-input v-model="form.name" type="text"/>
            </b-form-group>

            <div class="d-flex">
                <div class="mr-auto">
                    <div class="title">Ημερομηνία Λήξης Κάρτας<span class="iconify ml-2" data-icon="ion-calendar"/></div>
                    <div id="date" class="d-flex">
                        <b-form-select v-model="form.month" :options="months" class="mr-1" required></b-form-select>
                        <h2 class="mx-1">/</h2>
                        <b-form-select v-model="form.year" :options="years" class="mr-1" required></b-form-select>
                    </div>
                </div>
                <div>
                    <div class="title">
                        Κωδικός CVV
                        <span v-b-tooltip.hover="{ variant: 'light' }" title="Lorem ipsum dolor arsenal en La Plata"><span class="iconify" data-icon="ion-information-circle"/></span>
                    </div>
                    <b-input id="cvv" v-model="form.year" type="text" class="mr-1" required/>
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-end mt-5">
                <a id="back" class="mr-3" @click.prevent="$router.go(-1)">Πίσω</a>
                <button id="pay" class="p-2" @click.prevent="submit_reservation()">Πληρωμή και Κράτηση</button>
            </div>
        </b-form>

        <div class="vertical-line align-self-center mx-5"> </div>

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
                    <p class="reservationText">{{host}}</p>
                    <span class="iconify startspace"  style="font-size: 18px; color: #194A50;" data-icon="ion-briefcase"></span>
                </div>

                <hr style="border: 1px solid #ACBEC0; width: 99%;">

                <div class="d-flex flex-row">
                    <p style="font-size: 24px; color: #194A50;  margin-bottom: 5px;">Στοιχεία κράτησης</p>
                </div>

                <div class="d-flex flex-row align-items-baseline justify-content-between" >
                    <p class="reservationText">Tελική τιμή</p>
                    <div class="d-flex flex-row">
                        <p class="sumArea">{{total}}</p>
                        <p class="sumArea">€</p>
                    </div>
                </div>
                <div class="d-flex flex-row align-items-baseline justify-content-start" >
                    <p class="sumArea">{{persons}}</p>
                    <p class="reservationText startspace">άτομα</p>
                    <span class="iconify startspace"  style="font-size: 18px; color: #194A50;" data-icon="ion-person"></span>
                </div>
                <div class="d-flex flex-row align-items-baseline justify-content-between" >
                    <p v-if="date1 != ''" class="sumArea startspace">{{date1}}</p>
                    <span class="iconify"  style="font-size: 18px; color: #194A50;" data-icon="ion-arrow-forward"></span>
                    <p v-if="date2 != ''" class="sumArea startspace">{{date2}}</p>
                </div>
                <div class="d-flex flex-row align-items-baseline justify-content-start" >
                    <p class="sumArea">{{nights}}</p>
                    <p class="reservationText startspace">διανυκτέρευσεις</p>
                    <span class="iconify startspace"  style="font-size: 18px; color: #194A50;" data-icon="ion-cloudy-night"></span>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
export default {
    name: 'Payment',
    data() {
        return {
            form: {
                
            },
            pricePerNight: 15,
            nights: 5,
            months: [1,2,3,4,5,6,7,8,9,10,11,12],
            years: [],

            accId: null,
            title: "",
            address: "",
            host: "",
            total: 0,
            persons: 0,
            date1: "",
            date2: "",
            nights: 0,

        }
    },
    computed: {
        // BaseCost() {
        //     return this.pricePerNight * this.nights;
        // },
        // TotalPrice() {
        //     return this.BaseCost;
        // },
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
    methods: {
        async submit_reservation(){
            if(this.user){
                console.log("RESERVING");
                let response = await this.$axios.post('/accommodations/' + this.accId + '/reservations', {
                    UserId: this.$store.state.user.idUsers,
                    Date1: this.date1,
                    Date2: this.date2,
                    Persons: this.persons,
                    Price: this.total,
                });

                alert("Ολοκληρώθηκε η κράτηση με επιτυχία!");
                this.$router.push("/");
            }
        },
    },
    mounted() {
        let today = new Date();
        let thisyear = today.getFullYear();

        for (var i = thisyear - 3; i < thisyear + 10; i++) {
            this.years.push(i);
        }
    },

     created(){
        console.log(this.$route.query);
        if(this.$route.query.accId!=null){

            this.accId = this.$route.query.accId;
            this.title = this.$route.query.title;
            this.address = this.$route.query.address;
            this.host = this.$route.query.host;
            this.total = this.$route.query.total;
            this.persons = this.$route.query.persons;
            this.date1 = this.$route.query.date1;
            this.date2 = this.$route.query.date2;
            this.nights = this.$route.query.nights;
        }
    }
}
</script>

<style scoped>

#basic-form {
    color: #194A50;
}

#card {
    width: 500px;
}

#basic-form select {
    font-size: inherit;
    color: white;
    background-color: #4E7378;
    border: 0px;
    width: 80px;
}

#basic-form input {
    font-size: inherit;
    color: white;
    background-color: #4E7378;
    border: 0px
}

#details {
    border: 2px solid #194A50;
    border-top-width: 10px;
    width: 500px;
    height: 300px;
}

.title {
    font-size: 20px;
    font-weight: 500;
}

.vertical-line {
    width: 1px;
    background-color: #C4C4C4;
    height: 500px;
}

.horizontal-line {
    height: 1px;
    background-color: #C4C4C4;
}

#cvv {
    width: 100px;
}

#back {
    color: #194A50;
    text-decoration: underline;
}

#back:hover {
    color: #D37556;
    cursor: pointer;
}

#pay {
    border: none;
    border-radius: 3px;
    background-color: #D37556;
    color: white;
}

#pay:hover {
    cursor: pointer;
    background-color: #9C533B;
}

.reservationForm{
    width: 484px;
    height: 323px;
    background-color: white;
    color: #194A50;   
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

.startspace{
    margin-left: 5px;
}

</style>