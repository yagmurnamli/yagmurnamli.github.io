import { Previewer, registerHandlers } from 'pagedjs';
//import { HandlerSkeleton } from "./HandlerSkeleton.js";

//instanciate a Previewer to use,
//Previewer {settings: {…}, polisher: Polisher, chunker: Chunker, hooks: {…}, size: {…}}
const paged = new Previewer();
//register a handler to define hooks on a specific method it defines
//registerHandlers(HandlerSkeleton);

//CSS used in this project, including the pagedjs preview css
const pagedPreviewStyle = [
    "vendors/css/paged-preview.css"
];

const documentFragment = document.createDocumentFragment();

//pagination intitation method
export async function paginate(elementsList, styleList) {

    //!important! forEach can't be used as it doesn't respect await order!
    for (let index = 0; index < elementsList.length; index++) {
        const element = elementsList[index];
        //populate document fragment
        documentFragment.appendChild(element);
    };

    //merge styles together
    const styles = styleList.concat(styleList, pagedPreviewStyle);
    //execute pagedjs preview
    //clear the body out
    document.body.innerHTML = "";
    paged.preview(documentFragment, styles, document.body);
}