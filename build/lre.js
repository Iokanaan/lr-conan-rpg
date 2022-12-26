//region LRE 7.0.0
"use strict";
(function() {
    var rollSkill = function rollSkill2(sheet, skill, tags) {
        log("ll");
    };
    var initSkill = function initSkill2(sheet) {
        Tables.get("skills").each(function(skill) {
            sheet.get(skill.id + "_btn").on("click", function() {
                rollSkill(sheet, skill, []);
            });
        });
    };
    init = function init2(sheet) {
        if (sheet.id() === "main") {
            initSkill(sheet);
        }
    };
})();
//endregion LRE 7.0.0
