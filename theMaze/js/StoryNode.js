export class StoryNode {

    constructor({
        type = "default", //"start" "end"
        frameUrl = null,
        position = { x: 0, y: 0 },
        visible = false
    } = {}) {
        this.id = Math.floor(Math.random() * 1000000);
        console.log("id : ", this.id);
        this.type = type;
        this.next = new Map();
        this.frameUrl = frameUrl;
        this.content = null;
        this.position = position;
        this.visible = visible;
        this.markdownFile = null; // load the md file from the iFrame!!

        // Créez une promesse pour l'iFrame
        this.frameLoaded = this.makeIframe();
    }

    async makeIframe() {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement("iframe");
            iframe.className = "nodeFrame";
            iframe.src = this.frameUrl;
            iframe.onload = () => resolve(iframe);
            this.content = iframe;
            this.content.style.display = "none";
        });
    }

    async addNextNode(node) {
        console.log("adding node", node, node.id);
        this.next.set(node.id, node);
        const nodeIndex = this.next.size - 1;
        console.log(this.next);
        const frame = await this.frameLoaded; // Wait for the frame to be loaded
        const frameContent = frame.contentDocument;
        const answerContainer = frameContent.getElementsByClassName("answerContainer")[0];
        const allP = [...answerContainer.getElementsByTagName("p")];
        //console.log(allP, allP[this.next.size - 1]);
        console.log("nodeIndex", nodeIndex, allP[nodeIndex]);
        allP[nodeIndex]._nodeId = node.id;
        console.log(node, "adding this id", allP[this.next.size - 1]._nodeId);
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    setVisible(val) {
        this.visible = val;

        if (val === false) {
            this.content.style.display = "none";
        }
        else {
            this.content.style.display = "block";
        }
    }
}
