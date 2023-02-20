import BaseController from './BaseController'
import ThirdPartyException from '@app/Exceptions/ThirdPartyException'
import constantConfig from '@config/constant'
import _ from 'lodash'
const { roleKey ,stateForm } = constantConfig
import ErpInvoice from '@app/Services/ErpInvoice/index'


export default class InvoiceController extends BaseController {
  async index() {
    const data = this.request.all()
    let { filters } = data

    let result = await ErpInvoice.index()
    if (!result.length) return []
    if (filters && filters.length) {
      for (let filter of filters) {
        filter = JSON.parse(filter)
        switch (filter.operator) {
          case 'contains': {
            result = result.filter(rs => String(rs[filter['field']]).includes(filter['value']))
          }
        }
      }
    }
    return result;
  }

  async detail() {
   
  }

}
