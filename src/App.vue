<template>
    <div id="app">
        <Art />
        <Navbar />
        <router-view/>
        <Footer />
    </div>
</template>

<script>
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Art from './components/Art';

export default {
	components: {
		Art,
		Navbar,
		Footer,
	},
};
</script>

<style>
.b-btn {
	border-radius: 3px;
}
.btn-primary {
	background-color: #FFFFFF !important;
}

.noselect {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently
                        supported by Chrome, Opera and Firefox */
}

::-webkit-input-placeholder {
    color: white;
    font-style: normal;
    font-weight: normal;
}

:-moz-placeholder { /* Firefox 18- */
    color: white;
    font-style: normal;
    font-weight: normal;
}

::-moz-placeholder {  /* Firefox 19+ */
    color: white;
    font-style: normal;
    font-weight: normal;
}

:-ms-input-placeholder {  
    color: white;
    font-style: normal;
    font-weight: normal;
}
</style>
