import WidgetBase from './WidgetBase.svelte'
import { initializeState } from './utils'

class Widget {
  constructor({ target, props }){
    this.target = target
    this.props = { ...props }

    let { component } = initializeState(target, props, WidgetBase)

    this.component = component
  }

  destroy() {
    this.component?.$destroy();
  }
}


module.exports = { Widget }
