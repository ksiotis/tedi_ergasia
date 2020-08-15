<template>
    <div class="d-flex flex-column align-items-center my-3">
        <div id="toppage" class="d-flex mb-1">
            <div class="d-flex move-left">
                <span class="align-self-center title mr-5">Λίστα Χρηστών</span>
                <div class="d-flex flex-column mr-1">
                    <span><span class="iconify" data-icon="ion-build"/>Διαχειριστής</span>
                    <span><span class="iconify" data-icon="ion-home-sharp"/>Οικοδεσπότης</span>
                    <span><span class="iconify" data-icon="ion-briefcase"/>Ενοικιαστής</span>
                </div>
            </div>
            <span class="align-self-center title ml-5">Ενεργά Αιτήματα Οικοδεσπότη</span>
        </div>
        <div id="botpage" class="d-flex">
            <div class="box mr-5">
                <a v-for="user in users" :key="user.index" class="d-flex user-box flex-fill my-1 mx-1 px-2 py-1">
                    <img :src="user.profilepicpath" width="32px" height="32px" class="rounded-circle profile-pic">
                    <span class="d-flex ml-2 mr-auto overflow-hide">{{user.username}}</span>
                    <span class="iconify" data-icon="ion-briefcase"/>
                </a>
            </div>
            <div class="box ml-5">
                <div v-for="user in requests" :key="user.index" class="d-flex user-box flex-fill my-1 mx-1 px-2 py-1">
                    <img :src="user.profilepicpath" width="32px" height="32px" class="rounded-circle profile-pic">
                    <span class="d-flex ml-2 mr-auto overflow-hide">{{user.username}}</span>
                    <button class="btn accept mr-1 ">Αποδοχή</button>
                    <button class="btn reject">Απόρριψη</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Admin",
    data() {
        return {
            users: [
                {
                    username: "quirkygirl85",
                    surname: "Adams",
                    name: "Anna",
                    profilepicpath: require("../assets/profile_pics/quirkygirl85.jpg"),
                },
                {
                    username: "kostass00",
                    surname: "Σιώτης",
                    name: "Κωνσταντίνος",
                    profilepicpath: require("../assets/profile_pics/default.png"),
                },
            ],
            requests: [
                {
                    username: "kostass001234",
                    surname: "Σιώτης",
                    name: "Κωνσταντίνος",
                    profilepicpath: require("../assets/profile_pics/default.png"),
                },
            ]

        }
    }
}
</script>

<style scoped>

.iconify {
    height: 32px;
    width: 32px;
}

/* .move-left {
    margin-left: -100px;
} */

#toppage {
    font-size: 18px;
    color: #194A50;
}

#botpage {
    font-size:21px;
    color: white;
}

.title {
    font-size: 32px;
}

.box {
    background-color: #194A50;
    overflow: scroll;
    height: 500px;
    width: 400px;
    padding: 3px;
    border-radius: 10px;
}

.profile-pic {
    object-fit: cover;
}

.user-box {
    background-color: #4E7378;
    color: white;
    border-radius: 10px;
}

.user-box:hover {
    background-color: #46676B;
    cursor: pointer;
    text-decoration: none;
}

.btn {
    border: none;
    border-radius: 90px;
    font-size: 14px;
}

.accept {
    background-color: #D37556;
    color: white;
}

.accept:hover {
    background-color: #9C533B;
    color: white;
}

.reject {
    background-color: #E1DAD2;
    color: #194A50;
}

.reject:hover {
    background-color: #B4AEA8;
    color: #194A50;
}

</style>