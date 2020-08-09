<template>
    <div class="whole d-flex justify-content-center align-items-stretch">  
        <div class="line"/>
        
        <div class="pt-2 pb-2 d-flex flex-column align-items-start">
            <div id=logo class="mb-3 align-self-center">Homies</div>

            <div class="telephone d-flex align-items-center">
                <span class="iconify" data-icon="ion-call"/>
                <span>(+30) 2101234567</span>
            </div>
            <div class="text mt-5">Για οποιαδήποτε απορία, παρακαλώ καλέστε μας στο παραπάνω<br>τηλέφωνο ή επικοινωνήστε μαζί μας στην ακόλουθη διεύθυνση e-mail:</div>

            <div class="email mt-1"><b>support@homies.gr</b></div>
        </div>
        
        <div class="line"/>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Lemon&display=swap');
#logo {
    font-family: 'Lemon', cursive;
    font-size: 72px;
    color: rgba(25, 74, 80, 1);
}

.telephone{
    color: rgba(25, 74, 80, 1);
    font-size: 40px;
}

.line {
    height: 80%;
    width: 0px;
    border: 1px solid rgba(196, 196, 196, 0.5);
    margin-right: 50px;
    margin-left: 50px;
}

.whole {
    height: 500px;
    margin-top: 100px;
    margin-bottom: 100px;
}

.iconify {
    color: rgba(25, 74, 80, 1);
    font-size: 40px;
}

.text {
    font-size: 18px;
}

.email {
    color: rgba(25, 74, 80, 1);
    font-size: 25px;
}

</style>