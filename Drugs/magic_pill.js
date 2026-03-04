import { Drug } from "../drug";

export class MagicPill extends Drug {
  static NAME = "Magic Pill";
  static EXPIRES_IN = 15;
  static BENEFIT = 40;

  constructor(expiresIn, benefit) {
    super(
      MagicPill.NAME,
      expiresIn ?? MagicPill.EXPIRES_IN,
      benefit ?? MagicPill.BENEFIT,
    );
  }

  updateBenefit() {}

  updateExpiration() {}

  shouldExpire() {
    return false;
  }

  handleExpired() {}
}
