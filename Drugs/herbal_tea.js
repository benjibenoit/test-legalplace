import { Drug } from "../drug";

export class HerbalTea extends Drug {
  static NAME = "Herbal Tea";
  static EXPIRES_IN = 10;
  static BENEFIT = 5;

  constructor(expiresIn, benefit) {
    super(
      HerbalTea.NAME,
      expiresIn ?? HerbalTea.EXPIRES_IN,
      benefit ?? HerbalTea.BENEFIT,
    );
  }

  updateBenefit() {
    if (this.benefit < 50) {
      this.benefit = this.clampBenefit(this.benefit + 1);
    }
  }

  handleExpired() {
    if (this.benefit < 50) {
      this.benefit = this.clampBenefit(this.benefit + 1);
    }
  }
}
