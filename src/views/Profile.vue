<template>
    <div class="d-flex flex-column align-items-center mt-3 mb-3">
        <div id="profile" >
            <div class="d-flex p-3">
                <div id="column1" class="d-flex flex-column align-items-center mr-5">
                    <img :src="user.ProfilePicPath" width="150px" height="150px" class="rounded-circle ">
                    <span class="mt-3">{{user.Username}}</span>
                </div>

                <div id="column2" class="d-flex flex-column">
                    <span v-on:user-send="user.Username = $event.user.Username">
                        Επώνυμο: <span class="semitransparenttext">{{user.Username}}</span>
                    </span>

                    <span class="mt-2">
                        Όνομα: <span class="semitransparenttext">{{user.Username}}</span>
                    </span>

                    <span class="mt-2">
                        Διεύθυνση e-mail: <span class="semitransparenttext">{{user.Username}}</span>
                    </span>

                    <span class="mt-2">
                        Τηλέφωνο: <span class="semitransparenttext">{{user.Username}}</span>
                    </span>
                    
                    <span class="mt-2">
                        Ρόλος: <span class="semitransparenttext">{{user.Username}}</span> <span class="iconify" data-icon="ion-briefcase"/>
                    </span>
                </div>
            </div>
            <div id="bottom" class="d-flex flex-column">
                <div class="d-flex align-items-center">
                    <a class="d-flex"><span class="iconify" data-icon="ion-chatbubble-ellipses-outline"/></a>
                    <span class="mt-3 ml-3">Αποστολή Μηνύματος</span>
                </div>
                <div class="d-flex align-items-center">
                    <a class="d-flex"><span class="iconify" data-icon="ion-star"/></a>
                    <span  class="mt-3 ml-3">Κριτικές Χρήστη</span>
                </div>
                <div class="d-flex align-items-center">
                    <a class="d-flex"><span class="iconify" data-icon="ion-time-outline"/></a>
                    <span  class="mt-3 ml-3">Προβολή ιστορικού ενοικιάσεων</span>
                </div>
                <div class="d-flex align-items-center">
                    <a class="d-flex admin-button"><span class="iconify" data-icon="ion-repeat-outline"/></a>
                    <span  class="mt-3 ml-3">Αλλαγή ρόλου</span>
                </div>

                <button id="edit" @click="$router.push('editprofile')" class="px-4 py-1 align-self-end mr-5">Επεξεργασία <span class="iconify" data-icon="ion-pencil-outline"/></button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Profile",
    data() {
        return {
            user: {
                Username: "quirkygirl85",
                ProfilePicPath: require("../assets/profile_pics/quirkygirl85.jpg"),
                Name: "Anna",
                Surname: "Adams",
                Email: "iamsoquirkyrightnow@gmail.com",
                Phone: "(GR)+30 2102102101",
                Role: "Οικοδεσπότης"
            }
        }
    },
    methods: {
        
    },
    created() {
        // this.profile.username = this.$route.query.username;


    }
}
</script>

<style scoped>

#profile {
    background-color: #194A50;
    color: white;
    border-radius: 15px;
    padding: 20px;
    font-size: 18px;
}

img {
    object-fit: cover;
}

#column1 {
    font-size: 28px;
}

#column2 {
    font-size: 18px;
}

.semitransparenttext {
    color: rgba(255, 255, 255, 0.75);
    margin-left: 10px;
}

a {
    background-color: #4E7378;
    width: fit-content;
    border-radius: 90px;
    padding: 10px;
    margin-top: 15px
}

a:hover {
    cursor: pointer;
    background-color: #46676B;
}

.admin-button {
    background-color: #D37556;
}

.admin-button:hover {
    background-color: #9C533B;
}

a .iconify {
    width: 32px;
    height: 32px;
    color: white;
}

#bottom {
    font-size: 20px;
}

#edit {
    background-color: #D37556;
    border: none;
    color: white;
    border-radius: 90px;
}

#edit:hover {
    background-color: #9C533B;
}

</style>