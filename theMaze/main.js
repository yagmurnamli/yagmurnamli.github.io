import { loadScripts } from "./js/utils.js";
import { paginate } from "./js/paginate.js";

import { StoryContext } from "./js/StoryContext.js";
import { StoryNode } from "./js/StoryNode.js";

//Paged.js related part
const elementsToPaginate = [];
//CSS used in this project, including the pagedjs preview css
const styleList = [
    "paged.css",
    "vendors/css/paged-preview.css"
];

//additional script to load, not importable as es modules
const scritpList = [
    "vendors/js/markdown-it.js",
    "vendors/js/markdown-it-footnote.js",
    "vendors/js/markdown-it-attrs.js",
    "vendors/js/markdown-it-container.js"
];

//sync batch loading
await loadScripts(scritpList);


//markdownit instanciation (old school method as no ES6 modules are available)
const markdownit = window.markdownit({
    // Options for markdownit
    langPrefix: 'language-fr',
    // You can use html markup element
    html: true,
    typographer: true,
    // Replace english quotation by french quotation
    quotes: ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'],
})
    .use(markdownitContainer) //div
    .use(markdownItAttrs, { //custom html element attributes
        // optional, these are default options
        leftDelimiter: '{',
        rightDelimiter: '}',
        allowedAttributes: [] // empty array = all attributes are allowed
    });


//STORY part

const storyContainer = document.getElementById("storyContext");

const testStory = new StoryContext({
    nodesContainer: storyContainer,
});

const nodeStart = new StoryNode({
    type: "start",
    frameUrl: "./nodes/node0/index.html",
    visible: true
});

const nodeStep1 = new StoryNode({
    type: "default",
    frameUrl: "./nodes/node1/index.html",
});

const nodeStep2 = new StoryNode({
    frameUrl: "./nodes/node2/index.html",
});

const nodeStep3 = new StoryNode({
    frameUrl: "./nodes/node3/index.html",
});

const nodeStep4 = new StoryNode({
    frameUrl: "./nodes/node4/index.html",
});

const nodeStep4_1 = new StoryNode({
    frameUrl: "./nodes/node4-1/index.html",
});

const nodeStep4_2 = new StoryNode({
    frameUrl: "./nodes/node4-2/index.html",
});

const nodeStep4_3 = new StoryNode({
    frameUrl: "./nodes/node4-3/index.html",
});

const nodeStep5 = new StoryNode({
    frameUrl: "./nodes/node5/index.html",
});

const nodeStep6 = new StoryNode({
    frameUrl: "./nodes/node6/index.html",
});

const nodeStep7 = new StoryNode({
    frameUrl: "./nodes/node7/index.html",
});

const nodeStep7_1 = new StoryNode({
    frameUrl: "./nodes/node7-1/index.html",
});

const nodeStep7_2 = new StoryNode({
    frameUrl: "./nodes/node7-2/index.html",
});

const nodeStep7_3 = new StoryNode({
    frameUrl: "./nodes/node7-3/index.html",
});

const nodeStep7_4 = new StoryNode({
    frameUrl: "./nodes/node7-4/index.html",
});

const nodeStep8 = new StoryNode({
    frameUrl: "./nodes/node8/index.html",
    type: "end"
});

const nodeStep9 = new StoryNode({
    frameUrl: "./nodes/node9/index.html",
    type: "end"
});

const nodeStep10 = new StoryNode({
    frameUrl: "./nodes/node10/index.html",
    type: "end"
});

const nodeStep11 = new StoryNode({
    frameUrl: "./nodes/node11/index.html",
    type: "end"
});

testStory.addNode(nodeStart);
testStory.addNode(nodeStep1);
testStory.addNode(nodeStep2);
testStory.addNode(nodeStep3);
testStory.addNode(nodeStep4);
testStory.addNode(nodeStep4_1);
testStory.addNode(nodeStep4_2);
testStory.addNode(nodeStep4_3);
testStory.addNode(nodeStep5);
testStory.addNode(nodeStep6);
testStory.addNode(nodeStep7);
testStory.addNode(nodeStep7_1);
testStory.addNode(nodeStep7_2);
testStory.addNode(nodeStep7_3);
testStory.addNode(nodeStep7_4);
testStory.addNode(nodeStep8);
testStory.addNode(nodeStep9);
testStory.addNode(nodeStep10);
testStory.addNode(nodeStep11);

//LINK NODE
nodeStart.addNextNode(nodeStep1);
nodeStep1.addNextNode(nodeStep2);
nodeStep2.addNextNode(nodeStep3);
nodeStep3.addNextNode(nodeStep4);

nodeStep4.addNextNode(nodeStep4_1);
nodeStep4.addNextNode(nodeStep4_2);
nodeStep4.addNextNode(nodeStep4_3);

nodeStep4_1.addNextNode(nodeStep7);
nodeStep4_1.addNextNode(nodeStep11);

nodeStep4_2.addNextNode(nodeStep4_1);
nodeStep4_2.addNextNode(nodeStep5);

nodeStep4_3.addNextNode(nodeStep7);
nodeStep4_3.addNextNode(nodeStep6);
nodeStep4_3.addNextNode(nodeStep4_2);

nodeStep5.addNextNode(nodeStep9);
nodeStep5.addNextNode(nodeStep4_1);

nodeStep6.addNextNode(nodeStep7);
nodeStep6.addNextNode(nodeStep10);

nodeStep7.addNextNode(nodeStep7_1);
nodeStep7_1.addNextNode(nodeStep7_2);
nodeStep7_2.addNextNode(nodeStep7_3);
nodeStep7_3.addNextNode(nodeStep7_4);
nodeStep7_4.addNextNode(nodeStep8);

//start NODE
testStory.setCurrentNode(nodeStart);

//console.log(testStory);

//message reception from iFrames
window.addEventListener("message", (event) => {
    console.log("message", event.source, event.data);

    if (event.data) {
        //we can get the next node to make visible from here!
        const nextNodeId = event.data.nodeId;
        //console.log("nextNodeId", nextNodeId);
        const nextNode = testStory.nodes.get(nextNodeId);
        //console.log("nextNode", nextNode);

        if (event.data.md) {
            //convertion from md to html, returns a string
            const htmlFromMd = markdownit.render(event.data.md);
            const elFromhtml = new DOMParser().parseFromString(htmlFromMd, "text/html");
            const elFromhtmlArray = [...elFromhtml.body.children];

            elFromhtmlArray.forEach((el) => {
                elementsToPaginate.push(el);
            });
            //console.log("elementsToPaginate :", elementsToPaginate);
        }

        if (nextNode) {
            testStory.setCurrentNode(nextNode);
        }
        else {
            if(event.data.isEnd){
                paginate(elementsToPaginate, styleList);
            }
        }
    }
});
/* 
window.addEventListener("keydown", (event) => {
    if (event.key === 'p' || event.key === 'P') {
        paginate(elementsToPaginate, styleList);
    }
});
 */
