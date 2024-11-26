/**
 * import define store
 */
import { defineStore } from 'pinia'

/**
 * const home tab
 */
const home = {
	id: '0', 
	title: '首页', 
	closable: false, 
	route: '/core/home'
};

/**
 * export
 */
export const useTabStore = defineStore('tab', {
	state: () => {
		return {
			tabs: [home],
			activeTab: home
		}
	},
	actions: {
		/**
		 * set tabs
		 * @param tabs
		 */
		setTabs(tabs) {
			state.tabs = tabs
		},
		/**
		 * add tab
		 * @param tab
		 */
		addTab(tab) {
			// find tab index
			const index = this.tabs.findIndex(item => item.id == tab.id);
			// if not find then push tab
			if (index == -1) {
				this.tabs.push(tab)
			}
			// set active tab
			this.activeTab = tab
		},
		/**
		 * remove tab
		 * @param tabId
		 */
		removeTab(tabId) {
			// home cannot remove
			if(tabId=='0'){
				return;
			}
			// find tab index
			const index = this.tabs.findIndex(item => item.id == tabId);
			// remove tabs
			this.tabs = this.tabs.filter(tab => tab.id !== tabId);
			// if active is not this tab
			if (this.activeTab.id != tabId) {
				return;
			}
			// if no tabs open home
			if(this.tabs==null||this.tabs.length<=0){
				this.tabs = [home];
				this.activeTab = home;
				return;
			}
			// if length > index then open prev
			if(this.tabs.length>(index-1)){
				this.activeTab = this.tabs[index-1];
				return;
			}
			// open last
			this.activeTab = this.tabs[this.tabs.length-1];
		},
		/**
		 * clear tabs
		 */
		clearTabs() {
			this.tabs = [home];
			this.activeTab = home
		},
		/**
		 * set active tab
		 * @param activeTab
		 */
		setActiveTab(activeTab) {
			this.activeTab = activeTab
		}
	}
})