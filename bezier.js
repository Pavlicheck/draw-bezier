class Bezier {
	constructor(data) {
		data = Object.assign({selector: '#bezier', width: 400, height: 400}, data) 
		this.nest = document.querySelector(data.selector);
		this.width = data.width;
		this.height = data.height;
		this.svg = null;
		this.pointCounter = 0;
		this.points = [];
		this.drag = null;
		this.path = null;
		this.line1 = null;
		this.line2 = null;
		this.lines = [];
	}
// функция добавляет SVG холст	
	render() {
		let self = this;
		this._newSvg();
		window.addEventListener('mousemove', (e) => this._movePoint(e));
		window.addEventListener('mouseup', () => this.drag = null );
		this.svg.addEventListener('mouseleave', () =>  this.drag = null );
		this.svg.addEventListener('mousedown', function(e) {
			if (e.target.tagName != 'circle' && self.pointCounter < 4) {
				self._newPoint(e.offsetX, e.offsetY).addEventListener('mousedown', function() {
				});
			} else if(e.target.tagName == 'circle') {
				self.drag = e.target.parentNode;
			}
		})
	}
// функция очищает SVG холст 
	refresh() {
		this.pointCounter = 0;
		this.points = [];
		this.drag = null;
		this.line1 = null;
		this.line2 = null;
		this.path = null;
		this.svg.innerHTML = '';
	}
// функция очищает холст и удаляет историю
	clear() {
		this.refresh();
		this.lines = [];
	}
// функция возвращает текущую кривую
	getPath() {
		let len = this.points.length;
		switch (len) {
			case 0: return 'none'
			case 1: return 'none'
			case 2: return this.line1.outerHTML;
			case 3: return this.path.outerHTML;
			case 4: return this.path.outerHTML;
		}
	}
// функция добавляет текущую кривую в массив	
	saveLine() {
		this.lines.push(this.getPath());
		this.refresh();
		for (let line of this.lines) {
			this.svg.innerHTML += line;
		}
	}
// функция создает SVG холст
	_newSvg() {
		if (this.svg == null) {
			this.svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
			this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
			this.svg.setAttribute('width', this.width);
			this.svg.setAttribute('height', this.height);
			this.nest.appendChild(this.svg);
		}
	}
// функция создает новую точку
	_newPoint(x, y) {
			let point = document.createElementNS("http://www.w3.org/2000/svg",'svg');
			point.setAttribute('x', x-5);
			point.setAttribute('y', y-30);
			point.classList.add('point');
			point.ondragstart = () => false;
			point.innerHTML = `<text x='${5}' y='${20}' class="text-point"' readonly>${this.pointCounter + 1}</text><circle cx="${5}" cy="${30}" r="5" />`
			this.svg.appendChild(point);
			this.pointCounter++
			this.points.push(point);
			this._draw()
			return point
	}
// функция передвигает точку 
	_movePoint(e) {
		if (this.drag != null) {
			this.drag.setAttribute('x', e.offsetX - 5);
			this.drag.setAttribute('y', e.offsetY - 30);
			this._draw()
		}
	}
// функция устанавливает аттрибуты x1, x2, y1, y2 для линии
	_drawLine(line, p1, p2) {
		line.setAttribute('x1', +this.points[p1].getAttribute('x') + 5);
		line.setAttribute('y1', +this.points[p1].getAttribute('y') + 30);
		line.setAttribute('x2', +this.points[p2].getAttribute('x') + 5);
		line.setAttribute('y2', +this.points[p2].getAttribute('y') + 30);
	}
// функция устанавливает аттрибут d для квадратичной кривой
	_drawQ() {
		this.path.setAttribute('d', `M${+this.points[0].getAttribute('x') + 5} ${+this.points[0].getAttribute('y') + 30} Q ${+this.points[1].getAttribute('x') + 5} ${+this.points[1].getAttribute('y') + 30} ${+this.points[2].getAttribute('x') + 5} ${+this.points[2].getAttribute('y') + 30}`);
	}
// функция устанавливает аттрибут d для кубической кривой
	_drawС() {
		this.path.setAttribute('d', `M${+this.points[0].getAttribute('x') + 5} ${+this.points[0].getAttribute('y') + 30} C ${+this.points[1].getAttribute('x') + 5} ${+this.points[1].getAttribute('y') + 30} ${+this.points[2].getAttribute('x') + 5} ${+this.points[2].getAttribute('y') + 30} ${+this.points[3].getAttribute('x') + 5} ${+this.points[3].getAttribute('y') + 30}`);
	}
// функция рисует кубическую кривую
	_draw() {
		if (this.points.length == 2) {
			if (this.line1 == null) {
				this.line1 = document.createElementNS("http://www.w3.org/2000/svg",'line');
				this._drawLine(this.line1, 0, 1);
				// this.line1.setAttribute('style', 'stroke:black;stroke-width:2');
				this.line1.classList.add('path');
				this.svg.insertBefore(this.line1, this.points[0])
			} else {
				this._drawLine(this.line1, 0, 1);
			}
		} else if (this.points.length == 3) {
			if (this.line2 == null) {
				this.line2 = document.createElementNS("http://www.w3.org/2000/svg",'line');
				this._drawLine(	this.line2, 1, 2);
				this.line2.classList.add('help-line');
				this.svg.insertBefore(this.line2, this.points[0]);
				this.line1.classList.remove('path');
				this.line1.classList.add('help-line');
				this._drawLine(	this.line1, 0, 1);
				this.path = document.createElementNS("http://www.w3.org/2000/svg",'path');
				this.path.classList.add('path');
				this._drawQ();
				this.svg.insertBefore(this.path, this.points[0]);
			} else {
				this._drawLine(	this.line1, 0, 1);
				this._drawLine(	this.line2, 1, 2);
				this._drawQ();
			}
		} else if (this.points.length == 4) {
			this._drawLine(	this.line1, 0, 1);
			this._drawLine(	this.line2, 2, 3);
			this._drawС();
		}
	}
}