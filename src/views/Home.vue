<template>
  <div class="main__wrapper">
    <el-container>
      <el-main :style="cssProps">
        <div class="wrapper--forms">
          <label>Form Title</label>
          <input class="header__input" type="text" v-model="forms.title">
          <label>Form Description</label>
          <input class="header__input" type="textarea" v-model="forms.desc">
          <div v-if="forms.length == 0">
            <p style="text-align: center; margin-bottom: 20px;">Drag an element to get started</p>
          </div>

          <draggable :list="forms" class="dragArea" :options="sortElementOptions">
            <div v-for="(form, index) in forms" :key="index" v-bind="form" class="form__group"
              :class="{ 'is--active': form === activeForm }">

              <span class="form__selectedlabel">{{ form.fieldType }}</span>

              <div @click="editElementProperties(form)">
                <label class="form__label" v-model="form.label" v-show="form.hasOwnProperty('label')">{{ form.label
                }}</label>

                <component :is="form.fieldType" :currentField="form" class="form__field">
                </component>

                <small class="form__helpblock" v-model="form.helpBlockText" v-show="form.isHelpBlockVisible">{{
                    form.helpBlockText
                }} </small>
              </div>

              <!-- Actions list -->
              <div class="form__actiongroup">
                <el-button circle size="mini" type="primary" icon="el-icon-rank" class="form__actionitem--move">
                </el-button>

                <el-button-group class="form__actionlist">
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click="cloneElement(index, form)"
                    v-show="!form.isUnique"></el-button>
                  <el-button size="mini" type="primary" icon="el-icon-delete" @click="deleteElement(index)"></el-button>
                </el-button-group>
              </div>
            </div>
          </draggable>
        </div>
      </el-main>

      <el-aside class="wrapper--sidebar" width="470px">
        <el-tabs type="border-card" v-model="activeTabForFields">
          <el-tab-pane name="elements" label="Elements">
            <elements />
          </el-tab-pane>

          <el-tab-pane name="properties" label="Properties">
            <properties v-show="Object.keys($store.activeForm).length > 0"></properties>
          </el-tab-pane>
        </el-tabs>

        <div class="wrapper--snippet">
          <pre
            style="margin-bottom: -30px;">Form Header: { "title": "{{ forms.title }}", "desc": "{{ forms.desc }}" }</pre>
          <pre>Form Data: {{ forms }}</pre>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { FormBuilder } from '@/components/form_elements/formbuilder'

export default {
  name: 'Home',
  store: ['forms', 'activeForm', 'activeTabForFields', 'themingVars'],

  data() {
    return {
      sortElementOptions: FormBuilder.$data.sortElementOptions
    };
  },

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

      console.log("result", result)
      console.log("result JSON", JSON.stringify(result))

      return result;
    }
  },

  mounted() {
    console.log("form header ->", "{", '"title":', JSON.stringify(this.forms.title), ",", '"desc":', JSON.stringify(this.forms.desc), "}")
    console.log("form data ->", JSON.stringify(this.forms))
    // console.log("form ->", this.forms)
    // console.log("activeform ->", this.activeForm)
  },

  components: FormBuilder.$options.components,

  methods: {
    deleteElement(index) {
      FormBuilder.deleteElement(index)
    },

    cloneElement(index, form) {
      FormBuilder.cloneElement(index, form)
    },

    editElementProperties(form) {
      FormBuilder.editElementProperties(form)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main__wrapper {
  height: 100%;
}

.dragArea {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  min-height: 10px;
  z-index: 2;
}

.header__input {
  border: 1px solid #DCDFE6;
  height: 40px;
  width: 100%;
  line-height: 40px;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  background-color: #fff;
  padding: 0 15px;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 25px;
}

.form__selectedlabel {
  display: none;
  background: lighten(black, 20%);
  padding: 3px 5px;
  color: white;
  font-size: 10px;
  position: absolute;
  top: -17px;
  right: 15px;
}

.form__actionitem--move {
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;

  &:active,
  &:focus,
  &:hover {
    border-color: lighten(black, 50%);
    background: lighten(black, 50%);
  }
}

.form__actionlist {
  position: absolute;
  margin-top: 10px;
  visibility: hidden;
  z-index: 3;
  right: 0;
  box-shadow: 4px 4px 0 0 lighten(black, 80%);
  border-radius: 2px;
}

.form__group {
  margin-bottom: 25px;
  border: 2px solid transparent;
  position: relative;

  &:hover {
    border-color: lighten(black, 80%);

    .form__actionitem--move {
      visibility: visible;
    }
  }

  &.is--active {
    border-color: lighten(black, 50%);
    background: lighten(black, 95%);

    .form__actionlist {
      visibility: visible;
    }

    .form__selectedlabel {
      display: inline-block;
    }
  }
}
</style>
