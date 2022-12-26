"use strict";
(function() {
    var rollSkill = function rollSkill(sheet, skill, tags) {
        log("ll");
        var a = "";
    };
    var initSkill = function initSkill(sheet) {
        Tables.get("skills").each(function(skill) {
            sheet.get(skill.id + "_btn").on("click", function() {
                rollSkill(sheet, skill, []);
            });
        });
    };
    init = function init(sheet) {
        if (sheet.id() === "main") {
            initSkill(sheet);
        }
    };
})();