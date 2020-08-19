<template>
    <div id="new-message" class="container my-5 p-4">

        <div id="title">
            <span class="mr-2">Νέο Μήνυμα</span>
            <span class="iconify" data-icon="ion-mail-unread-outline"/>
        </div>

        <b-form @submit="send" class="mt-3">
            <b-form-group label-cols="2" label="Από:" label-for="username">
                <input id="username" v-model="user.username" required readonly/>
            </b-form-group>

            <b-form-group label-cols="2" label="Προς:" label-for="input-top">
                <input id="input-top" v-model="form.to" required/>
            </b-form-group>

            <b-form-group label-cols="2" label="Θέμα:" label-for="input-subject">
                <input id="input-subject" v-model="form.subject" required/>
            </b-form-group>

            <b-form-group label-cols="2" label="Μήνυμα:" label-for="textarea-large">
                <textarea type="textarea" id="textarea-large" v-model="form.message" required/>
            </b-form-group>

        
            <button id="send-button" class="d-flex mt-5 px-4 py-2 ml-auto mr-3 align-items-center">
                <span class="mr-2">Αποστολή</span>
                <span class="iconify" data-icon="ion-send"/>
            </button>
        </b-form>

    </div>
</template>

<script>
export default {
    name: "New Message",
    data() {
        return {
            user: {
                username: "quirkygirl85"
            },
            form: {
                to: "",
                subject: "",
                message: "",
            }
        }
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

</style>