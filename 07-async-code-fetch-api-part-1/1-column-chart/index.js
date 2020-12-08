export default class ColumnChart {
  subElements = {}
  constructor({
    link = '',
    url = '',
    label = '',
    range = {
      from: new Date('2020-04-06'),
      to: new Date('2020-05-06'),

    },
  } = {}) {

    this.data = [];
    this.label = label;
    this.value = 0;
    this.link = link;
    this.chartHeight = 50;
    this.url = url;
    this.dateFrom = range.from;
    this.dateTo = range.to;
    this.update(this.dateFrom, this.dateTo);


  }

  async update(from, to) {
    if (!this.data.length) {
      await this.render(this.data);
      this.subElements = this.element.querySelector(`.column-chart__chart`);
      this.subElements.body = this.subElements;
      for (let i = 0 ; i < 31; i++) {
        const div = document.createElement('div');
        this.subElements.body.append(div);
      }
    }
    let url = `https://course-js.javascript.ru/${this.url}?from=${from}&to=${to}`;
    const response = await fetch(url);
    const result = await response.json();
    const res = [];
    await Object.values(result).map(el => res.push(el));
    this.data = res;
    this.remove();
    await this.render(this.data);
    const toAppend = document.getElementById(`${this.label}`);


    if (!toAppend) {
      this.subElements = this.element.querySelector(`.column-chart__chart`);
      this.subElements.body = this.subElements;

      for (let i = 0 ; i < 3; i++) {
        if (this.subElements.body.children.length >= 3) {
          return;
        }
        const div = document.createElement('div');
        this.subElements.body.append(div);
      }

      return;
    }
    toAppend.append(this.element);
  }

  async render(data) {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate(data);
    this.element = element.firstElementChild;
  }
  getTemplate(data) {
    if (!data.length) {
      return `<div class="column-chart column-chart_loading" style="--chart-height: 50">
      <div class="column-chart__title">
        Total ${this.label}
        <a href="/sales" class="column-chart__link">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          344
        </div>
        <div data-element="body" class="column-chart__chart">

        </div>
      </div>
    </div>`;
    }

    let value = 0;
    data.forEach(el => {
      return value += el;
    });
    this.value = value;

    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__${this.link}">
        Total ${this.label}
        ${this.label === 'orders' && `<a href="/sales" class="column-chart__link">View all</a>` || ``}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.label === 'sales' ? `$${this.value}` : this.value}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.addColumnsToChart(data)}
        </div>
      </div>
    </div>`;
  }

  addColumnsToChart(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(el => {
      const percent = (el / maxValue * 100).toFixed(0) + '%';
      const value = Math.floor(el * scale);
      return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
    }).join('');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
