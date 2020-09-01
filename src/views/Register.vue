<template>
    <div class="d-flex flex-column align-items-center mt-3 mb-3">
        <b-form v-if="!logged_in" @submit.prevent="onSubmit" id="registration-form" class="">
            <div class="d-flex">

                <div class="d-flex flex-column set-width mr-5">
                    <div class="title mb-4">Εγγραφή</div>
                    <span class="subtitle">
                        Έχετε ήδη λογαριασμό;
                        <a id="login-link" v-b-modal.login-modal class="orange-link">Είσοδος</a>
                    </span>
                    <b-form-group label="Όνομα Χρήστη *" :description="username_desc" label-for="username" label-size="sm" class="mt-auto">
                        <b-form-input id="username" :state="username_state" @change="checkusername" v-model="form.username" type="text" required></b-form-input>
                    </b-form-group>
                    <b-form-group label="Επώνυμο *" label-for="surname" label-size="sm" class="">
                        <b-form-input id="surname" v-model="form.surname" type="text" required></b-form-input>
                    </b-form-group>
                </div>

                <div class="d-flex flex-column set-width">
                    <img :src="image" id="profile-pic" class="rounded-circle align-self-center">
                    <b-form-group id="file" class="mt-4 align-self-center" description="">
                        <!-- <a class="orange-link">Επιλογή Εικόνας</a> -->
                        <b-form-file id="file-input" @input="loadFile" v-model="form.file" accept="image/jpeg, image/png" placeholder="Επιλογή Εικόνας"></b-form-file>
                    </b-form-group>
                    <b-form-group label="Όνομα *" label-for="name" label-size="sm">
                        <b-form-input id="name" v-model="form.name" type="text" required></b-form-input>
                    </b-form-group>
                </div>
                
            </div>

            <b-form-group label="Διεύθηνση e-mail *" :description="email_desc" label-for="mail" label-size="sm" class="">
                <b-form-input id="mail" :state="email_state" @change="checkemail" v-model="form.email" type="email" required></b-form-input>
            </b-form-group>

            <div class="d-flex flex-fill">

                <div class="d-flex flex-column set-width mr-5">
                    <b-form-group label="Κωδικός Πρόσβασης *" label-for="password" label-size="sm" class="mt-auto">
                        <b-form-input id="password" @change="checkpasswords" v-model="form.password" type="password" required></b-form-input>
                    </b-form-group>
                    <div class="">
                        <b-form-group label="Τηλέφωνο *" label-for="phone-container" label-size="sm">
                            <div id="phone-container" class="d-flex">
                                <b-form-select id="phone-code" v-model="form.code" :options="options" class="mr-1" required></b-form-select>
                                <b-form-input id="phone" v-model="form.phone" type="tel" pattern="[0-9]{5,11}" required></b-form-input>
                            </div>
                        </b-form-group>
                        <b-form-group id="checkboxes" class="d-flex mb-0">
                            <b-form-checkbox id="checkbox-1" v-model="form.host" name="checkbox-1" class="ml-1">
                                Είμαι οικοδεσπότης
                                <span v-b-tooltip.hover="{ variant: 'light' }" title="Lorem ipsum dolor arsenal en La Plata"><span class="iconify" data-icon="ion-information-circle-outline"/></span>
                            </b-form-checkbox>
                            <b-form-checkbox id="checkbox-2" v-model="form.terms" name="checkbox-2" class="ml-1" required>
                                <a href="http://legalipsum.com/?count=3" target="_blank" class="orange-link">
                                    Αποδέχομαι τους όρους χρήσης 
                                </a> *
                            </b-form-checkbox>
                        </b-form-group>
                    </div>
                </div>

                <div class="d-flex set-width flex-column">
                    <b-form-group label="Επιβεβαίωση Κωδικού Πρόσβασης *" :description="password_desc" label-for="confirmpassword" label-size="sm" class="set-width">
                        <b-form-input id="confirmpassword" :state="password_state" @change="checkpasswords" v-model="form.confirmpassword" type="password" required ></b-form-input>
                    </b-form-group>
                </div>
            </div>

            <div class="d-flex flex-fill">
                <b-button id="register-btn" type="submit" class="ml-auto mr-5 px-5 py-2" :disabled="submit_disabled">Δημιουργία Λογαριασμού</b-button>
            </div>
        </b-form>
        <div v-else @click="$router.push('/').catch(() => {})" id="already-logged-in" class="d-flex flex-column">
            <div> Έχετε ήδη λογαριασμό χρήστη. Παρακαλώ αποσυνδεθείτε για να συνεχίσετε ή πατήστε τον παρακάτω σύνδεσμο...</div>
            <a class="orange-link mt-auto mb-5">Επιστροφή στην αρχική σελίδα</a>
        </div>

    </div>
</template>

<script>
export default {
    name: "Register",
    data() {
        return {
            image: require("../assets/profile_pics/default.png"),
            password_state: null,
            username_state: null,
            email_state: null,
            username_desc: "",
            email_desc: "",
            password_desc: "",
            form: {
                username: '',
                name: '',
                surname: '',
                email: '',
                password: '',
                confirmpassword: '',
                code: null,
                phone: '',
                file: null,
                host: false,
                terms: false
            },
            options: [
                { value: null, text: '...', disabled: true},
                { value: '+1', text: 'US'},
                { value: '+30', text: 'EL' },
                { value: '+44', text: 'EN' },
            ],
            errormessage: "Προέκυψε κάποιο σφάλμα, δοκιμάστε ξανά",
            user: ''
        }
    },
    methods: {
        async checkusername(username) {
            let myinput = '?username=' + username;
            let url =  '/checkusername' + myinput;
            try {
                let response = await this.$axios.get(url);
                console.log(response.data);
                if (!response.data.length) {
                    this.username_state = null;
                    this.username_desc = "";
                }
                else {
                    this.username_state = false;
                    this.username_desc = "Αυτό το όνομα χρήστη χρεισιμοποιείται ήδη!";
                }
            } catch(error) {
                this.username_state = false;
                alert(this.errormessage);
                console.log(error);
            }
        },
        async checkemail(email) {
            let myinput = '?email=' + email;
            let url =  '/checkemail' + myinput;
            try {
                let response = await this.$axios.get(url);
                console.log(response.data);
                if (!response.data.length) {
                    this.email_state = null;
                    this.email_desc = "";
                }
                else {
                    this.email_state = false;
                    this.email_desc = "Αυτή η διεύθυνση email χρεισιμοποιείται ήδη!";
                }
            } catch(error) {
                this.username_state = false;
                alert(this.errormessage);
                console.log(error);
            }
        },
        checkpasswords() {
            if (this.form.password === this.form.confirmpassword) {
                this.password_state = null;
                this.password_desc = "";
            }
            else {
                this.password_state = false;
                this.password_desc = "Οι κωδικοί πρόσβασης δεν ταιριάζουν";
            }
        },
        async onSubmit() {
            try {
                let formData = new FormData();
                formData.append("username", this.form.username);
                formData.append("name", this.form.name);
                formData.append("surname", this.form.surname);
                formData.append("email", this.form.email);
                formData.append("password", this.form.password);
                formData.append("role", this.form.host ? 2 : 1);
                formData.append("telephone", "(".concat(this.form.code).concat(")").concat(this.form.phone));
                formData.append("picture", this.form.file);

                let response = await this.$axios.post('/signup', formData);
                alert("Η δημιουργία λογαριασμού ολοκληρώθηκε με επιτυχία!");

                response = await this.$axios.post('/login', {
                    username: this.form.username,
                    password: this.form.password,
                });
                localStorage.token = response.data.token;
                this.user = await this.$jwt.decode(response.data.token).user;
                
                if (this.user.Role === 'admin')
                    this.$router.push('/admin').catch(() => {});
                else if (this.user.Role === 'aproved')
                    this.$router.push('/TODO').catch(() => {});
                else
                    this.$router.push('/').catch(() => {});
            } catch(error) {
                alert(this.errormessage)
                console.log(error);
            }
        },
        loadFile() {
            this.image = URL.createObjectURL(this.form.file);
        },
    },
    computed: {
        submit_disabled: function() {
            return ((this.username_state === false) ||
                    (this.email_state === false) ||
                    (this.password_state === false));
        },
        logged_in: function() {
            return localStorage.getItem('token') ? true : false;
        }
    }
}
</script>

<style scoped>

#registration-form, #already-logged-in {
    /* width: 50%; */
    /* max-width: 800px; */
    background-color: #194A50;
    color: white;
    border-radius: 15px;
    padding: 20px;
    font-size: 18px;
}

#already-logged-in {
    height: 500px;
    width: 500px;
    font-size: 30px;
    text-align: center;
}

#registration-form input {
    font-size: inherit;
    color: white;
    background-color: #4E7378;
    border: 0px
}

#registration-form select {
    font-size: inherit;
    color: white;
    background-color: #4E7378;
    border: 0px
}

.title {
    font-size: 48px;
}

.subtitle {
    font-size: 20px;
}

.set-width {
    width: 350px;
}

.orange-link {
    color: #D37556;
}

.orange-link:hover {
    text-decoration: underline;
    cursor: pointer;
}

#profile-pic {
    width: 200px;
    height: 200px;
    object-fit: cover;
}

#file {
    width: 100%;
}

#phone-code {
    width: 25%;
}

#register-btn {
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	background-color: #D37556;
	color: white;
}

#register-btn:hover {
	background-color: #9C533B;
}

</style>