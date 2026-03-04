import { Pharmacy } from "./pharmacy";
import { HerbalTea } from "./Drugs/herbal_tea";
import { Fervex } from "./Drugs/fervex";
import { MagicPill } from "./Drugs/magic_pill";
import { Normal } from "./Drugs/normal";
import * as fs from "node:fs";

const drugs = [
  new Normal("Dolipran", 20, 30),
  new HerbalTea(),
  new Fervex(),
  new MagicPill(),
];

const pharmacy = new Pharmacy(drugs);

const log = [];

for (let elapsedDays = 0; elapsedDays < 30; elapsedDays++) {
  log.push(JSON.parse(JSON.stringify(pharmacy.updateBenefitValue())));
}

console.log(log);

fs.writeFile(
  "output.json",
  JSON.stringify({ result: log }, null, 2).concat("\n"),
  (err) => {
    if (err) {
      console.log("error");
    } else {
      console.log("success");
    }
  },
);
