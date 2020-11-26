export default class RangePicker {
  element = {};
  constructor({from, to}) {
    this.from = from;
    this.to = to;
    this.firstMonth = from.getMonth() + 1;
    this.secondMonth = to.getMonth() + 1;
    this.selectionStart = from;
    this.selectionEnd = to;

    this.render();
    this.initListeners();
  }

  initListeners() {
    document.addEventListener('click', (e)=>{
      //закрыть открыьт при клике на инпут
      if (e.target.closest('.rangepicker__input')) {
        e.target.closest('.rangepicker__input').parentNode.classList.toggle('rangepicker_open');
      }
      //получить вэлью ячейки
      else if (e.target.closest('.rangepicker__cell')) {
        console.log(e.target.dataset.value);
      }
      //закрыть ренджПикер при клике не на селекторе
      else if (!e.target.closest('.rangepicker__selector')) {
        holder.firstElementChild.className = 'rangepicker';
      }
    });
  }

  render() {

    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  getMonthName(monthIndex){
    switch (monthIndex) {
    case 0 :
      return `Январь`;
    case 1 :
      return `Февраль`;
    case 2 :
      return `Март`;
    case 3 :
      return `Апрель`;
    case 4 :
      return `Май`;
    case 5 :
      return `Июнь`;
    case 6 :
      return `Июль`;
    case 7 :
      return `Август`;
    case 8 :
      return `Сентябрь`;
    case 9 :
      return `Октябрь`;
    case 10 :
      return `Ноябрь`;
    case 11 :
      return `Декабрь`;

    default :
      return `noName`;
    }
  }

  getTemplate() {
    let from = {date: this.from.getDate() < 10 ? `0${this.from.getDate()}` : this.from.getDate(),
      month: this.from.getMonth()+1 < 10 ? `0${this.from.getMonth()+1}` : this.from.getMonth()+1,
      year: this.from.getFullYear(),
      timeStamp: this.from.getTime(),
      monthName: this.getMonthName(this.from.getMonth())  };
    let to = {date: this.to.getDate() < 10 ? `0${this.to.getDate()}` : this.to.getDate(),
      month: this.to.getMonth()+1 < 10 ? `0${this.to.getMonth()+1}` : this.to.getMonth()+1,
      year: this.to.getFullYear(),
      timeStamp: this.to.getTime(),
      monthName: this.getMonthName(this.to.getMonth())};


    return `<div class="rangepicker">
    <div class="rangepicker__input" data-element="input">
      <span data-element="from">${from.date}/${from.month}/${from.year}</span> -
      <span data-element="to">${to.date}/${to.month}/${to.year}</span>
    </div>
    <div class="rangepicker__selector" data-element="selector">
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${from.monthName}">${from.monthName}</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">

          <button type="button" class="rangepicker__cell" data-value="2019-11-01T17:53:50.338Z" style="--start-from: 5">1</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-02T17:53:50.338Z">2</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-03T17:53:50.338Z">3</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-04T17:53:50.338Z">4</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-05T17:53:50.338Z">5</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-06T17:53:50.338Z">6</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-07T17:53:50.338Z">7</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-08T17:53:50.338Z">8</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-09T17:53:50.338Z">9</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-10T17:53:50.338Z">10</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-11T17:53:50.338Z">11</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-12T17:53:50.338Z">12</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-13T17:53:50.338Z">13</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-14T17:53:50.338Z">14</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-15T17:53:50.338Z">15</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-16T17:53:50.338Z">16</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-17T17:53:50.338Z">17</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-18T17:53:50.338Z">18</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-19T17:53:50.338Z">19</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-20T17:53:50.338Z">20</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-21T17:53:50.338Z">21</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-22T17:53:50.338Z">22</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-23T17:53:50.338Z">23</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-24T17:53:50.338Z">24</button>
          <button type="button" class="rangepicker__cell" data-value="2019-11-25T17:53:50.338Z">25</button>
          <button type="button" class="rangepicker__cell rangepicker__selected-from"
                  data-value="2019-11-26T17:53:50.338Z">26
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-11-27T17:53:50.338Z">27
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-11-28T17:53:50.338Z">28
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-11-29T17:53:50.338Z">29
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-11-30T17:53:50.338Z">30
          </button>
        </div>
      </div>
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="December">December</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-01T17:53:50.338Z" style="--start-from: 7">1
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-02T17:53:50.338Z">2
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-03T17:53:50.338Z">3
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-04T17:53:50.338Z">4
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-05T17:53:50.338Z">5
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-06T17:53:50.338Z">6
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-07T17:53:50.338Z">7
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-08T17:53:50.338Z">8
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-09T17:53:50.338Z">9
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-10T17:53:50.338Z">10
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-11T17:53:50.338Z">11
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-12T17:53:50.338Z">12
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-13T17:53:50.338Z">13
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-14T17:53:50.338Z">14
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-15T17:53:50.338Z">15
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-16T17:53:50.338Z">16
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-17T17:53:50.338Z">17
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-18T17:53:50.338Z">18
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-19T17:53:50.338Z">19
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-20T17:53:50.338Z">20
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-21T17:53:50.338Z">21
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-22T17:53:50.338Z">22
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-23T17:53:50.338Z">23
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-24T17:53:50.338Z">24
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-between"
                  data-value="2019-12-25T17:53:50.338Z">25
          </button>
          <button type="button" class="rangepicker__cell rangepicker__selected-to" data-value="2019-12-26T17:53:50.338Z">
            26
          </button>
          <button type="button" class="rangepicker__cell" data-value="2019-12-27T17:53:50.338Z">27</button>
          <button type="button" class="rangepicker__cell" data-value="2019-12-28T17:53:50.338Z">28</button>
          <button type="button" class="rangepicker__cell" data-value="2019-12-29T17:53:50.338Z">29</button>
          <button type="button" class="rangepicker__cell" data-value="2019-12-30T17:53:50.338Z">30</button>
          <button type="button" class="rangepicker__cell" data-value="2019-12-31T17:53:50.338Z">31</button>
        </div>
      </div>
    </div>
  </div>`;
  }

  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }

}
