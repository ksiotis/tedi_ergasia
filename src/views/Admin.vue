<template>
    <div class="d-flex flex-column align-items-center my-5">
        <div id="toppage" class="d-flex mb-1">
            <div class="d-flex move-left">
                <span class="align-self-center title mr-5">Λίστα Χρηστών</span>
                <div class="d-flex flex-column mr-5">
                    <span><span class="iconify" data-icon="ion-build"/>Διαχειριστής</span>
                    <span><span class="iconify" data-icon="ion-home-sharp"/>Οικοδεσπότης</span>
                    <span><span class="iconify" data-icon="ion-briefcase"/>Ενοικιαστής</span>
                </div>
            </div>
            <span class="align-self-center title2 ml-5">Ενεργά Αιτήματα Οικοδεσπότη</span>
        </div>
        <div id="botpage" class="d-flex">
            <div id="column1">
                <div class="box mr-5 mb-3">
                    <a v-for="(user, user_index) in users" :key="user_index" 
                    class="d-flex user-box flex-fill my-1 mx-1 px-2 py-1" 
                    @click="pushProfile(user.Username)">
                        <img :src="getpic(user.ProfilePicPath)" width="32px" height="32px" class="rounded-circle profile-pic">
                        <span class="d-flex ml-2 mr-auto overflow-hide">{{user.Username}}</span>
                        <span class="iconify" :data-icon="getRoleIcon(user.Role)"/>
                    </a>
                </div>
                <a id="export" v-b-modal.export-modal class="">Εξαγωγή δεδομένων<span v-b-tooltip.hover="{ variant: 'light' }" title="Lorem ipsum dolor arsenal en La Plata"><span class="iconify" data-icon="ion-information-circle-outline"/></span></a>
            </div>
            <div id="column2">
                <div class="half-box ml-3">
                    <a v-for="(user, user_index) in requests" :key="user_index" 
                    class="d-flex user-box flex-fill my-1 mx-1 px-2 py-1">
                        <img :src="getpic(user.ProfilePicPath)" width="32px" height="32px" class="rounded-circle profile-pic">
                        <span class="d-flex ml-2 mr-auto overflow-hide">{{user.Username}}</span>
                        <button class="btn accept mr-1" @click="aprove(user_index)">Αποδοχή</button>
                        <button class="btn reject" @click="reject(user_index)">Απόρριψη</button>
                    </a>
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

			<b-form-group label-for="type" label="Επιλέξτε τον τύπο των δεδομένων" class="mt-3">
				<b-form-select id="type" v-model="selected" :options="options"></b-form-select>
			</b-form-group>

			<template v-slot:modal-footer="" class="d-flex justify-content-start widen">
				<b-button id="export-btn" type="submit" class="widen" @click="download">Κατέβασμα</b-button>
			</template>

		</b-modal>
    </div>
</template>

<script>
import convert from 'xml-js'

export default {
    name: "Admin",
    data() {
        return {
            selected: "",
            options: [
                { value: null, text: 'Please select an option', disabled: true },
                { value: 'JSON', text: 'JSON' },
                { value: 'XML', text: 'XML' },
            ],
            users: [],
            requests: [],
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
    },
    async mounted() {
        await this.$nextTick();
        let response = await this.$axios.get(`/users`, {
            headers: { "authorization": 'Bearer ' + this.$store.state.token }
        });

        this.users = response.data;

        response = await this.$axios.get(`/unaproved`, {
            headers: { "authorization": 'Bearer ' + this.$store.state.token }
        });

        this.requests = response.data;
    },
    methods: {
        getpic(picname) {
            if (picname == null) {
                return require('../assets/profile_pics/default.png');
            }
            else {
                return require('../assets/profile_pics/' + picname);
            }
        },
        pushProfile(username, parent) {
            try {
                let query = { username };
                this.$router.push({ path: `/profile`, query: query}).catch(() => {});
            } catch(error) {
                alert(this.errormessage)
                console.log(error);
            }
        },
        getRoleIcon(role) {
            return this.$store.state.rolenames[role][1];
        },
        async changeRole(role, username, parent) {
            try {
                let response = await parent.$axios.post('/changerole', {
                    role,
                    username
                }, {
                    headers: { "authorization": 'Bearer ' + parent.$store.state.token}
                });
                alert('Το αίτημα αλλαγής ρόλου καταχωρήθηκε. Θα σας ενημερώσουμε όταν το εξετάσει ένας διαχειριστής');
                console.log(response.data);

                
            } catch(error) {
                this.username_state = false;
                alert(this.errormessage);
                console.log(error);
            }
        },
        aprove: async function(user_index) {
            await this.$nextTick();
            try {
                let role = 3;
                let username = this.requests[user_index].Username;
                let response = await this.$axios.post('/changerole', {
                    role,
                    username
                }, {
                    headers: { "authorization": 'Bearer ' + this.$store.state.token}
                });
                
                location.reload();
            } catch(error) {
                this.username_state = false;
                alert(this.errormessage);
                console.log(error);
            }
        },
        reject: async function(user_index) {
            await this.$nextTick();
            try {
                let role = 1;
                let username = this.requests[user_index].Username;
                let response = await this.$axios.post('/changerole', {
                    role,
                    username
                }, {
                    headers: { "authorization": 'Bearer ' + this.$store.state.token}
                });
                
                location.reload();
            } catch(error) {
                this.username_state = false;
                alert(this.errormessage);
                console.log(error);
            }
        },
        async download() {
            if (this.selected !== 'XML' && this.selected !== 'JSON')
                return;

            try {
                let response = await this.$axios.get('/dbdownload', {
                    headers: { "authorization": 'Bearer ' + this.$store.state.token}
                });
                let data = '';

                if (this.selected === 'XML') {
                    var options = {compact: true, spaces: 4};
                    data = '<?xml version="1.0" encoding="UTF-8"?>\n' + convert.json2xml(response.data, options);
                }
                else {
                    data = JSON.stringify(response.data, null, '  ');
                }

                const blob = new Blob([data], {type: 'text/plain'});
                const e = document.createEvent('MouseEvents'), a = document.createElement('a');
                a.download = `homies_db.${this.selected === 'XML' ? 'xml' : 'json'}`;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = [`text/plain`, a.download, a.href].join(':');
                e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
            } catch(error) {
                this.username_state = false;
                alert(this.errormessage);
                console.log(error);
            }
            
        },

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

.title2 {
    font-size: 30px;
}

.box {
    background-color: #194A50;
    overflow: scroll;
    height: 500px;
    width: 450px;
    padding: 3px;
    border-radius: 10px;
}

.half-box {
    background-color: #194A50;
    overflow: scroll;
    height: 250px;
    width: 450px;
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