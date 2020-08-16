<template>
    <div class="d-flex flex-column align-items-center my-5">
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
            <div id="column1">
                <div class="box mr-5 mb-3">
                    <a v-for="user in users" :key="user.index" class="d-flex user-box flex-fill my-1 mx-1 px-2 py-1">
                        <img :src="user.profilepicpath" width="32px" height="32px" class="rounded-circle profile-pic">
                        <span class="d-flex ml-2 mr-auto overflow-hide">{{user.username}}</span>
                        <span class="iconify" data-icon="ion-briefcase"/>
                    </a>
                </div>
                <a id="export" v-b-modal.export-modal class="">Εξαγωγή δεδομένων<span v-b-tooltip.hover="{ variant: 'light' }" title="Lorem ipsum dolor arsenal en La Plata"><span class="iconify" data-icon="ion-information-circle-outline"/></span></a>
            </div>
            <div id="column2">
                <div class="half-box ml-5">
                    <div v-for="user in requests" :key="user.index" class="d-flex user-box flex-fill my-1 mx-1 px-2 py-1">
                        <img :src="user.profilepicpath" width="32px" height="32px" class="rounded-circle profile-pic">
                        <span class="d-flex ml-2 mr-auto overflow-hide">{{user.username}}</span>
                        <button class="btn accept mr-1 ">Αποδοχή</button>
                        <button class="btn reject">Απόρριψη</button>
                    </div>
                </div>
                <img id="logo2" src="../assets/homies-logo2 1.png" class="align-self-center">
            </div>
        </div>

        <b-modal id="export-modal" title="BootstrapVue">
			<template v-slot:modal-header="{close}">
				<div class="widen d-flex">

					<span class="mr-auto mt-3">
						Εξαγωγή όλων των δεδομένων της βάσης.
					</span>

					<a @click="close()">
						<span class="iconify modal-icon" data-icon="ion-close-circle-outline"></span>
					</a>

				</div>
			</template>

			<b-form-group label-for="type" label="Επιλέξτε τον τύπο των δεδομένων" class="mt-3" >
				<b-form-select id="type" v-model="selected" :options="options"></b-form-select>
			</b-form-group>

			<template v-slot:modal-footer="" class="d-flex justify-content-start widen">
				<b-button id="export-btn" type="submit" class="widen">Κατέβασμα</b-button>    
			</template>

		</b-modal>
    </div>
</template>

<script>
export default {
    name: "Admin",
    data() {
        return {
            selected: "",
            options: [
                { value: null, text: 'Please select an option', disabled: true },
                { value: 'XML', text: 'XML' },
                { value: 'JSON', text: 'JSON' },
            ],
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

.modal-icon {
	color: #194A50;
}

.modal-icon:hover {
	color: #153D41;
    cursor: pointer;
}

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

.half-box {
    background-color: #194A50;
    overflow: scroll;
    height: 250px;
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

#export {
    color: #194A50;
    text-decoration: underline;
}

#export:hover {
    cursor: pointer;
}

#logo2 {
    height: auto;
    width: 350px;
    position: relative;
    left: 50px;
    bottom: -60px
}

.widen {
	width: 100%;
}

#export-btn {
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-color: #D37556;
	color: white;
}

#export-btn:hover {
	background-color: #9C533B;
}

</style>