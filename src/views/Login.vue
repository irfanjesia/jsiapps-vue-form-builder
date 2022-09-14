<template>
    <div class="login">
        <el-card>
            <h2>Login</h2>
            <el-form class="login-form" :model="model" :rules="rules" ref="form" @submit.native.prevent="login">
                <el-form-item prop="username">
                    <label>Username</label>
                    <el-input v-model="model.username" placeholder="Username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <label>Password</label>
                    <el-input v-model="model.password" placeholder="Password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" class="login-button" type="primary" native-type="submit" block>Login
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
  
<script>
export default {
    name: "login",
    data() {
        return {
            validCredentials: {
                username: "admin",
                password: "123456"
            },
            model: {
                username: "",
                password: ""
            },
            loading: false,
            rules: {
                username: [
                    { required: true, message: "Username is required", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "Password is required", trigger: "blur" },
                ]
            }
        };
    },
    methods: {
        simulateLogin() {
            return new Promise(resolve => {
                setTimeout(resolve, 800);
            });
        },
        async login() {
            let valid = await this.$refs.form.validate();
            if (!valid) {
                return;
            }
            this.loading = true;
            await this.simulateLogin();
            this.loading = false;
            if (this.model.username === this.validCredentials.username && this.model.password === this.validCredentials.password) {
                localStorage.setItem("login", true)
                this.$message.success("Login successful")
                return this.$router.push({ name: 'design' })
            } else {
                this.$message.error("Username or password is invalid")
            }
        },
    }
};
</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
    margin-top: 70px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-button {
    width: 100%;
    margin-top: 20px;
}

.login-form {
    width: 290px;
}
</style>
<style lang="scss">
.login .el-input__inner:hover {
    border-color: #409EFF;
}

h2 {
    text-align: center;
    padding-bottom: 20px;
}

a {
    color: #409EFF;
    text-decoration: none;

    &:hover,
    &:active,
    &:focus {
        color: lighten(#409EFF, 7);
    }
}

.login .el-card {
    width: 340px;
    display: flex;
    justify-content: center;
}
</style>
  