<template>
    <div class="main__wrapper">
        <el-container>
            <el-main :style="cssProps">
                <div class="wrapper--forms preview__wrapper">
                    <!-- Form Header -->
                    <img src="https://apps-jsi.ub.ac.id/jsiapps/public/uploads/2021-11/175d2c1a790beae2006ab0d26f5e964d.png"
                        style="height: 35%; width: 35%; 
                        display: block;
                        margin-top: -80px;
                        margin-left: auto;
                        margin-right: auto;">
                    <h1 v-if="!header.title">Form Title</h1>
                    <h1>{{ header.title }}</h1>
                    <p class="header-p" v-if="!header.desc">Form Description</p>
                    <p class="header-p">{{ header.desc }}</p>
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
import header from '../assets/json/header.json'
import axios from 'axios'

export default {
    name: 'Form',
    data() {
        return {
            token: localStorage.getItem('token'),
            login: localStorage.getItem('login'),
            json: [],
            header: header,
            validation: []
        }
    },
    store: ['themingVars'],
    components: FormBuilder.$options.components,
    created() {
        axios.get('https://apps-jsi.ub.ac.id/jsiapps/public/api/dsi_form', {
            headers: { 'Authorization': 'Bearer ' + this.token }, params: { id: this.$route.params.id }
        }).then(response => {
            console.log(response)
            this.json = JSON.parse(response.data.data.json)
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
            // Validation array
            this.validation = []

            // Input type
            const inputs = document.querySelectorAll('.el-input__inner')
            inputs.forEach(input => {
                if (input.parentElement.parentElement.parentElement.innerText) {
                    if (!input.value && input.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                        // Return validation true if there is no value in required field
                        // console.log(input.parentElement.parentElement.parentElement.hasAttribute('isRequired'))
                        this.validation.input = true
                    }
                    let inputValues = { [input.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: input.value }
                    console.log(JSON.stringify(inputValues))
                } else {
                    if (!input.value && input.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                        // Return validation true if there is no value in required field
                        // console.log(input.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired'))
                        this.validation.input = true
                    }
                    let inputValues = { [input.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: input.value }
                    console.log(JSON.stringify(inputValues))
                }
            })

            // Textarea type
            const textAreas = document.querySelectorAll('.el-textarea__inner')
            textAreas.forEach(textArea => {
                if (!textArea.value && textArea.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                    // Return validation true if there is no value in required field
                    // console.log(textArea.parentElement.parentElement.parentElement.hasAttribute('isRequired'))
                    this.validation.textArea = true
                }
                let textAreaValues = { [textArea.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: textArea.value }
                console.log(JSON.stringify(textAreaValues))
            })

            // Radio type
            const radios = document.querySelectorAll('.el-radio__original')
            this.validation.radio = true // Set validation true for no initial value
            radios.forEach(radio => {
                if (radio.closest('.is-checked') && (radio.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired'))) {
                    let radioValues = { [radio.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: radio.value }
                    console.log(JSON.stringify(radioValues))
                    // Return validation false if there is a value in required field
                    this.validation.radio = false
                }
                else if (radio.closest('.is-checked')) {
                    let radioValues = { [radio.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: radio.value }
                    console.log(JSON.stringify(radioValues))
                }
            })

            // Checkbox type
            const checkboxes = document.querySelectorAll('.el-checkbox__original')
            this.validation.checkbox = true // Set validation true for no initial value
            checkboxes.forEach(checkbox => {
                if (checkbox.closest('.is-checked') && (checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired'))) {
                    let checkboxValues = { [checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: checkbox.value }
                    console.log(JSON.stringify(checkboxValues))
                    // Return validation false if there is a value in required field
                    this.validation.checkbox = false
                }
                else if (checkbox.closest('.is-checked')) {
                    this.validation.checkbox = false
                    let checkboxValues = { [checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: checkbox.value }
                    console.log(JSON.stringify(checkboxValues))
                }
            })

            // Required field validation
            if (this.validation.input || this.validation.textArea || this.validation.radio || this.validation.checkbox) {
                // If validation field is true then show alert
                console.log(this.validation)
                this.$message.error("You must fill the required field!")
            } else { this.$message.success("Form submitted, check console for data.") }
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
</style>