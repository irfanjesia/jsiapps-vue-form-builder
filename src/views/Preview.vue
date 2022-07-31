<template>
  <div class="main__wrapper">
    <el-container>
      <el-main :style="cssProps">
        <div class="wrapper--forms preview__wrapper">
          <h1 v-if="!forms.title">Form Title</h1>
          <h1>{{ forms.title }}</h1>
          <p style="margin-top: 25px; margin-bottom: 20px" v-if="!forms.desc">Form Description</p>
          <p style="margin-top: 25px; margin-bottom: 20px">{{ forms.desc }}</p>
          <hr>
          <div v-for="(form, index) in forms" :key="index" v-bind="form" class="form__group" style="margin-top: 25px;">
            <label class="form__label" v-model="form.label" v-show="form.hasOwnProperty('label')">{{ form.label
            }}</label>

            <component :is="form.fieldType" :currentField="form" class="form__field">
            </component>

            <small class="form__helpblock" v-model="form.helpBlockText" v-show="form.isHelpBlockVisible">
              {{ form.helpBlockText }}
            </small>
          </div>
          <a href="/preview"><button type="button" @click="onSubmit" class="el-button form__button el-button--primary"
              style="margin-top: 25px"><span>Submit</span></button>
          </a>
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
  }
}
</script>