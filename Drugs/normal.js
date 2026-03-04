import { Drug } from "../drug";

export class Normal extends Drug {
  constructor(name, expiresIn, benefit) {
    super(name, expiresIn, benefit);
  }

  updateBenefit() {
    if (this.benefit > 0) {
      this.benefit = this.clampBenefit(this.benefit - 1);
    }
  }

  handleExpired() {
    if (this.benefit > 0) {
      this.benefit = this.clampBenefit(this.benefit - 1);
    }
  }
}
