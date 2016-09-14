(function (angular) {
    'use strict';

    angular
            .module("myApp.zen")
            .factory("ZenServiceTemplate", ['ZC', 'ZenServiceWords', function (ZC, ZenServiceWords) {

                    /**
                     * 
                     * @type Array
                     */
                    var words = [];
                    
                    /**
                     * 
                     */
                    var templates = [
                        'ARTICLE OBJ ARTICLE VERB SUBJECTIVE ADJECTIVE',
                        'VERB ARTICLE SUBJECTIVE ARTICLE CONJ OBJ ADJECTIVE ARTICLE VERB SUBJECTIVE ADJECTIVE',
                        'ARTICLE OBJ ADJECTIVE ARTICLE PREPOSITION OBJ ARTICLE VERB SUBJECTIVE ADJECTIVE'
                    ];
                    
                    var getRandomTemplate = function(){
                        var key = Math.floor(Math.random() * templates.length);
                        return templates[key]; // return random
                    }
                    
                    return {
                        /**
                         * 
                         * @param object response
                         * @returns {undefined}
                         */
                        getPhrase: function (response, limit = 10) {
                            console.info('phrase by template');
                            words = response;
                            var template = getRandomTemplate();
                            
                            var parts = template.split(' ').reverse();
                            if (parts.length < 1) {
                                return '';
                            }
                            
                            var phrase = "";
                            var lastPart, nextWord, lastWord;
                            while (parts.length) {
                                var part = parts.pop();
                                if (ZC.PART[part] > 0) {
                                    nextWord = ZenServiceWords.getRandomWord(ZC.PART[part], lastWord);
                                    phrase += ZenServiceWords.toWord(nextWord, lastWord, part, lastPart);
                                    lastWord = nextWord;
                                    lastPart = part;
                                }
                                
                            }
                            
                            return ZenServiceWords.formatPhrase(phrase);
                        }
                    };
                }]);
}
)(window.angular);
