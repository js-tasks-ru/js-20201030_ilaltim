

export default class SortableTable {

  constructor(header, {data}) {
    this.header = header;
    this.data = data;
    this.render();
  }


  render() {
    let div = document.createElement('div');
    div.innerHTML = `  <div data-element="productsContainer" class="products-list__container">
    <div class="sortable-table">
<div data-element="header" class="sortable-table__header sortable-table__row">
       ${this.getTableHeader(this.header)}
</div>
<div data-element="body" class="sortable-table__body">
       ${this.getTableBody(this.data)}
</div>
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>

    </div>
  </div>
`;

    this.element = div;

  }
  getTableBody(data) {
    let result = [];

    data.map((el) => {
      if (el.images) {
        result.push(` <a href="${el.id}" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${el.images[0].url}"></div>
        <div class="sortable-table__cell">${el.title}</div>

        <div class="sortable-table__cell">${el.quantity}</div>
        <div class="sortable-table__cell">${el.price}</div>
        <div class="sortable-table__cell">${el.sales}</div>
      </a> `);
      } else if (!el.images) {
        result.push(` <a href="${el.id}" class="sortable-table__row">
        <div class="sortable-table__cell">
        <div class="sortable-table__cell">${el.title}</div>

        <div class="sortable-table__cell">${el.quantity}</div>
        <div class="sortable-table__cell">${el.price}</div>
        <div class="sortable-table__cell">${el.sales}</div>
      </a> `);
      }

    });


    this.subElements = [...result];
    return result.join('');
  }

  getTableHeader(header) {
    let result = [];

    header.map(el => {
      result.push(`<div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}">
            <span>${el.title}</span>

          </div>`);
    }).join('');

    return result.join('');
  }
  sort(fieldValue, orderValue) {

    const isSortable = this.header.find(el => el.id === fieldValue).sortable; //true false
    const sortType = this.header.find(el => el.id === fieldValue).sortType; //sting number

    const result = [];
    if (!isSortable) {
      return ;
    }
    if (sortType === 'number' && orderValue === 'asc') {
      this.data.sort((objA, objB) =>{
        return objA[fieldValue] - objB[fieldValue];
      });
    }
    if (sortType === 'number' && orderValue === 'desc') {
      this.data.sort((objA, objB) =>{
        return objB[fieldValue] - objA[fieldValue];
      });
    }
    if (sortType === 'string' && orderValue === 'asc') {
      this.data.sort((objA, objB) =>{
        return objA[fieldValue].localeCompare(objB[fieldValue], ['ru', 'en'], {caseFirst: 'upper'});
      });
    }
    if (sortType === 'string' && orderValue === 'desc') {
      this.data.sort((objA, objB) =>{
        return objB[fieldValue].localeCompare(objA[fieldValue], ['ru', 'en'], {caseFirst: 'upper'});
      });

    }
    const cellIndex = this.header.findIndex(ob => ob.id === fieldValue);
    console.log(cellIndex)
    this.subElements.body = document.querySelector('.sortable-table__body');
    this.subElements.body.innerHTML = createBodyRows(this.data);
    const { body } =this.subElements;
    const firstRow = body.firstElementChild;
    const lastRow = body.lastElementChild;
    console.log(firstRow.children[cellIndex].textContent);
    /*this.subElements = {
      body: 'eeeee'
    }
    this.subElements.body = document.createElement('div');
    this.subElements.body.innerHTML = `${createBodyRows(this.data)}`

    console.log(this.subElements.body)
    const {body} = this.subElements;
    console.log(tocheck)*/


    function convertDataToRow(el){
      if (el.images) {
      return ` <a href="${el.id}" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${el.images[0].url}"></div>
        <div class="sortable-table__cell">${el.title}</div>

        <div class="sortable-table__cell">${el.quantity}</div>
        <div class="sortable-table__cell">${el.price}</div>
        <div class="sortable-table__cell">${el.sales}</div>
      </a> `;
      } else if (!el.images) {
        return ` <a href="${el.id}" class="sortable-table__row">
        <div class="sortable-table__cell">
        <div class="sortable-table__cell">${el.title}</div>

        <div class="sortable-table__cell">${el.quantity}</div>
        <div class="sortable-table__cell">${el.price}</div>
        <div class="sortable-table__cell">${el.sales}</div>
      </a> `;
      }
    }
    function createBodyRows(data){
      let result = [];
      data.map(el => {
       result.push(convertDataToRow(el));
      })
      result.join('');
      return result;
    }

  }
  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    //this.element = null;
  }
}

