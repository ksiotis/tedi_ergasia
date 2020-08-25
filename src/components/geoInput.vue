<template>
    <form @input.prevent="search" class="d-flex flex-column align-content-top" autocomplete="off">
        <div class="d-flex flex-row justify-content-start">
            <input 
                type="text"
                v-model="message" 
                class="input"
                placeholder="Εισάγεται τοποθεσία..."
               >
             
            <span class="iconify inputicon" data-icon="ion-locate"></span>
        </div>
        <div v-if="results != null && message != results[0].label" class="autocomplete d-flex flex-column justify-content-start">
            <p 
                class="d-flex flex-row" 
                v-for="(result, index) in results"
                v-bind:key="index"
                @click="message=result.label ; results = null">
                {{result.label}}</p>
        </div>
    </form>
</template>
 @change="$emit('geo-input-change', message)"

<script>

export default {
	data() {
		return {
            provider: new this.$OSMP(),

            message: '',
            hide: false,
            results: [],
            
            // result: {
            //     x: 0, // lon
            //     y: 0, // lat
            //     label: '', // formatted address
            //     bounds: [
            //         [0, 0], // south, west - lat, lon
            //         [0, 0], // north, east - lat, lon
            //     ],
            //     raw: '' // raw provider result
            // },

		};
	},
    methods:{
        async search(){
            try {
                console.log('HERE');
                                
                this.results = await this.provider.search({ query: this.message });
            
                console.log(this.results);
            } 
            catch (error) {
                console.log(error);
            }
        },

        complete(){
            this.message = this.results.label;
            this.results = null;
        }
    },
    computed:{
        
    },

    created(){
        
    }
};
</script>

<style scoped>
form{
    width: 250px;
}

.input{
    padding: 5px;
    background-color: #4E7378;
    color: white;

    width: 200px;

    outline: none;
    border: none;

    text-overflow: ellipsis;
}

.inputicon{
    background: #4E7378;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;

    font-size: 40px;
    color: white;

    float: right;
    position: relative;

    padding-top: 8px;
    padding-bottom: 8px;
}

.autocomplete{

    color: black;
    background-color: white;
    z-index: 200;
    position: relative;
    width: 500px;
    left: -20px;
    top: 10px;


    border-bottom-right-radius: 3px;    
    border-bottom-left-radius: 3px;    
}

.autocomplete p{
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 0px;
    width: 100%; 


    white-space: nowrap;
    overflow: hidden;
}

.autocomplete p:hover{
    cursor: pointer;
    background-color: #DBE8EA;
}

</style>
