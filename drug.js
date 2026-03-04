export class Drug {
  static MAX_BENEFIT = 50;
  static MIN_BENEFIT = 0;

  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  update() {
    this.updateBenefit();

    if (this.shouldExpire()) {
      this.updateExpiration();
    }

    if (this.expiresIn < 0) {
      this.handleExpired();
    }
  }

  updateBenefit() {
    throw new Error("Should be implemented.");
  }

  updateExpiration() {
    this.expiresIn -= 1;
  }

  shouldExpire() {
    return true;
  }

  handleExpired() {}

  clampBenefit(benefit) {
    return Math.max(Drug.MIN_BENEFIT, Math.min(Drug.MAX_BENEFIT, benefit));
  }
}
