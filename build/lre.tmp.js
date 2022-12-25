"use strict";
(() => {
  // src/diceroll/prompt/diceResultPopup.ts
  var DiceResultPopup = class {
    sheet;
    constructor(sheet) {
      this.sheet = sheet;
    }
    render(metadata) {
      this.renderTotalLabel(metadata);
      if (metadata.getFumbles() > 0) {
        this.renderFumbles(metadata);
      }
      if (metadata.getRawResult().allTags.includes("attack")) {
        this.renderDamageButton(metadata);
      }
      if (metadata.isRerollable()) {
        this.renderRerollButton(metadata);
      }
      if (metadata.getPertinentTalents().length !== 0) {
        this.renderInfos(metadata);
      } else {
        this.sheet.get("info_Container").removeClass("border");
        this.sheet.get("info_Container").removeClass("border-secondary");
        this.sheet.get("info_Container").removeClass("m-2");
        this.sheet.get("info_Container").removeClass("p-2");
      }
    }
    renderTotalLabel(metadata) {
      this.sheet.get("total").text(metadata.getSuccess() + " succ\xE8s");
    }
    renderDamageButton(metadata) {
      const damageRoll = new RollBuilder(this.sheet);
      this.sheet.get("damage_Btn").on("click", function() {
        let damageExpression = metadata.getNbAttackDice() + "d6 <{2:2,3:0,4:0,5:1,6:1} 7";
        const damageTags = metadata.getRawResult().allTags.filter(function(e) {
          return e !== "attack";
        });
        damageTags.push("damage");
        damageExpression += "[" + damageTags.join() + "]";
        damageRoll.expression(damageExpression).visibility("visible").title("D\xE9g\xE2ts");
        damageRoll.roll();
      });
    }
    renderRerollButton(metadata) {
      const rerollChoices = {};
      metadata.getRawResult().all.forEach(function(roll, index) {
        rerollChoices[index.toString()] = roll.value.toString();
      });
      this.sheet.get("reroll").setChoices(rerollChoices);
      const that = this;
      this.sheet.get("reroll_Btn").on("click", function() {
        const rerollDice = Dice.create(metadata.getRawResult().expression.replace(/[0-9]+d/i, that.sheet.get("reroll").value().length + "d")).tag("reroll");
        Dice.roll(that.sheet, rerollDice, metadata.getRawResult().title);
      });
    }
    renderInfos(metadata) {
      this.sheet.get("infos").value("Talents pertinents:\n" + metadata.getPertinentTalents().map(function(t) {
        return Tables.get("talents").get(t).name;
      }).join("\n "));
      if (!this.sheet.get("infos").value().includes("\xB9")) {
        this.sheet.get("info_notes_1").hide();
      }
    }
    renderFumbles(metadata) {
      this.sheet.get("fumble").text(metadata.getFumbles() + " complication(s)");
      this.sheet.get("fumble").show();
    }
  };

  // src/diceroll/prompt/damageDiceResultPopup.ts
  var DamageDiceResultPopup = class extends DiceResultPopup {
    constructor(sheet) {
      super(sheet);
    }
    render(result) {
      this.renderTotalLabel(result);
      if (result.getRawResult().allTags.includes("attack")) {
        this.renderDamageButton(result);
      }
      if (result.isRerollable()) {
        this.renderRerollButton(result);
      }
      if (result.getEffects().length > 0) {
        this.renderEffects(result);
      }
      if (result.getBadEffects().length > 0) {
        this.renderFumbles(result);
      }
      if (result.getPertinentTalents().length !== 0) {
        this.renderInfos(result);
      } else {
        this.sheet.get("info_Container").removeClass("border");
        this.sheet.get("info_Container").removeClass("border-secondary");
        this.sheet.get("info_Container").removeClass("m-2");
        this.sheet.get("info_Container").removeClass("p-2");
      }
    }
    renderTotalLabel(metadata) {
      if (metadata.isNonLetal()) {
        this.sheet.get("total").text("Non l\xE9tal");
      } else {
        this.sheet.get("total").text(metadata.getSuccess() + " d\xE9g\xE2t(s)");
      }
    }
    renderFumbles(metadata) {
      this.sheet.get("fumble").text(metadata.getBadEffects().join("\n"));
      this.sheet.get("fumble").show();
    }
    renderEffects(metadata) {
      this.sheet.get("effect").text(metadata.getEffects().join("\n"));
      this.sheet.get("effect").show();
    }
  };

  // src/util/utils.ts
  var letterToInt = function(letter) {
    return letter.charCodeAt(0) - 96;
  };
  var intToLetter = function(n) {
    return String.fromCharCode(96 + n);
  };

  // src/diceroll/wrapper/diceResultWrapper.ts
  var DiceResultWrapper = class {
    success;
    skillId;
    pertinentTalents = [];
    fumbles;
    rawResult;
    rerollable = false;
    nbAttackDice;
    talentEffects = {
      "AGI": function(r) {
        r.rerollable = true;
      },
      "AGIFEL": function(r) {
        r.pertinentTalents.push("AGIFEL");
      },
      "MESS": function(r) {
        r.pertinentTalents.push("MESS");
      }
    };
    constructor(result) {
      this.success = result.success;
      this.skillId = result.allTags.filter(function(e) {
        return /s_*/g.test(e);
      })[0];
      let fumbleCount = 0;
      result.all.forEach(function(roll) {
        if (roll.value === 20 || roll.value === 19 && result.allTags.includes("noskill")) {
          fumbleCount++;
        }
      });
      this.fumbles = fumbleCount;
      const weaponAttackTag = result.allTags.filter(function(e) {
        return /d_*/g.test(e);
      })[0];
      if (weaponAttackTag !== void 0) {
        this.nbAttackDice = letterToInt(weaponAttackTag.split("_")[1]);
        const voleeTag = result.allTags.filter(function(e) {
          return /v_*/g.test(e);
        })[0];
        if (voleeTag !== void 0) {
          this.nbAttackDice += letterToInt(voleeTag.split("_")[1]);
        }
      } else {
        this.nbAttackDice = 0;
      }
      const that = this;
      result.allTags.filter(function(e) {
        return /t_*/g.test(e);
      }).forEach(function(tag) {
        const talentId = tag.split("_")[1];
        if (Tables.get("talents").get(talentId).skill === that.skillId) {
          const talentLvl = tag.split("_")[2];
          if (talentLvl !== void 0) {
            that.talentEffects[talentId](that, letterToInt(talentLvl));
          } else {
            that.talentEffects[talentId](that, 1);
          }
        }
      });
      this.rawResult = result;
    }
    getRawResult() {
      return this.rawResult;
    }
    getFumbles() {
      return this.fumbles;
    }
    isRerollable() {
      return this.rerollable;
    }
    setRerollable(rerollable) {
      this.rerollable = rerollable;
    }
    getSuccess() {
      return this.success;
    }
    getNbAttackDice() {
      return this.nbAttackDice;
    }
    getPertinentTalents() {
      return this.pertinentTalents;
    }
  };

  // src/diceroll/wrapper/damageDiceResultWrapper.ts
  var DamageDiceResultWrapper = class extends DiceResultWrapper {
    selfDamage = 0;
    mentalDamage = 0;
    intense = false;
    nonletal = true;
    additionalLocalisations = 0;
    effects = [];
    badEffects = [];
    nbEffects = 0;
    qualityEffect = {
      "AVE": function(d) {
        d.effects.push("Aveuglant");
      },
      "CRU": function(d, lvl) {
        d.success += d.nbEffects * lvl;
      },
      "BOU": function() {
      },
      "JET": function() {
      },
      "CAV": function(d, lvl) {
        if (d.rawResult.allTags.includes("mounted")) {
          d.success += d.nbEffects * lvl;
        }
      },
      "PERF": function(d, lvl) {
        d.effects.push("-" + d.nbEffects * lvl + " \xE0 l'encaissement");
      },
      "CON": function(d, lvl) {
        d.selfDamage += d.nbEffects * lvl;
      },
      "ETEN": function(d, lvl) {
        d.additionalLocalisations += d.nbEffects * lvl;
      },
      "ETOU": function(d) {
        d.effects.push("D\xE9sorient\xE9 (" + d.nbEffects + ")");
      },
      "CACH": function() {
      },
      "ETRE": function(d) {
        d.effects.push("Immobilis\xE9");
      },
      "FRA": function(d) {
        d.badEffects.push("L'arme perd " + d.nbEffects + " d\xE9g\xE2t(s)");
      },
      "IMP": function(d) {
        d.success -= d.nbEffects;
      },
      "INC": function(d, lvl) {
        d.effects.push("Enflamm\xE9: " + lvl + "d6/" + d.nbEffects);
      },
      "INT": function(d) {
        d.intense = true;
      },
      "LET": function(d) {
        if (d.rawResult.allTags.includes("exploitation")) {
          d.success += d.nbEffects * 2;
          d.intense = true;
        }
      },
      "MAT": function(d) {
        d.effects.push("Mise \xE0 terre (" + d.nbEffects + ")");
      },
      "NLET": function(d) {
        if (!d.rawResult.allTags.includes("q_EMP") && !d.rawResult.allTags.includes("q_AVE") && !d.rawResult.allTags.includes("q_MAT") && d.rawResult.allTags.filter(function(e) {
          return /q_INC_*/g.test(e);
        })[0] === void 0 && !d.rawResult.allTags.includes("q_ETRE") && !d.rawResult.allTags.includes("q_ETOU")) {
          d.effects.push("Sonn\xE9");
        }
        d.nonletal = true;
      },
      "PAR": function() {
      },
      "PERS": function(d, lvl) {
        d.effects.push("Persistant: " + lvl + "d6/" + d.nbEffects);
      },
      "RED": function(d, lvl) {
        d.mentalDamage += d.nbEffects * lvl;
      },
      "SUB": function() {
      },
      "VOL": function() {
      },
      "ZON": function(d) {
        d.effects.push(d.nbEffects + " cibles suppl\xE9mentaires");
      }
    };
    talentDamageEffects = {
      "AGI": function(r) {
        r.rerollable = true;
      },
      "AGIFEL": function(r) {
        r.pertinentTalents.push("AGIFEL");
      },
      "MESS": function(r) {
        r.pertinentTalents.push("MESS");
      }
    };
    constructor(result) {
      super(result);
      this.nbEffects = result.all.filter(function(roll) {
        return roll.value === 5 || roll.value === 6;
      }).length;
      const that = this;
      result.allTags.filter(function(e) {
        return /q_*/g.test(e);
      }).forEach(function(tag) {
        const qualityId = tag.split("_")[1];
        const lvl = tag.split("_")[2];
        if (that.nbEffects > 0 || qualityId === "INT") {
          if (lvl === void 0) {
            that.qualityEffect[qualityId](that, letterToInt(lvl));
          } else {
            that.qualityEffect[qualityId](that, 1);
          }
        }
      });
    }
    isNonLetal() {
      return this.nonletal;
    }
    getBadEffects() {
      return this.badEffects;
    }
    getEffects() {
      return this.effects;
    }
  };

  // src/diceroll/business/roll.ts
  var rollSkill = function(sheet, skill, tags) {
    each(sheet.get("talents").value(), function(talent) {
      tags.push("t_" + talent.talents_Choice);
    });
    tags.push("s_" + skill.id);
    const compvalue = sheet.get(getExpInputName(skill.id)).value() + sheet.get(getAttrInputName(skill.attribute)).value();
    const concValue = sheet.get(getConcInputName(skill.id)).value();
    const crits = [];
    if (concValue > 0) {
      for (let i = 1; i <= concValue; i++) {
        crits.push(i + ":2");
      }
    }
    if (sheet.get(getExpInputName(skill.id)).value() + concValue === 0) {
      tags.push("noskill");
    }
    let intensity = sheet.getData().roll_intensity !== void 0 ? parseInt(sheet.getData().roll_intensity) : 2;
    const voleeTag = tags.filter(function(e) {
      return /v_*/g.test(e);
    })[0];
    if (voleeTag !== void 0) {
      intensity = intensity + parseInt(voleeTag.split("_")[1]);
    }
    let diceExpression = intensity + "d20 <=";
    diceExpression += crits.length !== 0 ? "{" + crits.join() + "} " : " ";
    diceExpression += compvalue;
    diceExpression += tags.length !== 0 ? "[" + tags.join() + "]" : "";
    const roll = new RollBuilder(sheet);
    roll.expression(diceExpression).visibility("visible").title(skill.name);
    roll.roll();
  };
  var rollResultHandler = function(result, callback) {
    callback("diceResult", function(sheet) {
      if (result.allTags.includes("damage")) {
        new DamageDiceResultPopup(sheet).render(new DamageDiceResultWrapper(result));
      } else {
        new DiceResultWrapper(result);
      }
    });
  };

  // src/skill/listener/skill.ts
  var initSkill = function(sheet) {
    Tables.get("skills").each(function(skill) {
      sheet.get(skill.id + "_btn").on("click", function() {
        rollSkill(sheet, skill, []);
      });
    });
  };
  var getExpInputName = function(id) {
    return id + "_Exp_Inpt";
  };
  var getConcInputName = function(id) {
    return id + "_Conc_Inpt";
  };
  var getAttrInputName = function(id) {
    return id + "_Inpt";
  };

  // src/weapons/business/qualities.ts
  var variableQualities = function() {
    const quals = [];
    Tables.get("weapon_qualities").each(function(quality) {
      if (quality.type === "Variable") {
        quals.push(quality);
      }
    });
    return quals;
  }();
  var getLabel = function(s) {
    return s + "_Input";
  };
  var processQualitiesLabel = function(data) {
    return data.qualities_Choice.map(function(selectedQuality) {
      const quality = Tables.get("weapon_qualities").get(selectedQuality);
      if (quality.type === "Variable") {
        if (data[getLabel(quality.id)] === void 0) {
          data[getLabel(quality.id)] = 1;
        }
        return quality.name.replace(" X", " " + data[getLabel(quality.id)]);
      }
      return quality.name;
    });
  };
  var handleQualityInput = function(sheet) {
    sheet.setData({ qualities_Input: processQualitiesLabel(sheet.getData()).join(", ") });
  };
  var handleRepeaterQualityChoice = function(entryCmp, target) {
    setRepeaterQualityInputs(entryCmp, target.value());
    entryCmp.find("qualities_Input").value(processQualitiesLabel(entryCmp.value()).join(", "));
    if (target.value().includes("JET")) {
      entryCmp.find("throwable_as_Int").value(1);
    } else {
      entryCmp.find("throwable_as_Int").value(0);
    }
  };
  var setRepeaterQualityInputs = function(component, selectedQualities) {
    variableQualities.forEach(function(quality) {
      if (selectedQualities.includes(quality.id)) {
        component.find(quality.id + "_Label").show();
        component.find(getLabel(quality.id)).show();
      } else {
        component.find(quality.id + "_Label").hide();
        component.find(getLabel(quality.id)).hide();
      }
    });
  };
  var processQualitiesTag = function(data) {
    return data.qualities_Choice.map(function(selectedQuality) {
      const quality = Tables.get("weapon_qualities").get(selectedQuality);
      if (quality.type === "Variable") {
        if (data[getLabel(quality.id)] === void 0) {
          data[getLabel(quality.id)] = 1;
        }
        return "q_" + quality.id + "_" + intToLetter(data[getLabel(quality.id)] !== void 0 ? data[getLabel(quality.id)] : 1);
      }
      return "q_" + quality.id;
    });
  };

  // src/weapons/types/weaponData.ts
  var weaponTypesInt = {
    melee: 1,
    ranged: 2
  };
  var weaponSizesInt = {
    uneMain: 1,
    deuxMains: 2,
    desequilibree: 3,
    encombrante: 4,
    fixe: 5,
    monstrueuse: 6
  };
  var weaponWieldingsInt = {
    uneMain: 1,
    deuxMains: 2
  };

  // src/weapons/business/charges.ts
  var setCharges = function(sheet, weaponType) {
    sheet.setData({
      type_Choice_as_Int: weaponTypesInt[weaponType]
    });
    if (weaponType === "ranged") {
      sheet.get("charges_Input").show();
      sheet.get("charges_Label").show();
    } else {
      sheet.get("charges_Input").hide();
      sheet.get("charges_Label").hide();
    }
  };
  var setRepeaterCharges = function(entryCmp, weaponType) {
    entryCmp.find("type_Choice_as_Int").value(weaponTypesInt[weaponType]);
    if (weaponType === "ranged") {
      entryCmp.find("charges_Input").show();
      entryCmp.find("charges_Label").show();
    } else {
      entryCmp.find("charges_Input").hide();
      entryCmp.find("charges_Label").hide();
    }
  };
  var handleChargeMoins = function(sheet, component) {
    const entryCmp = sheet.get("weapons").find(component.index());
    const entryData = sheet.get("weapons").value()[component.index()];
    if (entryData.charges_Input > 0) {
      entryCmp.find("charges_Input").value(entryData.charges_Input - 1);
      entryCmp.find("charges_Display_Label").value(entryCmp.find("charges_Input").value());
    }
  };
  var handleChargePlus = function(sheet, component) {
    const entryCmp = sheet.get("weapons").find(component.index());
    const entryData = sheet.get("weapons").value()[component.index()];
    if (entryData.charges_Input === void 0) {
      entryData.charges_Input = 0;
    }
    entryCmp.find("charges_Input").value(entryData.charges_Input + 1);
    entryCmp.find("charges_Display_Label").value(entryCmp.find("charges_Input").value());
  };

  // src/weapons/business/wielding.ts
  var handleWielding = function(sheet, component) {
    const entryData = sheet.get("weapons").value()[component.index()];
    const entryCmp = sheet.get("weapons").find(component.index());
    let weaponWieldingId = entryCmp.find("wielding_Choice").value();
    switch (entryData.size_Choice) {
      case "deuxMains":
        if (entryData.type_Choice === "ranged") {
          break;
        }
      case "desequilibree":
        weaponWieldingId = weaponWieldingId === "uneMain" ? "deuxMains" : "uneMain";
      default:
    }
    const weaponWielding = Tables.get("weapon_wieldings").get(weaponWieldingId);
    entryCmp.find("wielding_Choice").value(weaponWielding.id);
    component.value(weaponWielding.type);
    entryCmp.find("wielding_Choice_as_Int").value(weaponWieldingsInt[weaponWielding.id]);
  };
  var handleWeaponChoiceRepeater = function(entryCmp, type) {
    entryCmp.find("size_Choice_as_Int").value(weaponSizesInt[type.value()]);
    let wielding_Choice = "deuxMains";
    if (type.value() === "uneMain" || type.value() === "desequilibree") {
      wielding_Choice = "uneMain";
    }
    entryCmp.find("wielding_Choice").value(wielding_Choice);
    entryCmp.find("wielding_Choice_as_Int").value(weaponWieldingsInt[wielding_Choice]);
  };
  var handleWeaponChoiceCraft = function(sheet, target) {
    let wieldingChoice = "deuxMains";
    if (target.value() === "uneMain" || target.value() === "desequlibree") {
      wieldingChoice = "uneMain";
    }
    sheet.setData({
      size_Choice_as_Int: weaponSizesInt[target.value()],
      wielding_Choice: wieldingChoice,
      wielding_Choice_as_Int: weaponWieldingsInt[wieldingChoice]
    });
  };

  // src/weapons/business/attack.ts
  var handleAttack = function(sheet, component) {
    const entryData = sheet.get("weapons").value()[component.index()];
    const entryCmp = sheet.get("weapons").find(component.index());
    const talents = [];
    each(sheet.get("talents").value(), function(talent) {
      talents.push(talent.talents_Choice);
    });
    const tags = processQualitiesTag(entryData);
    tags.push("attack");
    entryData.damage_Input = entryData.damage_Input !== void 0 ? entryData.damage_Input : 0;
    tags.push("d_" + intToLetter(entryData.damage_Input));
    if (entryData.type_Choice === "melee") {
      rollSkill(sheet, Tables.get("skills").get("MEL"), tags);
    } else {
      if (entryData.charges_Input === void 0) {
        entryData.charges_Input = 0;
      }
      const volee = entryData.qualities_Choice.includes("VOL");
      const charges = entryData.charges_Input > 0;
      if (!volee && !charges) {
        sheet.prompt("Erreur", "GenericPrompt", function() {
        }, function(promptSheet) {
          promptSheet.get("message").value("Aucune charge disponible");
        });
      }
      if (!volee && charges) {
        entryCmp.find("charges_Input").value(entryData.charges_Input - 1);
        entryCmp.find("charges_Display_Label").value(entryCmp.find("charges_Input").value());
        rollSkill(sheet, Tables.get("skills").get("DIST"), tags);
      }
      if (volee && !charges) {
        rollSkill(sheet, Tables.get("skills").get("DIST"), tags);
      }
      if (volee && charges) {
        sheet.prompt("Consommer charge ?", "ChargePrompt", function(result) {
          tags.push("v_" + result.yesno);
          entryCmp.find("charges_Input").value(entryData.charges_Input - parseInt(result.yesno));
          entryCmp.find("charges_Display_Label").value(entryCmp.find("charges_Input").value());
          rollSkill(sheet, Tables.get("skills").get("DIST"), tags);
        }, function(promptSheet) {
          if (talents.includes("TIRRAP") && entryData.charges_Input >= 2) {
            promptSheet.get("yesno").setChoices({ "0": "0", "1": "1", "2": "2" });
          }
        });
      }
    }
  };
  var handleThrow = function(sheet, component) {
    const entryData = sheet.get("weapons").value()[component.index()];
    entryData.damage_Input = entryData.damage_Input !== void 0 ? entryData.damage_Input : 0;
    const tags = processQualitiesTag(entryData);
    tags.push("attack");
    tags.push("d_" + intToLetter(entryData.damage_Input));
    rollSkill(sheet, Tables.get("skills").get("DIST"), tags);
  };

  // src/weapons/listener/repeater.ts
  var globalWeaponEntryStates = {};
  var initWeaponsRepeater = function(sheet) {
    sheet.get("weapons").on("click", function(repeater) {
      each(repeater.value(), function(entryData, entryId) {
        const entryCmp = repeater.find(entryId);
        if (entryCmp.find("mode").value() === "EDIT") {
          if (globalWeaponEntryStates[entryId] !== "EDIT") {
            initRepeaterEditWeapon(entryCmp);
          }
          globalWeaponEntryStates[entryId] = "EDIT";
        } else {
          globalWeaponEntryStates[entryId] = "VIEW";
        }
      });
    });
    sheet.get("weapons").on("click", "charge_moins", function(component) {
      handleChargeMoins(sheet, component);
    });
    sheet.get("weapons").on("click", "charge_plus", function(component) {
      handleChargePlus(sheet, component);
    });
    sheet.get("weapons").on("click", "wielding", function(component) {
      handleWielding(sheet, component);
    });
    sheet.get("weapons").on("click", "weaponName", function(component) {
      handleAttack(sheet, component);
    });
    sheet.get("weapons").on("click", "throw", function(component) {
      handleThrow(sheet, component);
    });
  };
  var initRepeaterEditWeapon = function(entryCmp) {
    const selectedQualities = entryCmp.value().qualities_Choice;
    setRepeaterQualityInputs(entryCmp, selectedQualities);
    setRepeaterCharges(entryCmp, entryCmp.value().type_Choice);
    entryCmp.find("qualities_Choice").on("update", function(target) {
      handleRepeaterQualityChoice(entryCmp, target);
    });
    variableQualities.forEach(function(quality) {
      entryCmp.find(getLabel(quality.id)).on("update", function(target) {
        handleRepeaterQualityChoice(entryCmp, target);
      });
    });
    entryCmp.find("type_Choice").on("update", function(target) {
      setRepeaterCharges(entryCmp, target.value());
    });
    entryCmp.find("size_Choice").on("update", function(target) {
      handleWeaponChoiceRepeater(entryCmp, target);
    });
  };

  // src/weapons/listener/craft.ts
  var initWeaponCraft = function(sheet) {
    if (sheet.getData().qualities_Choice === void 0) {
      sheet.setData({
        qualities_Choice: []
      });
    }
    if (sheet.getData().type_Choice === void 0) {
      sheet.setData({
        type_Choice: "melee",
        type_Choice_as_Int: weaponTypesInt.melee
      });
    }
    if (sheet.getData().size_Choice === void 0) {
      sheet.setData({
        size_Choice: "uneMain",
        size_Choice_as_Int: weaponSizesInt.uneMain,
        wielding_Choice: "uneMain",
        wielding_Choice_as_Int: weaponWieldingsInt.uneMain
      });
    }
    if (sheet.getData().range_Choice === void 0) {
      sheet.setData({ range_Choice: "1" });
    }
    sheet.get("qualities_Choice").on("update", function() {
      handleQualityInput(sheet);
    });
    variableQualities.forEach(function(quality) {
      sheet.get(quality.id + "_Input").on("update", function() {
        handleQualityInput(sheet);
      });
    });
    sheet.get("type_Choice").on("update", function(event) {
      setCharges(sheet, event.value());
    });
    sheet.get("size_Choice").on("update", function(target) {
      handleWeaponChoiceCraft(sheet, target);
    });
  };

  // src/index.ts
  init = function(sheet) {
    if (sheet.id() === "main") {
      initSkill(sheet);
      initWeaponsRepeater(sheet);
    }
    if (sheet.id() === "weapon_craft") {
      initWeaponCraft(sheet);
    }
  };
  drop = function(from, to) {
    if (from.id() === "weapon_craft" && to.id() === "main") {
      return "weapons";
    }
  };
  initRoll = rollResultHandler;
})();
