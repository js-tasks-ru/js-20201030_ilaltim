import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element = {};


  constructor (productId) {
    this.productId = null;
  }

  appendHiddenInputToElement(el) {
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'fileInput';
    input.accept = 'image/*';
    input.hidden = true;
    el.append(input);
  }

  async render () {
    console.log('from async render');
    //TODO поняьб есть айди или нет.
    if (!this.productId) {
      await this.fetchDataForEmptyForm();
      this.renderEmptyForm();
      const uploadButton = this.element.querySelector('.button-primary-outline');

      uploadButton.addEventListener('click', ()=>{
        document.getElementById('fileInput').click();
      });

      const fileInput = this.element.querySelector('#fileInput');
      fileInput.addEventListener('change', async ()=>{
        console.log('change');
        const file = fileInput.files[0];
        //TODO доделать отсюда

      })


    } else {

    }
    //если нет айди то установить одни данные в зис для рендеринга,
    //если есть то фетч ждругие данные
    //потом отрендерить на основании данных форму.


    //запустить листенеры
    //ретурн зис элемент
    return this.element;
  }
  async fetchDataForEmptyForm() {
    const url = `${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`;
    const request = await fetchJson(url);

    const categoriesSubElements = [];
    for (const el of request) {
      const {subcategories} = el;
      for (const subcategory of subcategories) {
        categoriesSubElements.push(`<option value="${subcategory.id}">${el.title} &gt; ${subcategory.title}</option>`);
      }
    }
    this.element.categoriesSubElements = categoriesSubElements;

  }

  renderEmptyForm() {
    const container = document.createElement('div');

    container.innerHTML = `<div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer"><ul class="sortable-list"><li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
          <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
          <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="https://i.imgur.com/MWorX2R.jpg">
        <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
      </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button></li></ul></div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
          ${this.element.categoriesSubElements}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Добавить товар
        </button>
      </div>
    </form>
  </div>`;
    this.appendHiddenInputToElement(container);
    this.element = container;
  }
}
