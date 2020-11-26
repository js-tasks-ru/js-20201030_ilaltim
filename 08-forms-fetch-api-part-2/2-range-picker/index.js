export default class RangePicker {
  element = {};
  constructor({from, to}) {
    this.from = from;
    this.to = to;
    this.firstMonth = from.getMonth() + 1;
    this.secondMonth = to.getMonth() + 1;
    this.selectionStart = from.getTime();
    this.selectionEnd = to.getTime();

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
    console.log(this.element);
  }

  getMonthName(monthIndex) {
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
  getIndexOfFirstDayInMonth(date) {
    const newDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let indexOfFirstDay = newDate.getDay();
    if (indexOfFirstDay === 0) {
      indexOfFirstDay = 7;
    }
    return indexOfFirstDay;
  }
  getMonthElements(monthObject , selectionStart, selectionEnd ) {

    let result = [];
    for (let i = 1; i <= monthObject.numberOfDaysInMonth; i++) {
      if (i === 1) {
        let todayTimeStamp = new Date(monthObject.year,monthObject.month-1, i).getTime();

        let str = `<button type="button" class="rangepicker__cell ${todayTimeStamp >= selectionStart && todayTimeStamp <= selectionEnd ? ` rangepicker__selected-between` : ``}"
    data-value="${monthObject.year}-${monthObject.month}-${i}T17:53:50.338Z"
    style="--start-from: ${monthObject.indexOfFirstDay}">${i}</button>`;
        result.push(str);
      }else {
        let todayTimeStamp = new Date(monthObject.year,monthObject.month-1, i).getTime();
        let str = `<button type="button" class="rangepicker__cell ${todayTimeStamp >= selectionStart && todayTimeStamp <= selectionEnd ? ` rangepicker__selected-between` : ``}"
    data-value="${monthObject.year}-${monthObject.month}-${i}T17:53:50.338Z"
    style="--start-from: ${monthObject.indexOfFirstDay}">${i}</button>`;
        result.push(str);
      }

    }
    return result.join('');
  }
  getTemplate() {

    let firstMonth = {
      date: this.from.getDate() < 10 ? `0${this.from.getDate()}` : this.from.getDate(),
      month: this.from.getMonth() + 1 < 10 ? `0${this.from.getMonth() + 1}` : this.from.getMonth() + 1,
      year: this.from.getFullYear(),
      monthName: this.getMonthName(this.from.getMonth()),
      numberOfDaysInMonth: new Date(this.from.getFullYear(), this.from.getMonth() + 1, 0).getDate(),
      indexOfFirstDay: this.getIndexOfFirstDayInMonth(this.from),
    };
    firstMonth.elements = this.getMonthElements(firstMonth, this.selectionStart, this.selectionEnd);




    let secondMonth = {
      date: this.to.getDate() < 10 ? `0${this.to.getDate()}` : this.to.getDate(),
      month: this.to.getMonth() + 1 < 10 ? `0${this.to.getMonth() + 1}` : this.to.getMonth() + 1,
      year: this.to.getFullYear(),
      monthName: this.getMonthName(this.to.getMonth()),
      numberOfDaysInMonth: new Date(this.to.getFullYear(), this.to.getMonth() + 1, 0).getDate(),
      indexOfFirstDay: this.getIndexOfFirstDayInMonth(this.to)};
    secondMonth.elements = this.getMonthElements(secondMonth, this.selectionStart, this.selectionEnd);


    return `<div class="rangepicker">
    <div class="rangepicker__input" data-element="input">
      <span data-element="from">${firstMonth.date}/${firstMonth.month}/${firstMonth.year}</span> -
      <span data-element="to">${secondMonth.date}/${secondMonth.month}/${secondMonth.year}</span>
    </div>
    <div class="rangepicker__selector" data-element="selector">
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${firstMonth.monthName}">${firstMonth.monthName}</time>
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
            ${firstMonth.elements}

        </div>
      </div>
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${secondMonth.monthName}">${secondMonth.monthName}</time>
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
          ${secondMonth.elements}
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
