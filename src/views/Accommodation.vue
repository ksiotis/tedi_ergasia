<template>
    <div class="d-flex flex-column justify-content-start container">
        <!-- τίτλος  -->
        <h2 class="title">Τίτλος χώρου</h2>
        <!-- εικόνες -->
        

        <div>
            <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="3000"
            controls
            indicators
            background="#ccc"
            img-width="1024"
            img-height="480"
            style="text-shadow: 1px 1px 2px #000;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >
                <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=52"/>
                <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=53"/>
                <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54"/>
                <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=55"/>
           
            </b-carousel>
        </div>
    </div>
</template>



<script>
 export default {
    data() {
      return {
        slide: 0,
        sliding: null
      }
    },
    methods: {
      onSlideStart() {
        this.sliding = true
      },
      onSlideEnd() {
        this.sliding = false
      }
    }
  }
</script>

<style scoped>
.container{
    margin-left: 125px;
    margin-top: 50px;
}

.title{

    font-style: normal;
    font-weight: 900;
    line-height: 56px;

    color: #194A50;

}

img{
    width: 100px;
}
</style>
