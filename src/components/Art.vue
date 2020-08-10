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

			<button
				v-if="!user"
				class="d-flex align-items-center"
				v-on:click="$router.push('/login').catch(() => {})"
			>
				<i class="iconify mr-1" data-icon="ion-person-circle-outline" />
				Σύνδεση / Εγγραφή
			</button>
			<button
				v-else
				class="d-flex align-items-center"
				v-on:click="$router.push('/profile').catch(() => {})"
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


</style>
