<template>
	<div class="my-navbar d-flex justify-content-between">
        <a v-on:click="$router.push('/').catch(() => {})">
            <img class="logo" src="../assets/homies_text.svg" />
        </a>
		<div class="d-flex">
			<button
				v-for="(buttonInfo, index) in routes"
				v-bind:key="index"
				v-bind:class="{ current: $route.path === buttonInfo.page }"
				v-on:click="$router.push(buttonInfo.page).catch(() => {})"
				class="d-flex align-items-center"
			>
			<!-- <span class="iconify" data-icon="ion:globe-outline"></span> -->
				<i aria-hidden="true" class="iconify mr-2" v-bind:data-icon="buttonInfo.icon" />
				<span>{{ buttonInfo.text }}</span>
			</button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			routes: [
				{
					page: '/covid',
					text: 'Covid-19',
					icon: 'ion-medkit-outline',
				},
				{
					page: '/stay',
					text: 'Διαμονή',
					icon: 'ion-home-outline',
				},
				{
					page: '/support',
					text: 'Επικοινωνία',
					icon: 'ion-call-outline',
				},
			],
		};
	},
	methods: {},
};
</script>

<style scoped>
.my-navbar {
	color: white;
	background-color: #194A50;
	padding: 0 40px;
}
button {
	background: none;
	border: none;
	color: white;
	cursor: pointer;
	padding: 0 20px;
}

a {
	cursor: pointer;
}

button:focus {
	outline: none;
}
button:hover {
	background-color: #13363A;
}

button:active {
	background-color: #13363A;
}

button.current {
	background-color: #ffffff;
	color: #194A50;
	font-weight: normal;
}

.logo {
    size: 0px 0px;
	padding: 14px 0;
}

.iconify {
	font-size: 24px;
}
</style>
