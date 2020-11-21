

export default class SortableTable {
    subElements = {};
    constructor(header, {data}) {
      this.header = header;
      this.data = data;
      this.render();
    }

    get template() {
      return `
        <div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
     ${this.getTableHeader(this.header)}
    </div>
    <div data-element="body" class="sortable-table__body">
     ${this.getTableBody(this.data)}
    </div>
    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>

  </div>
</div>
      `;
    }
    getTableHeader(header) {
      return header.map(el => {
        return `<div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}" >
        <span>${el.title}</span>
      </div>`;
      }).join('');
    }
    getTableBody(body) {
      return body.map(el => {
        const url = el.images ? el.images[0].url : null;
        return ` <a href="/products/3d-ochki-optoma-zd301" class="sortable-table__row">
        ${url && `<div class="sortable-table__cell"><img class="sortable-table-image" alt="Image" src="${url}"></div>`}
        ${el.title && `<div class="sortable-table__cell">${el.title}</div>`}
        ${el.quantity && `<div class="sortable-table__cell">${el.quantity}</div>`}
        ${el.price && `<div class="sortable-table__cell">${el.price}</div>`}
        ${el.sales && `<div class="sortable-table__cell">${el.sales}</div>`}
      </a>`;
      }).join('');
    }

    render() {
      const element = document.createElement('div');
      element.innerHTML = this.template;
      this.element = element.firstElementChild;
      this.subElements.body = document.querySelector('.sortable-table__body');
    }

    sort(fieldValue, orderValue) {
      const isSortable = this.header.find(el => el.id === fieldValue).sortable; //true false
      const sortType = this.header.find(el => el.id === fieldValue).sortType; //sting number

      if (!isSortable) {
        return ;
      }
      const direction = orderValue === 'asc' ? 1 : -1;

      switch (sortType) {
      case 'number':
        this.data.sort((objA, objB) => {
          return direction * (objA[fieldValue] - objB[fieldValue]);
        });
        break;

      case "string":
        this.data.sort((objA, objB) => {
          return direction * (objA[fieldValue].localeCompare(objB[fieldValue], ['ru', 'en'], {caseFirst: 'upper'}));
        });
        break;
      }
      this.element.innerHTML = this.template;
      this.subElements.body = document.querySelector('.sortable-table__body');
    }

    remove() {
      this.element.remove();
    }

    destroy() {
      this.remove();
    //this.element = null;
    }
}
