import { Drug } from "../drug";

export class Dafalgan extends Drug {
  static NAME = "Dafalgan";
  static EXPIRES_IN = 20;
  static BENEFIT = 30;

  constructor(expiresIn, benefit) {
    super(
      Dafalgan.NAME,
      expiresIn ?? Dafalgan.EXPIRES_IN,
      benefit ?? Dafalgan.BENEFIT,
    );
  }

  updateBenefit() {
    if (this.benefit > 0) {
      this.benefit = this.clampBenefit(this.benefit - 2);
    }
  }

  handleExpired() {
    if (this.benefit > 0) {
      this.benefit = this.clampBenefit(this.benefit - 2);
    }
  }
}
