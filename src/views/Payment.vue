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
                <button id="pay" class="p-2">Πληρωμή και Κράτηση</button>
            </div>
        </b-form>

        <div class="vertical-line align-self-center mx-5"> </div>

        <div id="details" class="mx-5 mt-4 p-3 ">
            <div class="title">Τίτλος χώρου</div>
            <div>Διεύθυνση, Τοποθεσία<a  class="iconify mx-1" data-icon="ion-location-sharp"/></div>
            <div>Οικοδεσπότης<span class="iconify mx-1" data-icon="ion-home-sharp"/></div>

            <div class="mt-4 mb-2 horizontal-line"></div>

            <div class="title">Λεπτομέρειες Πληρωμής</div>
            <div class="d-flex">
                <div class="mr-auto">{{pricePerNight}}€ X {{nights}} διανυκτερεύσεις</div>
                <div class="mr-auto">{{BaseCost}}€</div>
            </div>
            <div class="d-flex mt-5 align-items-center ">
                <h3 class="mr-auto">Σύνολο:</h3>
                <h2 class="mr-auto">{{TotalPrice}}€</h2>
            </div>
        </div>
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
            years: []
        }
    },
    computed: {
        BaseCost() {
            return this.pricePerNight * this.nights;
        },
        TotalPrice() {
            return this.BaseCost;
        }
    },
    methods: {

    },
    mounted() {
        let today = new Date();
        let thisyear = today.getFullYear();

        for (var i = thisyear - 3; i < thisyear + 10; i++) {
            this.years.push(i);
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

</style>