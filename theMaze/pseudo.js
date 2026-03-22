//file StoryContext.js
class StoryContext {
    nodes = [<StoryNode>, <StoryNode>, ...];
    currentNode = <StoryNode>;

    addNode(node);
    setCurrentNode(node);
}

//file StoryNode.js
class StoryNode {
    id = <Number>; //type de donnée
    type = "default", //"start" "end";
    position = { x: 0, y: 0 };
    visible = false;
    frameUrl = <file.html>//iFrame

    addNextNode(node)
    setPosition(x, y)
    setVisible(val)
}

//in file main.js
const MazeStory = new StoryContext();

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

//start NODE
MazeStory.setCurrentNode(nodeStart);

onPrintStory(){
    paginate(elementsToPaginate);
}
