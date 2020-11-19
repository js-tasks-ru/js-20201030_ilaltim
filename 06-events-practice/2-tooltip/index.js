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
    Tooltip.linkOnMoveFunc = this.onMove.bind(this);
    document.body.addEventListener('pointermove', onMove);
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
    document.body.removeEventListener('pointerout', Tooltip.linkDestroyFunc);
  }

  destroy() {
    document.body.removeEventListener('pointerover', Tooltip.linkToRenderFunc);
    document.body.removeEventListener('pointermove', Tooltip.linkOnMoveFunc);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
