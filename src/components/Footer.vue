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
			    <span class="iconify" data-icon="ion-call-outline"></span>
				11 111
			</h5>
			<h5 class="mb-2">Social Media</h5>
			<div class="d-flex">
				<a class="mt-2">
					<i class="mr-4 iconify socialicon" data-icon="ion-logo-youtube" />
				</a>
				<a class="mt-2">
					<i class="mr-4 iconify socialicon" data-icon="ion-logo-facebook" />
				</a>
				<a class="mt-2">
					<i class="mr-4 iconify socialicon" data-icon="ion-logo-twitter" />
				</a>
			</div>
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

/* .title {
	font-weight: bold;
} */

.phone {
	font-weight: bold;
	font-size: 36px;
}

a {
    color: white;
	cursor: pointer;
}

/* a:hover{
    color:white;
    cursor: pointer;
} */

.socialicon {
	font-size: 32px;
}


.t:hover {
    color: white;
	text-decoration: underline;
}

.phone{
    color:white;
}
</style>
