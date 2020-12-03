import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';
const TODAY = new Date();
const PREV_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, TODAY.getDate() + 1);

export default class Page {

  constructor() {
    this.initEventListeners();
    this.render();
  }

    onDateSelect = async(e) => {
      //TODO сделать update всем чартам . range берется из ивента
      const orderPromise = this.ordersChartObj.update(e.detail.from, e.detail.to);
      const salesPromise = this.salesChartObj.update(e.detail.from, e.detail.to);
      const customersPromise = this.customersChartObj.update(e.detail.from, e.detail.to);
      //TODO нужно получить массив с новыми элементами для sortableTable при помощи запроса на сервер
      //создание url для запроса
      const url = new URL(`https://course-js.javascript.ru/api/dashboard/bestsellers`);
      url.searchParams.set('from', e.detail.from.toISOString());
      url.searchParams.set('to', e.detail.to.toISOString());
      url.searchParams.set('_sort', 'price');
      url.searchParams.set('_order', 'asc');
      url.searchParams.set('_start', `0`);
      url.searchParams.set('_end', `20`);


      const newData = await fetchJson(url);
      //TODO объединить все запросы в Promise.all
      await Promise.all([orderPromise, salesPromise, customersPromise]);
      //TODO обновить элемент сортаблТейбл.
      this.sortableTableObj.updateFuncForDashboardPage(newData);
    }

    initEventListeners() {
      document.addEventListener('date-select', this.onDateSelect);

    }

    async render() {
      const element = document.createElement('div');
      //TODO create rangePicker element
      const rangePicker = new RangePicker({from: PREV_MONTH, to: TODAY});
      //TODO create orderChat element
      const ordersChart = new ColumnChart({
        label: 'orders',
        link: `View all`,
        formatHeading: data => data,
        url: `${BACKEND_URL}api/dashboard/orders`,
        range: {from: PREV_MONTH, to: TODAY}
      });
      this.ordersChartObj = ordersChart;
      //TODO create salesChat element
      const salesChart = new ColumnChart({
        label: 'sales',
        formatHeading: data => data,
        url: `${BACKEND_URL}api/dashboard/sales`,
        range: {from: PREV_MONTH, to: TODAY}
      });
      this.salesChartObj = salesChart;
      //TODO create customersChat element
      const customersChart = new ColumnChart({
        label: 'customers',
        formatHeading: data => data,
        url: `${BACKEND_URL}api/dashboard/customers`,
        range: {from: PREV_MONTH, to: TODAY}
      });
      this.customersChartObj = customersChart;
      //TODO create sortableTable element
      const sortableTable = new SortableTable(header, {
        url: `api/dashboard/bestsellers`,
        sorted: {
          id: 'title',
          order: 'asc'
        },
        isSortLocally: true,
        step: 20,
        start: 1,
      });
      this.sortableTableObj = sortableTable;
      this.element = element;

      //TODO save subElements links
      this.subElements = {};
      this.subElements.sortableTable = sortableTable.element;
      this.subElements.rangePicker = rangePicker.element;
      this.subElements.ordersChart = ordersChart.element;
      this.subElements.salesChart = salesChart.element;
      this.subElements.customersChart = customersChart.element;
      const content = document.getElementById('#content');
      //TODO get html template
      this.element.innerHTML = this.getTemplate();
      //TODO append rangePicker
      const rangePickerCotainer = this.element.querySelector('.content__top-panel');
      rangePickerCotainer.append(rangePicker.element);
      //TODO append charts
      this.element.querySelector('.dashboard__chart_orders').append(ordersChart.element);
      this.element.querySelector('.dashboard__chart_sales').append(salesChart.element);
      this.element.querySelector('.dashboard__chart_customers').append(customersChart.element);
      //TODO append sortableTable
      this.element.querySelector('.dashboard').append(sortableTable.element);

      return this.element;

    }

    getTemplate() {
      return `<div class="dashboard">
           <div class="content__top-panel">
           <h2 class="page-title">Dashboard</h2>
           <div data-element="rangePicker"></div>
</div>
    <div data-element="chartsRoot" class="dashboard__charts">
    <div data-element="ordersChart" class="dashboard__chart_orders"></div>
    <div data-element="salesChart" class="dashboard__chart_sales"></div>
    <div data-element="customersChart" class="dashboard__chart_customers"></div>
</div>
    <h3 class="block-title">Best sellers</h3>
    <div data-element="sortableTable">

</div>
</div>`;
    }
    remove () {
      this.element.remove();
    }
    destroy() {
      this.remove();
      document.removeEventListener('date-select', this.onDateSelect);
    }

}
