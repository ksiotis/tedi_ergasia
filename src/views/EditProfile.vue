<template>
    <div class="d-flex flex-column align-items-center mt-3 mb-3">
        <b-form @submit.prevent="onSubmit" id="registration-form" class="">
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
                        <b-form-file id="file-input" v-model="form.file" accept="image/jpeg, image/png, image/gif" placeholder="Επιλογή Εικόνας"></b-form-file>
                    </b-form-group>
                    <b-form-group label="Όνομα" label-for="name" label-size="sm">
                        <input id="name" v-model="form.name" type="text" required/>
                    </b-form-group>
                </div>
                
            </div>

            <b-form-group label="Διεύθηνση e-mail" :description="email_desc"  label-for="mail" label-size="sm" class="">
                <input id="mail" :state="email_state" @change="checkemail" v-model="form.email" type="email" required/>
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
                        <input id="password" v-model="form.password" type="password" required/>
                    </b-form-group>
                </div>

                <div class="d-flex set-width flex-column">
                    <b-form-group label="Ρόλος" label-for="role" label-size="sm" class="set-width">
                        <span class="mr-2">{{roleName}}</span>
                        <span class="iconify" :data-icon="roleIcon"/>
                        <button v-if="user.Role === 'tenant'" @click.prevent="changeRole" class="mybutton">Γίνετε Οικοδεσπότης</button>
                    </b-form-group>
                </div>
            </div>

            <div class="d-flex flex-fill">
                <b-button id="register-btn" type="submit" class="ml-auto mr-5 px-5 py-2" :disabled="submit_disabled">Αποθήκευση</b-button>
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
                code: null,
                phone: '',
                file: null,
            },
            options: [
                { value: null, text: '...', disabled: true},
                { value: '+1', text: 'US'},
                { value: '+30', text: 'EL' },
                { value: '+44', text: 'EN' },
            ],
            errormessage: "Προέκυψε κάποιο σφάλμα, δοκιμάστε ξανά",
            roleName: '',
            roleIcon: ''
        }
    },
    created() {
        this.form.username = this.user.Username;
        this.form.name = this.user.Name;
        this.form.surname = this.user.Surname;
        this.form.email = this.user.Email;
        this.form.code = this.user.Telephone.split(')')[0].substring(1);
        this.form.phone = this.user.Telephone.split(')')[1];
    },
    computed: {
        profilePic() {
            if (this.form.file === null) {
                let filename = 'default.png';
    
                if (this.user && this.user.ProfilePicPath)
                    filename = this.user.ProfilePicPath;
                return require(`../assets/profile_pics/${filename}`);
            }
            else {
                return URL.createObjectURL(this.form.file);
            }
        },
        submit_disabled() {
            return ((this.username_state === false) ||
                    (this.email_state === false) ||
                    (this.password_state === false));
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
    methods: {
        async onSubmit(evt) {
            try {
                let formData = new FormData();
                formData.append("username", this.form.username);
                formData.append("name", this.form.name);
                formData.append("surname", this.form.surname);
                formData.append("email", this.form.email);
                formData.append("password", this.form.password);
                formData.append("telephone", "(".concat(this.form.code).concat(")").concat(this.form.phone));
                formData.append("picture", this.form.file);

                let response = await this.$axios.post('/userupdate', formData, {
                    headers: { "authorization": 'Bearer ' + this.$store.state.token }
                });
                alert("Τα στοιχεία του λογαριασμού άλλαξαν επιτυχώς!");
                this.$store.commit('updateUser', ''); //delete old user


                response = await this.$axios.post('/login', {
                    username: this.form.username,
                    password: this.form.password,
                });
                this.$store.commit('updateToken', response.data.token);
                await this.$nextTick();
                
                // if (this.user.Role === 'admin')
                //     this.$router.push('/admin').catch(() => {});
                // else if (this.user.Role === 'aproved')
                //     this.$router.push('/TODO').catch(() => {});
                // else
                //     this.$router.push('/').catch(() => {});
                // this.$router.push('/');
                let query = { username: this.user.Username };
                this.$router.push({ path: `/profile`, query: query}).catch(() => {});
            } catch(error) {
                if (error == 'Error: Request failed with status code 403') {
                    alert('Λάθος κωδικός πρόσβασης!');
                    console.log(error);
                }
                else {
                    alert(this.errormessage)
                    console.log(error);
                }
            }
        },
        async checkusername() {
            let username = this.form.username;
            if (this.user.Username === this.form.username) {
                this.username_state = null;
                this.username_desc = "";
                return;
            }
            console.log(this.user.Username === this.form.username);
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
        async checkemail() {
            let email = this.form.email;
            if (this.user.Email === this.form.email) {
                this.email_state = null;
                this.email_desc = "";
                return;
            }
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
        async changeRole() {
            try {
                let response = await this.$axios.post('/changerole', {
                    role: 2,
                    username: null
                }, {
                    headers: { "authorization": 'Bearer ' + this.$store.state.token}
                });
                alert('Το αίτημα αλλαγής ρόλου καταχωρήθηκε. Θα σας ενημερώσουμε όταν το εξετάσει ένας διαχειριστής');
                console.log(response.data);

                
            } catch(error) {
                this.username_state = false;
                alert(this.errormessage);
                console.log(error);
            }
        }
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