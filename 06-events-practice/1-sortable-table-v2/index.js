export default class SortableTable {
    sortBy = 'title';
    subElements ={}
    constructor(header = [], {data} = {}) {
      this.header = header;
      this.data = data;
      this.sort();
      this.render();
      this.addListener();
    }

    render() {
      const element = document.createElement('div');
      element.innerHTML = this.getTemplate();
      this.element = element.firstElementChild;
      this.subElements.header = this.element.querySelector('.sortable-table__header');
      this.subElements.body = this.element.querySelector('.sortable-table__body');

    }
    addListener(){
      const element = this.element
      const sortFn = this.sort.bind(this);
      const getBodyBody = this.getBodyBody.bind(this);
      let sortingOrder = null;
      let header =  this.subElements.header;
      let body = this.subElements.body;
      this.element.addEventListener('pointerdown', function (e) {
        let direction;
        const deleteArrow = element.querySelector('.sortable-table__sort-arrow');
        deleteArrow.remove();
        const cell =  e.target.closest('[data-id]') ? e.target.closest('[data-id]') : null;
        cell.innerHTML = cell.innerHTML + `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`

        const sortBy = cell.dataset.id;
        if(sortingOrder !== sortBy){
          direction ='desc';
          cell.dataset.order = 'desc';
          sortingOrder = sortBy;

        }
        else if(sortingOrder === sortBy) {
          direction = 'asc';
          cell.dataset.order = 'asc';
          sortingOrder = null;
        }

        sortFn(sortBy,direction);
        const tableBody = this.querySelector('.sortable-table__body');
        tableBody.innerHTML = `${getBodyBody()}`;
        header = element.querySelector('.sortable-table__header');
        body = element.querySelector('.sortable-table__body');

      });
    }

    sort(fieldValue = this.sortBy, orderValue = 'asc') {
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

    }


    getTemplate() {
      return `
    <div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
  ${this.getHeader()}
  ${this.getBody()}
  ${this.getRestTable()}
  </div>
  </div>
    `;


    }
    getBody() {
      return `
      <div data-element="body" class="sortable-table__body">
           ${this.getBodyBody()}
      </div>
      `;
    }
    getBodyBody() {
      return this.data.map(el => {
        return `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        ${el.images && `<div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${el.images[0].url}">
        </div>`}
        ${el.title && `<div class="sortable-table__cell">${el.title}</div>`}
        ${el.quantity && `<div class="sortable-table__cell">${el.quantity}</div>`}
        ${el.price && `<div class="sortable-table__cell">${el.price}</div>`}
        ${el.sales && `<div class="sortable-table__cell">${el.sales}</div>`}
      </a>`;
      }).join('');
    }
    getHeader() {
      return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
     ${this.getHeaderBody()}
    </div>
    `;
    }
    getHeaderBody() {
      return this.header.map(el => {
        return `<div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}" data-order="asc">
        <span>${el.title}</span>
        ${this.sortBy === el.id ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>` : ``}
      </div>`;
      }).join('');
    }
    getRestTable() {
      return `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>

    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>`;
    }
    remove() {
      this.element.remove();
    }

    destroy() {
      this.remove();
    //this.element = null;
    }
}

