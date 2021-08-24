/**
 * Класс генерирует HTML-таблицу по переданным данным ( json ),
 * с фиксированным набором полей.
 */
export default class Table {
  constructor(data) {
    this.data = data;
    this.container = null;
    this.dataSort = ['id', 'id', 'title', 'title', 'year', 'year', 'imdb', 'imdb'];
    this.isAscent = true;
    this.idx = 0;
  }

  /**
   * Метод получает HTMLElement из DOM и записывает его в свойство this.container
   * @param {HTMLelement} container
   */
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Метод генерирует HTML-разметку по переданным в конструктор данным и
   * втавляет её в DOM
   */
  drawTable() {
    this.checkBinding();
    this.container.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = `<caption class="table_title">Рейтинг фильмов</caption>
                       <thead class="table_head">
                          <tr>
                            <th data-name="id">id <span></span></th>
                            <th data-name="title">Название <span></span></th>
                            <th data-name="year">Год <span></span></th>
                            <th data-name="imdb">imdb <span></span></th>
                          </tr>
                        </thead>`;
    const tbody = document.createElement('tbody');
    tbody.className = 'table_body';
    this.data.forEach((e) => {
      const tr = `<tr data-id="${e.id}" data-title="${e.title}" data-year="${e.year}" data-imdb="${e.imdb}">
                    <td>${e.id}</td>
                    <td>${e.title}</td>
                    <td>(${e.year})</td>
                    <td>imdb: ${e.imdb.toFixed(2)}</td>
                  </tr>`;
      tbody.innerHTML += tr;
    });
    table.appendChild(tbody);
    table.innerHTML += `<tfoot class="table_footer">
                          <tr>
                            <th scope="row" colspan="3">Всего фильмов:</th>
                            <td colspan="2">${tbody.children.length}</td>
                          </tr>
                        </tfoot>`;
    this.container.appendChild(table);
  }

  /**
   * Метод сортирует данные по переданному в параметр полю по возрастанию/убыванию,
   * в зависимости от состояния свойства this.isAscent, соответственно.
   * @param {string} field field параметр сортировки (id, Название, Год, imdb)
   */
  getSortData(field) {
    if (this.isAscent) {
      this.data.sort((a, b) => {
        if (field === 'title') {
          return a.title < b.title ? -1 : 1;
        }
        return a[field] - b[field];
      });
      this.isAscent = false;
    } else {
      this.data.sort((a, b) => {
        if (field === 'title') {
          return a.title > b.title ? -1 : 1;
        }
        return b[field] - a[field];
      });
      this.isAscent = true;
    }
  }

  /**
   * Метод добавляет стрелку (вверх/вниз) элементу span в тэге thead,
   * в зависимости от  сортировки (по возрастанию/убыванию) соответственно
   */
  addArrow() {
    const curArrow = this.container.querySelector(`[data-name="${this.dataSort[this.idx]}"]`);
    const spans = this.container.querySelectorAll('.table_head span');
    spans.forEach((e) => {
      e.innerHTML = '';
    });
    curArrow.firstElementChild.innerHTML = this.isAscent ? '&#8659' : '&#8657';
  }

  /**
   * Метод проверяет связь контейнера с DOM
   */
  checkBinding() {
    if (this.container === null) {
      throw new Error('Table not bind to DOM');
    }
  }

  /**
   * Метод запускает сортировку таблицы, с переданной в миллисекундах переодичностью,
   * по умолчанию установлена переодичность 2000мс.
   * @param {number} interval
   */
  startSorting(interval = 2000) {
    if (!interval) return;
    setInterval(() => {
      this.getSortData(this.dataSort[this.idx]);
      this.drawTable();
      this.addArrow();
      this.idx += 1;
      if (this.idx > this.dataSort.length - 1) {
        this.idx = 0;
      }
    }, interval);
  }
}
