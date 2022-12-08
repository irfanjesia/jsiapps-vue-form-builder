<template>
    <div class="form__list">
        <el-table border :data="forms" style="width: 100%">
            <el-table-column align="center" type="index" label="No." width="45" />
            <el-table-column align="center" prop="id" label="ID" width="45" />
            <el-table-column label="Form">
                <template slot-scope="scope">
                    <div>{{ scope.row.title }}</div>
                    <div>{{ scope.row.desc }}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="Options" width="225">
                <template slot-scope="scope">
                    <router-link :to="{ name: 'form', params: { id: scope.row.id } }">
                        <el-button size="small" type="info">View</el-button>
                    </router-link>
                    <router-link :to="{ name: 'edit', params: { id: scope.row.id } }">
                        <el-button size="small" type="primary">Edit</el-button>
                    </router-link>
                    <el-button size="small" type="danger" @click.prevent="formDelete(scope.row.id)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Dashboard',
    data() {
        return {
            token: localStorage.getItem('token'),
            login: localStorage.getItem('login'),
            forms: [],
            header: []
        }
    },
    created() {
        axios.get('https://apps-jsi.ub.ac.id/jsiapps/public/api/list_dsi_form', { headers: { 'Authorization': 'Bearer ' + this.token } })
            .then(response => {
                this.forms = response.data.data
                for (let i = 0; i < this.forms.length; i++) {
                    this.header[i] = JSON.parse(this.forms[i].json_header)
                    this.forms[i].title = "Title: " + this.header[i].title
                    this.forms[i].desc = "Description: " + this.header[i].desc
                }
            }).catch(error => {
                console.log(error)
            })
    },
    methods: {
        formDelete(id) {
            if (confirm('Are you sure you want to delete this form?')) {
                axios.get('https://apps-jsi.ub.ac.id/jsiapps/public/api/delete_dsi_form', {
                    headers: { 'Authorization': 'Bearer ' + this.token }, params: { id: id }
                }).then(response => {
                    if (response.data.api_message) {
                        location.reload();
                        this.$message.success("Form deleted")
                    } else {
                        this.$message.error("Form delete failed")
                    }
                }).catch(error => {
                    console.log(error)
                })
            } else {
                return false;
            }
        }
    },
    mounted() {
        // Login validation
        if (!this.login) {
            this.$message.error("Not authenticated!")
            return this.$router.push({ name: 'login' })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>