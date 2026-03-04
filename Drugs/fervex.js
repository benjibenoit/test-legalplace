import { Drug } from "../drug";

export class Fervex extends Drug {
  static NAME = "Fervex";
  static EXPIRES_IN = 12;
  static BENEFIT = 35;

  static THRESHOLD_1 = 11;
  static THRESHOLD_2 = 6;

  constructor(expiresIn, benefit) {
    super(
      Fervex.NAME,
      expiresIn ?? Fervex.EXPIRES_IN,
      benefit ?? Fervex.BENEFIT,
    );
  }

  updateBenefit() {
    if (this.benefit < 50) {
      this.benefit = this.clampBenefit(this.benefit + 1);
    }

    if (this.expiresIn < Fervex.THRESHOLD_1) {
      if (this.benefit < 50) {
        this.benefit = this.clampBenefit(this.benefit + 1);
      }
    }

    if (this.expiresIn < Fervex.THRESHOLD_2) {
      if (this.benefit < 50) {
        this.benefit = this.clampBenefit(this.benefit + 1);
      }
    }
  }

  handleExpired() {
    this.benefit = 0;
  }
}
