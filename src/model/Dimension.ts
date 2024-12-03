//model dimenções
class Dimension {
  name: string;
  values: string[];

  constructor(name: string, size: number) {
    this.name = name;
    this.values = [];

    for (let row = 0; row < size; row++) {
      this.values[row] = "";
    }
  }

  setValue(index: number, value: string): void {
    if (index >= 0 && index < this.values.length) {
      this.values[index] = value;
    }
  }

  getValue(index: number): string {
    if (index >= 0 && index < this.values.length) {
      return this.values[index];
    }
    return "";
  }
}

export { Dimension };
