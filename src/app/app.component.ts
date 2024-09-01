import { Component, WritableSignal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

enum CalcOperationType {
  'OPERATION' = 'operation',
  'NUMBER' = 'number',
}

interface History {
  index: string;
  data: string;
}

interface CalcData {
  type: CalcOperationType.NUMBER | CalcOperationType.OPERATION;
  data: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public histories: History[] = [];
  public currentData: CalcData[] = [];
  public userViewCurrentData: string = '';
  public prevResult: string[] = [];
  public result: string = '0';
  public userError: string | null = null;
  public showHistory: WritableSignal<boolean> = signal(false);
  public showFunctions: WritableSignal<boolean> = signal(false);

  public init() {
    this.currentData = [];
    this.userViewCurrentData = '';
    this.prevResult = [];
    this.result = '0';
    this.userError = null;
  }

  public showHistoryHandler() {
    this.showHistory.set(!this.showHistory());
  }

  public showFunctionsHandler() {
    this.showFunctions.set(!this.showFunctions());
  }

  public addNumber(element: string) {
    this.currentData.push({
      type: CalcOperationType.NUMBER,
      data: element,
    });
    this.userViewCurrentData = this.userViewCurrentData + element.toString();
  }

  public addOperation(element: string) {
    const lenghtCurrentData = this.currentData.length;
    if (lenghtCurrentData === 0) {
      return;
    }
    if (
      this.currentData[lenghtCurrentData - 1].type ===
      CalcOperationType.OPERATION
    ) {
      this.currentData = this.currentData.map((e, i) => {
        if (i == lenghtCurrentData - 1) {
          return {
            ...e,
            data: element,
          };
        }
        return e;
      });
      this.userViewCurrentData =
        this.userViewCurrentData.slice(0, -1) + element.toString();
    } else {
      this.currentData.push({
        type: CalcOperationType.OPERATION,
        data: element,
      });
      this.userViewCurrentData = this.userViewCurrentData + element.toString();
    }
  }

  public calc() {
    try {
      this.result = eval(this.currentData.map((e) => e.data).join(''));
      this.histories.push({
        data: `${this.userViewCurrentData} = ${this.result}`,
        index: window.crypto.randomUUID().toString(),
      });
      this.currentData = [];
      this.userViewCurrentData = '';
    } catch (__error) {
      this.userError = 'Invalid expression';
    }
  }
}
