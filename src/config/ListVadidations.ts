import _ from "lodash";

export const validations = ({name,validation,t}) => {
	switch (validation) {
		case 'required':
			return ({ required: true, message: t('messages:form.required', { name: name }) })
		case 'whitespace':
			return ({ whitespace: true, message: t('messages:form.required', { name: name }) })
		case 'max':
			return ({ max: 255, message: t('messages:form.maxLength', { name: name, length: 255 }) })
			
	}
};
