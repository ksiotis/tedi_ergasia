<template>
    <div class="d-flex flex-column align-items-center my-3">
        <div v-if="user" class="" @>
            <div id="top-part">
                <div class="title">
                    Μηνύματα
                    <span class="iconify" data-icon="ion-mail-outline"/>
                </div>
                <div id="mail-buttons" class="d-flex mt-2">
                    <button class="mr-2 my-button" :class="{active:incoming}" @click="selectInHandle" ref="inboxbtn">Εισερχόμενα</button>
                    <button class="mr-5 my-button" :class="{active:outgoing}" @click="selectOutHandle">Εξερχόμενα</button>
                    <button @click="$router.push('newmessage')" id="new-mail" class="d-flex ml-auto">
                        <span class="mr-2 " >Νέο Μήνυμα</span>
                        <span class="iconify" data-icon="ion-mail-unread-outline" />
                    </button>
                </div>
            </div>
            <div id="table">
                <table class="my-5">
                <tr>
                    <th>Θέμα</th>
                    <th>{{secondaryColumnName}}</th>
                    <th>Ημερομηνία</th>
                </tr>
                <tr v-for="(message, message_index) in items" :key="message_index">
                    <td @click="displayMessage(message_index)">{{message.Subject}}</td>
                    <td @click="displayMessage(message_index)">{{message.Secondary}}</td>
                    <td @click="displayMessage(message_index)">{{message.Datetime}}</td>
                </tr>
                </table>

                <div @click="in_out_handler">
                    <b-pagination 
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    ></b-pagination>
                </div>
            </div>
        </div>

        <div v-else @click="$router.push('/').catch(() => {})" id="not-logged-in" class="d-flex flex-column">
            <div>Για να δείτε τα μηνύματά σας, πρέπει να συνδεθείτε...</div>
            <a class="orange-link mt-auto mb-5">Επιστροφή στην αρχική σελίδα</a>
        </div>
    </div>
        
</template>

<script>
export default {
    name: "Messages",
    data() {
        return {
            incoming: false,
            outgoing: false,
            currentPage: 1,
            rows: 0,
            perPage: 10,
            items: [],
            errormessage: "Προέκυψε κάποιο σφάλμα, δοκιμάστε ξανά"
        }
    },
    computed: {
        user() {
            if (this.$store.state.user)
                return this.$store.state.user;
            else if (this.$store.state.token) {
                this.$store.commit('updateUser', this.$jwt.decode(this.$store.state.token).user);
                return this.$store.state.user;
            }
            else
                return '';
        },
        secondaryColumnName() {
            return this.outgoing ? 'Προς' : 'Από';
        }
    },
    methods: {
        async selectIn() {
            try {
                this.incoming = true;
                this.outgoing = false;

                let url = `/messages?page=${this.currentPage}&perpage=${this.perPage}&inbox=1`;
                let response = await this.$axios.get(url, {
                    headers: { "authorization": 'Bearer ' + this.$store.state.token }
                });

                this.rows = response.data[0];
                this.items = response.data[1];

                for (var i = 0; i < this.items.length; i++) {
                    let current_datetime = new Date(Date.parse(this.items[i].Datetime));
                    this.items[i].Datetime = current_datetime.getFullYear() + "-" + 
                    (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + 
                    " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + 
                    ":" + current_datetime.getSeconds();
                }
                for (var i = this.items.length; i < 10; i++) {
                    this.items.push({
                        Datetime: '',
                        Message: '',
                        Secondary: '',
                        Subject: ''
                    });
                }
            } catch(error) {
                alert(this.errormessage)
                console.log(error);
            }

        },
        async selectOut() {
            try {
                this.outgoing = true;
                this.incoming = false;
    
                let url = `/messages?page=${this.currentPage}&perpage=${this.perPage}&inbox=0`;
                let response = await this.$axios.get(url, {
                    headers: { "authorization": 'Bearer ' + this.$store.state.token }
                });
    
                this.rows = response.data[0];
                this.items = response.data[1];
    
                for (var i = 0; i < this.items.length; i++) {
                    let current_datetime = new Date(Date.parse(this.items[i].Datetime));
                    this.items[i].Datetime = current_datetime.getFullYear() + "-" + 
                    (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + 
                    " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + 
                    ":" + current_datetime.getSeconds();
                }
                for (var i = this.items.length; i < 10; i++) {
                    this.items.push({
                        Datetime: '',
                        Message: '',
                        Secondary: '',
                        Subject: ''
                    });
                }
            } catch(error) {
                alert(this.errormessage)
                console.log(error);
            }
        },
        async in_out_handler() {
            if (this.incoming)
                await selectIn();
            else if (this.outgoing)
                await this.selectOut();
        },
        async selectInHandle() {
            this.currentPage = 1;
            await this.selectIn();
        },
        async selectOutHandle() {
            this.currentPage = 1;
            await this.selectOut();
        },
        displayMessage(message_index) {
            alert(this.items[message_index].Message);
        }
    },
    mounted() {
        this.$nextTick();
        this.$refs.inboxbtn.click();
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

.active {
    background-color: #194A50 !important;
}

.active:hover {
    background-color: #0d2629 !important;
}

.my-button {
    background-color: #759296;
}

.my-button:hover {
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

table th:nth-child(1) {
    width: 500px;
}

table th:nth-child(2) {
    width:200px;
}

table th:nth-child(3) {
    width:300px;
}

table {
    width: 1000px;
    border: solid 1px black;
    text-overflow: ellipsis;
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

#not-logged-in {
    background-color: #194A50;
    color: white;
    border-radius: 15px;
    padding: 20px;
    font-size: 18px;
    height: 500px;
    width: 500px;
    font-size: 30px;
    text-align: center;
}

.orange-link {
    color: #D37556;
}

#not-logged-in:hover .orange-link {
    text-decoration: underline;
    cursor: pointer;
}

</style>