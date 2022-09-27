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
          <h1 v-if="!forms.title">Form Title</h1>
          <h1>{{ forms.title }}</h1>
          <p class="header-p" v-if="!forms.desc">Form Description</p>
          <p class="header-p">{{ forms.desc }}</p>
          <el-divider />

          <div v-for="(form, index) in forms" :key="index" v-bind="form" class="form__group" style="margin-top: 25px;">
            <label class="form__label" v-model="form.label" v-show="form.hasOwnProperty('label')">
              {{ form.label }}
            </label>

            <component :is="form.fieldType" :currentField="form" class="form__field">
            </component>

            <small class="form__helpblock" v-model="form.helpBlockText" v-show="form.isHelpBlockVisible">
              {{ form.helpBlockText }}
            </small>
          </div>

          <el-button type="primary" class="mt-25">Submit</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { FormBuilder } from '@/components/form_elements/formbuilder'

export default {
  name: 'Publish',
  store: ['forms', 'themingVars'],
  components: FormBuilder.$options.components,
  data() {
    return {
      login: localStorage.getItem('login')
    };
  },
  mounted() {
    // Login validation
    if (!this.login) {
      this.$message.error("Not authenticated!")
      return this.$router.push({ name: 'login' })
    }

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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mt-25 {
  margin-top: 25px;
}
</style>