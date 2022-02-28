export const RENDER_TYPE = {
    DOM: 'dom',
    TMPL: 'tmpl',
    STRING: 'string'
}

export class MenuComponent {
    #items
    #parent

    constructor(parent) {
        this.#parent = parent;
    }

    set items(value) {
        this.#items = value;
    }

    get items() {
        return this.#items;
    }

    render(type) {
        switch (type) {
            case RENDER_TYPE.DOM:
                this.renderDOM();
                break;
            case RENDER_TYPE.TMPL:
                this.renderTMPL();
                break;
            case RENDER_TYPE.STRING:
                this.renderString();
                break;
            default:
        }
    }

    renderString() {
        this.#parent.innerHTML = `
            ${this.#items.map(({key, href, text}) => {
                if (!text) {
                    return;
                }
    
                return `<a class="menu__element" href="${href}" data-section="${key}">${text}</a>`
            }).join('\n')}
        `;
    }

    renderTMPL() {
        const template = fest['components/Menu/Menu.tmpl'];
        this.#parent.innerHTML = template(this.#items);
    }

    renderDOM() {
        this.#parent.innerHTML = '';

        this.#items
            .map(({key, href, text}) => {
                if (!text) {
                    return ;
                }
                const menuElement = document.createElement('a');
                menuElement.classList.add('menu__element')
                menuElement.href = href;
                menuElement.textContent = text;
                menuElement.dataset.section = key;

                return menuElement;
            })
            .forEach((element) => {
                if (!element) {
                    return;
                }
                this.#parent.appendChild(element);
            })
        ;
    }
}
