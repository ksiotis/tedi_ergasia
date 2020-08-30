<template>
    <div class="d-flex flex-column align-items-center mt-3 mb-3">
        <b-form @submit="onSubmit" id="registration-form" class="">
            <div class="d-flex">

                <div class="d-flex flex-column set-width mr-5">
                    <div class="title mb-4">Επεξεργασία Στοιχείων</div>
                    
                    <b-form-group label="Όνομα Χρήστη" :description="username_desc" label-for="username" label-size="sm" class="mt-auto">
                        <input id="username" :state="username_state" @change="checkusername" v-model="form.username" type="text" required/>
                    </b-form-group>
                    <b-form-group label="Επώνυμο" label-for="surname" label-size="sm" class="">
                        <input id="surname" v-model="form.surname" type="text" required/>
                    </b-form-group>
                </div>

                <div class="d-flex flex-column set-width">
                    <img :src="profilePic" id="profile-pic" class="rounded-circle align-self-center">
                    <b-form-group id="file" class="mt-4 align-self-center">
                        <!-- <a class="orange-link">Επιλογή Εικόνας</a> -->
                        <b-form-file id="file-input" @input="loadFile" v-model="form.file" accept="image/jpeg, image/png, image/gif" placeholder="Επιλογή Εικόνας"></b-form-file>
                    </b-form-group>
                    <b-form-group label="Όνομα" label-for="name" label-size="sm">
                        <input id="name" v-model="form.name" type="text" required/>
                    </b-form-group>
                </div>
                
            </div>

            <b-form-group label="Διεύθηνση e-mail" label-for="mail" label-size="sm" class="">
                <input id="mail" v-model="form.email" type="email" required/>
            </b-form-group>

            <div class="d-flex flex-fill">

                <div class="d-flex flex-column set-width mr-5">
                    <div class="">
                        <b-form-group label="Τηλέφωνο" label-for="phone-container" label-size="sm">
                            <div id="phone-container" class="d-flex">
                                <b-form-select id="phone-code" v-model="form.code" :options="options" class="mr-1" required/>
                                <input id="phone" v-model="form.phone" type="tel" pattern="[0-9]{5,11}" required/>
                            </div>
                        </b-form-group>
                        
                    </div>
                    <b-form-group label="Τρέχων Κωδικός Πρόσβασης *" label-for="password" label-size="sm" class="mt-auto">
                        <input id="password" @change="checkpassword" v-model="form.password" type="password" required/>
                    </b-form-group>
                </div>

                <div class="d-flex set-width flex-column">
                    <b-form-group label="Ρόλος" label-for="role" label-size="sm" class="set-width">
                        <span class="mr-2">{{rolenames[user.Role][0]}}</span>
                        <span class="iconify" :data-icon="rolenames[user.Role][1]"/>
                        <button v-if="user.Role === 'tenant'" class="mybutton">Γίνετε Οικοδεσπότης</button>
                    </b-form-group>
                </div>
            </div>

            <div class="d-flex flex-fill">
                <b-button id="register-btn" type="submit" class="ml-auto mr-5 px-5 py-2">Αποθήκευση</b-button>
            </div>
        </b-form>
    </div>
</template>

<script>
export default {
    name: "EditProfile",
    data() {
        return {
            password_state: null,
            username_state: null,
            username_desc: "",
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
            },
            user: '',
            options: [
                { value: null, text: '...', disabled: true},
                { value: '+1', text: 'US'},
                { value: '+30', text: 'EL' },
                { value: '+44', text: 'EN' },
            ],
            rolenames: {
                tenant: ['Ενοικιαστής', 'ion-briefcase'],
                unaproved: ['Ενοικιαστής', 'ion-briefcase'],
                aproved: ['Οικοδεσπότης', 'ion-home-sharp'],
                admin: ['Διαχειριστής', 'ion-build'],
            }
        }
    },
    created() {
        if (localStorage.token) {
            this.user = this.$jwt.decode(localStorage.token).user;
            this.form.username = this.user.Username;
            this.form.name = this.user.Name;
            this.form.surname = this.user.Surname;
            this.form.email = this.user.Email;
            this.form.code = this.user.Telephone.split(')')[0].substring(1);
            this.form.phone = this.user.Telephone.split(')')[1];
        }
    },
    computed: {
        profilePic: function () {
            if (form.file === null) {
                let filename = 'default.png';
    
                if (this.user && this.user.ProfilePicPath)
                    filename = this.user.ProfilePicPath;
                return require(`../assets/profile_pics/${filename}`);
            }
        },
    },
    methods: {
        onSubmit(evt) {
			evt.preventDefault()
			alert(JSON.stringify(this.form))
        },
        loadFile() {
            this.image = URL.createObjectURL(this.form.file);
        },
        checkusername() {
            if (this.form.username) {
                this.username_state = true;
                this.username_desc = ""
            }
            else {
                this.username_state = false;
                this.username_desc = "Αυτό το όνομα χρήστη χρεισιμοποιείται ήδη!";
            }
        },
        checkpassword() {
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

.title {
    font-size: 42px;
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

input, select {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #4E7378;
    color: white;
    border-radius: 5px;
    padding: 5px;
}

.mybutton {
    margin-left: 15px;
    padding: 3px;
    border: none;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	border-top-left-radius: 5px;
	border-top-right-radius:5px;
	background-color: #D37556;
	color: white;
}

.mybutton:hover {
	background-color: #9C533B;
}

</style>