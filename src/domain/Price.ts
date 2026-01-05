const FEE = 0.05; // 5% fee rate

export class Price {
  private desiredAmount: number;
  public finalAmount: number;

  constructor(desiredAmount: number) {
    this.desiredAmount = desiredAmount;
    this.finalAmount = this.calculateWithFee();
  }

  private calculateWithFee(): number {
    return +(this.desiredAmount / (1 - FEE)).toFixed(2);
  }

  getSummary() {
    return this.finalAmount;
  }
}
