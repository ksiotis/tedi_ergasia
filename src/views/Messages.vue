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
                <button v-b-modal.new-message-modal id="new-mail" class="d-flex">
                    <span class="mr-2" >Νέο Μήνυμα</span>
                    <span class="iconify" data-icon="ion-mail-unread-outline" />
                </button>
            </div>
        </div>
        <div id="table">
            <table class="my-5">
            <tr>
                <th>Θέμα</th>
                <th>Από</th>
                <th>Ημερομηνία</th>
            </tr>
            <tr v-for="message in mymessages" :key="message.index">
                <td>{{message.subject}}</td>
                <td>{{message.from}}</td>
                <td>{{message.when}}</td>
            </tr>
            </table>
        </div>

        
    </div>
</template>

<script>
export default {
    name: "Messages",
    data() {
        return {
            user: {
                username: "quirkygirl85"
            },
            mymessages: [
                {
                    subject: "why coronavirus is a semetic lie and how to protect yourself from it",
                    from: "quirkygirl85",
                    when: "22/1/1999",
                },
                {
                    subject: "Nigerian prince wants to give you money hon",
                    from: "quirkygirl85",
                    when: "22/1/1999",
                }
            ],
        }
    },
    methods: {
        send() {

        },
    }
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

/* table th:nth-child(1) td:nth-child(1) {
    width:10px !important;
}

table th:nth-child(2) {
    width:10px !important;
}

table th:nth-child(3) {
    width:10px !important;
} */

table {
    border: solid 1px black;
    width: 100%;
}

td {
    text-align: left;
    padding: 8px;
    border-right: #194A50 solid 1px;
    border-left: #194A50 solid 1px;
    height: 40px;
    color: black;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

tr:nth-child(even) {
    background-color: #DBE8EA;
    height: 40px;
}

tr:hover {
    background-color: #c5d0d2;
    cursor: pointer;
}

th {
    background-color: #759296;
    color: white;
    text-align: center;
    padding: 8px;
    border: #194A50 solid 1px;
}

.widen {
	width: 100%;
}

#new-message-modal span {
    font-size: 28px;
}

#new-message-modal .iconify {
	height: 32px;
	width: 32px;
	color: #153D41;
}

#send-button {
    font-size: 12px;
    border: none;
    background-color: #D37556;
    color: white;
    border-radius: 90px;
    padding: 1px 20px;
}

</style>