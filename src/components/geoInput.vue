<template>
    <form @input.prevent="search">
        <input v-model="message">
        <p  v-for="(result, index) in results"
            v-bind:key="index">{{result.label}}</p>
    </form>
</template>

<script>

export default {
	data() {
		return {
            provider: new this.$OSMP(),

            message: '',
            
            results: null,
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
        }
    },

    created(){
        
    }
};
</script>

<style scoped>
input{
    padding: 5px;
    background-color: rgba(239, 239, 239, 0.25);
    width: 220px;

    outline: none;
    border: none;
}
</style>
