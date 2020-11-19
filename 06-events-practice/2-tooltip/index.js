class Tooltip {
  static linkToRenderFunc = null;
  static linkDestroyFunc = null;
  static linkOnMoveFunc = null;

  initialize() {
    let element = document.createElement('div');
    element.className = 'tooltip';
    element.innerHTML = ``;

    this.element = element;
    this.addListeners();

  }

  addListeners() {
    let render = this.render.bind(this);
    Tooltip.linkToRenderFunc = render;
    let destroy = this.remove.bind(this);
    Tooltip.linkDestroyFunc = destroy;
    let onMove = this.onMove.bind(this);
    Tooltip.linkOnMoveFunc = this.onMove.bind(this);
    document.body.addEventListener('pointerover', render);
    document.body.addEventListener('pointerout', destroy);
    document.body.addEventListener('pointermove', onMove);
  }

  onMove(e) {
    this.element.style.left = e.clientX + 'px';
    this.element.style.top = e.clientY + 'px';
  }

  render(e) {
    if (e.target) {
      this.element.innerHTML = `${e.target.dataset.tooltip}`;
    }
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    document.body.removeEventListener('pointerover', Tooltip.linkToRenderFunc);
    document.body.removeEventListener('pointermove', Tooltip.linkOnMoveFunc);
    document.body.removeEventListener('pointerout', Tooltip.linkDestroyFunc);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
