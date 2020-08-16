<template>
	<div class="tile d-flex flex-column">
	    
        <div class="thumbnail"/>

        <div class="textrow d-flex justify-content-between">
            <p> Τίτλος διαμερίσματος </p>
            
            <div class="d-flex flex-row reviewContainer"> 
                <i class="iconify formicon reviewStar" data-icon="ion-star"></i>
                <p class="reviewScore">3.5</p>
                <a class="reviewCount"> 75 κριτικές </a>
            </div>
        </div>

         <div class="textrow d-flex justify-content-between">
            <div class="characteristics">
                <p>Τύπος δωματίου </p>
                <p>Αριθμός κρεβατιλων </p>
            </div>

            <div class="priceContainer d-flex flex-row"> 
                <p class="priceTag">69€</p>
                <p>/διανυκτέρευση</p>
            </div>
        </div>

        <div class="textrow d-flex justify-content-start">
            <div class="tag">
                Wifi
            </div>
            <div class="tag">
                Parking
            </div>
        </div>

	</div>
</template>

<script>
export default {
	data() {
		return {
		
		};
	},
	methods: {},
};
</script>

<style scoped>
.tile{
    margin-top: 25px;
    margin-right: 40px;

    height:280px;
    width: 330px;
    background-color: #194A50;

    filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5));
}

.thumbnail{
    background-color: grey;
    width: 330px;
    height: 170px;
}

.textrow{
    color:white;
    margin-top: 5px;
    padding: 0 7px;
}

.reviewContainer{
    margin-top: 5px;
}

.reviewStar{
    width: 12px;
    height: 12px;
}
.reviewScore{
    margin: 0 5px;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 12px;
}

.reviewCount{
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 12px;
    /* identical to box height */



    color: #C5D2D3;
}

.characteristics{
    font-size: 10px;
    line-height: 12px;

    color: #C5D2D3;
}

.characteristics p{
    margin-bottom: 5px;
}

.priceContainer{
    font-size: 12px;
    line-height: 12px;

    color: #C5D2D3;
}

.priceTag{
    font-size: 14px;
    color: white;
}

.tag{
    background: #4E7378;
    border-radius: 12px;
    font-size: 10px;

    height: 15px;
    padding: 0 5px;
}
</style>
