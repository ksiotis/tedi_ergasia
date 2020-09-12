<template>
    <div class="d-flex flex-column align-items-center my-5">
        <div v-if="user" id="new-message" class="p-4">
            <div id="title">
                <span class="mr-2">Νέο Μήνυμα</span>
                <span class="iconify" data-icon="ion-mail-unread-outline"/>
            </div>

            <b-form @submit.prevent="send" class="mt-3">
                <label>{{todesc}}</label>
                <b-form-group label-cols="2" label="Από:" label-for="username">
                    <input id="username" v-model="user.Username" required readonly/>
                </b-form-group>

                <b-form-group label-cols="2" label="Προς:" label-for="input-top" >
                    <input id="input-top" v-model="form.to" required/>
                </b-form-group>

                <b-form-group label-cols="2" label="Θέμα:" label-for="input-subject">
                    <input id="input-subject" v-model="form.subject" required/>
                </b-form-group>

                <b-form-group label-cols="2" label="Μήνυμα:" label-for="textarea-large">
                    <textarea type="textarea" id="textarea-large" v-model="form.message" required/>
                </b-form-group>

                <div class="d-flex">
                    <button id="cancel-button" @click.prevent="$router.go(-1)" class="d-flex px-4 py-2 ml-auto mr-3 align-items-center">
                        <span class="mr-2">Ακύρωση</span>
                    </button>
                    <button id="send-button" class="d-flex px-4 py-2 mr-3 align-items-center" :disabled="send_state">
                        <span class="mr-2">Αποστολή</span>
                        <span class="iconify" data-icon="ion-send"/>
                    </button>
                </div>
            </b-form>
        </div>
        <div v-else @click="$router.push('/').catch(() => {})" id="not-logged-in" class="d-flex flex-column">
            <div>Για να στείλετε κάποιο μήνυμα, πρέπει να συνδεθείτε...</div>
            <a class="orange-link mt-auto mb-5">Επιστροφή στην αρχική σελίδα</a>
        </div>
    </div>


</template>

<script>
export default {
    name: "NewMessage",
    data() {
        return {
            form: {
                to: "",
                subject: "",
                message: "",
            },
            send_state: true,
            errormessage: "Προέκυψε κάποιο σφάλμα, δοκιμάστε ξανά"
        }
    },
    computed: {
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
        todesc() {
            if (this.form.to === this.user.Username) {
                this.send_state = true;
                return 'Δεν μπορείτε να στείλετε μηνύματα στον εαυτό σας'
            }
            else {
                this.send_state = false;
                return '';
            }
        }
    },
    methods: {
        async send() {
            try {
                let response = await this.$axios.post('/message', {
                    to: this.form.to,
                    subject: this.form.subject,
                    message: this.form.message
                }, {
                    headers: { "authorization": 'Bearer ' + this.$store.state.token }
                });

                alert('Το μήνυμα εστάλει επιτυχώς!');
                this.$router.go(-1);
            } catch(error) {
                if (error == 'Error: Request failed with status code 404') {
                    alert('Το όνομα χρήστη του αποστολέα δεν υπάρχει, δοκιμάστε ξανά');
                    return;
                }
                alert(this.errormessage)
                console.log(error);
            }
        }
    },
    mounted() {
        let targetProfile = this.$route.query.to;

        this.form.to = targetProfile;
    }
}
</script>

<style scoped>

#new-message {
    width: 700px;
    background-color: #194A50;
    color: white;
    border-radius: 15px;
}

#title {
    font-size: 36px;
}

input, textarea {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #4E7378;
    color: white;
    border-radius: 5px;
    padding: 5px;
}

#send-button {
    border: none;
    color: white;
    background-color: #D37556;
    border-radius: 90px !important;
}

#send-button:hover {
    background-color: #9C533B;
}

#cancel-button {
    border: none;
    color: white;
    background-color: #4E7378;
    border-radius: 90px !important;
}

#cancel-button:hover {
    background-color: #46676B;
}

#not-logged-in {
    background-color: #194A50;
    color: white;
    border-radius: 15px;
    padding: 20px;
    font-size: 18px;
    height: 500px;
    width: 500px;
    font-size: 30px;
    text-align: center;
}

.orange-link {
    color: #D37556;
}

#not-logged-in:hover .orange-link {
    text-decoration: underline;
    cursor: pointer;
}

</style>