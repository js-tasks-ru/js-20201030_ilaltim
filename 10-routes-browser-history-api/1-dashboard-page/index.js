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
      this.sortableTableObj.update(newData);
    }

    initEventListeners() {
      document.addEventListener('date-select', this.onDateSelect);

    }

    async render() {
      const element = document.createElement('div');
      const rangePicker = new RangePicker({from: PREV_MONTH, to: TODAY});

      const ordersChart = new ColumnChart({
        label: 'orders',
        link: `View all`,
        formatHeading: data => data,
        url: `${BACKEND_URL}api/dashboard/orders`,
        range: {from: PREV_MONTH, to: TODAY}
      });
      this.ordersChartObj = ordersChart;

      const salesChart = new ColumnChart({
        label: 'sales',
        formatHeading: data => data,
        url: `${BACKEND_URL}api/dashboard/sales`,
        range: {from: PREV_MONTH, to: TODAY}
      });
      this.salesChartObj = salesChart;
      const customersChart = new ColumnChart({
        label: 'customers',
        formatHeading: data => data,
        url: `${BACKEND_URL}api/dashboard/customers`,
        range: {from: PREV_MONTH, to: TODAY}
      });
      this.customersChartObj = customersChart;

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


      element.append(rangePicker.element);
      element.append(ordersChart.element);
      element.append(salesChart.element);
      element.append(customersChart.element);
      element.append(sortableTable.element);

      this.element = element;
      this.subElements = {};
      this.subElements.sortableTable = sortableTable.element;
      this.subElements.rangePicker = rangePicker.element;
      this.subElements.ordersChart = ordersChart.element;
      this.subElements.salesChart = salesChart.element;
      this.subElements.customersChart = customersChart.element;
      return this.element;

    }
    remove () {
      this.element.remove();
    }
    destroy() {
      this.remove();
      document.removeEventListener('date-select', this.onDateSelect);
    }

}
