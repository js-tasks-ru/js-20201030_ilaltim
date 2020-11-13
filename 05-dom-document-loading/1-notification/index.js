export default class NotificationMessage {

   static isShown = false;

   constructor(message = 'some msg',
     {duration = 1000, type = 'success'} = {}) {
     this.message = message;
     this.duration = duration;
     this.type = type;

     this.element = document.createElement('div');
     this.element.innerHTML = `<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
  </div>`;
     this.element = this.element.firstElementChild;
   }



   show(...args) {
     if (NotificationMessage.isShown) {
       return ;
     }

     if (args.length) {
       args[0].insertAdjacentHTML('afterbegin', this.element.outerHTML);
       return;
     }

     document.body.append(this.element);
     NotificationMessage.isShown = NotificationMessage.isShown = true;

     setTimeout(()=> {
       this.element.innerHTML = ``;
       this.destroy();
       NotificationMessage.isShown = false;
     }, this.duration);


   }
   remove() {
     this.element.remove();
   }

   destroy() {
     this.remove();
   }

}
