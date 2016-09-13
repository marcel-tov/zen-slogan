(function (angular) {
    'use strict';

    angular
            .module("myApp.zen")
            .factory("ZenServiceWords", ['$http', '$q', 'ZC', function ($http, $q, ZC) {

                    /**
                     * 
                     * @type Array
                     */
                    var data = [];

 
                    /**
                     * Random word in array
                     * 
                     * @param array words
                     * @param object lastWord
                     * @returns object
                     */
                    var choice = function(words, lastWord) {
                        if (typeof lastWord !== 'undefined') {
                            // Wenn das vorhergehende Wort ein Geschlecht hat und das nächste auch!
                            // Muss das nächste auch eines haben.
                            if (typeof lastWord.gender !== 'undefined') {
                                var newWords = [];
                                // alle woerter eines bestimmten geschlechts raussuchen.
                                words.forEach(function(element, index, array){
                                    if (typeof element.gender !== 'undefined' && element.gender == lastWord.gender) {
                                        newWords.push(element);
                                    }
                                });
                                // zuweisen
                                if (newWords.length > 0) {
                                    words = newWords;
                                }
                            }
                        }

                        var key = Math.floor(Math.random() * words.length);
                        return words[key]; // return random
                    }

                    return {
                        getWords: function () {
                            if (typeof data.words === 'object') {
                                return $q.when(data.words);
                            }
                            
                            return $http.get(ZC.PATH_WORDS + 'words.json')
                                    .then(function (result) {
                                        data.words = result.data;
                                        return data.words;
                                    }, function (error) {
                                        return {'error': error}
                                    });
                        },
                       /**
                        * find the next Word by random
                        * 
                        * @param string part
                        * @param object lastWord
                        * @returns object
                        */
                       getRandomWord: function(part, lastWord) {
                           var res = {
                               [ZC.PART.SUBJECTIVE]: data.words.nouns,
                               [ZC.PART.OBJ]: data.words.nouns,
                               [ZC.PART.ADJECTIVE]: data.words.adjective,
                               [ZC.PART.VERB]: data.words.verbs,
                               [ZC.PART.ARTICLE]: data.words.article,
                               [ZC.PART.PREPOSITION]: data.words.preposition,
                               [ZC.PART.CONJ]: data.words.conjs,
                               [ZC.PART.END]: [""]
                           };
                           return choice(res[part], lastWord);
                       },
                        /**
                         * 
                         * @param object word
                         * @param object lastWord
                         * @param string part
                         * @param string lastPart
                         * @returns string
                         */
                        toWord: function(word, lastWord, part, lastPart) {
                            var result = '';
                            // text vorangestellt
                            if (typeof word.prepend !== 'undefined') {
                                result += word.prepend;
                            } else {
                                result += ' ';
                            }
                            // word selbst
                            if (typeof word.word !== 'undefined') {
                                result += word.word;
                            }
                                // TODO zB Frau"en"
                //            if (part == ZC.PART.ARTICLE) {
                //            }

//                            return ' ' + result + '('+ part +')';
                            return result;
                        },
                        /**
                         * First letter to uppercase + point at the end.
                         * 
                         * @param string phrase
                         * @returns string
                         */
                        formatPhrase: function(phrase) {
                            return phrase.charAt(1).toUpperCase() + phrase.slice(2) + '.';
                        }                            
                    };
                }]);
}
)(window.angular);
