import { MarkupAttributes } from "../types";


export default class DomService {
    static createMarkup(markupName: string, parent: HTMLElement, attributes: MarkupAttributes = {}, textContent: string = ""): HTMLElement {
        const markup: HTMLElement = document.createElement(markupName);
        markup.textContent = textContent;
        parent.appendChild(markup);

        for (const key in attributes) {
            markup.setAttribute(key, attributes[key]);
        }

        return markup;
    }

    static createSelectComposant(id: string, name: string, innerText: string, formParent: HTMLFormElement): HTMLSelectElement {
        const select = this.createMarkup("select", formParent, { id, name, "aria-label": name }) as HTMLSelectElement;
        const input = this.createMarkup("option", select, { name }) as HTMLOptionElement;
        input.innerText = innerText;
        return select;
    }

    static createOptionComposant(select: HTMLSelectElement, name: string): HTMLOptionElement {
        return this.createMarkup("option", select, { value: name }, name) as HTMLOptionElement;
    }

    static clearSelectMenu(select: HTMLSelectElement, innerText: string): void {
        select.innerHTML = "";
        this.createOptionComposant(select, innerText);
    }

    static clearAndHideComponent(component: HTMLElement): void {
        component.innerHTML = "";
        component.style.display = "none";
    }


    static townNameIsValid(value: string): boolean {
        return value !== "Séléctionner une town";
    }

    static departmentNameIsValid(value: string): boolean {
        return value !== "Séléctionner un département";
    }
}


