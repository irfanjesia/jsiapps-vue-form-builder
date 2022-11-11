<template>
    <div class="login">
        <el-card>
            <h2>Login</h2>
            <el-form class="login-form" :model="model" :rules="rules" ref="form" @submit.native.prevent="login">
                <el-form-item prop="username">
                    <label>Username</label>
                    <el-input v-model="model.username" placeholder="Username"><i slot="prefix"
                            class="el-icon-user username"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <label>Password</label>
                    <el-input v-model="model.password" placeholder="Password" type="password"><i slot="prefix"
                            class="el-icon-lock password"></i></el-input>
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
import axios from 'axios'

export default {
    name: "Login",
    data() {
        return {
            token: localStorage.getItem('token'),
            validCredentials: {
                username: "guest@gmail.com",
                password: "guest"
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
            },
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
                axios.post('https://apps-jsi.ub.ac.id/jsiapps/public/api/get-token', {
                    secret: '6ad9e973117f59d8732be82a8238f022',
                    username: this.model.username,
                    password: this.model.password
                }).then(response => {
                    console.log(response)
                    if (response.data.api_message) {
                        localStorage.setItem("login", true)
                        localStorage.setItem("token", response.data.data.access_token)
                        this.$message.success("Login successful")
                        return this.$router.push({ name: 'dashboard' })
                    } else {
                        this.$message.error("Login failed")
                    }
                }).catch(error => {
                    console.log(error)
                })
            } else {
                this.$message.error("Username or password is invalid")
            }
        }
    },
    mounted() {
        // Login validation
        if (localStorage.getItem('login')) {
            this.$message.error("You are already logged in")
            return this.$router.push({ name: 'dashboard' })
        }
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

.username,
.password {
    margin-left: 5px;
}
</style>
  