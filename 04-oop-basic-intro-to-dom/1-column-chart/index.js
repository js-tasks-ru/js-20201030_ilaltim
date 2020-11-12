export default class ColumnChart {
  constructor({
    data = [],
    label = '',
    value = '',
    link = ''
  } = {}) {

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.chartHeight = 50;
    this.render();
  }

  update(data) {
    this.data = data;
    this.render();
  }

  render() {

    const data = this.data;
    const label = this.label;
    // const link = this.link;
    const value = this.value;
    const element = document.createElement('div');

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

    if (isIncomeDataEmpty(data)) {
      noIncomeDataRender(element, label);
    }

    if (label === 'orders' && !isIncomeDataEmpty(data)) {
      addLink(element, '/sales');
    }

    addColumnsToChart(element, data);

    this.element = element.firstElementChild;

    function addLink(element, href) {
      const link = document.createElement('a');
      const divForLink = element.querySelector('.column-chart__title');
      link.className = "column-chart__link";
      link.href = href;
      link.innerHTML = "View all";
      divForLink.insertAdjacentElement('beforeend', link);
    }

    function noIncomeDataRender(element, label) {
      const outerDiv = document.createElement('div');
      outerDiv.id = label;
      outerDiv.className = `dashboard__chart_${label} column-chart_loading`;
      const colChart = element.querySelector('.column-chart');
      colChart.className = `column-chart column-chart_loading`;
      colChart.style.setProperty('--chart-height', '50');
      element.insertAdjacentElement('beforebegin', outerDiv);
      addLink(element, '#');
    }

    function addColumnsToChart(element, data) {
      const container = element.querySelector('.column-chart__chart');
      const maxValue = Math.max(...data);
      const scale = 50 / maxValue;

      for (const el of data) {
        const percent = (el / maxValue * 100).toFixed(0) + '%';
        const value = Math.floor(el * scale);
        const div = document.createElement('div');
        div.style.setProperty('--value', value);
        div.dataset.tooltip = percent;
        container.append(div);
      }

    }

    function isIncomeDataEmpty(data) {
      return data.length === 0;
    }

  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

