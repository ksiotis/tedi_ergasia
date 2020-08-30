<template>
	<div class="my-topart d-flex">
		
		<div class="flex-grow-1 mr-auto d-flex">
			<img class="art align-self-end" src="../assets/homies_logo.svg" />
		</div>

		<div class="d-flex align-self-center align-items-center mr-5">
			<a class="language d-flex align-items-center">
				<span class="iconify" data-icon="ion-globe-outline"></span>
				<span class="ltext">ΕΛ</span>
			</a>

			<button v-if="!user" v-b-modal.login-modal class="d-flex align-items-center">
				<i class="iconify mr-1" data-icon="ion-person-circle-outline" />
				Σύνδεση / Εγγραφή
			</button>
			<div v-else>
				<b-dropdown id="profile-button" size="lg" variant="white" left toggle-class="text-decoration-none" >
					<template v-slot:button-content>
						<img id="profile-pic" :src="userPic" width="32px" height="32px" class="rounded-circle mr-2">
						{{user.Username}}
					</template>
					<b-dropdown-item @click="pushProfile">Προβολή Λογαριασμού</b-dropdown-item>
                    
					<b-dropdown-item v-if="user.Role === 'aproved'" @click="$router.push('/accommodation-edit').catch(() => {})">Οι χώροι μου</b-dropdown-item>
                    <b-dropdown-item v-if="user.Role === 'unaproved'" disabled>Εκκρεμής Αίτηση Οικοδεσπότη</b-dropdown-item>
					<b-dropdown-item v-if="user.Role === 'admin'" @click="$router.push('/admin').catch(() => {})">Κατάλογος Χρηστών</b-dropdown-item>
					<b-dropdown-item v-else @click="$router.push('/becomehost').catch(() => {})">Γίνετε Οικοδεσπότης</b-dropdown-item>
					
					<b-dropdown-item @click="$router.push('/messages').catch(() => {})">Μηνύματα</b-dropdown-item>
					<b-dropdown-item @click="$router.push('/favorites').catch(() => {})">Αγαπημένα</b-dropdown-item>
					<b-dropdown-divider/>
					<b-dropdown-item @click="$router.push('/profile').catch(() => {})">Βοήθεια</b-dropdown-item>
					<b-dropdown-item @click="logout">Αποσύνδεση</b-dropdown-item>
				</b-dropdown>
			</div>
		</div>


		<b-modal ref="login-modal" id="login-modal" title="BootstrapVue">
			<template v-slot:modal-header="{close}">
				<div class="widen d-flex">

					<span id="to-register" class="mr-auto mt-3">
						Δεν έχω λογαριασμό.
						<a id="register-link" v-on:click="close(); $router.push('/register').catch(() => {});">Εγγραφή</a>
					</span>

					<a @click="close()">
						<span class="iconify" data-icon="ion-close-circle-outline"></span>
					</a>

				</div>
			</template>

			<b-form @submit.prevent="onSubmit" class="mt-3">
				<b-form-input id="modal-input-top" v-model="form.username" placeholder="Όνομα Χρήστη" size="lg" required></b-form-input>
				<b-form-input id="modal-input-bot" v-model="form.password" type="password" placeholder="Κωδικός Πρόσβασης" size="lg" required></b-form-input>
				<b-button id="login-btn" type="submit" class="widen mt-5">Είσοδος</b-button>
			</b-form>

			<template v-slot:modal-footer="" class="d-flex justify-content-start widen">
				<div class="d-flex flex-column links-container widen">
					<a href="">Ξέχασα τον κωδικό μου</a>
					<a href="">Ξέχασα το όνομα χρήστη</a>
				</div>
			</template>

		</b-modal>
	</div>
</template>

<script>
export default {
	data() {
		return {
			new_messages: false,
			user: '',
			form: {
				username: '',
				password: ''
			},
			errormessage: "Προέκυψε κάποιο σφάλμα, δοκιμάστε ξανά",
		};
	},
	computed: {
		userPic() {
			let fileName = 'default.png';
			if (this.user && this.user.ProfilePicPath) {
				fileName = this.user.ProfilePicPath;
			}
			return require(`../assets/profile_pics/${fileName}`);
		},
	},
	created() {
		if (localStorage.token) {
			this.user = this.$jwt.decode(localStorage.token).user;
		}
	},
	methods: {
		async onSubmit() {
			if (this.form.username && this.form.password) {
				try {
					let response = await this.$axios.post('/login', {
						username: this.form.username,
						password: this.form.password
					});
					localStorage.token = response.data.token;
					this.user = this.$jwt.decode(response.data.token).user;
					this.$refs['login-modal'].hide()

					if (this.user.Role === 'admin')
						this.$router.push('/admin').catch(() => {});
					else if (this.user.Role === 'aproved')
						this.$router.push('/TODO').catch(() => {});
				} catch(error) {
					alert(this.errormessage)
					console.log(error);
				}
			}
		},
		pushProfile() {
			let query = { username: this.user.Username };
			this.$router.push({ path: `/profile`, query: query}).catch(() => {});
		},
		logout() {
			this.user = '';
			localStorage.removeItem('token');
			this.$router.push('/').catch(() => {});
		}
	}
};
</script>

<style scoped>

.my-topart {
	color: #153D41;
	background-color: #E1DAD2;
	height: 80px;
}

.art {
	height: 95%;
	margin-left: 100px;
	margin-bottom: -1px;
}

button {
	background: white;
	border-radius: 90px;
	border: none;
	color: #153D41;
	font-weight: normal;
	cursor: pointer;
	padding: 0 20px;
	height: 47px;
	margin-right: 37px;
}

#profile-button {
	background: white;
	border-radius: 90px;
	border: none;
	color: #153D41;
	font-weight: normal;
	cursor: pointer;
	padding: 0 20px;
	height: 47px;
	margin-right: 37px;
}

#profile-button button {
	background: white !important;
	border-radius: 90px;
	border: none;
	color: #153D41 !important;
	font-weight: normal;
	cursor: pointer;
	padding: 0 20px;
	height: 47px;
	margin-right: 37px;
}

a {
	cursor: pointer;
}

.ion-ios-log-in {
	font-size: 30px;
}

button:focus {
	outline: none;
}

button:hover {
	background-color: gainsboro;
}

button:active {
	color: white;
	background-color: #004a87;
}

.iconify {
	height: 32px;
	width: 32px;
	color: #153D41;
}

.language {
	margin-right: 50px;
	height: 100%;
}

.language:hover {
	text-decoration: none;
}

.ltext {
	color: #153D41;
	font-weight: normal;
	text-decoration: none;
	margin-left: 5px;
}

.language:hover .ltext {
	color: white;
}

.widen {
	width: 100%;
}

.widen a {
	width: fit-content;
	color: #194A50;
}

#profile-pic {
	object-fit: cover;
}

#to-register {
	color: #194A50;
}

#register-link {
	color: #D37556;
}

#register-link:hover {
	text-decoration: underline;
}

.links-container a {
	color: #194A50;
}

#login-btn {
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-color: #D37556;
	color: white;
}

#login-btn:hover {
	background-color: #9C533B;
}

#modal-input-top {
	border-bottom-left-radius: 0px;
	border-bottom-right-radius: 0px;
}

#modal-input-bot {
	border-top-left-radius: 0px;
	border-top-right-radius: 0px;
}

</style>
