export default class ColumnChart {
  subElements = {}
  constructor({
    link = '',
    url = '',
    label = '',
    range = {
      from: '',
      to: ''

    },


  } = {}) {

    this.data = [];
    this.label = label;
    this.value = 0;
    this.link = link;
    this.chartHeight = 50;
    this.url = url;
    this.dateFrom = new Date('2020-04-06');
    this.dateTo = new Date('2020-05-06');
    this.update(this.dateFrom, this.dateTo);
    this.render(this.data);







  }

  async update(from, to) {
    const label = this.label;
    let url = `https://course-js.javascript.ru/${this.url}?from=${from}&to=${to}`;
    const response = await fetch(url);
    const result = await response.json();
    const res = await new Array();
    await Object.values(result).map(el => res.push(el));
    this.data = await new Array();
    this.data = await res;
    await this.remove();
    await this.render(this.data);
    const toAppend = await document.getElementById(`${this.label}`);
    await toAppend.append(this.element);


  }

  render(data) {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate(data);
    this.element = element.firstElementChild;
    this.subElements = this.element.querySelector(`.column-chart__chart`);
    this.subElements.body = this.subElements;
    const { body } = this.subElements;
    console.log(body.children);



  }
  getTemplate(data) {
    if (!this.data.length) {
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
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__${this.link}">
        Total ${this.label}
        ${this.label === 'orders' && `<a href="/sales" class="column-chart__link">View all</a>` || ``}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
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

  async remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
