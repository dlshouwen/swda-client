/*!
 * hightlight
 * @include hightlight
 * @author liujingcheng@live.cn
 * @copyright 2023
 */

// import hilightjs
import hljs from 'highlight.js';
// import skin
import 'highlight.js/styles/atom-one-light.css';

// defined highlight 
let Highlight = {};

// set highlight install
Highlight.install = function (Vue, _options) {
	
    // has data then bind: highlightA
    Vue.directive('highlightA', {
        inserted: function(el) {
            let blocks = el.querySelectorAll('pre code');
            for (let i = 0; i < blocks.length; i++) {
                const item = blocks[i];
                hljs.highlightBlock(item);
            };
        }
    });
 
    // bind then data update: highlightB
    Vue.directive('highlightB', {
        componentUpdated: function(el) {
            let blocks = el.querySelectorAll('pre code');
            for (let i = 0; i < blocks.length; i++) {
                const item = blocks[i];
                hljs.highlightBlock(item);
            };
        }
    });
 
};

/**
 * export hightlight
 */
export default Highlight;