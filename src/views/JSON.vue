<template>
    <div class="main__wrapper">
        <el-container>
            <el-main :style="cssProps">
                <div class="wrapper--forms preview__wrapper">
                    <h1 v-if="!header.title">Form Title</h1>
                    <h1>{{  header.title  }}</h1>
                    <p class="header-p" v-if="!header.desc">Form Description</p>
                    <p class="header-p">{{  header.desc  }}</p>
                    <hr>
                    <div v-for="(form, index) in json" :key="index" v-bind="form" class="form__group"
                        style="margin-top: 25px;">
                        <label class="form__label" v-model="form.label" v-show="form.hasOwnProperty('label')">{{
                             form.label 
                            }}</label>

                        <component :is="form.fieldType" :currentField="form" class="form__field">
                        </component>

                        <small class="form__helpblock" v-model="form.helpBlockText" v-show="form.isHelpBlockVisible">
                            {{  form.helpBlockText  }}
                        </small>
                    </div>
                    <a><button type="button" @click="onSubmit" class="el-button form__button el-button--primary"
                            style="margin-top: 25px"><span>Submit</span></button></a>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { FormBuilder } from '@/components/form_elements/formbuilder'
import json from '../assets/json/data.json'
import header from '../assets/json/header.json'

export default {
    name: 'JSON',
    data() {
        return {
            json: json,
            header: header,
            validation: []
        }
    },
    store: ['themingVars'],
    components: FormBuilder.$options.components,
    mounted() {
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
        onSubmit() {
            this.validation = []

            // Input type
            const inputs = document.querySelectorAll('.el-input__inner')
            inputs.forEach(input => {
                if (input.parentElement.parentElement.parentElement.innerText) {
                    if (!input.value && input.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                        console.log(input.parentElement.parentElement.parentElement.hasAttribute('isRequired'))
                        this.validation.input = true
                    }
                    let inputValues = { [input.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: input.value }
                    console.log(JSON.stringify(inputValues))
                } else {
                    if (!input.value && input.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                        console.log(input.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired'))
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
                    console.log(textArea.parentElement.parentElement.parentElement.hasAttribute('isRequired'))
                    this.validation.textArea = true
                }
                let textAreaValues = { [textArea.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: textArea.value }
                console.log(JSON.stringify(textAreaValues))
            })

            // Radio type
            const radios = document.querySelectorAll('.el-radio__original')
            radios.forEach(radio => {
                if (radio.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                    // check is required first
                }
                if (radio.parentElement.classList.contains('is-checked')) {
                    let radioValues = { [radio.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: radio.value }
                    console.log(JSON.stringify(radioValues))
                    console.log(radio.parentElement.classList)
                } else if (!radio.parentElement.classList.contains('is-checked')) {
                    // console.log(radio.parentElement.classList)
                    this.validation.radio = true
                }
            })

            // Checkbox type
            const checkboxes = document.querySelectorAll('.el-checkbox__original')
            checkboxes.forEach(checkbox => {
                if (checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.hasAttribute('isRequired')) {
                    // check is required first
                }
                if (checkbox.parentElement.classList.contains('is-checked')) {
                    let checkboxValues = { [checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: checkbox.value }
                    console.log(JSON.stringify(checkboxValues))
                    console.log(checkbox.parentElement.classList)
                } else if (!checkbox.parentElement.classList.contains('is-checked')) {
                    // console.log(checkbox.parentElement.classList)
                    this.validation.checkbox = true
                }
            })

            // Required field validation
            if (this.validation.input || this.validation.textArea || this.validation.radio || this.validation.checkbox) {
                console.log(this.validation)
                alert('You must fill the required field')
            }
        }
    }
}
</script>