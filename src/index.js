import GdsFormWizard from './components/FormWizard.vue'
import GdsTabContent from './components/TabContent.vue'
import GdsWizardButton from './components/WizardButton.vue'
import GdsWizardStep from './components/WizardStep.vue'
const GdsVueFormWizard = {
  install (Vue) {
    Vue.component('gds-form-wizard', GdsFormWizard)
    Vue.component('gds-tab-content', GdsTabContent)
    Vue.component('gds-wizard-button', GdsWizardButton)
    Vue.component('gds-wizard-step', GdsWizardStep)
  }
}
// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(GdsVueFormWizard)
}

export default GdsVueFormWizard
export {
  GdsFormWizard,
  GdsTabContent,
  GdsWizardButton,
  GdsWizardStep
}
