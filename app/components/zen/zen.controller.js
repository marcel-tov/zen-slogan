(function (angular) {
    'use strict';

    angular
            .module('myApp.zen', ['ngRoute'])
            .config(['$routeProvider', function ($routeProvider) {
                    $routeProvider.when('/zen', {
                        templateUrl: 'components/zen/zen.html',
                        controller: 'ZenController'
                    });
                }])
            .constant("ZC", {
                // pfad wo sich die Dateien befinden
                "PATH_WORDS": "components/zen/words/",
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
            })
            .controller('ZenController', [
                '$scope',
                'ZenServiceWords',
                'ZenPhraseRandom',
                'ZenServiceTemplate',
                function ($scope, ZenServiceWords, ZenPhraseRandom, ZenServiceTemplate) {
                    /**
                     * 
                     * @TODO load words only once
                     */
                    $scope.loadPhrase = function () {
                        ZenServiceWords.getWords().then(function (response) {
                            $scope.phrase = ZenPhraseRandom.getPhrase(response, 8);
//                            $scope.phrase = ZenServiceTemplate.getPhrase(response);
                            console.log($scope.phrase);
                        });
                    };
                }]);
})(window.angular);