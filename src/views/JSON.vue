<template>
    <div class="main__wrapper">
        <el-container>
            <el-main :style="cssProps">
                <div class="wrapper--forms preview__wrapper">
                    <h1 v-if="!header.title">Form Title</h1>
                    <h1>{{ header.title }}</h1>
                    <p style="margin-top: 25px; margin-bottom: 20px" v-if="!header.desc">Form Description</p>
                    <p style="margin-top: 25px; margin-bottom: 20px">{{ header.desc }}</p>
                    <hr>
                    <div v-for="(form, index) in json" :key="index" v-bind="form" class="form__group"
                        style="margin-top: 25px;">
                        <label class="form__label" v-model="form.label" v-show="form.hasOwnProperty('label')">{{
                                form.label
                        }}</label>

                        <component :is="form.fieldType" :currentField="form" class="form__field">
                        </component>

                        <small class="form__helpblock" v-model="form.helpBlockText" v-show="form.isHelpBlockVisible">
                            {{ form.helpBlockText }}
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
            header: header
        }
    },
    store: ['themingVars'],
    components: FormBuilder.$options.components,
    computed: {
        cssProps() {
            // Return an object that will generate css properties key 
            // to match with the themingVars
            // 
            // Example output: { '--theme-primary-color': this.themingVars.primaryColor }
            var result = {},
                themingVars = this.themingVars;

            for (var v in themingVars) {
                if (themingVars.hasOwnProperty(v)) {
                    var newV = "--theme-" + _.kebabCase(v),
                        suffix = "";

                    // Add px to the value if the default value contain 'px'
                    if (_.includes(newV, 'size')) suffix = "px"
                    else if (_.includes(newV, 'margin')) suffix = "px"
                    else if (_.includes(newV, 'radius')) suffix = "px"

                    result[newV] = themingVars[v] + suffix;
                }
            }

            return result;
        }
    },
    methods: {
        onSubmit() {
            // Input type
            let inputs = document.querySelectorAll('.el-input__inner');
            inputs.forEach(input => {
                if (input.parentElement.parentElement.parentElement.innerText) {
                    let inputValues = { [input.parentElement.parentElement.parentElement.innerText]: input.value }
                    console.log(JSON.stringify(inputValues))
                } else {
                    let inputValues = { [input.parentElement.parentElement.parentElement.parentElement.innerText]: input.value }
                    console.log(JSON.stringify(inputValues))
                }
            });

            // Textarea type
            let textAreas = document.querySelectorAll('.el-textarea__inner');
            textAreas.forEach(textArea => {
                let textAreaValues = { [textArea.parentElement.parentElement.parentElement.innerText]: textArea.value }
                console.log(JSON.stringify(textAreaValues))
            });

            // Radio type
            let radios = document.querySelectorAll('.el-radio__original');
            radios.forEach(radio => {
                if (radio.parentElement.classList.contains('is-checked')) {
                    let radioValues = { [radio.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: radio.value }
                    console.log(JSON.stringify(radioValues))
                }
            });

            // Checkbox type
            let checkboxes = document.querySelectorAll('.el-checkbox__original');
            checkboxes.forEach(checkbox => {
                if (checkbox.parentElement.classList.contains('is-checked')) {
                    let checkboxValues = { [checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.innerText.split("\n")[0]]: checkbox.value }
                    console.log(JSON.stringify(checkboxValues))
                }
            });
        }
    }
}
</script>