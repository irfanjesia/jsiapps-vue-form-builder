<template>
  <div class="main__wrapper">
    <el-container>
      <el-main :style="cssProps">
        <div class="wrapper--forms">
          <!-- Form Header -->
          <div class="form__header">
            <label>Form Title</label>
            <el-input v-model="forms.title" class="header__input" placeholder="Add form title..." />
            <label>Form Description</label>
            <el-input v-model="forms.desc" :rows="2" type="textarea" class="header__input"
              placeholder="Add form description..." />
            <div v-if="forms.length == 0">
              <p class="empty-p">Drag an element to get started</p>
            </div>
          </div>

          <draggable :list="forms" class="dragArea" :options="sortElementOptions">
            <div v-for="(form, index) in forms" :key="index" v-bind="form" class="form__group edit"
              :class="{ 'is--active': form === activeForm }">

              <span class="form__selectedlabel">{{ form.fieldType }}</span>

              <div @click="editElementProperties(form)">
                <label class="form__label" v-model="form.label" v-show="form.hasOwnProperty('label')">
                  {{ form.label }}
                </label>

                <component :is="form.fieldType" :currentField="form" class="form__field">
                </component>

                <small class="form__helpblock" v-model="form.helpBlockText" v-show="form.isHelpBlockVisible">
                  {{ form.helpBlockText }}
                </small>
              </div>

              <!-- Actions list -->
              <div class="form__actiongroup">
                <el-button circle size="mini" type="info" icon="el-icon-rank" class="form__actionitem--move">
                </el-button>

                <el-button-group class="form__actionlist">
                  <el-button size="mini" type="info" icon="el-icon-plus" @click="cloneElement(index, form)"
                    v-show="!form.isUnique"></el-button>
                  <el-button size="mini" type="info" icon="el-icon-delete" @click="deleteElement(index)"></el-button>
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

      <div class="submit-btn">
        <el-button type="primary" @click="onSubmit">Create Form</el-button>
      </div>
    </el-container>

    <!-- Preview -->
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

          <el-button type="primary" class="mt-25" disabled>Submit</el-button>
        </div>
      </el-main>
    </el-container>
  </div>

</template>

<script>
import axios from 'axios'
import { FormBuilder } from '@/components/form_elements/formbuilder'

export default {
  name: 'Create',
  store: ['forms', 'activeForm', 'activeTabForFields', 'themingVars'],

  data() {
    return {
      token: localStorage.getItem('token'),
      login: localStorage.getItem('login'),
      sortElementOptions: FormBuilder.$data.sortElementOptions
    };
  },
  computed: {
    cssProps() {
      // Return an object that will generate css properties key to match with the themingVars
      // Example output: { '--theme-primary-color': this.themingVars.primaryColor }
      var result = {},
        themingVars = this.themingVars

      for (var v in themingVars) {
        if (themingVars.hasOwnProperty(v)) {
          var newV = "--theme-" + _.kebabCase(v),
            suffix = "";

          // Add px to the value if the default value contain 'px'
          if (_.includes(newV, 'size')) suffix = "px"
          else if (_.includes(newV, 'margin')) suffix = "px"
          else if (_.includes(newV, 'radius')) suffix = "px"

          result[newV] = themingVars[v] + suffix
        }
      }
      // console.log("result", result)
      return result;
    }
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
    },
    onSubmit() {
      let header = { title: this.forms.title, desc: this.forms.desc }
      console.log("form header ->", JSON.stringify(header))
      console.log("form data ->", JSON.stringify(this.forms))

      if (this.forms.length > 0) {
        axios.post('https://apps-jsi.ub.ac.id/jsiapps/public/api/add_dsi_form', {
          json: JSON.stringify(this.forms)
        }, {
          headers: { 'Authorization': 'Bearer ' + this.token }
        }).then(res => {
          console.log(res)
          if (res.data.api_message) {
            this.$message.success("Form created")
            return this.$router.push({ name: 'dashboard' })
          } else {
            this.$message.error("Failed to create form")
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$message.error("Form data empty")
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

.form__selectedlabel {
  display: none;
  background: #909399;
  padding: 3px 5px;
  color: white;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
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
}

.form__actionlist {
  position: absolute;
  margin-top: 10px;
  visibility: hidden;
  z-index: 3;
  right: 0;
  border-radius: 2px;
}

.edit {
  &:hover {
    padding: 8px;
    border-radius: 3px;
    border-color: #D4D7DE;

    .form__actionitem--move {
      visibility: visible;
    }
  }
}

.form__group {
  margin-bottom: 25px;
  border: 1.5px solid transparent;
  position: relative;

  &.is--active {
    padding: 8px;
    border-radius: 3px;
    border-color: #D4D7DE;
    background: #f9f9f9;

    .form__actionlist {
      visibility: visible;
    }

    .form__selectedlabel {
      display: inline-block;
    }
  }

  &.is--active {
    padding: 8px;
    border-radius: 3px;
    border-color: #D4D7DE;
    background: #f9f9f9;

    .form__actionlist {
      visibility: visible;
    }

    .form__selectedlabel {
      display: inline-block;
    }
  }
}

.empty-p {
  text-align: center;
  margin-bottom: 20px;
}

.submit-btn {
  position: fixed;
  right: 87.5%;
  top: 87.5%;
  z-index: 2;
}

.form__header {
  margin-top: -20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.header__input {
  margin-top: 10px;
  margin-bottom: 25px;
}
</style>
