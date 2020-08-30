<template>
	<div class="tile d-flex flex-column"  @click="submit">
	    
        <img :src="require(`@/assets/accommodation_pics/${preview_package.img}`)" class="thumbnail"/>

        <div class="textrow d-flex justify-content-between">
            <p> {{preview_package.title}} </p>
            
            <div class="d-flex flex-row reviewContainer"> 
                <i class="iconify formicon reviewStar" data-icon="ion-star"></i>
                <p class="reviewScore">{{preview_package.reviewScore}}</p>
                <a class="reviewCount"> {{preview_package.reviewCount}} κριτικές </a>
            </div>
        </div>

         <div class="textrow d-flex justify-content-between">
            <div class="characteristics">
                <p>{{preview_package.roomType}} </p>
                <p>{{preview_package.beds}} κρεβατιών </p>
            </div>

            <div class="priceContainer d-flex flex-row"> 
                <p class="priceTag">{{preview_package.price}}€</p>
                <p>/διανυκτέρευση</p>
            </div>
        </div>
        <div class="d-flex flex-row flex-wrap" style="margin-bottom: 10px;">
            <div 
                class="textrow"
                v-for="(characteristic, index) in preview_package.characteristics"
                v-bind:key="index">

                    <div class="tag" v-if="characteristic.status == true">
                        {{characteristic.name}}
                    </div>
            </div>
        </div>
	</div>
</template>

<script>
export default {
    props: {
        preview_package: {
            id: Number,
            img: String,
            title: String,
            reviewScore: Number,
            reviewCount: Number,
            roomType: String,
            price: Number,
            beds: Number,
            characteristics: [
                {
                    name: String,
                    status: Boolean,
                },
                {
                    name: String,
                    status: Boolean,
                },
                {
                    name: String,
                    status: Boolean,
                },
                {
                    name: String,
                    status: Boolean,
                },
                {
                    name: String,
                    status: Boolean,
                },
                {
                    name: String,
                    status: Boolean,
                },
                {
                    name: String,
                    status: Boolean,
                },
                {
                    name: String,
                    status: Boolean,
                },
            ]
        }
    },
	data() {
		return {
		};
	},
	methods: {
        submit(){
            // let query = { location: this.searchForm.location, date1: this.searchForm.date1, date2: this.searchForm.date2, persons: this.searchForm.persons };
            
            // query.date1 = query.date1.toISOString();
            // query.date2 = query.date2.toISOString();

            this.$router.push({ path: '/accommodation'/*, query: query*/}).catch(() => {});
        }
    },

};
</script>

<style scoped>
.tile{
    margin-top: 25px;
    margin-right: 40px;

    height:300px;
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
    /* margin-left: -5px; */
}
</style>
