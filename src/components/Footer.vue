<template>
	<div class="my-footer d-flex justify-content-between">
		<div class="d-flex flex-column mb-3">
			<h5 class="title mb-2">Διαμονή</h5>
			<a class="t my-2">Χώροι διαμονής</a>
			<a class="t my-2">Εμπειρίες</a>
		</div>
		<div class="d-flex flex-column mb-3">
			<h5 class="title mb-2">Επικοινωνία</h5>
			<a class="t my-2">Τηλέφωνο Επικοινωνίας</a>
			<a class="t my-2">Φόρμα Παραπόνων</a>
			<a class="t my-2">E-mail: homies@info.gr</a>
		</div>
		<div class="d-flex flex-column mb-3">
			<h5 class="phone mb-2">
				<i class="ion-md-call" />
				11 111
			</h5>
			<h5 class="title mb-2">Social Media</h5>
			<a class="mt-2">
				<i class="mr-4 socialicon ion-logo-youtube" />
				<i class="mr-4 socialicon ion-logo-facebook" />
				<i class="mr-4 socialicon ion-logo-twitter" />
			</a>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {},
};
</script>

<style scoped>

.my-footer {
	color: white;
	background-color: #0C2431;
	padding: 72px 100px;
}

.title {
	font-weight: bold;
}

.phone {
	font-weight: bold;
	font-size: 36px;
}

a{
    color: white;
	cursor: pointer;
}

.socialicon {
	font-size: 28px;
}

.t:hover {
	text-decoration: underline;
}
</style>
