(function (angular) {
    'use strict';

    angular
            .module('myApp.zen')
            .factory('ZenService', ZenService);

    ZenService.$inject = ['$http', '$q'];

    /**
     *
     * @returns {Object}
     * @constructor
     */
    function ZenService($http, $q, $scope) {
        var pathWords = 'components/zen/words/';
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
            var promises = [];
            var types = [
                'adjective',
                'article',
                'conjs',
                'nouns',
                /**
                 * Präpositionen sind kleine Wörter (an, in, zu),
                 * die normalerweise vor einem Nomen stehen (manchmal auch vor einem Verb im Gerundium).
                 */
                'preposition', 
                'subjective',
                'verbs'
            ];

            angular.forEach(types, function (type) {
                var promise = ftowl(type).then(function (response) {
                    var name = response.name;
                    words[name] = response.data;
                });
                promises.push(promise);
            });

            return $q.all(promises);
        }

        /**
         * 
         * @param string word
         * @param string lastWord
         * @param string part
         * @returns string
         */
        function toWord(word, lastWord, part) {
            // wenn ein > dann folgt ein Komma!
            if (word.slice(0, 1) == '>') {
                return word.slice(1);
            }
            if (part == 'ARTICLE') {
                // TODO zB Frau"en"
            }
            return ' ' + word;
        }

        /**
         * Returns all available creatives.
         * @param int limit
         * @returns {Array}
         */
        function getPhrase(limit) {
            var ret = [];
            var part = "ARTICLE"; // Das erste Wort startet mit einem Artikel
            var phrase = "";
            var nextWord, lastWord;
            var ccount = 0; // counts conjunctions
            var subj = true; // 1 if subject, 2 if object is next

            var lim = 0;
            while (true) {
                if (part == "CONJ") {
                    ccount++;
                    if (ccount == limit) {
                        return formatPhrase(phrase)
                    }
                }

                nextWord = getRandomWord(part);
                phrase += toWord(nextWord, lastWord, part);
                lastWord = nextWord;
                var ret = getNextPart(part, subj);
                if (ret) {
                    part = ret[0];
                    subj = ret[1];
                }

                if (part == "END") {
                    //# fix 'a' vs 'an'
                    return formatPhrase(phrase);
                }

                /**
                 * TODO 
                 * remove this case
                 */
                lim++;
                if (lim > 100) {
                    console.log('endless loop?!');
                    return formatPhrase(phrase);
                    break;
                }
            }

            console.log(phrase);
        }

        /**
         * 
         * @param string filename
         * @returns promise
         */
        function ftowl(filename) {
            return $http.get(pathWords + filename + '.txt')
                    .then(function (result) {
                        return {'name': filename, 'data': result.data.trim().split('\n')};
                    }, function (error) {
                        return {'error': error}
                    });
        }

        /**
         * Random word in array
         * 
         * @param array words
         * @returns {zen_service_L1.ZenService.choice.a}
         */
        function choice(words) {
            var key = Math.floor(Math.random() * words.length);
            return words[key]; // return random
        }

        /**
         * find the next Word by random
         * 
         * @param {type} part
         * @returns {zen_service_L1.ZenService.choice.a}
         */
        function getRandomWord(part) {
            var data = {
                "SUBJECTIVE": words.nouns,
                "OBJ": words.nouns,
                "ADJECTIVE": words.adjective,
                "VERB": words.verbs,
                "ARTICLE": words.article,
                "PREPOSITION": words.preposition,
                "CONJ": words.conjs,
                "END": [""],
            };
            return choice(data[part]);
        }

        /**
         * Ermittelt das nächste Wort welches auf das vorherige folgen soll
         * 
         * @param string part
         * @param boolean subj
         * @returns {Array}
         */
        function getNextPart(part, subj) {
            //# markov thing to map parts of speech together
            // Was soll als nächstes folgen?!
            // Die Summe der Gewichtungen muss zusammen 1 ergeben.
            var l = {
                "SUBJECTIVE": [["VERB", 1.0]],
                "OBJ": [
                    ["PREPOSITION", 0.3],
                    ["CONJ", 0.3],
                    ["END", 0.1]
                ],
                "ADJECTIVE": [
                    ["ADJECTIVE", 0.3],
                    ["SUBJECTIVE", 0.7 * subj],
                    ["OBJ", 0.7 * !subj]
                ],
                "VERB": [
                    ["PREPOSITION", 0.5],
                    ["ARTICLE", 0.5]
                ],
                "ARTICLE": [
                    ["ADJECTIVE", 0.6],
                    ["SUBJECTIVE", 0.4 * subj],
                    ["OBJ", 0.4 * !subj]
                ],
                "PREPOSITION": [["ARTICLE", 1.0]],
                "CONJ": [["ARTICLE", 1.0]],
            }[part];

            // Der Wert darf nie direkt 1 sein!
            var c = (Math.random() * (1 - 0.2) + 0.1).toFixed(1);
//            var c = 0.13;
            console.log(c);
            var e = [["None", 1.0]];

            while (c > 0.0) {
                if (l.length < 1) {
                    break;
                }
                e = l.pop();
                c -= e[1];
            }

            if (e[0] == "VERB" || e[0] == "CONJ") {
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

})(window.angular);
