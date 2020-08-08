<template>
	<div class="my-topart d-flex">
		<div class="flex-grow-1 mr-auto">
			<img class="art" src="../assets/homies_logo.svg" />
		</div>
		<!-- <div class="languages d-flex flex-row align-self-center">
			<div class="d-flex language">
				<img class="icon" src="../assets/images/GR.png" />
				<a>GR</a>
			</div>
			<div class="d-flex language">
				<img class="icon" src="../assets/images/EN.png" />
				<a>EN</a>
			</div>
		</div> -->
		<div class="align-self-center">
			<button
				v-if="!user"
				class="d-flex align-items-center"
				@click="$router.push('/login').catch(() => {})"
			>
				<i class="ion-ios-log-in" />
				Σύνδεση / Εγγραφή
			</button>
			<button
				v-else
				class="d-flex align-items-center"
				@click="$router.push('/profile').catch(() => {})"
			>
				<i class="ion-ios-log-in" />
				{{user.fullName}} / Προφίλ
			</button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
	},
	methods: {},
};
</script>

<style scoped>
.my-topart {
	color: #153D41;
	background-color: #E1DAD2;
	height: 80px;
}

.art {
	height: 100%;
    margin-left: 100px;
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

a {
	cursor: pointer;
}

.languages {
	margin-right: 37px;
}

.language {
	padding: 0 15px;
}

.ion-ios-log-in {
	font-size: 30px;
	margin-right: 7px;
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

.language:hover {
	color: white;
	text-decoration: underline;
}

.icon {
	cursor: pointer;
	width: 25px;
	height: 25px;
	margin-right: 7px;
}
</style>
