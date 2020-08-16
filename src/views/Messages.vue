<template>
    <div class="container my-4">
        <div id="top-part">
            <div class="title">
                Μηνύματα
                <span class="iconify" data-icon="ion-mail-outline"/>
            </div>
            <div id="mail-buttons" class="d-flex mt-2">
                <button id="incoming" class="mr-2">Εισερχόμενα</button>
                <button id="outgoing" class=" mr-auto">Εξερχόμενα</button>
                <button id="new-mail" class="">
                    <span class="mr-2">Νέο Μήνυμα</span>
                    <div class="iconify" data-icon="ion-mail-unread-outline align-item-center"/>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Messages",
    data() {
        return {

        }
    },
}
</script>

<style scoped>

.container {
    color: #194A50;
}

.title {
    font-size: 42px;
}

#mail-buttons button {
    color: white;
    border: none;
    font: 24px;
    padding: 8px 20px;
    border-radius: 5px;
}

#incoming {
    background-color: #194A50;
}

#incoming:hover {
    background-color: #0d2629;
}

#outgoing {
    background-color: #759296;
}

#outgoing:hover {
    background-color: #46676B;
}

#new-mail {
    background-color: #D37556;
    border-radius: 90px !important;
}

#new-mail:hover {
    background-color: #9C533B;
}

#new-mail .iconify {
    width: 20px;
    height: 20px;
}

</style>