import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {};
  defaultFormData = {
    title: '',
    description: '',
    quantity: 1,
    subcategory: '',
    status: 1,
    images: [],
    price: 100,
    discount: 0
  };

  onSubmit = event => {
    event.preventDefault();

    this.save();
  };

  uploadImage = () => {
    const fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // TODO: replace to addEventListener?
    fileInput.onchange = async () => {
      const [file] = fileInput.files;

      if (file) {
        const formData = new FormData();
        const { uploadImage, imageListContainer } = this.subElements;

        formData.append('image', file);

        uploadImage.classList.add('is-loading');
        uploadImage.disabled = true;

        const result = await fetchJson('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
          body: formData
        });

        imageListContainer.append(this.getImageItem(result.data.link, file.name));

        uploadImage.classList.remove('is-loading');
        uploadImage.disabled = false;

        // Remove input from body
        fileInput.remove();
      }
    };

    // must be in body for IE
    fileInput.hidden = true;
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  constructor (productId) {
    this.productId = productId;
  }

  template () {
    return `
      <div class="product-form">
      <form data-element="productForm" class="form-grid">
        <div class="form-group form-group__half_left">
          <fieldset>
            <label class="form-label">Название товара</label>
            <input required
              id="title"
              value=""
              type="text"
              name="title"
              class="form-control"
              placeholder="Название товара">
          </fieldset>
        </div>
        <div class="form-group form-group__wide">
          <label class="form-label">Описание</label>
          <textarea required
            id="description"
            class="form-control"
            name="description"
            data-element="productDescription"
            placeholder="Описание товара"></textarea>
        </div>
        <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          <ul class="sortable-list" data-element="imageListContainer">
            ${this.createImagesList()}
          </ul>
          <button data-element="uploadImage" type="button" class="button-primary-outline">
            <span>Загрузить</span>
          </button>
        </div>
        <div class="form-group form-group__half_left">
          <label class="form-label">Категория</label>
            ${this.createCategoriesSelect()}
        </div>
        <div class="form-group form-group__half_left form-group__two-col">
          <fieldset>
            <label class="form-label">Цена ($)</label>
            <input required
              id="price"
              value=""
              type="number"
              name="price"
              class="form-control"
              placeholder="${this.defaultFormData.price}">
          </fieldset>
          <fieldset>
            <label class="form-label">Скидка ($)</label>
            <input required
              id="discount"
              value=""
              type="number"
              name="discount"
              class="form-control"
              placeholder="${this.defaultFormData.discount}">
          </fieldset>
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Количество</label>
          <input required
            id="quantity"
            value=""
            type="number"
            class="form-control"
            name="quantity"
            placeholder="${this.defaultFormData.quantity}">
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Статус</label>
          <select id="status" class="form-control" name="status">
            <option value="1">Активен</option>
            <option value="0">Неактивен</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit" name="save" class="button-primary-outline">
            ${this.productId ? "Сохранить" : "Добавить"} товар
          </button>
        </div>
      </form>
    </div>
    `;
  }

  async render () {
    const categoriesPromise = this.loadCategoriesList();

    const productPromise = this.productId
      ? this.loadProductData(this.productId)
      : [this.defaultFormData];

    const [categoriesData, productResponse] = await Promise.all([categoriesPromise, productPromise]);

    const [productData] = productResponse;

    this.formData = productData;
    this.categories = categoriesData;

    this.renderForm();
    this.setFormData();
    this.initEventListeners();

    console.error('this.element', this.element.innerHTML);

    return this.element;
  }

  renderForm () {
    const element = document.createElement('div');

    element.innerHTML = this.formData
      ? this.template()
      : this.getEmptyTemplate();

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
  }

  getEmptyTemplate () {
    return `<div>
      <h1 class="page-title">Страница не найдена</h1>
      <p>Извините, данный товар не существует</p>
    </div>`;
  }

  async save() {
    const product = this.getFormData();

    try {
      const result = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
        method: this.productId ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      this.dispatchEvent(result.id);
    } catch (error) {
      console.error('something went wrong', error);
    }
  }

  getFormData () {
    const { productForm, imageListContainer } = this.subElements;
    const excludedFields = ['images'];
    const formatToNumber = ['price', 'quantity', 'discount', 'status'];
    const fields = Object.keys(this.defaultFormData).filter(item => !excludedFields.includes(item));
    const values = {};

    for (const field of fields) {
      values[field] = formatToNumber.includes(field)
        ? parseInt(productForm.querySelector(`#${field}`).value)
        : productForm.querySelector(`#${field}`).value;
    }

    const imagesHTMLCollection = imageListContainer.querySelectorAll('.sortable-table__cell-img');

    values.images = [];
    values.id = this.productId;

    for (const image of imagesHTMLCollection) {
      values.images.push({
        url: image.src,
        source: image.alt
      });
    }

    return values;
  }

  dispatchEvent (id) {
    const event = this.productId
      ? new CustomEvent('product-updated', { detail: id })
      : new CustomEvent('product-saved');

    this.element.dispatchEvent(event);
  }

  setFormData () {
    const { productForm } = this.subElements;
    const excludedFields = ['images'];
    const fields = Object.keys(this.defaultFormData).filter(item => !excludedFields.includes(item));

    fields.forEach(item => {
      const element = productForm.querySelector(`#${item}`);

      element.value = this.formData[item] || this.defaultFormData[item];
    });
  }

  async loadProductData (productId) {
    return await fetchJson(`${BACKEND_URL}/api/rest/products?id=${productId}`);
  }

  async loadCategoriesList () {
    return await fetchJson(`${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`);
  }

  createCategoriesSelect () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `<select class="form-control" id="subcategory" name="subcategory"></select>`;

    const select = wrapper.firstElementChild;

    for (const category of this.categories) {
      for (const child of category.subcategories) {
        select.append(new Option(`${category.title} > ${child.title}`, child.id));
      }
    }

    return select.outerHTML;
  }

  getSubElements(element) {
    const subElements = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const item of elements) {
      subElements[item.dataset.element] = item;
    }

    return subElements;
  }

  createImagesList () {
    return this.formData.images.map(item => {
      return this.getImageItem(item.url, item.source).outerHTML;
    }).join('');
  }

  getImageItem (url, name) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <li class="products-edit__imagelist-item sortable-list__item">
        <span>
          <img src="./icon-grab.svg" data-grab-handle alt="grab">
          <img class="sortable-table__cell-img" alt="${escapeHtml(name)}" src="${escapeHtml(url)}">
          <span>${escapeHtml(name)}</span>
        </span>
        <button type="button">
          <img src="./icon-trash.svg" alt="delete" data-delete-handle>
        </button>
      </li>`;

    return wrapper.firstElementChild;
  }

  initEventListeners () {
    const { productForm, uploadImage, imageListContainer } = this.subElements;

    productForm.addEventListener('submit', this.onSubmit);
    uploadImage.addEventListener('click', this.uploadImage);

    /* TODO: will be removed in the next iteration of realization.
       this logic will be implemented inside "SortableList" component
    */
    imageListContainer.addEventListener('click', event => {
      if ('deleteHandle' in event.target.dataset) {
        event.target.closest('li').remove();
      }
    });
  }

  destroy () {
    this.remove();
    this.element = null;
    this.subElements = null;
  }

  remove () {
    this.element.remove();
  }
}

/* МОЙ РАБОТАЮЩИЙ НО НЕ ПРОХОДЯЩИЙ ТЕСТЫ КОД
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element = {};
  imageSubElements=[]
  imageSubElementsInfo=[];
  product ={}

  constructor (productId) {
    this.productId = productId;
    this.initListeners();
  }


  initListeners() {

    document.addEventListener('click', this.removeItem);
  }


   removeItem = (e)=>{
     if (!e.target.closest('button')) {
       return;
     }
     let subElementsInfo = [...this.imageSubElementsInfo];

     subElementsInfo = subElementsInfo.filter(el => el.url !== e.target.parentNode.parentNode.firstElementChild.value);
     this.imageSubElementsInfo = [...subElementsInfo];
     const li = e.target.parentNode.parentNode.remove();
   }
   async render () {
     this.renderEmptyForm();
     //TODO id не передан - создать новый товар
     if (!this.productId) {
       await this.getSubCategories();
       const thisForm = this.element.querySelector('.form-grid');
       thisForm.subcategory.innerHTML = this.element.categoriesSubElements;

       const uploadButton = this.element.querySelector('.button-primary-outline');
       uploadButton.addEventListener('click', ()=>{
         document.getElementById('fileInput').click();
       });
       await this.uploadImage('POST');
       //TODO собрать тело товара в объект продакт
       const form = this.element.querySelector('.form-grid');
       form.addEventListener('submit', async (e)=>{
         e.preventDefault();
         const product = {
           title: form.title.value,
           description: form.description.value,
           subcategory: form.subcategory.value,
           price: +form.price.value,
           quantity: +form.quantity.value,
           discount: +form.discount.value,
           status: +form.status.value,
           images:
            [...this.imageSubElementsInfo]
         };


         //TODO заслать его на сервер body: JSON.stringify(user) PUT
         try {
           const request = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
             method: 'PUT',
             headers: {
               'Content-Type': 'application/json'
             },
             body: JSON.stringify(product)
           });
           //TODO dispatch product saved
           const productSavedEvent = new CustomEvent('product-saved', {bubbles: true});
           this.element.dispatchEvent(productSavedEvent);
         } catch (err) {
           console.error(err);
         }
       });


       //TODO айди передан нужно отредактировать товар
     } else {
       const subCategoriesPromise = fetchJson(`${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`);
       const productPromise = fetchJson(`${BACKEND_URL}/api/rest/products?id=${this.productId}`);
       const [subCategory, product] = await Promise.all([subCategoriesPromise, productPromise]);
       //TODO установить в зис категории из которых будет рендерится шаблон
       this.setSubCategories(subCategory);
       //TODO установить в this сам продукт из него будут браться данные для рендеринга
       this.product.title = product[0].title;
       this.product.description = product[0].description;
       this.product.images = product[0].images;
       //TODO добавить в this все текстовые данные картинок
       for (const img of product[0].images) {
         this.imageSubElementsInfo.push({source: img.source, url: img.url});
       }
       this.product.price = product[0].price;
       this.product.discount = product[0].discount;
       this.product.quantity = product[0].quantity;
       this.product.status = product[0].status;


       //TODO рендер формы на основании данных из this
       this.renderEmptyForm();
       const thisForm = this.element.querySelector('.form-grid');

       thisForm.title.value = this.product.title;
       thisForm.description.value = this.product.description;
       thisForm.price.value = this.product.price;
       thisForm.discount.value = this.product.discount;
       thisForm.quantity.value = this.product.quantity;
       thisForm.status.value = this.product.status;
       this.setImages(thisForm);

       //TODO обработчик на загрузку

       const uploadButton = this.element.querySelector('.button-primary-outline');
       uploadButton.addEventListener('click', ()=>{
         document.getElementById('fileInput').click();
       });

       await this.uploadImage('POST');
       //TODO обработчик на сохранени
       // найти кнопку

       // повесить обработчик на клик
       //собрать данные из формы
       //не забыть добавить к массиву фоток вновь добавленные фотки
       //отправить запрос джейсон стрингифай
       // диспа
       const form = this.element.querySelector('.form-grid');
       form.addEventListener('submit', async (e)=>{
         e.preventDefault();
         const product = {
           title: form.title.value,
           description: form.description.value,
           subcategory: form.subcategory.value,
           price: +form.price.value,
           quantity: +form.quantity.value,
           discount: +form.discount.value,
           status: +form.status.value,
           images:
            [...this.imageSubElementsInfo]
         };


         //TODO заслать его на сервер body: JSON.stringify(user) PUT
         try {
           const request = await fetchJson(`${BACKEND_URL}/api/rest/products`, {
             method: 'PUT',
             headers: {
               'Content-Type': 'application/json'
             },
             body: JSON.stringify(product)
           });
           //TODO dispatch product saved
           const productUpdateEvent = new CustomEvent('product-updated', {bubbles: true});
           this.element.dispatchEvent(productUpdateEvent);
         } catch (err) {
           console.error(err);
         }
       });


     }
     return this.element;
   }
   setImages(form) {
     const imgArray = this.product.images;
     const ul = form.querySelector('.sortable-list');
     for (const el of imgArray) {
       const li = document.createElement('li');
       li.className = `products-edit__imagelist-item sortable-list__item`;
       li.innerHTML = `
          <input type="hidden" name="url" value="${el.url}">
          <input type="hidden" name="source" value="${el.source}">
          <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${el.url}">
        <span>${el.source}</span>
      </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>`;
       ul.append(li);
     }

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
        <textarea required=""  class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer"><ul class="sortable-list">


</ul></div>
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
          <input required="" value="${this.product.price}" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required=""value="${this.product.discount}" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" value='${this.product.quantity}' type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select value="${+this.product.value}" class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          ${this.productId ? 'Сохранить' : 'Добавить'} товар
        </button>
      </div>
    </form>
  </div>`;
     this.appendHiddenInputToElement(container);
     this.element = container;
   }

   appendHiddenInputToElement(el) {
     const input = document.createElement('input');
     input.type = 'file';
     input.id = 'fileInput';
     input.accept = 'image/!*';
     input.hidden = true;
     el.append(input);
   }

   async uploadImage(method) {
     const fileInput = this.element.querySelector('#fileInput');
     fileInput.addEventListener('change', async ()=>{
       const file = fileInput.files[0];
       if (file) {
         const formData = new FormData();
         formData.append('image', file);
         const button = this.element.querySelector('.button-primary-outline');
         button.classList.add('is-loading');
         button.disabled = true;
         const result = await fetchJson('https://api.imgur.com/3/image', {
           method: method,
           headers: {
             Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
           },
           body: formData,
         });
         //TODO получить месот куда вставлять данные. DONE
         const photoContainer = this.element.querySelector('.sortable-list');
         //TODO создать элемент для вставки. DONE
         const newImage = document.createElement('li');
         newImage.className = `products-edit__imagelist-item sortable-list__item`;
         newImage.innerHTML = `<input type="hidden" name="url" value="${result.data.link}">
          <input type="hidden" name="source" value="${file.name}">
          <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${result.data.link}">
        <span>${file.name}</span>
      </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>`;
         //TODO добавиьт к уже существ фоткам новый элемент со ссылкой от имгура DONE
         photoContainer.append(newImage);
         //TODO запушить этот объект в зис DONE
         this.imageSubElements.push(newImage);
         this.imageSubElementsInfo.push({source: file.name, url: result.data.link});

         //TODO сделать кнопку доступной
         button.classList.remove('is-loading');
         button.disabled = false;

       }
     });
   }

   async getSubCategories() {
     const url = `${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`;
     const request = await fetchJson(url);
     this.setSubCategories(request);

   }
   setSubCategories(response) {
     const categoriesSubElements = [];
     for (const el of response) {
       const {subcategories} = el;
       for (const subcategory of subcategories) {
         categoriesSubElements.push(`<option value="${subcategory.id}">${el.title} &gt; ${subcategory.title}</option>`);
       }
     }
     this.element.categoriesSubElements = categoriesSubElements;
   }

   remove() {
     this.element.remove();
   }
   destroy() {
     document.removeEventListener('click', this.removeItem);
     this.remove();
   }
}
*/
