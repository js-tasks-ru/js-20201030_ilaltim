export default class RangePicker {
  element = {};

  constructor({from, to}) {
    this.from = from;
    this.to = to;
    this.selectionStart = from.getTime();
    this.selectionEnd = to.getTime();
    this.clickOnRangePicker = 0;
    this.firstShow = false;
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

        if (this.clickOnRangePicker === 0) {
          this.clickOnRangePicker++;
          /*  console.log(`первый клик на ренджпиекре нужно 1 снять выделение со всех дат 2 выделить эту
          ячейку Как фром 3 сохранить дату клика 4 увеличить каунтер на единицу'`);*/
          this.turnoffHighLight(this.element);
          this.hightLightCell(this.element, 'from', e);

          //TODO invalidDate
          const incomeStringForCheck = e.target.dataset.value;

          this.firstClick = new Date(this.convertToRightFormat(incomeStringForCheck));


        } else if (this.clickOnRangePicker === 1) {

          /* console.log(`это второй клик по ячейке по итогу нужно
          сохранить все данные в зисе);*/
          this.clickOnRangePicker = 0;
          this.hightLightCell(this.element, 'to', e);
          this.reselectSelectionRange(this.selectionStart, this.selectionEnd, this.firstClick, e);
          this.closeRangePicker(this.element);
          this.turnOnHighLight(this.element, this.selectionStart, this.selectionEnd);
          this.setInputValues(this.element, this.selectionStart, this.selectionEnd);

        }
      }
      //закрыть ренджПикер при клике не на селекторе
      else if (!e.target.closest('.rangepicker__selector')) {
        holder.firstElementChild.className = 'rangepicker';
      }
      //перелистнуть на месяц вперед
      else if (e.target.closest('.rangepicker__selector-control-right')) {
        this.reselectFromTo(this.from, this.to, 1);

        // изменить имена месяца в календаре
        this.setMonthesNames(this.element, this.from, this.to);
        // пересетать даты
        this.setCalendarElements(this.element, this.from, this.to);




      }
      //перелистнуть на месяц назад
      else if (e.target.closest('.rangepicker__selector-control-left')) {
        this.reselectFromTo(this.from, this.to, -1);
        this.setMonthesNames(this.element, this.from, this.to);
        this.setCalendarElements(this.element, this.from, this.to);

      }
    });
  }
  convertToRightFormat(string) {
    let res;
    res = string.split('T');

    if (res[0].length === 10) {
      return string;
    }
    else {
      let temp = res[0].split('');
      temp.splice(temp.length - 1, 0, `0`);
      const newString = temp.join('');
      res.splice(0, 1, newString);
      const result = res.join('T');
      return result;
    }

  }
  setInputValues(element, selectionStart, selectionEnd) {
    const firstInput = element.querySelector('.rangepicker__input').firstElementChild;
    const secondInput = element.querySelector('.rangepicker__input').lastElementChild;
    firstInput.innerHTML = this.getSpanInner(selectionStart);
    secondInput.innerHTML = this.getSpanInner(selectionEnd);
  }
  turnOnHighLight(element, selectionStart, selectionEnd) {

    Array.from(element.querySelectorAll('.rangepicker__cell')).forEach(el => {
      const todayStamp = new Date(el.dataset.value).getTime();
      if (todayStamp > selectionStart && todayStamp < selectionEnd) {
        el.className = `rangepicker__cell rangepicker__selected-between`;
      }

    }) ;


  }
  closeRangePicker(element) {
    element.className = 'rangepicker';
  }
  reselectSelectionRange(selectionStart, selectionEnd, firstClick, e) {
    let leftBorder;
    let rightBorder;
    if (firstClick.getTime() < new Date(e.target.dataset.value).getTime()) {
      leftBorder = firstClick.getTime();
      rightBorder = new Date(e.target.dataset.value).getTime();
    } else if (firstClick.getTime() > new Date(e.target.dataset.value).getTime()) {
      leftBorder = new Date(e.target.dataset.value).getTime();
      rightBorder = firstClick.getTime();
    } else if (firstClick.getTime() === new Date(e.target.dataset.value).getTime()) {
      leftBorder = firstClick.getTime();
      rightBorder = firstClick.getTime();
    }

    this.selectionStart = leftBorder;
    this.selectionEnd = rightBorder;
  }
  hightLightCell(element, fromOrTo, e) {
    e.target.className = `rangepicker__cell rangepicker__selected-${fromOrTo}`;
  }
  turnoffHighLight(element) {
    element.querySelectorAll('.rangepicker__selected-between').forEach(el => el.className = 'rangepicker__cell');
    if(element.querySelector('.rangepicker__selected-from')){
      element.querySelector('.rangepicker__selected-from').className = 'rangepicker__cell';

    }
    if(element.querySelector('.rangepicker__selected-to')){
      element.querySelector('.rangepicker__selected-to').className = 'rangepicker__cell';

    }
  }
  setCalendarElements(element, from, to) {
    let [firstMonth, secondMonth] = element.querySelectorAll('.rangepicker__date-grid');
    firstMonth.innerHTML = this.getMonthElementsGeneralMethod(from, this.selectionStart, this.selectionEnd);
    secondMonth.innerHTML = this.getMonthElementsGeneralMethod(to, this.selectionStart, this.selectionEnd);
  }

  getMonthElementsGeneralMethod (dateFromOrTo, selectionStart, selectionEnd) {
    let roundSelectionStart = new Date(selectionStart);
    roundSelectionStart = new Date(roundSelectionStart.getFullYear(),
      roundSelectionStart.getMonth(),
      roundSelectionStart.getDate()).getTime();

    let roundedSelectionEnd = new Date(selectionEnd);
    roundedSelectionEnd = new Date(roundedSelectionEnd.getFullYear(),
      roundedSelectionEnd.getMonth(),
      roundedSelectionEnd.getDate()).getTime();

    const numberOfDaysInMonth = new Date(dateFromOrTo.getFullYear(), dateFromOrTo.getMonth() + 1, 0).getDate();
    let result = [];
    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      if (i === 1) {
        let j = i;
        if (j < 10) { j = `0${i}`;}
        let todayTimeStamp = new Date(dateFromOrTo.getFullYear(), dateFromOrTo.getMonth(), i).getTime();
        let addClassToStr = ``;
        if (todayTimeStamp > roundSelectionStart && todayTimeStamp < roundedSelectionEnd) {
          addClassToStr = `rangepicker__selected-between`;
        } else if (todayTimeStamp === roundSelectionStart) {

          addClassToStr = `rangepicker__selected-from`;
        } else if (todayTimeStamp === roundedSelectionEnd) {
          addClassToStr = `rangepicker__selected-to`;
        }
        let str = `<button type="button" class="rangepicker__cell ${addClassToStr}"
    data-value="${dateFromOrTo.getFullYear()}-${dateFromOrTo.getMonth() + 1}-${j}T00:00:00.000Z"
    style="--start-from: ${this.getIndexOfFirstDayInMonth(dateFromOrTo)}">${i}</button>`;
        result.push(str);
      } else {
        let j = i;
        if (j < 10) { j = `0${i}`;}
        let todayTimeStamp = new Date(dateFromOrTo.getFullYear(), dateFromOrTo.getMonth(), i).getTime();

        let addClassToStr = ``;
        if (todayTimeStamp > roundSelectionStart && todayTimeStamp < roundedSelectionEnd) {
          addClassToStr = `rangepicker__selected-between`;
        } else if (todayTimeStamp === roundSelectionStart) {
          addClassToStr = `rangepicker__selected-from`;
        } else if (todayTimeStamp === roundedSelectionEnd) {
          addClassToStr = `rangepicker__selected-to`;
        }

        let str = `<button type="button" class="rangepicker__cell ${addClassToStr}"
    data-value="${dateFromOrTo.getFullYear()}-${dateFromOrTo.getMonth() + 1}-${j}T00:00:00.000Z"
    >${i}</button>`;
        result.push(str);
      }

    }
    return result.join('');
  }
  reselectFromTo(from, to, direction) {
    this.from = new Date(from.getFullYear(), from.getMonth() + direction);
    this.to = new Date(to.getFullYear(), to.getMonth() + direction);
  }
  setMonthesNames(element, from, to) {
    const [first, second] = this.element.querySelectorAll('.rangepicker__month-indicator');

    first.innerHTML = `<time datetime="${this.getMonthName(from.getMonth())}">${this.getMonthName(from.getMonth())}</time>`;
    second.innerHTML = `<time datetime="${this.getMonthName(to.getMonth())}">${this.getMonthName(to.getMonth())}</time>`;
  }
  render() {

      const element = document.createElement('div');
      element.innerHTML = this.getTemplate();
      this.element = element.firstElementChild;
    }


  getMonthName(monthIndex) {
    switch (monthIndex) {
    case 0 :
      return `январь`;
    case 1 :
      return `февраль`;
    case 2 :
      return `март`;
    case 3 :
      return `апрель`;
    case 4 :
      return `май`;
    case 5 :
      return `июнь`;
    case 6 :
      return `июль`;
    case 7 :
      return `август`;
    case 8 :
      return `сентябрь`;
    case 9 :
      return `октябрь`;
    case 10 :
      return `ноябрь`;
    case 11 :
      return `декабрь`;

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
  getSpanInner(selection) {
    const date = new Date(selection).getDate() < 10 ? `0${new Date(selection).getDate()}` : new Date(selection).getDate();
    const month = new Date(selection).getMonth() + 1 < 10 ? `0${new Date(selection).getMonth() + 1 }` : new Date(selection).getMonth() + 1;
    const year = new Date(selection).getFullYear();
    return `${date}.${month}.${year}`;
  }
  getMonthElements(monthObject, selectionStart, selectionEnd) {

    let result = [];
    for (let i = 1; i <= monthObject.numberOfDaysInMonth; i++) {
      if (i === 1) {
        let todayTimeStamp = new Date(monthObject.year, monthObject.month - 1, i).getTime();

        let addClassToStr = ``;
        if (todayTimeStamp > selectionStart && todayTimeStamp < selectionEnd) {
          addClassToStr = `rangepicker__selected-between`;
        } else if (todayTimeStamp === selectionStart) {
          addClassToStr = `rangepicker__selected-from`;
        } else if (todayTimeStamp === selectionEnd) {
          addClassToStr = `rangepicker__selected-to`;
        }
        let str = `<button type="button" class="rangepicker__cell ${addClassToStr}"
    data-value="${monthObject.year}-${monthObject.month}-${`01`}T17:53:50.338Z"
    style="--start-from: ${monthObject.indexOfFirstDay}">${i}</button>`;
        result.push(str);
      } else {
        let todayTimeStamp = new Date(monthObject.year, monthObject.month - 1, i).getTime();

        let addClassToStr = ``;
        if (todayTimeStamp > selectionStart && todayTimeStamp < selectionEnd) {
          addClassToStr = `rangepicker__selected-between`;
        } else if (todayTimeStamp === selectionStart) {
          addClassToStr = `rangepicker__selected-from`;
        } else if (todayTimeStamp === selectionEnd) {
          addClassToStr = `rangepicker__selected-to`;
        }
        let str = `<button type="button" class="rangepicker__cell ${addClassToStr}"
    data-value="${monthObject.year}-${monthObject.month}-${i < 10 ? `0${i}` : i}T17:53:50.338Z"
    >${i}</button>`;
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
      <span data-element="from">${this.getSpanInner(this.selectionStart)}</span> -
      <span data-element="to">${this.getSpanInner(this.selectionEnd)}</span>
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
