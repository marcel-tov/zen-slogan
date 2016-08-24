(function (angular) {
    'use strict';

    angular
            .module('myApp.zen')
            .factory('ZenService', ZenService);

    ZenService.$inject = ['$http'];

    /**
     * A Service that can be used to retrieve available creatives.
     *
     * @returns {Object}
     *
     * @constructor
     */
    function ZenService($http) {

        var words = [];

        _initialize();

        return {
            'getPhrase': getPhrase
        };

        /**
         * Initially constructs an array out of creatives that would normally be loaded from an API.
         *
         * @private
         */
        function _initialize() {
            words = {
                'nounsl': ftowl("nouns.txt"),
                'adjsl': ftowl("adjs.txt"),
                'verbsl': ftowl("verbs.txt"),
                'articlesl': ftowl("articles.txt"),
                'prepsl': ftowl("preps.txt"),
                'conjsl': ftowl("conjs.txt")
            };
            console.log(words);
        }

        /**
         * Returns all available creatives.
         * @param int limit
         * @returns {Array}
         */
        function getPhrase(limit) {
            var ret = [];

            var part = "ARTICLE";
            var phrase = "";
            var ccount = 0; // counts conjunctions
            var subj = true; // 1 if subject, 2 if object is next

            var lim = 10;
            while (true) {
                if (part == "CONJ") {
                    ccount++;
                    if (ccount == limit) {
                        return formatPhrase(phrase)
                    }
                }
                phrase += getRandomWord(part);
                var ret = getNextPart(part, subj);

                console.log(ret);

                if (part == "END") {
                    //# fix 'a' vs 'an'
                    return formatPhrase(phrase);
                }

                console.log('ccount: ' + ccount);
                console.log(phrase);

                lim++;
                if (lim > 10) {
                    break;
                }
            }
        }

        /**
         * 
         * @param string filename
         * @returns {unresolved}
         */
        function ftowl(filename) {
            return ['Leben', 'test', 'aaa'];

            return $http({
                method: "GET",
                async: false,
                url: "/components/zen/words/" + filename
            }).then(function success(response) {
                return response.data;
            }, function error(response) {
                console.log('Fehler:' + response.statusText + ' ' + response.status);
            });
        }

//                var promise = $scope.ftowl("nouns.txt");
//                promise.then(function(result) {
//                    console.log(result); // "Stuff worked!"
//                  }, function(err) {
//                    console.log(err); // Error: "It broke"
//                  });
//                

        /**
         * 
         * @param {type} a
         * @returns {zen_service_L1.ZenService.choice.a}
         */
        function choice(a) {
            return a[0]; // return random
        }

        /**
         * 
         * @param {type} part
         * @returns {zen_service_L1.ZenService.choice.a}
         */
        function getRandomWord(part) {
            return choice({
                "SUBJ": words.nounsl,
                "OBJ": words.nounsl,
                "ADJ": words.adjsl,
                "VERB": words.verbsl,
                "ARTICLE": words.articlesl,
                "PREP": words.prepsl,
                "CONJ": words.conjsl,
                "END": [""],
            }[part]);
        }

        /**
         * 
         * @param string part
         * @param boolean subj
         * @returns {Array}
         */
        function getNextPart(part, subj) {
            //# markov thing to map parts of speech together
            var l = {
                "SUBJ": [["VERB", 1.0]],
                "OBJ": [["PREP", 0.6], ["CONJ", 0.3], ["END", 0.1]],
                "ADJ": [["ADJ", 0.3], ["SUBJ", 0.7 * subj], ["OBJ", 0.7 * !subj]],
                "VERB": [["PREP", 0.5], ["ARTICLE", 0.5]],
                "ARTICLE": [["ADJ", 0.6], ["SUBJ", 0.4 * subj], ["OBJ", 0.4 * !subj]],
                "PREP": [["ARTICLE", 1.0]],
                "CONJ": [["ARTICLE", 1.0]],
            }[part];
            
            console.log(l);

            var c = (Math.random() * (1 - 0) + 0).toFixed(1);
            var e = 'None';
            
            while (c > 0.0) {
                e = l.pop();
                c -= e[1];
            }

            if (e[0] == "VERB" || e[0] == "CONJ") {
                subj = !subj;
            }

            return [e[0], subj];
        }

        /**
         * 
         * @param string phrase
         * @returns string
         */
        function formatPhrase(phrase) {
            return phrase;
        }
    }

})(window.angular);
