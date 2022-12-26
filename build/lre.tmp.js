"use strict";
(() => {
  // src/diceroll/business/roll.ts
  var rollSkill = function(sheet, skill, tags) {
    log("ll");
    const a = "";
  };

  // src/skill/listener/skill.ts
  var initSkill = function(sheet) {
    Tables.get("skills").each(function(skill) {
      sheet.get(skill.id + "_btn").on("click", function() {
        rollSkill(sheet, skill, []);
      });
    });
  };

  // src/index.ts
  init = function(sheet) {
    if (sheet.id() === "main") {
      initSkill(sheet);
    }
  };
})();
