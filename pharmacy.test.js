import { Pharmacy } from "./pharmacy";
import { HerbalTea } from "./Drugs/herbal_tea";
import { Drug } from "./drug";
import { Fervex } from "./Drugs/fervex";
import { MagicPill } from "./Drugs/magic_pill";
import { Dafalgan } from "./Drugs/dafalgan";
import { Normal } from "./Drugs/normal";

describe("Pharmacy", () => {
  describe("Normal Drug Degradation", () => {
    it("should decrease benefit by 1 per day when not expired", () => {
      const pharmacy = new Pharmacy([new Normal("Doliprane", 4, 9)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(3);
      expect(pharmacy.drugs[0].benefit).toBe(8);
    });

    it("should decrease benefit by 1 and expiresIn by 1 each day", () => {
      const pharmacy = new Pharmacy([new Normal("Doliprane", 5, 4)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(4);
      expect(pharmacy.drugs[0].benefit).toBe(3);
    });

    it("should handle multiple normal drugs", () => {
      const pharmacy = new Pharmacy([
        new Normal("Dolipran 0", 4, 6),
        new Normal("Dolipran 1", 5, 7),
      ]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(3);
      expect(pharmacy.drugs[0].benefit).toBe(5);

      expect(pharmacy.drugs[1].expiresIn).toBe(4);
      expect(pharmacy.drugs[1].benefit).toBe(6);
    });
  });

  describe("Expired Drug Double Degradation", () => {
    it("should decrease benefit by 2 per day when expired", () => {
      const pharmacy = new Pharmacy([new Normal("Dolipran", 0, 10)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-1);
      expect(pharmacy.drugs[0].benefit).toBe(8);
    });

    it("should continue double degradation after expiration", () => {
      const pharmacy = new Pharmacy([new Normal("Dolipran", -1, 8)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-2);
      expect(pharmacy.drugs[0].benefit).toBe(6);
    });

    it("should handle transition from not expired to expired", () => {
      const pharmacy = new Pharmacy([new Normal("Dolipran", 1, 10)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(0);
      expect(pharmacy.drugs[0].benefit).toBe(9);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-1);
      expect(pharmacy.drugs[0].benefit).toBe(7);
    });
  });

  describe("Herbal Tea Benefit Increase", () => {
    it("should increase benefit by 1 per day when not expired", () => {
      const pharmacy = new Pharmacy([new HerbalTea(5, 10)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(4);
      expect(pharmacy.drugs[0].benefit).toBe(11);
    });

    it("should increase benefit by 2 per day when expired", () => {
      const pharmacy = new Pharmacy([new HerbalTea(0, 10)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-1);
      expect(pharmacy.drugs[0].benefit).toBe(12);
    });

    it("should continue double increase after expiration", () => {
      const pharmacy = new Pharmacy([new HerbalTea(-1, 12)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-2);
      expect(pharmacy.drugs[0].benefit).toBe(14);
    });

    it("should handle transition from not expired to expired", () => {
      const pharmacy = new Pharmacy([new HerbalTea(1, 10)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(0);
      expect(pharmacy.drugs[0].benefit).toBe(11);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-1);
      expect(pharmacy.drugs[0].benefit).toBe(13);
    });
  });

  describe("Fervex Benefit Increase Logic", () => {
    it("should increase benefit by 1 when expiresIn >= 11", () => {
      const pharmacy = new Pharmacy([new Fervex(12, 35)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(11);
      expect(pharmacy.drugs[0].benefit).toBe(36);
    });

    it("should increase benefit by 2 when expiresIn < 11 and >= 6", () => {
      const pharmacy = new Pharmacy([new Fervex(10, 35)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(9);
      expect(pharmacy.drugs[0].benefit).toBe(37);
    });

    it("should increase benefit by 3 when expiresIn < 6", () => {
      const pharmacy = new Pharmacy([new Fervex(5, 35)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(4);
      expect(pharmacy.drugs[0].benefit).toBe(38);
    });

    it("should transition from +1 to +2 when crossing 11 days threshold", () => {
      const pharmacy = new Pharmacy([new Fervex(11, 35)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(10);
      expect(pharmacy.drugs[0].benefit).toBe(36);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(9);
      expect(pharmacy.drugs[0].benefit).toBe(38);
    });

    it("should transition from +2 to +3 when crossing 6 days threshold", () => {
      const pharmacy = new Pharmacy([new Fervex(6, 35)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(5);
      expect(pharmacy.drugs[0].benefit).toBe(37);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(4);
      expect(pharmacy.drugs[0].benefit).toBe(40);
    });

    it("should drop benefit to 0 when expired", () => {
      const pharmacy = new Pharmacy([new Fervex(0, 50)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-1);
      expect(pharmacy.drugs[0].benefit).toBe(0);
    });

    it("should keep benefit at 0 after expiration", () => {
      const pharmacy = new Pharmacy([new Fervex(-1, 0)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-2);
      expect(pharmacy.drugs[0].benefit).toBe(0);
    });

    it("should handle transition from expiration day to expired", () => {
      const pharmacy = new Pharmacy([new Fervex(1, 48)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(0);
      expect(pharmacy.drugs[0].benefit).toBe(50);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-1);
      expect(pharmacy.drugs[0].benefit).toBe(0);
    });
  });

  describe("Magic Pill No Change", () => {
    it("should not change benefit or expiresIn", () => {
      const pharmacy = new Pharmacy([new MagicPill(15, 40)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(15);
      expect(pharmacy.drugs[0].benefit).toBe(40);
    });

    it("should remain unchanged after multiple updates", () => {
      const pharmacy = new Pharmacy([new MagicPill(10, 50)]);

      for (let i = 0; i < 5; i++) {
        pharmacy.updateBenefitValue();
      }

      expect(pharmacy.drugs[0].expiresIn).toBe(10);
      expect(pharmacy.drugs[0].benefit).toBe(50);
    });

    it("should remain unchanged even when expiresIn would be negative", () => {
      const pharmacy = new Pharmacy([new MagicPill(0, 40)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(0);
      expect(pharmacy.drugs[0].benefit).toBe(40);
    });
  });

  describe("Dafalgan Double Degradation", () => {
    it("should decrease benefit by 2 per day when not expired", () => {
      const pharmacy = new Pharmacy([new Dafalgan(5, 10)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(4);
      expect(pharmacy.drugs[0].benefit).toBe(8);
    });

    it("should decrease benefit by 4 per day when expired", () => {
      const pharmacy = new Pharmacy([new Dafalgan(0, 10)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-1);
      expect(pharmacy.drugs[0].benefit).toBe(6);
    });

    it("should continue quadruple degradation after expiration", () => {
      const pharmacy = new Pharmacy([new Dafalgan(-1, 8)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-2);
      expect(pharmacy.drugs[0].benefit).toBe(4);
    });

    it("should handle transition from not expired to expired", () => {
      const pharmacy = new Pharmacy([new Dafalgan(1, 10)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(0);
      expect(pharmacy.drugs[0].benefit).toBe(8);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].expiresIn).toBe(-1);
      expect(pharmacy.drugs[0].benefit).toBe(4);
    });
  });

  describe("Benefit Cap (50) Enforcement", () => {
    it("should not exceed 50 for normal drugs", () => {
      const pharmacy = new Pharmacy([new Normal("Dolipran", 5, 50)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(49);
      expect(pharmacy.drugs[0].benefit).toBeLessThanOrEqual(Drug.MAX_BENEFIT);
    });

    it("should cap Herbal Tea at 50", () => {
      const pharmacy = new Pharmacy([new HerbalTea(5, 50)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(50);
    });

    it("should cap Herbal Tea at 50 even when expired", () => {
      const pharmacy = new Pharmacy([new HerbalTea(-1, 50)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(50);
    });

    it("should cap Fervex at 50", () => {
      const pharmacy = new Pharmacy([new Fervex(12, 49)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(50);
    });

    it("should cap Fervex at 50 when getting +2 increase", () => {
      const pharmacy = new Pharmacy([new Fervex(10, 49)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(50);
    });

    it("should cap Fervex at 50 when getting +3 increase", () => {
      const pharmacy = new Pharmacy([new Fervex(5, 48)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(50);
    });

    it("should prevent benefit from exceeding 50 even with multiple increases", () => {
      const pharmacy = new Pharmacy([new Fervex(5, 49)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(50);
    });
  });

  describe("Benefit Floor (0) Enforcement", () => {
    it("should not go below 0 for normal drugs", () => {
      const pharmacy = new Pharmacy([new Normal("Dolipran", 5, 0)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(0);
      expect(pharmacy.drugs[0].benefit).toBeGreaterThanOrEqual(
        Drug.MIN_BENEFIT,
      );
    });

    it("should not go below 0 for expired normal drugs", () => {
      const pharmacy = new Pharmacy([new Normal("Dolipran", -1, 0)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(0);
    });

    it("should not go below 0 for Dafalgan", () => {
      const pharmacy = new Pharmacy([new Dafalgan(5, 0)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(0);
    });

    it("should not go below 0 for expired Dafalgan", () => {
      const pharmacy = new Pharmacy([new Dafalgan(-1, 1)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(0);
    });

    it("should handle benefit at 1 for expired normal drug", () => {
      const pharmacy = new Pharmacy([new Normal("Dolipran", -1, 1)]);

      pharmacy.updateBenefitValue();

      expect(pharmacy.drugs[0].benefit).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    describe("Benefit at 0", () => {
      it("should handle normal drug with benefit 0 and expiresIn > 0", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", 5, 0)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(4);
        expect(pharmacy.drugs[0].benefit).toBe(0);
      });

      it("should handle normal drug with benefit 0 and expiresIn = 0", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", 0, 0)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(-1);
        expect(pharmacy.drugs[0].benefit).toBe(0);
      });

      it("should handle normal drug with benefit 0 and expiresIn < 0", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", -1, 0)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(-2);
        expect(pharmacy.drugs[0].benefit).toBe(0);
      });

      it("should handle Herbal Tea with benefit 0", () => {
        const pharmacy = new Pharmacy([new HerbalTea(5, 0)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(4);
        expect(pharmacy.drugs[0].benefit).toBe(1);
      });
    });

    describe("Benefit at 50", () => {
      it("should handle normal drug with benefit 50", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", 5, 50)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(4);
        expect(pharmacy.drugs[0].benefit).toBe(49);
      });

      it("should handle Herbal Tea with benefit 50", () => {
        const pharmacy = new Pharmacy([new HerbalTea(5, 50)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(4);
        expect(pharmacy.drugs[0].benefit).toBe(50);
      });

      it("should handle Fervex with benefit 50", () => {
        const pharmacy = new Pharmacy([new Fervex(12, 50)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(11);
        expect(pharmacy.drugs[0].benefit).toBe(50);
      });
    });

    describe("Expiration Boundaries", () => {
      it("should handle expiresIn = 1 (day before expiration)", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", 1, 10)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(0);
        expect(pharmacy.drugs[0].benefit).toBe(9);
      });

      it("should handle expiresIn = 0 (expiration day)", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", 0, 10)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(-1);
        expect(pharmacy.drugs[0].benefit).toBe(8);
      });

      it("should handle expiresIn = -1 (day after expiration)", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", -1, 8)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(-2);
        expect(pharmacy.drugs[0].benefit).toBe(6);
      });

      it("should handle Fervex at expiresIn = 11 (threshold boundary)", () => {
        const pharmacy = new Pharmacy([new Fervex(11, 35)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(10);
        expect(pharmacy.drugs[0].benefit).toBe(36);
      });

      it("should handle Fervex at expiresIn = 10 (just below threshold)", () => {
        const pharmacy = new Pharmacy([new Fervex(10, 35)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(9);
        expect(pharmacy.drugs[0].benefit).toBe(37);
      });

      it("should handle Fervex at expiresIn = 6 (threshold boundary)", () => {
        const pharmacy = new Pharmacy([new Fervex(6, 35)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(5);
        expect(pharmacy.drugs[0].benefit).toBe(37);
      });

      it("should handle Fervex at expiresIn = 5 (just below threshold)", () => {
        const pharmacy = new Pharmacy([new Fervex(5, 35)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].expiresIn).toBe(4);
        expect(pharmacy.drugs[0].benefit).toBe(38);
      });
    });

    describe("Multiple Updates", () => {
      it("should handle multiple consecutive updates for normal drug", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", 5, 10)]);

        for (let i = 0; i < 3; i++) {
          pharmacy.updateBenefitValue();
        }

        expect(pharmacy.drugs[0].expiresIn).toBe(2);
        expect(pharmacy.drugs[0].benefit).toBe(7);
      });

      it("should handle multiple updates crossing expiration", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", 2, 10)]);

        for (let i = 0; i < 3; i++) {
          pharmacy.updateBenefitValue();
        }

        expect(pharmacy.drugs[0].expiresIn).toBe(-1);
        expect(pharmacy.drugs[0].benefit).toBe(6);
      });

      it("should handle multiple drugs with different behaviors", () => {
        const pharmacy = new Pharmacy([
          new Normal("Dolipran", 5, 10),
          new HerbalTea(5, 10),
          new MagicPill(5, 40),
          new Fervex(5, 35),
        ]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].benefit).toBe(9);
        expect(pharmacy.drugs[1].benefit).toBe(11);
        expect(pharmacy.drugs[2].benefit).toBe(40);
        expect(pharmacy.drugs[3].benefit).toBe(38);
      });
    });

    describe("Boundary Value Testing", () => {
      it("should handle benefit = 1 with expired normal drug", () => {
        const pharmacy = new Pharmacy([new Normal("Dolipran", -1, 1)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].benefit).toBe(0);
      });

      it("should handle benefit = 49 with Fervex at threshold", () => {
        const pharmacy = new Pharmacy([new Fervex(5, 49)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].benefit).toBe(50);
      });

      it("should handle benefit = 1 with Dafalgan expired", () => {
        const pharmacy = new Pharmacy([new Dafalgan(-1, 1)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].benefit).toBe(0);
      });

      it("should handle benefit = 2 with Dafalgan expired", () => {
        const pharmacy = new Pharmacy([new Dafalgan(-1, 2)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].benefit).toBe(0);
      });

      it("should handle benefit = 3 with Dafalgan expired", () => {
        const pharmacy = new Pharmacy([new Dafalgan(-1, 3)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].benefit).toBe(0);
      });

      it("should handle benefit = 4 with Dafalgan expired", () => {
        const pharmacy = new Pharmacy([new Dafalgan(-1, 4)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].benefit).toBe(0);
      });

      it("should handle benefit = 5 with Dafalgan expired", () => {
        const pharmacy = new Pharmacy([new Dafalgan(-1, 5)]);

        pharmacy.updateBenefitValue();

        expect(pharmacy.drugs[0].benefit).toBe(1);
      });
    });
  });
});
