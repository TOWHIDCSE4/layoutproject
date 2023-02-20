export default {
  dataTypes: [{
    label: "String",
    value: "string",
  }, {
    label: "Number",
    value: "number",
  }, {
    label: "Date",
    value: "datetime",
  }, {
    label: "File",
    value: "file",
  }],

  inputTypes: [{
    label: "Input Number",
    value: "numberInput",
  }, {
    label: "Input Text",
    value: "textInput",
  }, {
    label: "Input Date Time",
    value: "dateTimeInput",
  }, {
    label: "Select",
    value: "selectInput",
  }, {
    label: "File",
    value: "fileInput",
  }, {
    label: "Text Area",
    value: "textAreaInput",
  },{
    label: "Checkbox",
    value: "checkboxInput",
  },{
    label: "Radio",
    value: "radioInput",
  },{
    label: "Date Show Time",
    value: "dateTimeShowTimeInput",
  },{
    label: "table Input",
    value: "tableInput",
  }],

  validations: {
    textInput: [
      {
        label: "Required",
        value: "required",
      },
      {
        label: "Whitespace",
        value: "whitespace",
      },
      {
        label: "Max",
        value: "max",
      },
    ],
    numberInput: [      {
      label: "Required",
      value: "required",
    }],
    dateTimeInput: [{
      label: "Required",
      value: "required",
    },],
    selectInput: [{
      label: "Required",
      value: "required",
    },],
    fileInput: [{
      label: "Required",
      value: "required",
    },],
    textAreaInput: [
      {
        label: "Required",
        value: "required",
      },
      {
        label: "Whitespace",
        value: "whitespace",
      },
      {
        label: "Max",
        value: "max",
      },
    ],
    checkboxInput: [{
      label: "Required",
      value: "required",
    },],
    radioInput: [{
      label: "Required",
      value: "required",
    }],
    dateTimeShowTimeInput: [{
      label: "Required",
      value: "required",
    }],
    tableInput: [{
      label: "Required",
      value: "required",
    }]
  },

  listSourceTypes : ["database", "manual"],

  documentStatus : {
    1: 'Draft',
    2: 'Submitted',
    3: 'In Progress',
    4: 'Rejected',
    5: 'Approve',
  },

  documentStatusFollowArray : {
    'Cancelled':"Personal Health",
    'Submitted':"Company Detals",
    'Draft': "Your Detals"
  },


  documentArrayStatus : ["Your Detals","Company Detals","Personal Health"],

  stateForm : ['Draft', 'BSEZ Employee', 'BSEZ Admin', 'Done'],

  documentStatusColor : {
    1: '#1890ff',
    2: 'blue',
    3: 'yellow',
    4: 'red',
    5: 'green',

  }
};
