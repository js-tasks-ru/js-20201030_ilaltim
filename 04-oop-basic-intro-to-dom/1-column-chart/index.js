export default class ColumnChart {
  constructor({data = [],
    label = '',
    value = '',
    link = ''} = {}) {

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.chartHeight = 50;
    this.render();
    // this.initEventListeners();
  }

  update(data) {
    this.data = data;
    this.render();
  }
  render() {
    const data = this.data;
    const label = this.label;
    //const link = this.link;
    const value = this.value;

    const element = document.createElement('div');

    // if no data - show skeleton
    if (!data.length) {

      element.innerHTML = `
      <div id="${label}" class="dashboard__chart_${label} column-chart_loading">
    <div class="column-chart column-chart_loading" style="--chart-height: 50">
      <div class="column-chart__title">
        Total ${label}
        <a class="column-chart__link" href="#">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${ value }
        </div>
        <div data-element="body" class="column-chart__chart">
        </div>
      </div>
    </div>
  </div>
      `;

      // if there is data and if type of chart - order - show order form(in order form there is
      // special <a> tag)

    } else if (data.length && label === 'orders') {

      element.innerHTML = `<div class="column-chart">
      <div class="column-chart__title">
        Total ${label}
        <a href="/sales" class="column-chart__link">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${value}</div>
        <div data-element="body" class="column-chart__chart">

        </div>
      </div>
    </div>`;
    // common case - there is data and type is not order. e.g. sales  or customers...
    } else if (data.length) {
      element.innerHTML = `
        <div class="column-chart">
      <div class="column-chart__title">
        Total ${label}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${value}</div>
        <div data-element="body" class="column-chart__chart">


        </div>
      </div>
    </div>
      `;
    }
    //appending data to chart
    let container = element.querySelector('.column-chart__chart');
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    for (let el of data) {
      let percent = (el / maxValue * 100).toFixed(0) + '%';
      let value = String(Math.floor(el * scale));
      let div = document.createElement('div');
      div.style.setProperty('--value', value);
      div.dataset.tooltip = percent;
      container.append(div);
    }

    this.element = element.firstElementChild;
  }

  initEventListeners () {
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

