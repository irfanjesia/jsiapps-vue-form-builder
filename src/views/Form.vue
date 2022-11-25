<template>
    <div class="main__wrapper">
        <el-container>
            <el-main :style="cssProps">
                <div class="wrapper--forms preview__wrapper">
                    <!-- Form Header -->
                    <img src="https://apps-jsi.ub.ac.id/jsiapps/public/uploads/2021-11/175d2c1a790beae2006ab0d26f5e964d.png"
                        class="jsi-logo">
                    <h1 v-if="!form_header.title">Form Title</h1>
                    <h1>{{ form_header.title }}</h1>
                    <p class="header-p" v-if="!form_header.desc">Form Description</p>
                    <p class="header-p">{{ form_header.desc }}</p>
                    <el-divider />

                    <div v-for="(form, index) in json" :key="index" v-bind="form" class="form__group mt-25">
                        <label class="form__label" v-model="form.label" v-show="form.hasOwnProperty('label')">
                            {{ form.label }}
                        </label>

                        <component :is="form.fieldType" :currentField="form" class="form__field">
                        </component>

                        <small class="form__helpblock" v-model="form.helpBlockText" v-show="form.isHelpBlockVisible">
                            {{ form.helpBlockText }}
                        </small>
                    </div>

                    <el-button type="primary" class="mt-25" @click="onSubmit">Submit</el-button>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { FormBuilder } from '@/components/form_elements/formbuilder'
import axios from 'axios'

export default {
    name: 'Form',
    data() {
        return {
            token: localStorage.getItem('token'),
            login: localStorage.getItem('login'),
            form_header: {},
            json: [],
            validation: []
        }
    },
    store: ['themingVars'],
    components: FormBuilder.$options.components,
    created() {
        axios.get('https://apps-jsi.ub.ac.id/jsiapps/public/api/dsi_form', {
            headers: { 'Authorization': 'Bearer ' + this.token }, params: { id: this.$route.params.id }
        }).then(response => {
            this.json = JSON.parse(response.data.data.json)
            this.form_header = JSON.parse(response.data.data.json_header)
            this.addIsRequired()
        }).catch(error => {
            console.log(error)
        })
    },
    computed: {
        cssProps() {
            // Return an object that will generate css properties key to match with the themingVars
            // Example output: { '--theme-primary-color': this.themingVars.primaryColor }
            var result = {},
                themingVars = this.themingVars;

            for (var v in themingVars) {
                if (themingVars.hasOwnProperty(v)) {
                    var newV = "--theme-" + _.kebabCase(v),
                        suffix = ""

                    // Add px to the value if the default value contain 'px'
                    if (_.includes(newV, 'size')) suffix = "px"
                    else if (_.includes(newV, 'margin')) suffix = "px"
                    else if (_.includes(newV, 'radius')) suffix = "px"

                    result[newV] = themingVars[v] + suffix
                }
            }
            return result
        }
    },
    methods: {
        async addIsRequired() {
            await new Promise(resolve => {
                setTimeout(resolve, 0);
            });
            // Input type
            const inputs = document.querySelectorAll('.el-input__inner')
            inputs.forEach(input => {
                if (input.parentElement.parentElement.parentElement.innerText) {
                    if (input.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                        var tag = document.createElement('p')
                        var text = document.createTextNode('*Required field')
                        tag.appendChild(text)
                        tag.setAttribute('class', 'required-tag')
                        input.parentElement.parentElement.parentElement.appendChild(tag)
                    }
                } else {
                    if (input.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                        var tag = document.createElement('p')
                        var text = document.createTextNode('*Required field')
                        tag.appendChild(text)
                        tag.setAttribute('class', 'required-tag')
                        input.parentElement.parentElement.parentElement.parentElement.appendChild(tag)
                    }
                }
            })

            // Textarea type
            const textAreas = document.querySelectorAll('.el-textarea__inner')
            textAreas.forEach(textArea => {
                if (textArea.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                    var tag = document.createElement('p')
                    var text = document.createTextNode('*Required field')
                    tag.appendChild(text)
                    tag.setAttribute('class', 'required-tag')
                    textArea.parentElement.parentElement.parentElement.appendChild(tag)
                }
            })

            // Radio type
            const radioCheck = document.querySelector('.el-radio__original')
            const radios = document.querySelectorAll('.form__group[fieldType="RadioButton"]')
            radios.forEach(radio => {
                if (radio.hasAttribute('isRequired') && !radioCheck.parentElement.classList.contains('is-checked')) {
                    var tag = document.createElement('p')
                    var text = document.createTextNode('*Required field')
                    tag.appendChild(text)
                    tag.setAttribute('class', 'required-tag')
                    radio.appendChild(tag)
                }
            })

            // Checkbox type
            const checkboxCheck = document.querySelector('.el-checkbox__original')
            const checkboxes = document.querySelectorAll('.form__group[fieldType="Checkbox"]')
            checkboxes.forEach(checkbox => {
                if (checkbox.hasAttribute('isRequired') && !checkboxCheck.parentElement.classList.contains('is-checked')) {
                    var tag = document.createElement('p')
                    var text = document.createTextNode('*Required field')
                    tag.appendChild(text)
                    tag.setAttribute('class', 'required-tag')
                    checkbox.appendChild(tag)
                }
            })
        },
        onSubmit() {
            this.validation = []
            let value = []

            // Input type
            const inputs = document.querySelectorAll('.el-input__inner')
            inputs.forEach(input => {
                if (input.parentElement.parentElement.parentElement.innerText) {
                    if (!input.value && input.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                        this.validation.input = true
                    }
                    let inputValues = { [input.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: input.value }
                    value.push(inputValues)
                } else {
                    if (!input.value && input.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                        this.validation.input = true
                    }
                    let inputValues = { [input.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: input.value }
                    value.push(inputValues)
                }
            })

            // Textarea type
            const textAreas = document.querySelectorAll('.el-textarea__inner')
            textAreas.forEach(textArea => {
                if (!textArea.value && textArea.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                    this.validation.textArea = true
                }
                let textAreaValues = { [textArea.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: textArea.value }
                value.push(textAreaValues)
            })

            // Radio type
            const radios = document.querySelectorAll('.el-radio__original')
            radios.forEach(radio => {
                if (radio.closest('.is-checked') && (radio.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired'))) {
                    let radioValues = { [radio.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: radio.value }
                    value.push(radioValues)
                }
                else if (radio.closest('.is-checked')) {
                    let radioValues = { [radio.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: radio.value }
                    value.push(radioValues)
                }
            })

            // Checkbox type
            const checkboxes = document.querySelectorAll('.el-checkbox__original')
            checkboxes.forEach(checkbox => {
                if (checkbox.closest('.is-checked') && (checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired'))) {
                    let checkboxValues = { [checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: checkbox.value }
                    value.push(checkboxValues)
                }
                else if (checkbox.closest('.is-checked')) {
                    let checkboxValues = { [checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: checkbox.value }
                    value.push(checkboxValues)
                }
            })

            // Required field validation for input and textarea
            if (this.validation.input || this.validation.textArea) {
                this.$message.error("You must fill the required field!")
            } else {
                const date = (new Date()).toISOString().slice(0, 19).replace("T", " ");
                axios.post('https://apps-jsi.ub.ac.id/jsiapps/public/api/dsi_form_data', {
                    date: date,
                    data: String(value),
                    unit_jsiform_id: this.$route.params.id
                }, {
                    headers: { 'Authorization': 'Bearer ' + this.token }
                }).then(res => {
                    if (res.data.api_message) {
                        this.$message.success("Form submitted")
                        return this.$router.push({ name: 'dashboard' })
                    } else {
                        this.$message.error("Failed to submit form")
                    }
                }).catch(error => {
                    console.log(error)
                })
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
.mt-25 {
    margin-top: 25px;
}

.jsi-logo {
    height: 35%;
    width: 35%;
    display: block;
    margin-top: -80px;
    margin-left: auto;
    margin-right: auto;
}
</style>