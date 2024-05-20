export class StoryContext {

    constructor({
        currentNode = null,
        nodesContainer = null
    } = {}) {
        this.mainIntroduction = null; // load a markdown!
        this.nodes = new Map();
        this.currentNode = currentNode;
        this.nodesContainer = nodesContainer;
    }

    addNode(node) {
        this.nodes.set(node.id, node);
        console.log("node", node);
        this.nodesContainer.appendChild(node.content);
    }

    setCurrentNode(node) {
        if (!this.currentNode) {
            this.currentNode = node;
            this.currentNode.setVisible(true);
        }
        else {
            this.currentNode.setVisible(false);
            this.currentNode = node;
            this.currentNode.setVisible(true);
        }
    }
}