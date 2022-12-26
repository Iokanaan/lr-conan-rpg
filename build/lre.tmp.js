"use strict";
(() => {
  // src/diceroll/business/roll.ts
  var rollSkill = function rollSkill2(sheet, skill, tags) {
    log("ll");
  };

  // src/skill/listener/skill.ts
  var initSkill = function initSkill2(sheet) {
    Tables.get("skills").each(function(skill) {
      sheet.get(skill.id + "_btn").on("click", function() {
        rollSkill(sheet, skill, []);
      });
    });
  };

  // src/index.ts
  init = function init2(sheet) {
    if (sheet.id() === "main") {
      initSkill(sheet);
    }
  };
})();
