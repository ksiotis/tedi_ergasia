<template>
	<div class="my-footer d-flex justify-content-between">
		<div class="d-flex flex-column mb-3">
			<h5 class="title mb-2">Χάρτες</h5>
			<a class="t my-2">Χάρτης Μετρό</a>
			<a class="t my-2">Χάρτης Λεωφορείων</a>
			<a class="t my-2">Χάρτης Τραμ</a>
			<a class="t my-2">Χάρτης Τρόλεϊ</a>
		</div>
		<div class="d-flex flex-column mb-3">
			<h5 class="title mb-2">Επικοινωνία</h5>
			<a class="t my-2">Απολεσθέντα</a>
			<a class="t my-2">Τηλέφωνο Επικοινωνίας</a>
			<a class="t my-2">Φόρμα Παραπόνων</a>
			<a class="t my-2">E-mail: support@oasa.gr</a>
		</div>
		<div class="d-flex flex-column mb-3">
			<h5 class="phone mb-2">
				<i class="ion-md-call" />
				11 185
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
	background-color: #042e51;
	padding: 72px 100px;
}

.title {
	font-weight: bold;
}

.phone {
	font-weight: bold;
	font-size: 36px;
}

a {
	cursor: pointer;
}

.socialicon {
	font-size: 28px;
}

.t:hover {
	text-decoration: underline;
}
/* commit comment */
</style>
