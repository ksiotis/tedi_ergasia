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
		TopArt: Art,
		Navbar: Navbar,
		Footer: Footer,
	},
};
</script>

<style>
</style>
