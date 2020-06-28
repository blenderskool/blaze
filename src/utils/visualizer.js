class Visualizer {

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.updateCanvasSize();
    window.addEventListener('resize', this.updateCanvasSize.bind(this));

    this.nodes = [];
    this.sentTo = [];
    this.receivedBy = [];
    this.state = {
      start: 0,
      end: 0,
    };

    this.draw();
  }

  updateCanvasSize() {
    const dpr = window.devicePixelRatio || 1;

    this.height = Math.floor(window.innerHeight / 2.2);
    
    if (window.innerWidth <= 800) {
      this.width = window.innerWidth - 32;
    } else {
      this.width = Math.floor(window.innerWidth / 2);
    }

    /**
     * Canvas resolution correction based on the device pixel-ratio.
     * The canvas is first scaled to it's actual size based on the pixel ratio.
     * Then the bounds of the canvas is reduced to display size using CSS.
     * Then the contents of the canvas are upscaled by the device pixel-ratio.
     * 
     * In the end, we get a sharper canvas with same size elements
     */
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);

    this.ctx.translate(this.width * 0.5, this.height * 0.5);
  }

  /**
   * Updates the positions of all the connected nodes in the graph
   */
  updateAllPos() {
    // Get only the connected nodes by removing the client node
    const nodes = this.nodes;

    const divisions = 360/nodes.length;

    /**
     * If only one 1 node is present in the network,
     * then it must be placed at the centre of the canvas
     */
    if (nodes.length == 1) {
      nodes[0].cx = 0;
      nodes[0].cy = 0;

      return;
    }

    nodes.forEach((node, i) => {
      // Calculate the angle that line makes
      const angle = divisions*(i+1)*Math.PI/180;
      const r = 100;

      node.cx = r * Math.cos(angle);
      node.cy = r * Math.sin(angle);
    });
  }

  /**
   * Adds a node to the graph
   * @param {String} name Name/Identifier of the node. Must be unique
   * @param {Array} pos Array of two elements that have location values of the node
   * @param {Boolean} isClient Dentoes whether the node is the current client
   */
  addNode({ name, isClient, pos, peerId }) {

    const nodeData = {
      name,
      peerId,
      radius: 30,
      cx: pos ? pos[0] : undefined,
      cy: pos ? pos[1] : undefined,
      textColor: isClient ? '#C5C7CC' : '#636979',
    };

    const nodeDuplID = this.nodes.findIndex(node => node.name === name);

    if (nodeDuplID > -1)
      this.nodes[nodeDuplID] = nodeData;
    else
      this.nodes.push(nodeData);

    if (!pos) this.updateAllPos();

  }

  /**
   * Removes a node from the graph
   * @param {String} name Identifier of the node
   */
  removeNode(name) {
    const nodeDuplID = this.nodes.findIndex(node => node.name === name);

    if (nodeDuplID > -1) {
      this.nodes.splice(nodeDuplID, 1);
      
      this.updateAllPos();
    }

  }


  /**
   * Adds the sender client
   * @param {String[]} name Name of the client who is sending the files
   * @param {Number} percentage Completed file transfer percentage
   */
  startSharing(sentTo, receivedBy) {

    if (sentTo === undefined) {
      this.sentTo = this.nodes.slice(1);
    }
    else {
      this.sentTo = this.nodes.filter(node => sentTo.includes(node.name) || sentTo.includes(node.peerId));
    }

    if (receivedBy !== undefined) {
      this.receivedBy = this.nodes.filter(node => receivedBy.includes(node.name) || receivedBy.includes(node.peerId));
    }

  }

  /**
   * Removes the sender client and resets for next file transfer
   */
  stopSharing() {
    this.sentTo = [];
    this.receivedBy = [];
  }

  draw() {
    /**
     * Empty the canvas, and add the updated nodes, connections and labels
     */
    this.ctx.clearRect(-this.width, -this.height, 2*this.width, 2*this.height);

    const connect = (sender, receiver) => {
      // Get the (x, y) coordinates of sender and receiver node
      const x1 = sender.cx;
      const y1 = sender.cy;
      const x2 = receiver.cx;
      const y2 = receiver.cy;

      // Calculate the total distance between the node
      const dis = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)) - sender.radius;
      // Calculate the angle of line between the nodes along x axis.
      // Slope is calculated first
      const angle = Math.atan2(y2-y1, x2-x1);
      
      if (this.state.start > dis) {
        this.state.start = 0;
      }

      new CanvasElements.Line({
        x: x1 + this.state.start * Math.cos(angle),
        y: y1 + this.state.start * Math.sin(angle),
        r: 0.2 * dis,
        angle,
        borderWidth: 2,
        borderColor: '#3BE8B0',
        ctx: this.ctx,
      });      
    }

    /**
     * Creates the file transfer indicator line
     */
    if (this.sentTo.length || this.receivedBy.length) {

      this.sentTo.forEach(node => {
        connect(this.nodes[0], node);
      });

      this.receivedBy.forEach(node => {
        connect(node, this.nodes[0]);
      });

      this.state.start += 3;
    }
    else {
      this.state.start = 0;
    }

    
    const primaryColor = ({ name, peerId }) => {
      if (this.sentTo.length && (this.nodes[0].name === name || this.nodes[0].peerId === peerId)) {
        return '#3BE8B0';
      }

      if (this.receivedBy.find(node => node.name === name || node.peerId === peerId)) {
        return '#3BE8B0';
      }

      return '#636979';
    };

    /**
     * Adds the nodes
     */
    this.nodes.forEach((node, i) => {

      /**
       * Add waves to current client node
       */
      if (i === 0) {
        const radii = [50, 40];

        radii.forEach(radius =>
          new CanvasElements.Circle({
            x: node.cx,
            y: node.cy,
            r: radius,
            background: 'rgba(99, 105, 121, 0.1)',
            ctx: this.ctx,
          })
        );
      }

      new CanvasElements.Circle({
        x: node.cx,
        y: node.cy,
        r: node.radius,
        background: '#0D1322',
        borderColor: primaryColor(node),
        borderWidth: 2.5,
        ctx: this.ctx,
      });
    });

    /**
     * Adds the avatar text
     */
    this.nodes.forEach(node => {
      new CanvasElements.Text({
        x: node.cx,
        y: node.cy + 2,
        text: node.name[0].toUpperCase(),
        font: '"Jost", sans-serif',
        align: 'center',
        baseline: 'middle',
        size: node.radius/1.2,
        background: primaryColor(node),
        ctx: this.ctx,
      })
    });

    /**
     * Adds the nickname labels
     */
    this.nodes.forEach(node => 
      new CanvasElements.Text({
        x: node.cx,
        y: node.cy + node.radius + 20,
        text: node.name,
        font: '"Jost", sans-serif',
        align: 'center',
        baseline: 'middle',
        size: 15,
        background: node.textColor,
        ctx: this.ctx,
      })
    );

    requestAnimationFrame(this.draw.bind(this));
  }

  /**
   * Updates the file transfer percentage
   * @param {Number} percentage Completed file transfer percentage
   */
  setTransferPercentage(percentage) {
    if (percentage > 100) percentage = 100;
  }
}


export default Visualizer;