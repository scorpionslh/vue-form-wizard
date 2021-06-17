<template>
  <div :id="id ? id : ''" class="vue-form-wizard" :class="[stepSize, {vertical: isVertical}]" @keyup.right="focusNextTab"
       @keyup.left="focusPrevTab">
    <div class="wizard-header" v-if="$slots['title']">
      <slot name="title">
        <h4 class="wizard-title">{{title}}</h4>
        <p class="category">{{subtitle}}</p>
      </slot>
    </div>
    <div class="wizard-navigation">
       <div class="wizard-progress-with-circle" style="top:0 !important" v-if="progressBarShow">
        <div class="wizard-progress-bar"
             :style="progressBarStyle"></div>
      </div>
      <br />
         <div class="wizard-footer-left">
          <span @click="prevTab" @keyup.enter="prevTab" v-if="displayPrevButton" role="button" tabindex="0">
            <slot name="prev" v-bind="slotProps">
              <span class="backButton" :disabled="loading">
                             <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.9226 0.405563C10.3077 0.405563 10.6191 0.721741 10.6191 1.10686C10.6191 1.29229 10.5454 1.4682 10.4147 1.59896L2.30344 9.71021L10.4147 17.8167C10.6833 18.0949 10.6738 18.537 10.3981 18.8057C10.127 19.0648 9.69914 19.0648 9.42813 18.8057L0.822396 10.2023C0.551388 9.92892 0.551388 9.48675 0.822396 9.21336L9.42813 0.61001C9.55888 0.479259 9.73479 0.405563 9.9226 0.405563Z" fill="#414A4E"/>
</svg>
                {{backButtonText}}
              </span>
            </slot>
          </span>
          <slot name="custom-buttons-left" v-bind="slotProps"></slot>
        </div>
     
      <br />
      <ul class="wizard-nav wizard-nav-pills" role="tablist" :class="stepsClasses">
        <slot name="step" v-for="(tab, index) in tabs"
              :tab="tab"
              :index="index"
              :navigate-to-tab="navigateToTab"
              :step-size="stepSize"
              :transition="transition">
  
        </slot>
      </ul>
      <div class="wizard-tab-content">
        <slot v-bind="slotProps">
        </slot>
      </div>
    </div>

    <div class="wizard-card-footer clearfix" v-if="!hideButtons">
      <slot name="footer"
            v-bind="slotProps">
        <div class="wizard-footer-right">
          <slot name="custom-buttons-right" v-bind="slotProps"></slot>
          <span @click="nextTab" @keyup.enter="nextTab" v-if="isLastStep" role="button" tabindex="0">
              <slot name="finish" v-bind="slotProps">
               <wizard-button class="nextButton">
                {{finishButtonText}}
              </wizard-button>
            </slot>
          </span>
          <span @click="nextTab" @keyup.enter="nextTab" role="button" tabindex="0" v-else>
           <slot name="next" v-bind="slotProps">
             <wizard-button  class="nextButton"
                            :disabled="loading">
              {{nextButtonText}}
              <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.00611 7.78538L7.35977 7.43173L7.00601 7.07817L0.521748 0.597712C0.501952 0.575604 0.500931 0.539554 0.524088 0.515317C0.547007 0.494999 0.58219 0.494895 0.605235 0.515003L7.4823 7.39016C7.48244 7.3903 7.48257 7.39044 7.48271 7.39057C7.50576 7.41428 7.50576 7.45318 7.48271 7.47689C7.48257 7.47703 7.48244 7.47717 7.4823 7.4773L0.599306 14.3584L0.599258 14.3584C0.588128 14.3696 0.574448 14.3755 0.557233 14.3755C0.529697 14.3755 0.5 14.3509 0.5 14.3145C0.5 14.3001 0.505337 14.2862 0.51711 14.2744L7.00611 7.78538Z" fill="white" stroke="white"/>
</svg>

             </wizard-button>
           </slot>
         </span>
        </div>

      </slot>
    </div>
  </div>
</template>
<script>
  import WizardButton from './WizardButton.vue'
  import WizardStep from './WizardStep.vue'
  import {isPromise, findElementAndFocus, getFocusedTabIndex} from './helpers'

  export default {
    name: 'gds-form-wizard',
    components: {
      WizardButton,
      WizardStep
    },
    props: {
      id: {
        type: String,
        default: 'fw_' + (new Date()).valueOf()
      },
      title: {
        type: String,
        default: 'Awesome Wizard'
      },
      subtitle: {
        type: String,
        default: 'Split a complicated flow in multiple steps'
      },
      nextButtonText: {
        type: String,
        default: 'Continuar'
      },
      backButtonText: {
        type: String,
        default: 'voltar'
      },
      finishButtonText: {
        type: String,
        default: 'Finish'
      },
      hideButtons: {
        type: Boolean,
        default: false
      },
      validateOnBack: Boolean,
      /***
       * Applies to text, border and circle
       */
      color: {
        type: String,
        default: '#4E46B6'
      },
      errorColor: {
        type: String,
        default: '#8b0000'
      },
      shape: {
        type: String,
        default: 'circle'
      },
      layout: {
        type: String,
        default: 'horizontal'
      },
      stepsClasses: {
        type: [String, Array],
        default: ''
      },
      stepSize: {
        type: String,
        default: 'md',
        validator: (value) => {
          let acceptedValues = ['xs', 'sm', 'md', 'lg']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      /**
       * Name of the transition when transition between steps
       * */
      transition: {
        type: String,
        default: ''
      },
      /***
       *
       * Index of the initial tab to display
       */
      startIndex: {
        type: Number,
        default: 0,
        validator: (value) => {
          return value >= 0
        }
      },
      progressBarShow: {
        type: Boolean,
        default: true
      }
    },
    provide () {
      return {
        addTab: this.addTab,
        removeTab: this.removeTab
      }
    },
    data () {
      return {
        activeTabIndex: 0,
        currentPercentage: 0,
        maxStep: 0,
        loading: false,
        tabs: []
      }
    },
    computed: {
      slotProps () {
        return {
          nextTab: this.nextTab,
          prevTab: this.prevTab,
          activeTabIndex: this.activeTabIndex,
          isLastStep: this.isLastStep,
          fillButtonStyle: this.fillButtonStyle
        }
      },
      tabCount () {
        return this.tabs.length
      },
      isLastStep () {
        return this.activeTabIndex === this.tabCount - 1
      },
      isVertical () {
        return this.layout === 'vertical'
      },
      displayPrevButton () {
        return this.activeTabIndex !== 0
      },
      stepPercentage () {
        return 1 / (this.tabCount - 1) * 100
      },
      progressBarStyle () {
        return {
          background: 'linear-gradient(320.52deg, #4E46B6 3.6%, #8AE21A 102.85%)',
          width: `${this.progress}%`,
          color: this.color
        }
      },
      fillButtonStyle () {
        return {
          backgroundColor: this.color,
          borderColor: this.color,
          color: 'white'
        }
      },
      progress () {
        let percentage = 0
        if (this.activeTabIndex > 0) {
          percentage = this.stepPercentage * this.activeTabIndex
        }
        return percentage
      }
    },
    methods: {
      emitTabChange (prevIndex, nextIndex) {
        this.$emit('on-change', prevIndex, nextIndex)
        this.$emit('update:startIndex', nextIndex)
      },
      addTab (item) {
        const index = this.$slots.default.indexOf(item.$vnode)
        item.tabId = `${item.title.replace(/ /g, '')}${index}`
        this.tabs.splice(index, 0, item)
        // if a step is added before the current one, go to it
        if (index < this.activeTabIndex + 1) {
          this.maxStep = index
          this.changeTab(this.activeTabIndex + 1, index)
        }
      },
      removeTab (item) {
        const tabs = this.tabs
        const index = tabs.indexOf(item)
        if (index > -1) {
          // Go one step back if the current step is removed
          if (index === this.activeTabIndex) {
            this.maxStep = this.activeTabIndex - 1
            this.changeTab(this.activeTabIndex, this.activeTabIndex - 1)
          }
          if (index < this.activeTabIndex) {
            this.maxStep = this.activeTabIndex - 1
            this.activeTabIndex = this.activeTabIndex - 1
            this.emitTabChange(this.activeTabIndex + 1, this.activeTabIndex)
          }
          tabs.splice(index, 1)
        }
      },
      reset () {
        this.maxStep = 0
        this.tabs.forEach((tab) => {
          tab.checked = false
        })
        this.navigateToTab(0)
      },
      activateAll () {
        this.maxStep = this.tabs.length - 1
        this.tabs.forEach((tab) => {
          tab.checked = true
        })
      },
      navigateToTab (index) {
        let validate = index > this.activeTabIndex
        if (index <= this.maxStep) {
          let cb = () => {
            if (validate && index - this.activeTabIndex > 1) {
              // validate all steps recursively until destination index
              this.changeTab(this.activeTabIndex, this.activeTabIndex + 1)
              this.beforeTabChange(this.activeTabIndex, cb)
            } else {
              this.changeTab(this.activeTabIndex, index)
              this.afterTabChange(this.activeTabIndex)
            }
          }
          if (validate) {
            this.beforeTabChange(this.activeTabIndex, cb)
          } else {
            this.setValidationError(null)
            cb()
          }
        }
        return index <= this.maxStep
      },
      nextTab () {
        let cb = () => {
          if (this.activeTabIndex < this.tabCount - 1) {
            this.changeTab(this.activeTabIndex, this.activeTabIndex + 1)
            this.afterTabChange(this.activeTabIndex)
          } else {
            this.$emit('on-complete')
          }
        }
        this.beforeTabChange(this.activeTabIndex, cb)
      },
      prevTab () {
        let cb = () => {
          if (this.activeTabIndex > 0) {
            this.setValidationError(null)
            this.changeTab(this.activeTabIndex, this.activeTabIndex - 1)
          }
        }
        if (this.validateOnBack) {
          this.beforeTabChange(this.activeTabIndex, cb)
        } else {
          cb()
        }
      },
      focusNextTab () {
        let tabIndex = getFocusedTabIndex(this.tabs)
        if (tabIndex !== -1 && tabIndex < this.tabs.length - 1) {
          let tabToFocus = this.tabs[tabIndex + 1]
          if (tabToFocus.checked) {
            findElementAndFocus(tabToFocus.tabId)
          }
        }
      },
      focusPrevTab () {
        let tabIndex = getFocusedTabIndex(this.tabs)
        if (tabIndex !== -1 && tabIndex > 0) {
          let toFocusId = this.tabs[tabIndex - 1].tabId
          findElementAndFocus(toFocusId)
        }
      },
      setLoading (value) {
        this.loading = value
        this.$emit('on-loading', value)
      },
      setValidationError (error) {
        this.tabs[this.activeTabIndex].validationError = error
        this.$emit('on-error', error)
      },
      validateBeforeChange (promiseFn, callback) {
        this.setValidationError(null)
        // we have a promise
        if (isPromise(promiseFn)) {
          this.setLoading(true)
          promiseFn.then((res) => {
            this.setLoading(false)
            let validationResult = res === true
            this.executeBeforeChange(validationResult, callback)
          }).catch((error) => {
            this.setLoading(false)
            this.setValidationError(error)
          })
          // we have a simple function
        } else {
          let validationResult = promiseFn === true
          this.executeBeforeChange(validationResult, callback)
        }
      },
      executeBeforeChange (validationResult, callback) {
        this.$emit('on-validate', validationResult, this.activeTabIndex)
        if (validationResult) {
          callback()
        } else {
          this.tabs[this.activeTabIndex].validationError = 'error'
        }
      },
      beforeTabChange (index, callback) {
        if (this.loading) {
          return
        }
        let oldTab = this.tabs[index]
        if (oldTab && oldTab.beforeChange !== undefined) {
          let tabChangeRes = oldTab.beforeChange()
          this.validateBeforeChange(tabChangeRes, callback)
        } else {
          callback()
        }
      },
      afterTabChange (index) {
        if (this.loading) {
          return
        }
        let newTab = this.tabs[index]
        if (newTab && newTab.afterChange !== undefined) {
          newTab.afterChange()
        }
      },
      changeTab (oldIndex, newIndex, emitChangeEvent = true) {
        let oldTab = this.tabs[oldIndex]
        let newTab = this.tabs[newIndex]
        if (oldTab) {
          oldTab.active = false
        }
        if (newTab) {
          newTab.active = true
        }
        if (emitChangeEvent && this.activeTabIndex !== newIndex) {
          this.emitTabChange(oldIndex, newIndex)
        }
        this.activeTabIndex = newIndex
        this.activateTabAndCheckStep(this.activeTabIndex)
        return true
      },
      tryChangeRoute (tab) {
        if (this.$router && tab.route) {
          this.$router.push(tab.route)
        }
      },
      checkRouteChange (route) {
        let matchingTabIndex = -1
        let matchingTab = this.tabs.find((tab, index) => {
          let match = tab.route === route
          if (match) {
            matchingTabIndex = index
          }
          return match
        })

        if (matchingTab && !matchingTab.active) {
          const shouldValidate = matchingTabIndex > this.activeTabIndex
          this.navigateToTab(matchingTabIndex, shouldValidate)
        }
      },
      deactivateTabs () {
        this.tabs.forEach(tab => {
          tab.active = false
        })
      },
      activateTab (index) {
        this.deactivateTabs()
        let tab = this.tabs[index]
        if (tab) {
          tab.active = true
          tab.checked = true
          this.tryChangeRoute(tab)
        }
      },
      activateTabAndCheckStep (index) {
        this.activateTab(index)
        if (index > this.maxStep) {
          this.maxStep = index
        }
        this.activeTabIndex = index
      },
      initializeTabs () {
        if (this.tabs.length > 0 && this.startIndex === 0) {
          this.activateTab(this.activeTabIndex)
        }
        if (this.startIndex < this.tabs.length) {
          this.activateTabAndCheckStep(this.startIndex)
        } else {
          window.console.warn(`Prop startIndex set to ${this.startIndex} is greater than the number of tabs - ${this.tabs.length}. Make sure that the starting index is less than the number of tabs registered`)
        }
      }
    },
    mounted () {
      this.initializeTabs()
    },
    watch: {
      '$route.path' (newRoute) {
        this.checkRouteChange(newRoute)
      }
    }
  }
</script>
<style lang="scss">
  @import "./../assets/wizard";
</style>
