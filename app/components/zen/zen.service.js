(function (angular) {
    'use strict';

    angular
            .module('myApp.zen')
            .factory('ZenService', ZenService)
            // ZEN_CONFIG=ZC
            .constant("ZC", {
                // pfad wo sich die Dateien befinden
                "PATH_WORDS": "components/zen/words/",
                "END_PHRASE_MAX_WORDS": 10,
                "PART": {
                    "SUBJECTIVE": 1,
                    "OBJ": 2,
                    "VERB": 3,
                    "ARTICLE": 4,
                    "PREPOSITION": 5,
                    "CONJ": 6,
                    "ADJECTIVE": 7,
                    "END": 99,
                    "NONE": 0
                },
                "TYPE": [
                    'adjective',
                    'article',
                    'conjs',
                    /**
                     * 98.7% of German nouns have a single gender.
                     * Just under 1.3% can be used with two genders, and .02% can be used with all three genders.
                     * Less than 0.1% of nouns have no gender at all (e.g. AIDS, Allerheiligen (a holiday)).
                     * 
                     * Of the nouns with a unique gender, 46% are feminine, 34% masculine, and 20% neuter.
                     * So, if in doubt about the gender of a noun, guess "die" :)
                     */
                    'nouns',
                    /**
                     * Präpositionen sind kleine Wörter (an, in, zu),
                     * die normalerweise vor einem Nomen stehen (manchmal auch vor einem Verb im Gerundium).
                     */
                    'preposition',
                    'subjective',
                    'verbs'
                ]
            });
    ZenService.$inject = ['$http', '$q', 'ZC'];

    /**
     *
     * @returns {Object}
     * @constructor
     */
    /**
     * 
     * @param object $http
     * @param object $q
     * @param object ZC Config object
     * @returns {zen_service_L1.ZenService.zen.serviceAnonym$2|zen_service_L1.ZenService.choice.words}
     */
    function ZenService($http, $q, ZC) {
        /*
         * hier werden alle woerter abgelegt.
         *
         * @type Array
         */
        var words = [];

//        var tenses = {
//            ACT: toACT = function (verb) {
//                if (verb.slice(-1) == 's' || verb.slice(-1) == 'y') {
//                    return verb + 'es';
//                } else {
//                    return verb + 's';
//                }
//            },
//            FUT: toFUT = function (verb) {
//                return ' will' + verb;
//            },
//            INF: toINF = function (verb) {
////                if verb.endswith("e"):
////		return (verb[:-1]+"ing")
////	elif verb.endswith("p"):
////		return (verb+"ping")
////	else:
////		return (verb+"ing")
//                return verb;
//            },
//            PAS: toPAS = function (verb) {
////f verb == "run":
////		verbsl.append("ran")
////	elif verb.endswith("e"):
////		verbsl.append(verb+"d")
////	elif verb.endswith("p"):
////		verbsl.append(verb+"ped")
////	else:
////		verbsl.append(verb+"ed")
//                return verb;
//            },
//        }


        /**
         * @TODO use constanst for types
         */

//        _initialize();

        return {
            words: words,
            getWords: getWords,
            getPhrase: getPhrase
        };

        /**
         *
         * @private
         */
        function getWords() {
            return $http.get(ZC.PATH_WORDS + 'words.json')
                    .then(function (result) {
                        words = result.data;
                        return words;
                    }, function (error) {
                        return {'error': error}
                    });
        }

        /**
         * 
         * @param object word
         * @param object lastWord
         * @param string part
         * @param string lastPart
         * @returns string
         */
        function toWord(word, lastWord, part, lastPart) {
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
            
//            return ' ' + result + '('+ part +')';
            return result;
        }

        /**
         * Returns all available creatives.
         * @param int limit
         * @returns {Array}
         */
        function getPhrase(limit) {
            var ret = [];
            var part = ZC.PART.ARTICLE; // Das erste Wort startet mit einem Artikel
            var lastPart;
            var phrase = "";
            var nextWord, lastWord;
            var ccount = 0; // counts conjunctions
            var subj = true; // 1 if subject, 2 if object is next
            var countWords = 0;
            
            while (true) {
                if (part == ZC.PART.CONJ) {
                    ccount++;
                    if (ccount == limit) {
                        return formatPhrase(phrase)
                    }
                }
                
                nextWord = getRandomWord(part, lastWord);
                phrase += toWord(nextWord, lastWord, part, lastPart);
                lastWord = nextWord;
                lastPart = part;
                var ret = getNextPart(part, subj, countWords);
                if (ret) {
                    part = ret[0];
                    subj = ret[1];
                }

                if (part == ZC.PART.END) {
                    return formatPhrase(phrase);
                }
//
//                /**
//                 * TODO 
//                 * remove this case
//                 */
                countWords++;
//                if (countWords > 100) {
//                    console.log('endless loop?!');
//                    return formatPhrase(phrase);
//                    break;
//                }
            }

            console.log(phrase);
        }

        /**
         * Random word in array
         * 
         * @param array words
         * @param object lastWord
         * @returns object
         */
        function choice(words, lastWord) {
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

        /**
         * find the next Word by random
         * 
         * @param string part
         * @param object lastWord
         * @returns object
         */
        function getRandomWord(part, lastWord) {
            var data = {
                [ZC.PART.SUBJECTIVE]: words.nouns,
                [ZC.PART.OBJ]: words.nouns,
                [ZC.PART.ADJECTIVE]: words.adjective,
                [ZC.PART.VERB]: words.verbs,
                [ZC.PART.ARTICLE]: words.article,
                [ZC.PART.PREPOSITION]: words.preposition,
                [ZC.PART.CONJ]: words.conjs,
                [ZC.PART.END]: [""]
            };
            return choice(data[part], lastWord);
        }

        /**
         * Ermittelt das nächste Wort welches auf das vorherige folgen soll
         * 
         * @param string part
         * @param boolean subj
         * @param int countWords
         * @returns {Array}
         */
        function getNextPart(part, subj, countWords) {
            // PARTS
            var p = ZC.PART;
            
            /**
             * # markov thing to map parts of speech together
             * 
             * Was soll als nächstes folgen?!
             * Die Summe der Gewichtungen muss zusammen 1 ergeben.
             * 
             * @type Array
             */
            var l = {
                [p.SUBJECTIVE]: [
                    [p.VERB, 1.0]
                ],
                [p.OBJ]: [
                    [p.PREPOSITION, 0.3],
                    [p.CONJ, 0.3],
                    [p.END, 0.1]
                ],
                [p.ADJECTIVE]: [
                    [p.ADJECTIVE, 0.3],
                    [p.SUBJECTIVE, 0.7 * subj],
                    [p.OBJ, 0.7 * !subj]
                ],
                [p.VERB]: [
                    [p.PREPOSITION, 0.4],
                    [p.ARTICLE, 0.4],
                    [p.END, 0.1]
                ],
                [p.ARTICLE]: [
                    [p.ADJECTIVE, 0.6],
                    [p.SUBJECTIVE, 0.4 * subj],
                    [p.OBJ, 0.4 * !subj]
                ],
                [p.PREPOSITION]: [
                    [p.ARTICLE, 1.0]
                ],
                [p.CONJ]: [
                    [p.ARTICLE, 1.0]
                ],
            }[part];

            // Der Wert darf nie direkt 1 sein!
            var c = (Math.random() * (1 - 0.2) + 0.1).toFixed(1);
//            var c = 0.13;
            var e = [[p.NONE, 1.0]];
            
            // Satzlaenge begrenzen
            if (countWords > ZC.END_PHRASE_MAX_WORDS && (part == p.OBJ || part == p.VERB)) {
                e = l[2];
                c -= e[1];
            } else {
                while (c > 0.0) {
                    if (l.length < 1) {
                        break;
                    }
                    e = l.pop();
                    c -= e[1];
                }
            }
            if (e[0] == ZC.PART.VERB || e[0] == ZC.PART.CONJ) {
                subj = !subj;
            }
            return [e[0], subj];
        }

        /**
         * First letter to uppercase + point at the end.
         * 
         * @param string phrase
         * @returns string
         */
        function formatPhrase(phrase) {
            return phrase.charAt(1).toUpperCase() + phrase.slice(2) + '.';
        }
    }

}
)(window.angular);
