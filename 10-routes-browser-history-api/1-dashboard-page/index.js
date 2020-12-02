import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';
const TODAY = new Date();
const PREV_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, TODAY.getDate() + 1);
const EXPEREMENTAL_DATE = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, TODAY.getDate() + 5);
export default class Page {

  constructor() {
    console.log('new page constructor');
    this.initEventListeners();
    this.render();
  }

    onDateSelect = async(e) => {
      console.log(e);
      console.log(new Date(e.detail.from.toISOString()));
      console.log(new Date(e.detail.to.toISOString()));
      console.log(e.target);
      //TODO по аналогии доделать остальные преобразования и в конце концов объединить
      //их в промисОлл
      await this.mainchart.update(e.detail.from,e.detail.to);
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
      this.mainchart = ordersChart;
      const salesChart = new ColumnChart({
        label: 'sales',
        formatHeading: data => data,
        url: `${BACKEND_URL}api/dashboard/sales`,
        range: {from: PREV_MONTH, to: TODAY}
      });
      const customersChart = new ColumnChart({
        label: 'customers',
        formatHeading: data => data,
        url: `${BACKEND_URL}api/dashboard/customers`,
        range: {from: PREV_MONTH, to: TODAY}
      });
      const sortableTable = new SortableTable(header, {
        url: `api/dashboard/bestsellers`,
        sorted: {
          id: 'title',
          order: 'asc'
        },
        isSortLocally: true,
        step: 20,
        start: 1,
        end: 21

      });


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
      console.log(this.element);
      return this.element;

    }
    remove (){
    this.element.remove();
    }
    destroy(){
      this.remove();
    }
}
