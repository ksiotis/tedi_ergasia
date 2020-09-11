<template>
    <div class="d-flex flex-column align-items-center mt-3 mb-3">
        <div id="profile">
            <div class="d-flex p-3">
                <div id="column1" class="d-flex flex-column align-items-center mr-5">
                    <img :src="profilePic" width="150px" height="150px" class="rounded-circle ">
                    <span class="mt-3">{{user.Username}}</span>
                </div>

                <div id="column2" class="d-flex flex-column">
                    <span>
                        Επώνυμο: <span class="semitransparenttext">{{user.Surname}}</span>
                    </span>

                    <span class="mt-2">
                        Όνομα: <span class="semitransparenttext">{{user.Name}}</span>
                    </span>

                    <span v-if="user.Email" class="mt-2">
                        Διεύθυνση e-mail: <span class="semitransparenttext">{{user.Email}}</span>
                    </span>

                    <span v-if="user.Telephone" class="mt-2">
                        Τηλέφωνο: <span class="semitransparenttext">{{user.Telephone}}</span>
                    </span>
                    
                    <span class="mt-2">
                        Ρόλος: <span class="semitransparenttext">{{roleName}}</span> <span class="iconify" :data-icon="roleIcon"/>
                    </span>
                </div>
            </div>
            <div id="bottom" class="d-flex flex-column">
                <div v-if="user && user.loggedin && !user.same" class="d-flex align-items-center" @click="pushmessage">
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

                <button v-if="user && user.same" id="edit" @click="$router.push('editprofile')" class="px-4 py-1 align-self-end mr-5">
                    Επεξεργασία <span class="iconify" data-icon="ion-pencil-outline"/>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Profile",
    data() {
        return {
            user: '',
            roleName: '',
            roleIcon: ''
        }
    },
    computed: {
        profilePic: function () {
            let filename = 'default.png';

            if (this.user && this.user.ProfilePicPath)
                filename = this.user.ProfilePicPath;
            return require(`../assets/profile_pics/${filename}`);
        },
    },
    methods: {
        pushmessage() {
            let targetUsername = this.user.Username;
            let query = { to: targetUsername };
            this.$router.push({ path: `/newmessage`, query: query}).catch(() => {});
        }
    },
    async mounted() {
        try {
        
            let targetProfile = this.$route.query.username;
            let url = `/users?username=${targetProfile}`;
            let response = await this.$axios.get(url, {
                headers: { "authorization": 'Bearer ' + this.$store.state.token }
            });
            this.user = response.data[0];
            
            this.roleName = this.$store.state.rolenames[this.user.Role][0];
            this.roleIcon = this.$store.state.rolenames[this.user.Role][1];
            
        } catch (error) {
            if (error == 'Error: Request failed with status code 404') {
                alert('Ο λογαριασμός χρήστη που αναζητήσατε δεν υπάρχει!');
                this.$router.go(-1);
            }
            console.log(error);
        }
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