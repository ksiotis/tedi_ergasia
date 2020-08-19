<template>
    <div class="d-flex flex-column align-items-center mt-3 mb-3">
        <b-form @submit="onSubmit" id="registration-form" class="">
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
                    <b-form-group id="file" class="mt-4 align-self-center">
                        <!-- <a class="orange-link">Επιλογή Εικόνας</a> -->
                        <b-form-file id="file-input" @input="loadFile" v-model="form.file" accept="image/jpeg, image/png, image/gif" placeholder="Επιλογή Εικόνας"></b-form-file>
                    </b-form-group>
                    <b-form-group label="Όνομα *" label-for="name" label-size="sm">
                        <b-form-input id="name" v-model="form.name" type="text" required></b-form-input>
                    </b-form-group>
                </div>
                
            </div>

            <b-form-group label="Διεύθηνση e-mail *" label-for="mail" label-size="sm" class="">
                <b-form-input id="mail" v-model="form.mail" type="email" required></b-form-input>
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
                    <b-form-group label="Επιβεβαίωση Κωδικού Πρόσβασης" label-for="confirmpassword" label-size="sm" class="set-width">
                        <b-form-input id="confirmpassword" :state="password_state" @change="checkpasswords" v-model="form.confirmpassword" type="password" required ></b-form-input>
                    </b-form-group>
                    <p v-if="form.password.length>0 && form.password != form.confirmpassword" class="text-danger">Οι κωδικοί πρόσβασης δεν ταιριάζουν!</p>
                </div>
            </div>

            <div class="d-flex flex-fill">
                <b-button id="register-btn" type="submit" class="ml-auto mr-5 px-5 py-2" :disabled="submit_disabled">Δημιουργία Λογαριασμού</b-button>
            </div>
        </b-form>
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
            submit_disabled: true,
            username_desc: "",
            form: {
                username: '',
                name: '',
                surname: '',
                mail: '',
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
        }
    },
    methods: {
        onSubmit(evt) {
			evt.preventDefault()
			alert(JSON.stringify(this.form))
        },
        loadFile() {
            this.image = URL.createObjectURL(this.form.file);
        },
        checkusername(value) {
            if (value) {
                this.username_state = true;
                this.username_desc = ""
            }
            else {
                this.username_state = false;
                this.username_desc = "Αυτό το όνομα χρήστη χρεισιμοποιείται ήδη!";
            }
        },
        checkpasswords() {
            if (this.form.password === this.form.confirmpassword) {
                this.password_state = true;
                this.submit_disabled = false;
            }
            else {
                this.password_state = false;
                this.submit_disabled = true;
            }
        },
    }
}
</script>

<style scoped>

#registration-form {
    /* width: 50%; */
    /* max-width: 800px; */
    background-color: #194A50;
    color: white;
    border-radius: 15px;
    padding: 20px;
    font-size: 18px;
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

.asterisk {

}

</style>