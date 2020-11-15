export default class NotificationMessage {

  static isShown = false;

  constructor(message = 'some msg',
    {duration = 1000, type = 'success'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.element = document.createElement('div');
    this.element.innerHTML = `<div class="notification ${this.type} note" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message + Math.random()}
      </div>
    </div>
  </div>`;
    this.element = this.element.firstElementChild;
    //без таймаута не порходят тесты.
    setTimeout(() => this.show());
  }


  show(...args) {
    if (args.length) {
      args[0].insertAdjacentHTML('afterbegin', this.element.outerHTML);
      return;
    }
    /*
   если фолс то добавляем элемент, ставим таймаут на удаление(ПОСЛЕ УДАЛЕНИЯ ТАЙМАУТ МЕНЯЕТ
    СЩСТОЯНИЕ НА ФОЛС)
    и ПОСЛЕ ТАЙМАУТА =>
   меняем состояние на тру
   ретурн
   */
    if (!NotificationMessage.isShown) {
      document.body.append(this.element);

      setTimeout(() => {
        this.remove();
        NotificationMessage.isShown = false;
      }, this.duration);

      NotificationMessage.isShown = true;
      return;
    }

    /*
  если тру
  то ищем элемент по note
  удаляем элемент
  ставим новый элемент
  ставим на него таймер(ПОСЛЕ УДАЛЕНИЯ ТАЙМЕР МЕНЯЕТ СТЕЙТ НА ФОЛС) на удаление
  ретурн
   */

    if (NotificationMessage.isShown) {
      let elem = document.body.querySelectorAll('.note');
      elem.forEach(el=> el.remove())
      document.body.append(this.element);


      setTimeout(() => {
        this.remove();
        NotificationMessage.isShown = false;
      }, this.duration);

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
