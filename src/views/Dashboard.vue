<template>
    <div class="form__list">
        <el-table border :data="forms" style="width: 100%">
            <el-table-column prop="id" label="ID" width="40" />
            <el-table-column prop="json_header" label="Form Header" width="400" />
            <el-table-column prop="json" label="Form Data" />
            <el-table-column label="Options" width="210">
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
        }
    },
    created() {
        axios.get('https://apps-jsi.ub.ac.id/jsiapps/public/api/list_dsi_form', { headers: { 'Authorization': 'Bearer ' + this.token } })
            .then(response => {
                this.forms = response.data.data
            }).catch(error => {
                console.log(error.response.data)
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