<template>
	<el-container>
		<el-header v-if="this.$route.name != 'login' && this.$route.name != 'form'">
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :router="true">
				<el-menu-item index="/">Design</el-menu-item>
				<el-menu-item index="/preview">Preview</el-menu-item>
				<el-menu-item class="dock-right">
					<el-button type="danger" @click.prevent="logout" plain>Logout</el-button>
				</el-menu-item>
			</el-menu>
		</el-header>

		<el-container>
			<el-main>
				<slot />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			activeIndex: '/',
			login: localStorage.getItem('login')
		};
	},
	methods: {
		logout() {
			localStorage.removeItem("login")
			this.$message.success("Logout successful")
			return this.$router.push({ name: 'login' })
		}
	}
}
</script>

<style lang="scss" scoped>
.dock-right {
	float: right;
}
</style>
<!-- https://itnext.io/anyway-heres-how-to-create-a-multiple-layout-system-with-vue-and-vue-router-b379baa91a05 -->