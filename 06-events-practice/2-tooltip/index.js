class Tooltip {

  initialize() {
    let element = document.createElement('div');
    element.className = 'tooltip';
    element.innerHTML = ``;

    this.element = element;
    this.addListeners();

  }

  addListeners() {
    let render = this.render.bind(this);
    this.linkToRenderFunc = render;
    let destroy = this.remove.bind(this);
    this.linkDestroyFunc = destroy;

    document.body.addEventListener('pointerover', render);
    document.body.addEventListener('pointerout', destroy);

  }

  onMove(e) {
    this.element.style.left = e.clientX + 'px';
    this.element.style.top = e.clientY + 'px';
  }

  render(e) {
    if (e.target) {
      this.element.innerHTML = `${e.target.dataset.tooltip}`;
    }
    let onMove = this.onMove.bind(this);
   this.linkOnMoveFunc = this.onMove.bind(this);
    document.body.addEventListener('pointermove', onMove);
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
    document.body.removeEventListener('pointerout', this.linkDestroyFunc);
  }

  destroy() {
    document.body.removeEventListener('pointerover', this.linkToRenderFunc);
    document.body.removeEventListener('pointermove', this.linkOnMoveFunc);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
