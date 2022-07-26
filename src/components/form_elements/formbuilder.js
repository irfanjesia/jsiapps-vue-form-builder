import Vue from 'vue';

import draggable from 'vuedraggable';

import TextInput from '@/components/form_elements/FormElementTextInput';
import LongTextInput from '@/components/form_elements/FormElementLongTextInput';
import NumberInput from '@/components/form_elements/FormElementNumberInput';
import SelectList from '@/components/form_elements/FormElementSelectList';
import RadioButton from '@/components/form_elements/FormElementRadioButton';
import Checkbox from '@/components/form_elements/FormElementCheckbox';
import TimePicker from '@/components/form_elements/FormElementTimePicker';
import DatePicker from '@/components/form_elements/FormElementDatePicker';

import Elements from '@/components/form_elements/Elements';
import Properties from '@/components/form_elements/Properties';

export const FormBuilder = new Vue ({
  components: {
    Elements,
    Properties,
    draggable,
    TextInput,
    LongTextInput,
    NumberInput,
    SelectList,
    RadioButton,
    Checkbox,
    TimePicker,
    DatePicker,
  },
  data () {
    return {
      fields: [
        {
          name: 'TextInput',
          text: 'Text',
          group: 'form', //form group
          hasOptions: false,
          isRequired: false,
          isHelpBlockVisible: false,
          isPlaceholderVisible: true,
          isUnique: false,
        },
        {
          name: 'LongTextInput',
          text: 'Long Text',
          group: 'form',
          hasOptions: false,
          isRequired: false,
          isHelpBlockVisible: false,
          isPlaceholderVisible: true,
          isUnique: false,
        },
        {
          name: 'NumberInput',
          text: 'Number',
          group: 'form',
          hasOptions: false,
          isRequired: false,
          isHelpBlockVisible: false,
          isPlaceholderVisible: false,
          isUnique: false,
        },
        {
          name: 'SelectList',
          text: 'Select',
          group: 'form',
          hasOptions: true,
          isRequired: false,
          isHelpBlockVisible: false,
          isPlaceholderVisible: false,
          isUnique: false,
        },
        {
          name: 'RadioButton',
          text: 'Radio',
          group: 'form',
          hasOptions: true,
          isRequired: false,
          isHelpBlockVisible: false,
          isPlaceholderVisible: false,
          isUnique: false,
        },
        {
          name: 'Checkbox',
          text: 'Checkbox',
          group: 'form',
          hasOptions: true,
          isRequired: false,
          isHelpBlockVisible: false,
          isPlaceholderVisible: false,
          isUnique: false,
        },
        {
          name: 'TimePicker',
          text: 'Time Picker',
          group: 'form',
          hasOptions: false,
          isRequired: false,
          isHelpBlockVisible: false,
          isPlaceholderVisible: false,
          isUnique: false,
        },
        {
          name: 'DatePicker',
          text: 'Date Picker',
          group: 'form',
          hasOptions: false,
          isRequired: false,
          isHelpBlockVisible: false,
          isPlaceholderVisible: false,
          isUnique: false,
        },
      ],

      sortElementOptions: {
        group: {name: 'formbuilder', pull: false, put: true},
        sort: true,
        handle: '.form__actionitem--move',
      },

      dropElementOptions: {
        group: {name: 'formbuilder', pull: 'clone', put: false},
        sort: false,
        ghostClass: 'sortable__ghost',
        filter: '.is-disabled',
      },
    };
  },
  methods: {
    deleteElement (index) {
      vm.$store.activeForm = [];
      vm.$store.activeTabForFields = 'elements';
      this.$delete (vm.$store.forms, index);
    },

    cloneElement (index, form) {
      var cloned = _.cloneDeep (form); // clone deep lodash
      vm.$store.forms.splice (index, 0, cloned);
    },

    editElementProperties (form) {
      vm.$store.activeForm = form;
      vm.$store.activeTabForFields = 'properties';
    },
  },
});
