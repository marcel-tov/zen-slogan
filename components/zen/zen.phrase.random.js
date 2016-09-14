(function (angular) {
    'use strict';

    angular
            .module("myApp.zen")
            .factory("ZenPhraseRandom", ['ZC', 'ZenServiceWords', function (ZC, ZenServiceWords) {

                    /**
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
                     * Ermittelt das nächste Wort welches auf das vorherige folgen soll
                     * 
                     * @param string part
                     * @param boolean subj
                     * @param int countWords
                     * @param int limit
                     * @returns {Array}
                     */
                    var getNextPart = function(part, subj, countWords, limit) {
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
                        if (countWords > limit && (part == p.OBJ || part == p.VERB)) {
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
                     * 
                     */    
                    var showTemplate = function(parts) {
                        var p = ZC.PART;
                        var template = [];
                        while (parts.length) {
                            var part = parts.pop();

                            for (var key in p) {
                                if (p[key] === part) {
                                    template.push(key);
                                    break;
                                }
                            }
                        }
                        console.log(template.join(' '));
                    }
                    
                    return {
                        /**
                         * 
                         * @param object response
                         * @param int limit end after 10
                         * @returns {undefined}
                         */
                        getPhrase: function (response, limit = 10) {
                            console.info('phrase by random');
                            words = response;

                            var ret = [];
                            var part = ZC.PART.ARTICLE; // Das erste Wort startet mit einem Artikel
                            var lastPart;
                            var phrase = "";
                            var nextWord, lastWord;
                            var ccount = 0; // counts conjunctions
                            var subj = true; // 1 if subject, 2 if object is next
                            var countWords = 0;
                            
                            var usedParts = [];
                            
                            while (true) {
                                nextWord = ZenServiceWords.getRandomWord(part, lastWord);
                                phrase += ZenServiceWords.toWord(nextWord, lastWord, part, lastPart);
                                lastWord = nextWord;
                                lastPart = part;
                                var ret = getNextPart(part, subj, countWords, limit);
                                if (ret) {
                                    part = ret[0];
                                    subj = ret[1];
                                }
                                
                                usedParts.push(part);

                                if (part == ZC.PART.END) {
//                                    showTemplate(usedParts);
                                    return ZenServiceWords.formatPhrase(phrase);
                                }
                                
                                countWords++;
                            }
                        }
                    };


                }]);
}
)(window.angular);
