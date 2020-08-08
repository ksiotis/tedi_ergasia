<template>
	<div class="my-topart d-flex">
        
        <div class="flex-grow-1 mr-auto">
			<img class="art" src="../assets/homies_logo.svg" />
		</div>

		<div class="d-flex align-self-center align-items-center">
			<div class="language">
				<span class="iconify " data-icon="ion-globe-outline"></span>
			</div>
			
			<div class="mr-5">
				<a class="ltext ">ΕΛ</a>
			</div>

			<button
				v-if="!user"
				class="d-flex align-items-center"
				v-on:click="$router.push('/login').catch(() => {})"
			>
				<i class="ion-ios-log-in" />
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
	height: 100%;
    margin-left: 96.5px;
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

.iconify{
    height: 32px;
    width: 32px;
    margin-right: -15px;
    color: #153D41;
}

.language{
    margin-right: 20px;
}

.ltext{
    color: #153D41;
    font-weight: normal;
}

.ltext:hover{
    color: white;
}

</style>
